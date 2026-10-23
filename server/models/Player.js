const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    default: ''
  },
  surname: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: 25
  },
  preferredFoot: {
    type: String,
    default: 'Right'
  },
  jerseyNumber: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    required: true
  },
  subPositions: [{
    type: String
  }],
  role: {
    type: String,
    default: 'Star Player'
  },
  nationality: {
    type: String,
    default: 'Global',
    trim: true
  },
  nationalityCode: {
    type: String,
    default: ''
  },
  club: {
    type: String,
    default: 'Free Agent',
    trim: true
  },
  clubCrestUrl: {
    type: String,
    default: ''
  },
  league: {
    type: String,
    default: 'Premier League'
  },
  competitions: [{
    type: String
  }],
  basePrice: {
    type: Number,
    required: true,
    default: 10,
    min: 10
  },
  estimatedValue: {
    type: Number,
    default: 100,
    min: 1
  },
  currentPrice: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['upcoming', 'in_auction', 'sold', 'unsold'],
    default: 'upcoming'
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  stats: {
    pace: { type: Number, default: 75, min: 1, max: 99 },
    shooting: { type: Number, default: 75, min: 1, max: 99 },
    passing: { type: Number, default: 75, min: 1, max: 99 },
    dribbling: { type: Number, default: 75, min: 1, max: 99 },
    defending: { type: Number, default: 75, min: 1, max: 99 },
    physical: { type: Number, default: 75, min: 1, max: 99 },
    overall: { type: Number, default: 80, min: 1, max: 99 }
  },
  rarity: {
    type: String,
    default: 'RARE'
  },
  photoUrl: {
    type: String,
    default: ''
  },
  orderIndex: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
