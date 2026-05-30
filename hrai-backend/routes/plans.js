const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getPlans, getMySubscription } = require('../controllers/planController');

router.get('/', getPlans);                    // Public
router.get('/my', protect, getMySubscription); // Auth required

module.exports = router;
