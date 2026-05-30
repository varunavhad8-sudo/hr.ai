// Central source of truth for all plan limits and pricing.
// Annual price = monthly × 12 × 0.9 (10% discount)
// INR → Indian users via Razorpay
// USD → International users via Dodo Payments

const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    // INR
    monthlyPrice: 0,
    annualPrice: 0,
    // USD
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    parsesPerMonth: 10,
    features: [
      "10 resume parses/month",
      "AI-powered resume parsing",
      "Personal candidate library",
      "Search and filter candidates",
      "Community support"
    ],
  },

  starter: {
    id: 'starter',
    name: 'Starter',
    // INR (Indian users — Razorpay)
    monthlyPrice: 399,
    annualPrice: 4308,        // 399 × 12 × 0.9
    // USD (International users — Dodo)
    monthlyPriceUSD: 10,
    annualPriceUSD: 108,      // 10 × 12 × 0.9
    parsesPerMonth: 200,
    features: [
      "200 resume parses/month",
      "AI-powered resume parsing",
      "Personal candidate library",
      "Vault for archived candidates",
      "Export candidates to Excel",
      "Priority support"
    ],
    razorpay: {
      monthly: { planId: 'plan_Su2qpTUFAsFc399' },
      annual:  { planId: 'plan_Su2r5WydvKLy430' },
    },
    dodo: {
      monthly: { productId: 'pdt_0NfgWIPKGN9k7paNFgr56' },
      annual:  { productId: 'pdt_0NfgWIWcmlKmovY8CWFUy' },
    },
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    // INR (Indian users — Razorpay)
    monthlyPrice: 699,
    annualPrice: 7548,       // 699 × 12 × 0.9
    // USD (International users — Dodo)
    monthlyPriceUSD: 20,
    annualPriceUSD: 216,      // 20 × 12 × 0.9
    parsesPerMonth: 500,
    features: [
      "500 resume parses/month",
      "Everything in Starter",
      "Advanced search and filters",
      "Dedicated account support"
    ],
    razorpay: {
      monthly: { planId: 'plan_Su2rGwuObhyi699' },
      annual:  { planId: 'plan_Su2rTnqGAQGb754' },
    },
    dodo: {
      monthly: { productId: 'pdt_0NfgWIaq9wmFZFmkZk9FH' },
      annual:  { productId: 'pdt_0NfgWIf9aqdmFU6VNF396' },
    },
  },
};

module.exports = PLANS;
