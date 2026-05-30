const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment, handleWebhook, cancelSubscription } = require('../controllers/razorpayController');

// Webhook MUST use raw body — registered before express.json() in server.js
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Auth-protected routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
