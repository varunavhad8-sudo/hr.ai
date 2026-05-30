const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro'],
      default: 'free',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    gateway: {
      type: String,
      enum: ['razorpay', 'dodo', null],
      default: null,
    },
    gatewaySubId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
