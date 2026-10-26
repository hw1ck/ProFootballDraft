const path = require('path');
const fs = require('fs');

// Mathematical formulas from Step 3 of roadmap
const SQUAD_SIZE = 18;
const MIN_OPENING_BID = 10;
const ANTI_SNIPE_THRESHOLD_SECONDS = 3;
const ANTI_SNIPE_RESET_SECONDS = 5;

function calculateMaxBid(currentBalance, currentSquadCount, totalSlots = SQUAD_SIZE, minReservePerSlot = MIN_OPENING_BID) {
  if (currentSquadCount >= totalSlots) return 0;
  const remainingSlotsAfterCurrentLot = totalSlots - currentSquadCount - 1;
  const requiredReserve = remainingSlotsAfterCurrentLot * minReservePerSlot;
  return Math.max(0, currentBalance - requiredReserve);
}

function calculateQuickBidTargets(currentLeadingBid, maxBid) {
  const increments = [10, 25, 50, 100];
  return increments.map((inc) => {
    const targetAmount = currentLeadingBid === 0 ? inc : currentLeadingBid + inc;
    return {
      increment: inc,
      targetAmount,
      disabled: targetAmount > maxBid
    };
  });
}

function classifyTransfer(pricePaid, estimatedValue) {
  if (pricePaid * 3 <= estimatedValue) return 'BARGAIN';
  if (pricePaid >= estimatedValue * 2.0) return 'OVERPAY';
  return 'FAIR';
}

