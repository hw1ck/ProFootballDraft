const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  logo: {
    type: String,
    default: '⚽'
  },
  color: {
    type: String,
    default: '#10B981'
  },
  budget: {
    type: Number,
    required: true,
    default: 1000 // 1,000 coins default
  },
  spent: {
    type: Number,
    default: 0
  },
  maxPlayers: {
    type: Number,
    default: 18 // 18-man squad rule
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

teamSchema.virtual('remainingBudget').get(function() {
  return Math.max(0, this.budget - this.spent);
});

teamSchema.virtual('playerCount').get(function() {
  return this.players ? this.players.length : 0;
});

teamSchema.virtual('maxBid').get(function() {
  const currentSquadCount = this.players ? this.players.length : 0;
  if (currentSquadCount >= 18) return 0;
  const remainingSlotsAfterCurrentLot = 18 - currentSquadCount - 1;
  const requiredReserve = Math.max(0, remainingSlotsAfterCurrentLot * 10);
  const remaining = Math.max(0, this.budget - this.spent);
  return Math.max(0, remaining - requiredReserve);
});

module.exports = mongoose.model('Team', teamSchema);
