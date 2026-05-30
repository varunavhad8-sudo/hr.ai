const crypto = require('crypto');
const Razorpay = require('razorpay');
const PLANS = require('../config/plans');
const Subscription = require('../models/Subscription');
const {
  sendPaymentConfirmation,
  sendRenewalReceipt,
  sendPaymentFailed,
  sendCancellationConfirmation,
} = require('../services/emailService');
const admin = require('../config/firebase');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/razorpay/create-order
 * Creates a Razorpay subscription for the selected plan + billing cycle.
 * Body: { plan: "starter" | "pro", billingCycle: "monthly" | "annual" }
 */
const createOrder = async (req, res) => {
  try {
    const { plan: planId, billingCycle = 'monthly' } = req.body;

    if (!planId || planId === 'free') {
      return res.status(400).json({ error: 'Invalid plan. Choose starter or pro.' });
    }

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    const razorpayPlanId = plan.razorpay[billingCycle]?.planId;
    if (!razorpayPlanId) {
      return res.status(400).json({ error: 'Razorpay plan ID not configured' });
    }

    // Create subscription in Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: billingCycle === 'annual' ? 1 : 12, // annual = 1 charge, monthly = 12
      quantity: 1,
      notes: {
        firebaseUid: req.user.uid,
        plan: planId,
        billingCycle,
      },
    });

    return res.status(200).json({
      subscriptionId: subscription.id,
      key: process.env.RAZORPAY_KEY_ID,
      plan: planId,
      billingCycle,
      amount: billingCycle === 'annual' ? plan.annualPrice * 100 : plan.monthlyPrice * 100, // paise
      currency: 'INR',
    });
  } catch (err) {
    console.error('[createOrder] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/razorpay/verify
 * Called from the frontend after Razorpay payment modal closes successfully.
 * Verifies the payment signature and activates the subscription.
 * Body: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan, billingCycle }
 */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      plan: planId,
      billingCycle = 'monthly',
    } = req.body;

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Invalid signature.' });
    }

    // Calculate period end date
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'annual') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Upsert subscription record
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user.uid },
      {
        userId: req.user.uid,
        plan: planId,
        billingCycle,
        gateway: 'razorpay',
        gatewaySubId: razorpay_subscription_id,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      { upsert: true, new: true }
    );

    // Send payment confirmation email
    const firebaseUser = await admin.auth().getUser(req.user.uid);
    const plan = PLANS[planId];
    sendPaymentConfirmation(
      { email: firebaseUser.email, name: firebaseUser.displayName },
      {
        plan: planId,
        billingCycle,
        amount: billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice,
        currency: 'INR',
        nextBillingDate: periodEnd.toDateString(),
      }
    );

    return res.status(200).json({ message: 'Plan activated successfully!', subscription });
  } catch (err) {
    console.error('[verifyPayment] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/razorpay/webhook
 * Razorpay sends events here automatically.
 * Uses raw body for signature verification (must NOT use express.json() for this route).
 */
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body) // raw buffer
      .digest('hex');

    if (expectedSig !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString());
    const payload = event.payload?.subscription?.entity;

    if (!payload) return res.status(200).json({ received: true });

    const notes = payload.notes || {};
    const uid = notes.firebaseUid;
    const planId = notes.plan;
    const billingCycle = notes.billingCycle;

    switch (event.event) {
      case 'subscription.activated': {
        const now = new Date();
        const periodEnd = new Date(now);
        billingCycle === 'annual'
          ? periodEnd.setFullYear(periodEnd.getFullYear() + 1)
          : periodEnd.setMonth(periodEnd.getMonth() + 1);

        await Subscription.findOneAndUpdate(
          { userId: uid },
          { plan: planId, billingCycle, gateway: 'razorpay',
            gatewaySubId: payload.id, status: 'active',
            currentPeriodStart: now, currentPeriodEnd: periodEnd },
          { upsert: true }
        );
        break;
      }

      case 'subscription.charged': {
        // Renew the period
        const now = new Date();
        const periodEnd = new Date(now);
        billingCycle === 'annual'
          ? periodEnd.setFullYear(periodEnd.getFullYear() + 1)
          : periodEnd.setMonth(periodEnd.getMonth() + 1);

        const updated = await Subscription.findOneAndUpdate(
          { gatewaySubId: payload.id },
          { status: 'active', currentPeriodStart: now, currentPeriodEnd: periodEnd },
          { new: true }
        );

        // Send renewal receipt
        if (uid && updated) {
          const firebaseUser = await admin.auth().getUser(uid).catch(() => null);
          const plan = PLANS[planId];
          if (firebaseUser && plan) {
            sendRenewalReceipt(
              { email: firebaseUser.email, name: firebaseUser.displayName },
              {
                plan: planId,
                billingCycle,
                amount: billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice,
                currency: 'INR',
                nextBillingDate: periodEnd.toDateString(),
              }
            );
          }
        }
        break;
      }

      case 'subscription.cancelled':
        await Subscription.findOneAndUpdate(
          { gatewaySubId: payload.id },
          { status: 'cancelled' }
        );
        if (uid) {
          const firebaseUser = await admin.auth().getUser(uid).catch(() => null);
          if (firebaseUser) {
            const sub = await Subscription.findOne({ gatewaySubId: payload.id });
            sendCancellationConfirmation(
              { email: firebaseUser.email, name: firebaseUser.displayName },
              { plan: planId, periodEnd: sub?.currentPeriodEnd?.toDateString() || 'N/A' }
            );
          }
        }
        break;

      case 'payment.failed':
        await Subscription.findOneAndUpdate(
          { gatewaySubId: payload.id },
          { status: 'expired' }
        );
        if (uid) {
          const firebaseUser = await admin.auth().getUser(uid).catch(() => null);
          if (firebaseUser) sendPaymentFailed({ email: firebaseUser.email, name: firebaseUser.displayName });
        }
        break;

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[razorpay webhook] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/subscription/cancel
 * Cancels the current active Razorpay subscription at period end.
 */
const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user.uid, status: 'active' });

    if (!sub || sub.plan === 'free') {
      return res.status(400).json({ error: 'No active paid subscription to cancel' });
    }

    if (sub.gateway === 'razorpay' && sub.gatewaySubId) {
      await razorpay.subscriptions.cancel(sub.gatewaySubId, { cancel_at_cycle_end: 1 });
    }

    sub.status = 'cancelled';
    await sub.save();

    return res.status(200).json({ message: 'Subscription cancelled. Access continues until period end.', sub });
  } catch (err) {
    console.error('[cancelSubscription] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, verifyPayment, handleWebhook, cancelSubscription };
