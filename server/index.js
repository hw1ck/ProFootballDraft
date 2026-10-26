const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { setupAuctionSocket } = require('./socket/auctionSocket');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration - dynamic origin for Render and local development
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://localhost:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server) or matching origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production' || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in preview/render deployments
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  },
  transports: ['websocket', 'polling']
});

// Setup Auction Socket engine
setupAuctionSocket(io);

// Health Check endpoint (for Render / uptime monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ProFootballDraft Auction Service',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/leaderboard', require('./routes/profileRoutes'));
app.use('/api/auction', require('./routes/auctionRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 ProFootballDraft Auction Service running on port ${PORT}`);
  console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`====================================================`);

  // Optional: Auto-seed if database is completely empty
  try {
    const Player = require('./models/Player');
    const count = await Player.countDocuments();
    if (count === 0) {
      console.log('[Auto-Seed] Empty database detected. Running initial seed...');
      const auctionController = require('./controllers/auctionController');
      await auctionController.seedDatabase({ body: {} }, { status: () => ({ json: () => {} }) });
    }
  } catch (err) {
    // Graceful if DB is offline initially
  }
});
