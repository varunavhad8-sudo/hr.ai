const PLANS = require('../config/plans');
const Subscription = require('../models/Subscription');
const UsageLog = require('../models/UsageLog');

/**
 * GET /api/plans?region=IN  → INR pricing via Razorpay (default)
 * GET /api/plans?region=US  → USD pricing via Dodo Payments
 * Public — no auth needed.
 */
const getPlans = (req, res) => {
  const region = (req.query.region || 'IN').toUpperCase();
  const isIndia = region === 'IN';

  const plans = Object.values(PLANS).map(({
    id, name, parsesPerMonth, features,
    monthlyPrice, annualPrice,
    monthlyPriceUSD, annualPriceUSD,
  }) => ({
    id,
    name,
    parsesPerMonth,
    features,
    currency:     isIndia ? 'INR' : 'USD',
    gateway:      isIndia ? 'razorpay' : 'dodo',
    monthlyPrice: isIndia ? monthlyPrice    : monthlyPriceUSD,
    annualPrice:  isIndia ? annualPrice     : annualPriceUSD,
    annualDiscount: '10%',
  }));

  return res.status(200).json({ plans, region: isIndia ? 'IN' : 'INTL' });
};


/**
 * GET /api/subscription
 * Returns the current user's subscription + usage for this month.
 */
const getMySubscription = async (req, res) => {
  try {
    const uid = req.user.uid;
    const month = new Date().toISOString().slice(0, 7);

    const subscription = await Subscription.findOne({ userId: uid });
    const planId = subscription?.plan || 'free';
    const plan = PLANS[planId];

    const usageLog = await UsageLog.findOne({ userId: uid, month });
    const parsesUsed = usageLog?.parsesUsed || 0;

    return res.status(200).json({
      plan: planId,
      billingCycle: subscription?.billingCycle || 'monthly',
      status: subscription?.status || 'active',
      parsesUsed,
      parsesLimit: plan.parsesPerMonth,
      parsesRemaining: Math.max(0, plan.parsesPerMonth - parsesUsed),
      currentPeriodEnd: subscription?.currentPeriodEnd || null,
    });
  } catch (err) {
    console.error('[getMySubscription] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getPlans, getMySubscription };
