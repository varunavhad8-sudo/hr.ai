const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  try {
    // Local development bypass mode
    if (process.env.BYPASS_AUTH === 'true') {
      req.user = {
        uid: 'mock-dev-user-id',
        email: 'dev@hr.ai',
        name: 'Developer'
      };
      return next();
    }

    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    // Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('[authMiddleware] Token Verification Failed:', err.message);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
