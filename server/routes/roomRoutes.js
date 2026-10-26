const express = require('express');
const router = express.Router();
const { roomManager } = require('../rooms/RoomManager');

// Helper to get user info from request or fallback to demo user
function getUserFromReq(req) {
  if (req.user) {
    return {
      id: req.user._id || req.user.id,
      name: req.user.name || req.user.username || 'Manager',
      email: req.user.email
    };
  }
  const bodyUser = req.body.user || {};
  return {
    id: bodyUser.id || bodyUser._id || 'anon-' + (req.ip || 'user').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10),
    name: bodyUser.name || bodyUser.username || req.body.username || 'Manager',
    email: bodyUser.email || ''
  };
}

// @desc Get open public rooms
// @route GET /api/rooms/public
router.get('/public', (req, res) => {
  try {
    const { competition, mode } = req.query;
    const rooms = roomManager.getOpenPublicRooms(competition, mode);
    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc Create a new custom room
// @route POST /api/rooms
router.post('/', (req, res) => {
  try {
    const user = getUserFromReq(req);
    const {
      roomName,
      competition,
      season,
      roomSize,
      startingBudget,
      bidTimer,
      mode,
      isPublic,
      antiSnipe
    } = req.body;

    const room = roomManager.createRoom({
      roomName,
      competition,
      season,
      roomSize,
      startingBudget,
      bidTimer,
      mode,
      isPublic,
      antiSnipe
    }, user);

    return res.status(201).json({
      success: true,
      code: room.code,
      room: room.toFullState()
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to create room' });
  }
});

// @desc Play Now (Instant matchmaking)
// @route POST /api/rooms/play-now
router.post('/play-now', (req, res) => {
  try {
    const user = getUserFromReq(req);
    const { competition, mode } = req.body;
    const room = roomManager.matchmakePlayNow(user, competition, mode);

    return res.status(200).json({
      success: true,
      code: room.code,
      room: room.toFullState()
    });
  } catch (error) {
    console.error('Error in matchmaking:', error);
    return res.status(400).json({ success: false, message: error.message || 'Matchmaking failed' });
  }
});

// @desc Get room by code
// @route GET /api/rooms/:code
router.get('/:code', (req, res) => {
  try {
    const room = roomManager.getRoom(req.params.code);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    return res.status(200).json({
      success: true,
      room: room.toFullState()
    });
  } catch (error) {
    console.error('Error getting room:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc Join an existing room
// @route POST /api/rooms/:code/join
router.post('/:code/join', (req, res) => {
  try {
    const room = roomManager.getRoom(req.params.code);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    const user = getUserFromReq(req);
    const seat = room.addManager(user);
    return res.status(200).json({
      success: true,
      seat,
      room: room.toFullState()
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to join room' });
  }
});

// @desc Start auction (host only)
// @route POST /api/rooms/:code/start
router.post('/:code/start', (req, res) => {
  try {
    const room = roomManager.getRoom(req.params.code);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const user = getUserFromReq(req);
    room.startAuction(user.id);
    return res.status(200).json({ success: true, room: room.toFullState() });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to start auction' });
  }
});

// @desc Place bid in room
// @route POST /api/rooms/:code/bid
router.post('/:code/bid', (req, res) => {
  try {
    const room = roomManager.getRoom(req.params.code);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const user = getUserFromReq(req);
    const amount = Number(req.body.amount);
    room.placeBid(user.id, amount);
    return res.status(200).json({ success: true, room: room.toFullState() });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to place bid' });
  }
});

// @desc Skip lot in room
// @route POST /api/rooms/:code/skip
router.post('/:code/skip', (req, res) => {
  try {
    const room = roomManager.getRoom(req.params.code);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const user = getUserFromReq(req);
    room.skipLot(user.id);
    return res.status(200).json({ success: true, room: room.toFullState() });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to skip lot' });
  }
});

// @desc Toggle pause in room (host only)
// @route POST /api/rooms/:code/pause
router.post('/:code/pause', (req, res) => {
  try {
    const room = roomManager.getRoom(req.params.code);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const user = getUserFromReq(req);
    room.togglePause(user.id);
    return res.status(200).json({ success: true, room: room.toFullState() });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to toggle pause' });
  }
});

module.exports = router;
