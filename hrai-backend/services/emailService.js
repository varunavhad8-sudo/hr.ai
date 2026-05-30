const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || 'HR.ai <noreply@hr-ai.com>';
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Shared HTML layout ───────────────────────────────────────────────────────
const layout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>HR.ai</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">HR<span style="color:#c4b5fd;">.ai</span></h1>
            <p style="margin:6px 0 0;color:#e0d9ff;font-size:13px;">AI-Powered Recruitment Platform</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #334155;text-align:center;">
            <p style="margin:0;color:#64748b;font-size:12px;">© ${new Date().getFullYear()} HR.ai · All rights reserved</p>
            <p style="margin:6px 0 0;color:#64748b;font-size:12px;">
              <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">Visit HR.ai</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ─── Helper: send email ───────────────────────────────────────────────────────
const send = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    // Never crash the main flow due to email failure
    console.error('[emailService] Failed to send email:', err.message);
  }
};

// ─── Button component ─────────────────────────────────────────────────────────
const btn = (text, url) =>
  `<a href="${url}" style="display:inline-block;margin-top:24px;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">${text}</a>`;

const h2 = (text) =>
  `<h2 style="margin:0 0 12px;color:#f1f5f9;font-size:22px;font-weight:700;">${text}</h2>`;

const p = (text) =>
  `<p style="margin:0 0 16px;color:#94a3b8;font-size:15px;line-height:1.7;">${text}</p>`;

const badge = (text, color = '#6366f1') =>
  `<span style="display:inline-block;padding:4px 14px;background:${color}22;color:${color};border-radius:99px;font-size:13px;font-weight:600;border:1px solid ${color}55;">${text}</span>`;

const infoBox = (rows) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:10px;padding:20px;margin:20px 0;">
  ${rows.map(([label, value]) => `
  <tr>
    <td style="color:#64748b;font-size:13px;padding:6px 0;">${label}</td>
    <td style="color:#f1f5f9;font-size:13px;font-weight:600;text-align:right;">${value}</td>
  </tr>`).join('')}
