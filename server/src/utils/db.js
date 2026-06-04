const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
  });
  isConnected = true;
  console.log('MongoDB connected');
}

module.exports = { connectDB };
