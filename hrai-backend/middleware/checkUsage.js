const PLANS = require('../config/plans');
const Subscription = require('../models/Subscription');
const UsageLog = require('../models/UsageLog');
const User = require('../models/User');
const { sendUsageWarning, sendLimitReached } = require('../services/emailService');
const admin = require('../config/firebase');

/**
 * Middleware — runs before every POST /api/parse-resume
 * Checks if the user has remaining parses for the current month.
 * Blocks with 429 if limit is reached.
 */
const checkUsage = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    // 1. Get user's active plan (default to free if no subscription found)
    const subscription = await Subscription.findOne({ userId: uid });
    const planId = subscription?.plan || 'free';
    const plan = PLANS[planId];
    const limit = plan.parsesPerMonth;

    // 2. Get usage depending on plan type
    let used = 0;
    if (planId === 'free') {
      // Free plan uses lifetime limit
      const userDoc = await User.findOne({ firebaseUid: uid });
      used = userDoc?.total_lifetime_parses || 0;
    } else {
      // Paid plans use monthly limit
      let usageLog = await UsageLog.findOne({ userId: uid, month });
      used = usageLog?.parsesUsed || 0;
    }

    // 3. Check usage thresholds and send emails
    if (used >= limit) {
      // Send limit-reached email (fire-and-forget)
      admin.auth().getUser(uid).then((firebaseUser) => {
        sendLimitReached({ email: firebaseUser.email, name: firebaseUser.displayName }, { limit, planId });
      }).catch(() => {});

      return res.status(429).json({
        error: planId === 'free' ? 'Lifetime parse limit reached' : 'Monthly parse limit reached',
        plan: planId,
        limit,
        used,
        upgradeUrl: '/pricing',
      });
    }

    // Send 80% warning when they're about to hit the limit (only once — at exactly 80%)
    const warningThreshold = Math.floor(limit * 0.8);
    if (limit > 1 && used === warningThreshold && used > 0) {
      admin.auth().getUser(uid).then((firebaseUser) => {
        sendUsageWarning(
          { email: firebaseUser.email, name: firebaseUser.displayName },
          { used, limit, planId }
        );
      }).catch(() => {});
    }

    // 4. Attach plan info to req for use in controller
    req.planId = planId;
    req.month = month;
    req.parsesUsed = used;

    next();
  } catch (err) {
    console.error('[checkUsage] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Called by resumeController after a successful parse to increment usage.
 */
const incrementUsage = async (uid, month) => {
  // Always log monthly for metrics
  await UsageLog.findOneAndUpdate(
    { userId: uid, month },
    { $inc: { parsesUsed: 1 } },
    { upsert: true, new: true }
  );
  // Also track lifetime usage for free tier limits
  await User.findOneAndUpdate(
    { firebaseUid: uid },
    { $inc: { total_lifetime_parses: 1 } }
  );
};

module.exports = { checkUsage, incrementUsage };
