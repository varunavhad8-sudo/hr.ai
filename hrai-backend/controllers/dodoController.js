const crypto = require('crypto');
const DodoPayments = require('dodopayments');
const PLANS = require('../config/plans');
const Subscription = require('../models/Subscription');

const dodo = new DodoPayments({ bearerToken: process.env.DODO_API_KEY });

/**
 * POST /api/dodo/create-checkout
 * Creates a Dodo Payments hosted checkout session.
 * Body: { plan: "starter" | "pro", billingCycle: "monthly" | "annual" }
 */
const createCheckout = async (req, res) => {
  try {
    const { plan: planId, billingCycle = 'monthly' } = req.body;

    if (!planId || planId === 'free') {
      return res.status(400).json({ error: 'Invalid plan. Choose starter or pro.' });
    }

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    const productId = plan.dodo[billingCycle]?.productId;
    if (!productId) {
      return res.status(400).json({ error: 'Dodo product ID not configured' });
    }

    // Create Dodo checkout session
    const session = await dodo.subscriptions.create({
      billing: { city: '', country: 'US', state: '', street: '', zipcode: '' },
      customer: { email: req.user.email, name: req.user.name || '' },
      metadata: {
        firebaseUid: req.user.uid,
        plan: planId,
        billingCycle,
      },
      payment_link: true,
      product_id: productId,
      quantity: 1,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
    });

    return res.status(200).json({
      checkoutUrl: session.payment_link,
      plan: planId,
      billingCycle,
    });
  } catch (err) {
    console.error('[createCheckout] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/dodo/webhook
 * Dodo sends events here after payment.
 * Signature is verified using HMAC-SHA256.
 */
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    const signature = req.headers['webhook-signature'];
    const timestamp = req.headers['webhook-timestamp'];

    // Verify Dodo webhook signature
    const signedPayload = `${timestamp}.${req.body.toString()}`;
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex');

    if (!signature || !signature.includes(expectedSig)) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString());
    const data = event.data;
    const metadata = data?.metadata || {};

    const uid = metadata.firebaseUid;
    const planId = metadata.plan;
    const billingCycle = metadata.billingCycle;

    const now = new Date();
    const periodEnd = new Date(now);
    billingCycle === 'annual'
      ? periodEnd.setFullYear(periodEnd.getFullYear() + 1)
      : periodEnd.setMonth(periodEnd.getMonth() + 1);

    switch (event.type) {
      case 'payment.succeeded':
      case 'subscription.active': {
        await Subscription.findOneAndUpdate(
          { userId: uid },
          {
            userId: uid,
            plan: planId,
            billingCycle,
            gateway: 'dodo',
            gatewaySubId: data.subscription_id || data.payment_id,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
          { upsert: true, new: true }
        );
        break;
      }

      case 'subscription.renewed': {
        const renewEnd = new Date(now);
        billingCycle === 'annual'
          ? renewEnd.setFullYear(renewEnd.getFullYear() + 1)
          : renewEnd.setMonth(renewEnd.getMonth() + 1);

        await Subscription.findOneAndUpdate(
          { gatewaySubId: data.subscription_id },
          { status: 'active', currentPeriodStart: now, currentPeriodEnd: renewEnd }
        );
        break;
      }

      case 'subscription.cancelled':
        await Subscription.findOneAndUpdate(
          { gatewaySubId: data.subscription_id },
          { status: 'cancelled' }
        );
        break;

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[dodo webhook] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createCheckout, handleWebhook };
