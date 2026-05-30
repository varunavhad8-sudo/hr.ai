require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRouter = require('./routes/auth');
const resumeRoute = require('./routes/resume');
const candidatesRouter = require('./routes/candidates');
const plansRouter = require('./routes/plans');
const razorpayRouter = require('./routes/razorpay');
const dodoRouter = require('./routes/dodo');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Webhooks (must use raw body, so mount before express.json)
app.use('/api/razorpay/webhook', express.raw({ type: 'application/json' }));
app.use('/api/dodo/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());



// Full API Routes
app.use('/api/auth', authRouter);
app.use('/api/parse-resume', resumeRoute);
app.use('/api/candidates', candidatesRouter);
app.use('/api/plans', plansRouter);
app.use('/api/razorpay', razorpayRouter);
app.use('/api/dodo', dodoRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HR.ai clean backend running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
