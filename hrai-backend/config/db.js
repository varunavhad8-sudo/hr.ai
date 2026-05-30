const mongoose = require('mongoose');
const { enableMockDB } = require('./mockDb');

const connectDB = async () => {
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err.message);
  });

  if (process.env.BYPASS_AUTH === 'true') {
    enableMockDB();
    await mongoose.connect(process.env.MONGODB_URI);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Connection failed: ${error.message}`);
    console.warn('[dbConfig] WARNING: MongoDB failed to connect. Server will remain running in offline/mock mode.');
    enableMockDB();
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

module.exports = connectDB;
