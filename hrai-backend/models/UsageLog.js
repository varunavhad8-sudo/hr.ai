const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
    },
    // "YYYY-MM" key — new doc created automatically each month on first parse
    month: {
      type: String,
      required: true,
    },
    parsesUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound unique index — one record per user per month
usageLogSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('UsageLog', usageLogSchema);