</table>`;

// ─── 1. Welcome Email ─────────────────────────────────────────────────────────
const sendWelcomeEmail = async ({ email, name }) => {
  await send({
    to: email,
    subject: '👋 Welcome to HR.ai — Let\'s build your dream team',
    html: layout(`
      ${h2(`Welcome aboard, ${name || 'there'}! 🎉`)}
      ${p('We\'re thrilled to have you on HR.ai — the AI-powered recruitment platform that helps you find the best candidates faster than ever.')}
      ${p('Here\'s what you can do right now:')}
      <ul style="color:#94a3b8;font-size:15px;line-height:2;padding-left:20px;">
        <li>📄 Upload PDF resumes and let AI extract candidate details instantly</li>
        <li>🗂️ Build your personal candidate library — yours forever</li>
        <li>🔍 Search, filter and manage all your candidates in one place</li>
      </ul>
      ${p('You\'re on the <strong style="color:#f1f5f9;">Free plan</strong> — 10 resume parses per month. Upgrade anytime to unlock more.')}
      ${btn('Get Started →', APP_URL)}
    `),
  });
};

// ─── 2. Payment Confirmation ──────────────────────────────────────────────────
const sendPaymentConfirmation = async ({ email, name }, { plan, billingCycle, amount, currency, nextBillingDate }) => {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const cycleLabel = billingCycle === 'annual' ? 'Annual' : 'Monthly';
  await send({
    to: email,
    subject: `✅ Payment confirmed — ${planLabel} Plan activated`,
    html: layout(`
      ${h2('Payment Confirmed!')}
      ${p(`Hi ${name || 'there'}, your payment was successful. Welcome to the <strong style="color:#f1f5f9;">${planLabel} Plan</strong>!`)}
      ${infoBox([
        ['Plan', `${planLabel} (${cycleLabel})`],
        ['Amount Paid', `${currency} ${amount}`],
        ['Next Billing Date', nextBillingDate],
        ['Status', '✅ Active'],
      ])}
      ${p('You can now enjoy all your plan\'s features. Start uploading resumes and finding great candidates!')}
      ${btn('Go to Dashboard →', `${APP_URL}/dashboard`)}
    `),
  });
};

// ─── 3. Renewal Receipt ───────────────────────────────────────────────────────
const sendRenewalReceipt = async ({ email, name }, { plan, billingCycle, amount, currency, nextBillingDate }) => {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  await send({
    to: email,
    subject: `🔄 Your HR.ai ${planLabel} plan has been renewed`,
    html: layout(`
      ${h2('Subscription Renewed')}
      ${p(`Hi ${name || 'there'}, your <strong style="color:#f1f5f9;">${planLabel} Plan</strong> has been successfully renewed. Nothing changes — you're all set!`)}
      ${infoBox([
        ['Plan', planLabel],
        ['Billing Cycle', billingCycle === 'annual' ? 'Annual' : 'Monthly'],
        ['Amount Charged', `${currency} ${amount}`],
        ['Next Renewal', nextBillingDate],
      ])}
      ${btn('View Dashboard →', `${APP_URL}/dashboard`)}
    `),
  });
};

// ─── 4. Payment Failed ────────────────────────────────────────────────────────
const sendPaymentFailed = async ({ email, name }) => {
  await send({
    to: email,
    subject: '⚠️ Payment failed — Action required',
    html: layout(`
      ${h2('Payment Failed')}
      ${p(`Hi ${name || 'there'}, we were unable to process your recent payment for HR.ai.`)}
      ${p('This could be due to an expired card, insufficient funds, or a bank issue. Please update your payment method to keep your subscription active.')}
      <div style="background:#7f1d1d22;border:1px solid #ef444455;border-radius:10px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0;color:#fca5a5;font-size:14px;">⚠️ Your subscription will be paused if payment is not resolved within <strong>3 days</strong>.</p>
      </div>
      ${btn('Update Payment Method →', `${APP_URL}/billing`)}
    `),
  });
};

// ─── 5. Usage Warning (80%) ───────────────────────────────────────────────────
const sendUsageWarning = async ({ email, name }, { used, limit, planId }) => {
  const remaining = limit - used;
  await send({
    to: email,
    subject: `⚡ You've used ${used}/${limit} resume parses this month`,
    html: layout(`
      ${h2('Running low on parses')}
      ${p(`Hi ${name || 'there'}, you've used <strong style="color:#f59e0b;">${used} of ${limit}</strong> resume parses this month. Only <strong style="color:#f1f5f9;">${remaining} remaining</strong>.`)}
      <div style="background:#0f172a;border-radius:10px;padding:20px;margin:20px 0;">
        <div style="background:#1e293b;border-radius:99px;height:10px;overflow:hidden;">
          <div style="background:linear-gradient(90deg,#6366f1,#f59e0b);width:80%;height:100%;border-radius:99px;"></div>
        </div>
        <p style="margin:10px 0 0;color:#94a3b8;font-size:13px;text-align:right;">${used} / ${limit} parses used</p>
      </div>
      ${planId === 'free'
        ? p('Upgrade to <strong style="color:#f1f5f9;">Starter</strong> (200 parses/month) or <strong style="color:#f1f5f9;">Pro</strong> (500 parses/month) to never run out.')
        : p('Consider upgrading to a higher plan to ensure uninterrupted access.')
      }
      ${btn('Upgrade Plan →', `${APP_URL}/pricing`)}
    `),
  });
};

// ─── 6. Limit Reached (100%) ──────────────────────────────────────────────────
const sendLimitReached = async ({ email, name }, { limit, planId }) => {
  await send({
    to: email,
    subject: `🚫 Monthly parse limit reached (${limit}/${limit})`,
    html: layout(`
      ${h2('Parse limit reached')}
      ${p(`Hi ${name || 'there'}, you've used all <strong style="color:#ef4444;">${limit} resume parses</strong> for this month on your current plan.`)}
      ${p('You won\'t be able to upload more resumes until your limit resets on the 1st of next month — unless you upgrade now.')}
      ${infoBox([
        ['Current Plan', planId.charAt(0).toUpperCase() + planId.slice(1)],
        ['Parses Used', `${limit} / ${limit}`],
        ['Resets On', '1st of next month'],
      ])}
      ${planId !== 'pro' ? btn('Upgrade Now →', `${APP_URL}/pricing`) : btn('Go to Dashboard →', `${APP_URL}/dashboard`)}
    `),
  });
};

// ─── 7. Cancellation Confirmation ────────────────────────────────────────────
const sendCancellationConfirmation = async ({ email, name }, { plan, periodEnd }) => {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  await send({
    to: email,
    subject: `Subscription cancelled — Access continues until ${periodEnd}`,
    html: layout(`
      ${h2('Subscription Cancelled')}
      ${p(`Hi ${name || 'there'}, we've cancelled your <strong style="color:#f1f5f9;">${planLabel} Plan</strong> as requested.`)}
      <div style="background:#16213e;border:1px solid #334155;border-radius:10px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0;color:#94a3b8;font-size:14px;">✅ Your access to all <strong style="color:#f1f5f9;">${planLabel}</strong> features continues until <strong style="color:#f1f5f9;">${periodEnd}</strong>. After that, you'll be moved to the Free plan.</p>
      </div>
      ${p('We\'d love to know why you cancelled. Your feedback helps us improve.')}
      ${btn('Reactivate Subscription →', `${APP_URL}/pricing`)}
    `),
  });
};

// ─── 8. Expiry Reminder ───────────────────────────────────────────────────────
const sendExpiryReminder = async ({ email, name }, { plan, daysLeft, periodEnd }) => {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  await send({
    to: email,
    subject: `⏰ Your ${planLabel} plan expires in ${daysLeft} days`,
    html: layout(`
      ${h2(`Your plan expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`)}
      ${p(`Hi ${name || 'there'}, your <strong style="color:#f1f5f9;">${planLabel} Plan</strong> is set to expire on <strong style="color:#f59e0b;">${periodEnd}</strong>.`)}
      ${p('After expiry, your account will be moved to the Free plan (10 parses/month) and some features will be restricted.')}
      ${btn('Renew Subscription →', `${APP_URL}/pricing`)}
    `),
  });
};

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  sendWelcomeEmail,
  sendPaymentConfirmation,
  sendRenewalReceipt,
  sendPaymentFailed,
  sendUsageWarning,
  sendLimitReached,
  sendCancellationConfirmation,
  sendExpiryReminder,
};
