const AuctionState = require('../models/AuctionState');
const Player = require('../models/Player');
const Team = require('../models/Team');
const Bid = require('../models/Bid');
const {
  SQUAD_SIZE,
  MIN_OPENING_BID,
  ANTI_SNIPE_THRESHOLD_SECONDS,
  ANTI_SNIPE_RESET_SECONDS,
  calculateMaxBid,
  classifyTransfer,
  isBargain,
  isOverpay,
  hasGoalkeeper
} = require('../utils/auctionMath');
const { roomManager } = require('../rooms/RoomManager');

let timerInterval = null;
let transitionTimeout = null;

function setupAuctionSocket(io) {
  roomManager.init(io);
  // Helper to fetch populated auction state
  async function getPopulatedState() {
    let state = await AuctionState.findOne()
      .populate('currentPlayer')
      .populate('currentBidder')
      .populate('skippedManagers');

    if (!state) {
      state = await AuctionState.create({
        status: 'idle',
        timerSeconds: 30,
        initialTimer: 30,
        antiSnipe: true,
        currentBid: 0,
        message: 'Football Auction Arena is ready'
      });
      state = await AuctionState.findById(state._id)
        .populate('currentPlayer')
        .populate('currentBidder')
        .populate('skippedManagers');
    }
    return state;
  }

  // Broadcast current state to all connected sockets
  async function broadcastState(message = null) {
    const state = await getPopulatedState();
    if (message) {
      state.message = message;
      await state.save();
    }
    io.emit('auction:state_update', state);
    return state;
  }

  // Broadcast notification toast
  function broadcastNotification(title, message, type = 'info') {
    io.emit('auction:notification', {
      id: Date.now() + Math.random(),
      title,
      message,
      type, // 'bid', 'sold', 'unsold', 'info', 'warning'
      timestamp: new Date()
    });
  }

  // Stop countdown ticker
  function stopCountdown() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // Start countdown ticker
  function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(async () => {
      try {
        const state = await AuctionState.findOne();
        if (!state || !state.isTimerRunning) {
          stopCountdown();
          return;
        }

        if (state.timerSeconds > 0) {
          state.timerSeconds -= 1;
          await state.save();
          io.emit('timer:tick', {
            seconds: state.timerSeconds,
            initialTimer: state.initialTimer
          });
        } else {
          // Timer hit 0!
          stopCountdown();
          state.isTimerRunning = false;
          await state.save();

          if (state.currentBidder && state.currentPlayer) {
            await handleSell(state.currentPlayer, state.currentBidder, state.currentBid);
          } else if (state.currentPlayer) {
            await handleUnsold(state.currentPlayer);
          }
        }
      } catch (err) {
        console.error('Timer ticker error:', err);
      }
    }, 1000);
  }

  // Finalize Sale
  async function handleSell(playerId, teamId, amount) {
    try {
      stopCountdown();
      const player = await Player.findById(playerId);
      const team = await Team.findById(teamId);

      if (!player || !team) return;

      // Update Player
      player.status = 'sold';
      player.soldTo = team._id;
      player.currentPrice = amount;
      await player.save();

      // Update Team
      team.spent += amount;
      if (!team.players.includes(player._id)) {
        team.players.push(player._id);
      }
      await team.save();

      // Check valuation classification
      const estVal = player.estimatedValue || 100;
      const bargain = isBargain(amount, estVal);
      const overpay = isOverpay(amount, estVal);

      // Update Auction State
      const state = await AuctionState.findOne();
      state.status = 'sold';
      state.isTimerRunning = false;
      const valuationTag = bargain ? ' · 🟢 Bargain' : overpay ? ' · ⚠️ Overpay' : '';
      state.message = `🔨 SOLD! ${player.name} to ${team.name} for ${amount} coins${valuationTag}!`;

      const lastSoldData = {
        player: {
          _id: player._id,
          name: player.name,
          surname: player.surname || player.name.split(' ').pop().toUpperCase(),
          position: player.position,
          nationality: player.nationality,
          nationalityCode: player.nationalityCode,
          club: player.club,
          stats: player.stats,
          rarity: player.rarity,
          photoUrl: player.photoUrl,
          estimatedValue: estVal
        },
        team: {
          _id: team._id,
          name: team.name,
          shortName: team.shortName,
          logo: team.logo,
          color: team.color
        },
        amount,
        isBargain: bargain,
        isOverpay: overpay,
        estimatedValue: estVal
      };

      state.lastSold = lastSoldData;
      state.activityFeed.unshift({
        text: `🔨 SOLD: ${player.name} acquired by ${team.name} for ${amount} coins${valuationTag}`,
        type: 'sold',
        timestamp: new Date()
      });
      if (state.activityFeed.length > 30) state.activityFeed = state.activityFeed.slice(0, 30);

      await state.save();

      const populatedState = await getPopulatedState();
      io.emit('auction:sold', {
        player,
        team,
        amount,
        isBargain: bargain,
        isOverpay: overpay,
        estimatedValue: estVal,
        lastSold: lastSoldData,
        message: state.message,
        state: populatedState
      });

      broadcastNotification(
        'PLAYER SOLD!',
        `${player.name} acquired by ${team.name} for ${amount} coins${valuationTag}`,
        'sold'
      );

      // Auto-advance to next lot after 3.5 seconds transition
      if (transitionTimeout) clearTimeout(transitionTimeout);
      transitionTimeout = setTimeout(async () => {
        try {
          const nextUpcoming = await Player.findOne({ status: 'upcoming' }).sort({ orderIndex: 1 });
          if (nextUpcoming) {
            await advanceToLot(nextUpcoming._id);
          } else {
            const finalState = await AuctionState.findOne();
            if (finalState) {
              finalState.status = 'completed';
              finalState.message = 'Auction complete! All lots have concluded.';
              await finalState.save();
              await broadcastState();
            }
          }
        } catch (e) {
          console.error('Error auto-advancing lot:', e);
        }
      }, 3500);

    } catch (err) {
      console.error('Handle sell error:', err);
    }
  }

  // Handle Unsold Player
  async function handleUnsold(playerId) {
    try {
      stopCountdown();
      const player = await Player.findById(playerId);
      if (player) {
        player.status = 'unsold';
        await player.save();
      }

      const state = await AuctionState.findOne();
      state.status = 'unsold';
      state.isTimerRunning = false;
      state.message = `${player ? player.name : 'Player'} goes UNSOLD at opening bid ${state.currentBid || 10} coins`;

      state.activityFeed.unshift({
        text: `❌ UNSOLD: ${player ? player.name : 'Player'} received no bids`,
        type: 'unsold',
        timestamp: new Date()
      });
      if (state.activityFeed.length > 30) state.activityFeed = state.activityFeed.slice(0, 30);

      await state.save();

      const populatedState = await getPopulatedState();
      io.emit('auction:unsold', {
        player,
        message: state.message,
        state: populatedState
      });

      broadcastNotification(
        'PLAYER UNSOLD',
        `${player ? player.name : 'Player'} did not receive any bids.`,
        'unsold'
      );

      // Auto-advance to next lot after 3.5 seconds transition
      if (transitionTimeout) clearTimeout(transitionTimeout);
      transitionTimeout = setTimeout(async () => {
        try {
          const nextUpcoming = await Player.findOne({ status: 'upcoming' }).sort({ orderIndex: 1 });
          if (nextUpcoming) {
            await advanceToLot(nextUpcoming._id);
          }
        } catch (e) {
          console.error('Error auto-advancing lot:', e);
        }
      }, 3500);

    } catch (err) {
      console.error('Handle unsold error:', err);
    }
  }

  // Advance lot helper
  async function advanceToLot(playerId) {
    const player = await Player.findById(playerId);
    if (!player) return;

    player.status = 'in_auction';
    await player.save();

    let state = await AuctionState.findOne();
    if (!state) state = new AuctionState();

    state.currentPlayer = player._id;
    state.currentBid = 0; // Lot opens with 0 bids placed; opening bid required is 10
    state.currentBidder = null;
    state.timerSeconds = state.initialTimer || 30;
    state.isTimerRunning = true;
    state.status = 'bidding';
    state.bidHistory = [];
    state.skippedManagers = [];
    state.antiSnipeTriggered = false;
    state.lotNumber = (state.lotNumber || 0) + 1;
    state.message = `Bidding OPEN for ${player.name} (${player.position}, ${player.stats?.overall || 80} OVR) · Opening bid: 10 coins`;

    state.activityFeed.unshift({
      text: `⚡ Lot ${state.lotNumber}: ${player.name} (${player.position}, ${player.stats?.overall || 80} OVR) is now on the block`,
      type: 'info',
      timestamp: new Date()
    });
    if (state.activityFeed.length > 30) state.activityFeed = state.activityFeed.slice(0, 30);

    await state.save();

    startCountdown();
    await broadcastState();

    broadcastNotification(
      'LOT OPEN',
      `${player.name} is on the block! Opening bid 10 coins.`,
      'info'
    );
  }

  // Check if all non-leading managers have skipped or cannot afford next bid
  async function checkSkipQuorum(state) {
    if (!state || state.status !== 'bidding') return;

    const allTeams = await Team.find();
    if (allTeams.length <= 1) return;

    const currentLeaderId = state.currentBidder ? state.currentBidder._id.toString() : null;
    const skippedSet = new Set((state.skippedManagers || []).map((id) => id.toString()));

    const activeNonLeaderManagers = allTeams.filter((t) => {
      const isLeader = currentLeaderId && t._id.toString() === currentLeaderId;
      if (isLeader) return false;
      const isFull = t.players.length >= SQUAD_SIZE;
      if (isFull) return false;

      const maxBid = calculateMaxBid(t.budget - t.spent, t.players.length);
      const minNextBid = state.currentBid === 0 ? MIN_OPENING_BID : state.currentBid + 1;
      const cannotAfford = maxBid < minNextBid;
      const hasSkipped = skippedSet.has(t._id.toString());

      return !cannotAfford && !hasSkipped;
    });

    // If no active non-leader managers remain, immediately resolve lot
    if (activeNonLeaderManagers.length === 0) {
      stopCountdown();
      state.isTimerRunning = false;
      await state.save();

      if (state.currentBidder && state.currentPlayer) {
        await handleSell(state.currentPlayer, state.currentBidder, state.currentBid);
      } else if (state.currentPlayer) {
        await handleUnsold(state.currentPlayer);
      }
    }
  }

  // Socket Connection Listener
  io.on('connection', async (socket) => {
    // Send initial state on connection
    try {
      const initialState = await getPopulatedState();
      socket.emit('auction:state_update', initialState);
    } catch (e) {
      console.error('Error sending initial state:', e);
    }

    // ==========================================
    // ROOM-SPECIFIC REAL-TIME AUCTION HANDLERS
    // ==========================================
    socket.on('room:join', ({ roomCode, user }) => {
      if (!roomCode) return;
      const cleanCode = roomCode.toUpperCase().trim();
      socket.join(`room:${cleanCode}`);
      const room = roomManager.getRoom(cleanCode);
      if (room) {
        if (user) {
          try { room.addManager(user); } catch (e) {}
        }
        socket.emit('room:state_update', room.toFullState());
      }
    });

    socket.on('room:leave', ({ roomCode, userId }) => {
      if (!roomCode) return;
      const cleanCode = roomCode.toUpperCase().trim();
      socket.leave(`room:${cleanCode}`);
      const room = roomManager.getRoom(cleanCode);
      if (room && userId) {
        room.removeManager(userId);
      }
    });

    socket.on('room:start', ({ roomCode, userId }) => {
      const room = roomManager.getRoom(roomCode);
      if (!room) return;
      try {
        room.startAuction(userId);
      } catch (err) {
        socket.emit('room:error', { message: err.message });
      }
    });

    socket.on('room:bid', ({ roomCode, userId, amount }) => {
      const room = roomManager.getRoom(roomCode);
      if (!room) return;
      try {
        room.placeBid(userId, Number(amount));
      } catch (err) {
        socket.emit('room:error', { message: err.message });
      }
    });

    socket.on('room:skip', ({ roomCode, userId }) => {
      const room = roomManager.getRoom(roomCode);
      if (!room) return;
      try {
        room.skipLot(userId);
      } catch (err) {
        socket.emit('room:error', { message: err.message });
      }
    });

    socket.on('room:pause_toggle', ({ roomCode, userId }) => {
      const room = roomManager.getRoom(roomCode);
      if (!room) return;
      try {
        room.togglePause(userId);
      } catch (err) {
        socket.emit('room:error', { message: err.message });
      }
    });

    socket.on('room:chat', ({ roomCode, user, text }) => {
      const room = roomManager.getRoom(roomCode);
      if (!room || !text) return;
      room.addChatMessage(user, text);
    });

    // 1. PLACE BID
    socket.on('bid:place', async (data) => {
      try {
        const { teamId, amount, userId } = data;
        const state = await AuctionState.findOne().populate('currentPlayer');

        if (!state || state.status !== 'bidding') {
          return socket.emit('bid:error', { message: 'Auction is not currently open for bids.' });
        }

        const player = await Player.findById(state.currentPlayer);
        if (!player) {
          return socket.emit('bid:error', { message: 'No active player in auction arena.' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
          return socket.emit('bid:error', { message: 'Invalid manager team or team not found.' });
        }

        // Check squad limit (18-man squad rule)
        if (team.players.length >= SQUAD_SIZE) {
          return socket.emit('bid:error', {
            message: `Squad Limit Reached! ${team.name} already has ${SQUAD_SIZE} players (18/18).`
          });
        }

        // Check Max Bid Safety Constraint:
        // Must reserve 10 coins per remaining empty slot
        const maxAllowed = calculateMaxBid(team.budget - team.spent, team.players.length);
        if (amount > maxAllowed) {
          return socket.emit('bid:error', {
            message: `Bid exceeds your Max Bid limit of ${maxAllowed} coins! You must reserve 10 coins per remaining empty slot.`
          });
        }

        // Check minimum bid:
        // Opening bid is 10. If bids already exist, must be strictly higher.
        const minRequired = state.currentBidder ? state.currentBid + 1 : MIN_OPENING_BID;
        if (amount < minRequired) {
          return socket.emit('bid:error', {
            message: `Bid must be at least ${minRequired} coins.`
          });
        }

        // Prevent self-outbidding consecutively
        if (state.currentBidder && state.currentBidder.toString() === team._id.toString()) {
          return socket.emit('bid:error', {
            message: `${team.name} already holds the highest bid!`
          });
        }

        // Record persistent bid
        const bid = await Bid.create({
          player: player._id,
          team: team._id,
          user: userId || null,
          amount
        });

        // Update auction state
        state.currentBid = amount;
        state.currentBidder = team._id;

        // Anti-snipe rule:
        // If a bid is placed in the last 3s, reset clock to 5s!
        if (state.antiSnipe && state.timerSeconds <= ANTI_SNIPE_THRESHOLD_SECONDS) {
          state.timerSeconds = ANTI_SNIPE_RESET_SECONDS;
          state.antiSnipeTriggered = true;
          state.activityFeed.unshift({
            text: `⚡ Anti-snipe: Clock reset to 5s following ${team.name}'s bid!`,
            type: 'anti_snipe',
            timestamp: new Date()
          });
          broadcastNotification(
            'ANTI-SNIPE TRIGGERED',
            `Clock reset to 5s after late bid by ${team.name}`,
            'warning'
          );
        }

        // Remove bidder from skippedManagers if they bid
        state.skippedManagers = (state.skippedManagers || []).filter(
          (id) => id.toString() !== team._id.toString()
        );

        state.message = `⚡ New highest bid: ${amount} coins by ${team.name}`;

        state.bidHistory.unshift({
          teamId: team._id,
          teamName: team.name,
          teamShort: team.shortName,
          teamColor: team.color,
          amount,
          timestamp: new Date()
        });

        if (state.bidHistory.length > 20) {
          state.bidHistory = state.bidHistory.slice(0, 20);
        }

        state.activityFeed.unshift({
          text: `🪙 ${team.name} bid ${amount} coins for ${player.name}`,
          type: 'bid',
          timestamp: new Date()
        });
        if (state.activityFeed.length > 30) state.activityFeed = state.activityFeed.slice(0, 30);

        await state.save();

        const updatedState = await getPopulatedState();

        // Broadcast bid success
        io.emit('bid:success', {
          bid,
          team: {
            id: team._id,
            name: team.name,
            shortName: team.shortName,
            color: team.color,
            logo: team.logo
          },
          amount,
          state: updatedState
        });

        broadcastNotification(
          'NEW BID PLACED!',
          `${team.name} bid ${amount} coins for ${player.name}`,
          'bid'
        );
      } catch (err) {
        console.error('Bid error:', err);
        socket.emit('bid:error', { message: 'Internal server error processing bid.' });
      }
    });

    // 2. SKIP LOT (Hotkey S or button)
    socket.on('bid:skip', async (data) => {
      try {
        const { teamId } = data;
        const state = await AuctionState.findOne();
        if (!state || state.status !== 'bidding') return;

        // Cannot skip if leading bidder
        if (state.currentBidder && state.currentBidder.toString() === teamId) {
          return socket.emit('bid:error', {
            message: 'You currently hold the highest bid and cannot skip this lot.'
          });
        }

        const team = await Team.findById(teamId);
        if (!team) return;

        if (!state.skippedManagers) state.skippedManagers = [];
        const alreadySkipped = state.skippedManagers.some((id) => id.toString() === teamId);

        if (!alreadySkipped) {
          state.skippedManagers.push(team._id);
          state.activityFeed.unshift({
            text: `⏭️ ${team.name} skipped on this lot`,
            type: 'skip',
            timestamp: new Date()
          });
          if (state.activityFeed.length > 30) state.activityFeed = state.activityFeed.slice(0, 30);
          await state.save();

          await broadcastState();
          await checkSkipQuorum(state);
        }
      } catch (err) {
        console.error('Skip lot error:', err);
      }
    });

    // 3. START AUCTION (Admin/Host)
    socket.on('auction:start', async (data) => {
      try {
        let state = await AuctionState.findOne();
        let targetPlayerId = data?.playerId || state?.currentPlayer;

        let player;
        if (targetPlayerId) {
          player = await Player.findById(targetPlayerId);
        } else {
          player = await Player.findOne({ status: 'upcoming' }).sort({ orderIndex: 1 });
        }

        if (!player) {
          return socket.emit('auction:error', { message: 'No upcoming players available for auction.' });
        }

        await advanceToLot(player._id);
      } catch (err) {
        console.error('Auction start error:', err);
      }
    });

    // 4. PAUSE AUCTION (Admin/Host)
    socket.on('auction:pause', async () => {
      try {
        const state = await AuctionState.findOne();
        if (state && state.status === 'bidding') {
          stopCountdown();
          state.status = 'paused';
          state.isTimerRunning = false;
          state.message = '⏸️ Auction paused by host';
          state.activityFeed.unshift({
            text: '⏸️ Auction paused by host',
            type: 'info',
            timestamp: new Date()
          });
          await state.save();
          await broadcastState();
        }
      } catch (err) {
        console.error('Pause error:', err);
      }
    });

    // 5. RESUME AUCTION (Admin/Host)
    socket.on('auction:resume', async () => {
      try {
        const state = await AuctionState.findOne();
        if (state && state.status === 'paused') {
          state.status = 'bidding';
          state.isTimerRunning = true;
          state.message = '▶️ Auction resumed';
          state.activityFeed.unshift({
            text: '▶️ Auction resumed',
            type: 'info',
            timestamp: new Date()
          });
          await state.save();
          startCountdown();
          await broadcastState();
        }
      } catch (err) {
        console.error('Resume error:', err);
      }
    });

    // 6. HAMMER SELL (Admin instant finish)
    socket.on('auction:hammer', async () => {
      try {
        const state = await AuctionState.findOne();
        if (state && state.status === 'bidding' && state.currentBidder && state.currentPlayer) {
          stopCountdown();
          await handleSell(state.currentPlayer, state.currentBidder, state.currentBid);
        }
      } catch (err) {
        console.error('Hammer error:', err);
      }
    });

    // 7. PASS PLAYER (Admin pass)
    socket.on('auction:pass', async () => {
      try {
        const state = await AuctionState.findOne();
        if (state && state.status === 'bidding' && state.currentPlayer) {
          stopCountdown();
          await handleUnsold(state.currentPlayer);
        }
      } catch (err) {
        console.error('Pass error:', err);
      }
    });

    // 8. NEXT PLAYER QUEUE
    socket.on('auction:next_player', async () => {
      try {
        const nextPlayer = await Player.findOne({ status: 'upcoming' }).sort({ orderIndex: 1 });
        if (nextPlayer) {
          await advanceToLot(nextPlayer._id);
        } else {
          socket.emit('auction:error', { message: 'No more upcoming players left in the pool!' });
        }
      } catch (err) {
        console.error('Next player error:', err);
      }
    });

    // 9. SET SPECIFIC PLAYER
    socket.on('auction:set_player', async ({ playerId }) => {
      try {
        await advanceToLot(playerId);
      } catch (err) {
        console.error('Set player error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupAuctionSocket };
