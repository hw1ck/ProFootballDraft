const mongoose = require('mongoose');

let mongodInstance = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[Database] Connecting to configured MONGODB_URI...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`[Database] Connected to external MongoDB URI`);
      return;
    } catch (err) {
      console.warn(`[Database] External URI connection failed (${err.message}). Trying fallback options...`);
    }
  }

  // Try local MongoDB daemon
  try {
    console.log(`[Database] Checking local MongoDB on mongodb://127.0.0.1:27017/profootballdraft...`);
    await mongoose.connect('mongodb://127.0.0.1:27017/profootballdraft', { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] Connected to local MongoDB daemon.`);
    return;
  } catch (err) {
    console.log(`[Database] Local MongoDB daemon not reachable.`);
  }

  // Fallback to embedded in-memory MongoDB
  try {
    console.log(`[Database] Initializing embedded in-memory database...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Successfully connected to embedded in-memory database at ${memoryUri}`);
  } catch (err) {
    console.error(`[Database Error] Failed to initialize in-memory database:`, err.message);
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
}

module.exports = connectDB;
