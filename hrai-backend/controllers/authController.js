const User = require('../models/User');
const Subscription = require('../models/Subscription');
const admin = require('../config/firebase');
const { sendWelcomeEmail } = require('../services/emailService');

/**
 * POST /api/auth/sync
 * Called from frontend immediately after Firebase login/signup.
 * Creates the user in MongoDB if they don't exist yet, or returns existing.
 * req.user is populated by the protect middleware (Firebase decoded token).
 */
const syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // First time — create the user record in MongoDB
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || req.body.name || '',
        photoURL: picture || '',
        role: 'hr_manager',
      });

      // Write custom claim role to Firebase Auth securely
      try {
        await admin.auth().setCustomUserClaims(uid, { role: 'hr_manager' });
        console.log(`[syncUser] Set custom Firebase claim (role: hr_manager) for UID: ${uid}`);
      } catch (firebaseError) {
        console.warn('[syncUser] Firebase Admin claims warning (normal in mock development):', firebaseError.message);
      }

      // Send welcome email to new users
      sendWelcomeEmail({ email: user.email, name: user.name });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('[syncUser] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's MongoDB record.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sync first.' });
    }

    const subscription = await Subscription.findOne({ userId: req.user.uid });
    user.plan = subscription?.plan || 'free';

    return res.status(200).json({ user });
  } catch (err) {
    console.error('[getMe] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
/**
 * PUT /api/auth/me
 * Update the current user's profile details.
 */
const updateProfile = async (req, res) => {
  try {
    const { name, jobTitle, company } = req.body;
    
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: { name, jobTitle, company } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('[updateProfile] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { syncUser, getMe, updateProfile };
