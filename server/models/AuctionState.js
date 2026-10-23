const mongoose = require('mongoose');

const auctionStateSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['idle', 'bidding', 'paused', 'sold', 'unsold', 'completed'],
    default: 'idle'
  },
  competition: {
    type: String,
    default: 'Premier League'
  },
  lotNumber: {
    type: Number,
    default: 1
  },
  totalLots: {
    type: Number,
    default: 162
  },
  currentPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  currentBid: {
    type: Number,
    default: 0
  },
  currentBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  timerSeconds: {
    type: Number,
    default: 30
  },
  initialTimer: {
    type: Number,
    default: 30
  },
  antiSnipe: {
    type: Boolean,
    default: true
  },
  antiSnipeTriggered: {
    type: Boolean,
    default: false
  },
  isTimerRunning: {
    type: Boolean,
    default: false
  },
  skippedManagers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  bidHistory: [{
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    teamName: String,
    teamShort: String,
    teamColor: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  activityFeed: [{
    text: String,
    type: { type: String, default: 'info' }, // 'bid', 'sold', 'skip', 'anti_snipe', 'info'
    timestamp: { type: Date, default: Date.now }
  }],
  lastSold: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  message: {
    type: String,
    default: 'ProFootballDraft Auction Arena is ready'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuctionState', auctionStateSchema);