function hasGoalkeeper(squad) {
  return squad.some(p => p.position === 'GK' || (p.subPositions && p.subPositions.includes('GK')));
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// In-memory player dataset loader
let cachedPlayers = null;
function loadDataset() {
  if (cachedPlayers) return cachedPlayers;
  try {
    const pPath = path.join(__dirname, '..', 'data', 'players-2026-27.json');
    if (fs.existsSync(pPath)) {
      cachedPlayers = JSON.parse(fs.readFileSync(pPath, 'utf8'));
      return cachedPlayers;
    }
  } catch (e) {
    console.error('Error loading players-2026-27.json:', e);
  }
  return [];
}

class AuctionRoom {
  constructor(config, hostUser, io) {
    this.io = io;
    this.code = generateRoomCode();
    this.roomName = config.roomName || `${hostUser.name || 'Manager'}'s Arena`;
    this.competition = config.competition || 'PREMIER_LEAGUE';
    this.season = config.season || '2026-27';
    this.roomSize = Number(config.roomSize) || 4;
    this.startingBudget = Number(config.startingBudget) || 1000;
    this.bidTimer = Number(config.bidTimer) || 30;
    this.mode = config.mode || 'RANKED';
    this.isPublic = config.isPublic !== undefined ? Boolean(config.isPublic) : true;
    this.antiSnipe = config.antiSnipe !== undefined ? Boolean(config.antiSnipe) : true;

    this.hostUserId = hostUser.id || hostUser._id || 'host-' + Date.now();
    this.phase = 'LOBBY'; // LOBBY, AUCTION_ACTIVE, AUCTION_PAUSED, LOT_SOLD_TRANSITION, COMPLETED
    this.managers = new Map();

    this.playerPool = [];
    this.currentLotIndex = 0;
    this.currentLot = null;
    this.timerSeconds = this.bidTimer;
    this.timerHandle = null;
    this.activityFeed = [
      { text: `Room created by ${hostUser.name || 'Host'}. Waiting for managers...`, type: 'info', timestamp: new Date() }
    ];
    this.chatMessages = [];
    this.lastSold = null;

    // Add host as first manager
    this.addManager(hostUser, true);
  }

  addManager(user, isHost = false) {
    const uid = String(user.id || user._id || user.userId || Date.now());
    if (this.managers.has(uid)) {
      // Reconnection
      const m = this.managers.get(uid);
      m.connected = true;
      return m;
    }

    if (this.managers.size >= this.roomSize) {
      throw new Error('Room is already full');
    }

    const seat = {
      userId: uid,
      username: user.name || user.username || `Manager ${this.managers.size + 1}`,
      email: user.email || '',
      isHost: isHost || (this.managers.size === 0),
      connected: true,
      balance: this.startingBudget,
      spent: 0,
      squad: [],
      maxBid: calculateMaxBid(this.startingBudget, 0),
      status: 'THINKING', // THINKING, WINNING, SKIPPED
      needsGoalkeeper: true
    };

    this.managers.set(uid, seat);
    this.addFeedEntry(`${seat.username} joined the room.`);
    this.broadcastState();
    return seat;
  }

  removeManager(userId) {
    const uid = String(userId);
    const seat = this.managers.get(uid);
    if (!seat) return;

    this.managers.delete(uid);
    this.addFeedEntry(`${seat.username} left the room.`);

    if (seat.isHost && this.managers.size > 0) {
      const nextHost = Array.from(this.managers.values())[0];
      nextHost.isHost = true;
      this.hostUserId = nextHost.userId;
      this.addFeedEntry(`${nextHost.username} is now the host.`);
    }

    this.broadcastState();
  }

  addFeedEntry(text, type = 'info') {
    this.activityFeed.unshift({ text, type, timestamp: new Date() });
    if (this.activityFeed.length > 50) this.activityFeed.pop();
  }

  addChatMessage(user, message) {
    const msg = {
      id: Date.now() + Math.random(),
      userId: user.id || user._id,
      username: user.name || user.username || 'Manager',
      text: message,
      timestamp: new Date()
    };
    this.chatMessages.push(msg);
    if (this.chatMessages.length > 100) this.chatMessages.shift();
    this.io?.to(`room:${this.code}`)?.emit('room:chat_message', msg);
  }

  startAuction(requestingUserId) {
    if (String(requestingUserId) !== String(this.hostUserId)) {
      throw new Error('Only the room host can start the auction');
    }
    if (this.managers.size < 2) {
      throw new Error('Need at least 2 managers to start the auction');
    }
    if (this.phase !== 'LOBBY') {
      throw new Error('Auction already started');
    }

    // Load and shuffle player pool
    const all = loadDataset();
    let pool = all.filter(p => p.competitions && p.competitions.includes(this.competition));
    if (pool.length === 0) pool = all.slice(0, 162); // fallback
    
    // Shuffle pool
    this.playerPool = [...pool].sort(() => Math.random() - 0.5);
    this.currentLotIndex = 0;
    this.phase = 'AUCTION_ACTIVE';
    this.addFeedEntry(`Auction started! Pool: ${this.playerPool.length} players.`, 'info');

    // Reset manager ledgers
    for (const m of this.managers.values()) {
      m.balance = this.startingBudget;
      m.spent = 0;
      m.squad = [];
      m.maxBid = calculateMaxBid(this.startingBudget, 0);
      m.status = 'THINKING';
      m.needsGoalkeeper = true;
    }

    this.advanceToNextLot();
  }

  advanceToNextLot() {
    this.stopTimer();

    // Check if finished: all managers have 18 players, or pool exhausted
    const allFilled = Array.from(this.managers.values()).every(m => m.squad.length >= SQUAD_SIZE);
    if (allFilled || this.currentLotIndex >= this.playerPool.length) {
      this.completeAuction();
      return;
    }

    const player = this.playerPool[this.currentLotIndex];
    this.currentLotIndex++;

    this.currentLot = {
      lotNumber: this.currentLotIndex,
      totalLots: this.playerPool.length,
      player,
      currentBid: 0,
      leadingBidderId: null,
      leadingBidderName: null,
      bidHistory: [],
      skippedManagerIds: []
    };

    this.phase = 'AUCTION_ACTIVE';
    this.timerSeconds = this.bidTimer;
    this.lastSold = null;

    // Reset manager statuses for new lot
    for (const m of this.managers.values()) {
      m.status = m.squad.length >= SQUAD_SIZE ? 'SKIPPED' : 'THINKING';
    }

    this.addFeedEntry(`Lot ${this.currentLot.lotNumber}: ${player.name} (${player.position}) is now up for auction.`);
    this.broadcastState();
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timerHandle = setInterval(() => {
      if (this.phase !== 'AUCTION_ACTIVE') return;

      if (this.timerSeconds > 0) {
        this.timerSeconds -= 1;
        this.io?.to(`room:${this.code}`)?.emit('room:timer_tick', {
          seconds: this.timerSeconds,
          initialTimer: this.bidTimer
        });
      } else {
        this.stopTimer();
        this.resolveCurrentLot();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  togglePause(requestingUserId) {
    if (String(requestingUserId) !== String(this.hostUserId)) {
      throw new Error('Only the host can pause or resume the auction');
    }
    if (this.phase === 'AUCTION_ACTIVE') {
      this.phase = 'AUCTION_PAUSED';
      this.stopTimer();
      this.addFeedEntry('Auction clock paused by host.');
    } else if (this.phase === 'AUCTION_PAUSED') {
      this.phase = 'AUCTION_ACTIVE';
      this.startTimer();
      this.addFeedEntry('Auction clock resumed by host.');
    }
    this.broadcastState();
  }

  placeBid(userId, amount) {
    if (this.phase !== 'AUCTION_ACTIVE' || !this.currentLot) {
      throw new Error('Bidding is not currently active');
    }

    const uid = String(userId);
    const manager = this.managers.get(uid);
    if (!manager) throw new Error('Manager not seated in room');
    if (manager.squad.length >= SQUAD_SIZE) throw new Error('Squad is already full (18/18)');

    const maxAllowed = calculateMaxBid(manager.balance, manager.squad.length);
    if (amount > maxAllowed) {
      throw new Error(`Bid of ${amount} exceeds your max bid reserve of ${maxAllowed}`);
    }

    const minRequired = this.currentLot.currentBid === 0 ? MIN_OPENING_BID : this.currentLot.currentBid + 1;
    if (amount < minRequired) {
      throw new Error(`Minimum bid required is ${minRequired} coins`);
    }

    this.currentLot.currentBid = amount;
    this.currentLot.leadingBidderId = uid;
    this.currentLot.leadingBidderName = manager.username;

    this.currentLot.bidHistory.unshift({
      userId: uid,
      username: manager.username,
      amount,
      timestamp: new Date()
    });

    // Remove from skipped if previously skipped
    this.currentLot.skippedManagerIds = this.currentLot.skippedManagerIds.filter(id => id !== uid);

    // Update manager statuses
    for (const [mId, m] of this.managers.entries()) {
      if (mId === uid) {
        m.status = 'WINNING';
      } else if (!this.currentLot.skippedManagerIds.includes(mId) && m.squad.length < SQUAD_SIZE) {
        m.status = 'THINKING';
      }
    }

    // Anti-snipe rule: bids in last 3s reset clock to 5s
    if (this.antiSnipe && this.timerSeconds <= ANTI_SNIPE_THRESHOLD_SECONDS) {
      this.timerSeconds = ANTI_SNIPE_RESET_SECONDS;
      this.addFeedEntry(`⏱️ Anti-snipe: Clock reset to 5s!`, 'anti_snipe');
    }

    this.addFeedEntry(`${manager.username} bid ${amount} coins on ${this.currentLot.player.name}.`, 'bid');
    this.broadcastState();
  }

  skipLot(userId) {
    if (this.phase !== 'AUCTION_ACTIVE' || !this.currentLot) return;
    const uid = String(userId);
    if (this.currentLot.leadingBidderId === uid) {
      throw new Error('Highest bidder cannot skip');
    }

    if (!this.currentLot.skippedManagerIds.includes(uid)) {
      this.currentLot.skippedManagerIds.push(uid);
    }

    const m = this.managers.get(uid);
    if (m) m.status = 'SKIPPED';

    this.addFeedEntry(`${m ? m.username : 'Manager'} passed on this lot.`, 'skip');

    // Check if all non-winning managers have skipped
    const eligibleManagers = Array.from(this.managers.values()).filter(mgr => mgr.squad.length < SQUAD_SIZE);
    const nonWinningEligible = eligibleManagers.filter(mgr => mgr.userId !== this.currentLot.leadingBidderId);
    const allPassed = nonWinningEligible.every(mgr => this.currentLot.skippedManagerIds.includes(mgr.userId));

    if (allPassed && eligibleManagers.length > 0) {
      this.stopTimer();
      this.resolveCurrentLot();
      return;
    }

    this.broadcastState();
  }

  resolveCurrentLot() {
    this.phase = 'LOT_SOLD_TRANSITION';
    const player = this.currentLot.player;
    const winnerId = this.currentLot.leadingBidderId;

    if (winnerId && this.currentLot.currentBid > 0) {
      const winner = this.managers.get(winnerId);
      const price = this.currentLot.currentBid;

      winner.balance -= price;
      winner.spent += price;
      winner.squad.push({
        ...player,
        pricePaid: price,
        acquiredAt: new Date()
      });
      winner.maxBid = calculateMaxBid(winner.balance, winner.squad.length);
      winner.needsGoalkeeper = !hasGoalkeeper(winner.squad);

      const valuation = classifyTransfer(price, player.estimatedValue);
      const isBargainVal = valuation === 'BARGAIN';
      const isOverpayVal = valuation === 'OVERPAY';

      this.lastSold = {
        player,
        buyerId: winnerId,
        buyerName: winner.username,
        price,
        estimatedValue: player.estimatedValue,
        isBargain: isBargainVal,
        isOverpay: isOverpayVal
      };

      this.addFeedEntry(`🎉 SOLD! ${player.name} signed by ${winner.username} for ${price} coins.${isBargainVal ? ' (Bargain!)' : ''}`, 'sold');
      this.io?.to(`room:${this.code}`)?.emit('room:lot_sold', this.lastSold);
    } else {
      this.lastSold = null;
      this.addFeedEntry(`Lot UNSOLD: No valid bids placed for ${player.name}.`, 'unsold');
      this.io?.to(`room:${this.code}`)?.emit('room:lot_unsold', { player });
    }

    this.broadcastState();

    // 3.5-second transition delay before next lot
    setTimeout(() => {
      this.advanceToNextLot();
    }, 3500);
  }

  completeAuction() {
    this.phase = 'COMPLETED';
    this.stopTimer();

    // Calculate squad scores & standings
    const standings = Array.from(this.managers.values()).map(m => {
      const ovrs = m.squad.map(p => p.stats?.overall || p.overall || 75);
      const avgOvr = ovrs.length ? ovrs.reduce((a, b) => a + b, 0) / ovrs.length : 0;
      const chem = Math.min(100, Math.round(avgOvr * 0.95 + (hasGoalkeeper(m.squad) ? 10 : 0)));
      const tactics = Math.min(100, Math.round(85 + (m.squad.length >= 11 ? 10 : 0)));
      const finalScore = parseFloat((0.55 * avgOvr + 0.25 * chem + 0.20 * tactics).toFixed(1));

      return {
        userId: m.userId,
        username: m.username,
        squadCount: m.squad.length,
        balanceRemaining: m.balance,
        totalSpent: m.spent,
        startingXiOvr: Math.round(avgOvr),
        chemistryScore: chem,
        tacticsScore: tactics,
        squadScore: finalScore,
        squad: m.squad
      };
    });

    standings.sort((a, b) => b.squadScore - a.squadScore || b.balanceRemaining - a.balanceRemaining);
    standings.forEach((s, idx) => { s.placement = idx + 1; });

    this.addFeedEntry('🏆 AUCTION FINISHED! Final results and squad valuations calculated.', 'completed');
    this.broadcastState({ standings });
    this.io?.to(`room:${this.code}`)?.emit('room:completed', { standings });
  }

  toPublicSummary() {
    return {
      code: this.code,
      roomName: this.roomName,
      competition: this.competition,
      season: this.season,
      roomSize: this.roomSize,
      managerCount: this.managers.size,
      startingBudget: this.startingBudget,
      bidTimer: this.bidTimer,
      mode: this.mode,
      antiSnipe: this.antiSnipe,
      isPublic: this.isPublic,
      phase: this.phase,
      hostName: Array.from(this.managers.values()).find(m => m.isHost)?.username || 'Host'
    };
  }

  toFullState() {
    return {
      code: this.code,
      roomName: this.roomName,
      competition: this.competition,
      season: this.season,
      roomSize: this.roomSize,
      startingBudget: this.startingBudget,
      bidTimer: this.bidTimer,
      mode: this.mode,
      isPublic: this.isPublic,
      antiSnipe: this.antiSnipe,
      phase: this.phase,
      hostUserId: this.hostUserId,
      timerSeconds: this.timerSeconds,
      currentLotIndex: this.currentLotIndex,
      totalLots: this.playerPool.length,
      currentLot: this.currentLot,
      lastSold: this.lastSold,
      managers: Array.from(this.managers.values()),
      activityFeed: this.activityFeed.slice(0, 30),
      chatMessages: this.chatMessages.slice(-50)
    };
  }

  broadcastState(extra = {}) {
    const state = { ...this.toFullState(), ...extra };
    this.io?.to(`room:${this.code}`)?.emit('room:state_update', state);
  }
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.io = null;
  }

  init(io) {
    this.io = io;
  }

  createRoom(config, hostUser) {
    const room = new AuctionRoom(config, hostUser, this.io);
    this.rooms.set(room.code, room);
    return room;
  }

  getRoom(code) {
    if (!code) return null;
    return this.rooms.get(code.toUpperCase().trim()) || null;
  }

  getOpenPublicRooms(competitionFilter = null, modeFilter = null) {
    const result = [];
    for (const room of this.rooms.values()) {
      if (room.isPublic && room.phase === 'LOBBY' && room.managers.size < room.roomSize) {
        if (competitionFilter && competitionFilter !== 'ANY' && room.competition !== competitionFilter) continue;
        if (modeFilter && room.mode !== modeFilter) continue;
        result.push(room.toPublicSummary());
      }
    }
    return result;
  }

  matchmakePlayNow(user, competition = 'ANY', mode = 'RANKED') {
    // Find the fullest open waiting room
    const candidates = [];
    for (const room of this.rooms.values()) {
      if (room.isPublic && room.phase === 'LOBBY' && room.managers.size < room.roomSize) {
        if (competition && competition !== 'ANY' && room.competition !== competition) continue;
        if (mode && room.mode !== mode) continue;
        candidates.push(room);
      }
    }

    if (candidates.length > 0) {
      // Sort by fullest first
      candidates.sort((a, b) => b.managers.size - a.managers.size);
      const selected = candidates[0];
      selected.addManager(user);
      return selected;
    }

    // Otherwise create a new public room
    const defaultComp = competition && competition !== 'ANY' ? competition : 'PREMIER_LEAGUE';
    return this.createRoom({
      roomName: `${user.name || 'Manager'}'s Arena`,
      competition: defaultComp,
      roomSize: 4,
      startingBudget: 1000,
      bidTimer: 30,
      mode: mode || 'RANKED',
      isPublic: true,
      antiSnipe: true
    }, user);
  }
}

const roomManagerSingleton = new RoomManager();
module.exports = {
  roomManager: roomManagerSingleton,
  calculateMaxBid,
  calculateQuickBidTargets,
  classifyTransfer,
  hasGoalkeeper
};
