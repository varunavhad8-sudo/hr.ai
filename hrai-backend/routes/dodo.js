const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckout, handleWebhook } = require('../controllers/dodoController');

// Webhook uses raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Auth-protected routes
router.post('/create-checkout', protect, createCheckout);

module.exports = router;
