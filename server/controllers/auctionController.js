const fs = require('fs');
const path = require('path');
const AuctionState = require('../models/AuctionState');
const Player = require('../models/Player');
const Team = require('../models/Team');
const User = require('../models/User');
const Bid = require('../models/Bid');
const seedData = require('../data/seedData');

// Helper to ensure singleton auction state exists
async function getOrCreateState() {
  let state = await AuctionState.findOne()
    .populate('currentPlayer')
    .populate('currentBidder');

  if (!state) {
    state = await AuctionState.create({
      status: 'idle',
      timerSeconds: 25,
      initialTimer: 25,
      message: 'ProFootballDraft Auction Arena is ready'
    });
    state = await AuctionState.findById(state._id)
      .populate('currentPlayer')
      .populate('currentBidder');
  }
  return state;
}

// @desc Get live auction state
// @route GET /api/auction/state
exports.getAuctionState = async (req, res) => {
  try {
    const state = await getOrCreateState();
    return res.status(200).json({ success: true, state });
  } catch (error) {
    console.error('Error getting auction state:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Seed database with star players, clubs, and accounts
// @route POST /api/auction/seed
exports.seedDatabase = async (req, res) => {
  try {
    console.log('[Seed] Resetting previous collections...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Bid.deleteMany({});
    await AuctionState.deleteMany({});

    console.log('[Seed] Creating Admin account...');
    const admin = await User.create(seedData.admin);

    console.log('[Seed] Creating Clubs & Managers...');
    const createdTeams = [];
    for (const t of seedData.teams) {
      const managerUser = await User.create(t.managerUser);
      const team = await Team.create({
        name: t.name,
        shortName: t.shortName,
        logo: t.logo,
        color: t.color,
        budget: t.budget,
        maxPlayers: t.maxPlayers,
        manager: managerUser._id
      });
      managerUser.team = team._id;
      await managerUser.save();
      createdTeams.push(team);
    }

    console.log('[Seed] Creating Star Players from 2026-27 Pool...');
    const createdPlayers = [];
    let playersToSeed = seedData.players;
    try {
      const fullPoolPath = path.join(__dirname, '..', 'data', 'players-2026-27.json');
      if (fs.existsSync(fullPoolPath)) {
        playersToSeed = JSON.parse(fs.readFileSync(fullPoolPath, 'utf8'));
        console.log(`[Seed] Loaded full 2026-27 dataset with ${playersToSeed.length} players!`);
      }
    } catch (err) {
      console.warn('[Seed] Using fallback seedData.players:', err.message);
    }

    for (const p of playersToSeed) {
      const player = await Player.create({
        ...p,
        currentPrice: p.basePrice || 10,
        status: 'upcoming'
      });
      createdPlayers.push(player);
    }

    const firstPlayer = createdPlayers[0];
    const auctionState = await AuctionState.create({
      status: 'idle',
      currentPlayer: firstPlayer._id,
      currentBid: firstPlayer.basePrice,
      currentBidder: null,
      timerSeconds: 30,
      initialTimer: 30,
      antiSnipe: true,
      isTimerRunning: false,
      bidHistory: [],
      activityFeed: [{ text: 'Auction Arena initialized and ready.', type: 'info', timestamp: new Date() }],
      message: `Next lot: ${firstPlayer.name} with opening bid ${firstPlayer.basePrice} coins`
    });

    console.log('[Seed] Seeding completed successfully!');
    return res.status(200).json({
      success: true,
      message: 'Database seeded with Football Auction clubs, star players, and accounts!',
      counts: {
        users: 1 + createdTeams.length,
        teams: createdTeams.length,
        players: createdPlayers.length
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error seeding database' });
  }
};

// @desc Reset auction progress
// @route POST /api/auction/reset
exports.resetAuction = async (req, res) => {
  try {
    await Player.updateMany({}, {
      status: 'upcoming',
      soldTo: null,
      $set: { currentPrice: 10 }
    });

    await Team.updateMany({}, {
      spent: 0,
      players: []
    });

    await Bid.deleteMany({});

    const firstPlayer = await Player.findOne().sort({ orderIndex: 1 });
    let state = await AuctionState.findOne();
    if (!state) {
      state = new AuctionState();
    }
    state.status = 'idle';
    state.currentPlayer = firstPlayer ? firstPlayer._id : null;
    state.currentBid = firstPlayer ? firstPlayer.basePrice : 10;
    state.currentBidder = null;
    state.timerSeconds = 30;
    state.initialTimer = 30;
    state.antiSnipe = true;
    state.isTimerRunning = false;
    state.bidHistory = [];
    state.skippedManagers = [];
    state.activityFeed = [{ text: 'Auction reset. Ready for next lot.', type: 'info', timestamp: new Date() }];
    state.message = firstPlayer ? `Next lot: ${firstPlayer.name} (Opening bid: 10 coins)` : 'Ready';
    await state.save();

    const populated = await AuctionState.findById(state._id)
      .populate('currentPlayer')
      .populate('currentBidder');

    return res.status(200).json({
      success: true,
      message: 'Auction reset successfully!',
      state: populated
    });
  } catch (error) {
    console.error('Error resetting auction:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting auction' });
  }
};

// @desc Get recent bids history
// @route GET /api/auction/bids
exports.getBidsHistory = async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate('player', 'name position nationality photoUrl stats role')
      .populate('team', 'name shortName logo color')
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(50);

    return res.status(200).json({ success: true, count: bids.length, bids });
  } catch (error) {
    console.error('Error getting bids history:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Get auction analytics & insights
// @route GET /api/auction/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const soldPlayers = await Player.find({ status: 'sold' }).populate('soldTo', 'name shortName color logo');
    const unsoldPlayers = await Player.countDocuments({ status: 'unsold' });
    const upcomingPlayers = await Player.countDocuments({ status: 'upcoming' });

    const teams = await Team.find();
    const totalBudget = teams.reduce((sum, t) => sum + t.budget, 0);
    const totalSpent = teams.reduce((sum, t) => sum + t.spent, 0);

    const positionSpend = {
      GK: { count: 0, spent: 0 },
      DEF: { count: 0, spent: 0 },
      MID: { count: 0, spent: 0 },
      FWD: { count: 0, spent: 0 }
    };

    soldPlayers.forEach(p => {
      if (positionSpend[p.position]) {
        positionSpend[p.position].count += 1;
        positionSpend[p.position].spent += p.currentPrice || p.basePrice;
      }
    });

    const topBuys = [...soldPlayers]
      .sort((a, b) => (b.currentPrice || b.basePrice) - (a.currentPrice || a.basePrice))
      .slice(0, 5)
      .map(p => ({
        id: p._id,
        name: p.name,
        position: p.position,
        role: p.role,
        rating: p.stats?.overall || 80,
        club: p.club,
        basePrice: p.basePrice,
        soldPrice: p.currentPrice,
        inflation: Math.round(((p.currentPrice - p.basePrice) / p.basePrice) * 100),
        team: p.soldTo
      }));

    return res.status(200).json({
      success: true,
      analytics: {
        totalPlayers,
        soldCount: soldPlayers.length,
        unsoldCount: unsoldPlayers,
        upcomingCount: upcomingPlayers,
        totalBudget,
        totalSpent,
        remainingBudget: Math.max(0, totalBudget - totalSpent),
        averagePlayerPrice: soldPlayers.length > 0 ? Math.round(totalSpent / soldPlayers.length) : 0,
        positionSpend,
        topBuys
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};
