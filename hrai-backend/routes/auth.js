const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { syncUser, getMe, updateProfile } = require('../controllers/authController');

// POST /api/auth/sync — called after Firebase login to create/fetch MongoDB user
router.post('/sync', protect, syncUser);

// GET /api/auth/me — get current user's profile
router.get('/me', protect, getMe);

// PUT /api/auth/me — update current user's profile
router.put('/me', protect, updateProfile);

module.exports = router;
