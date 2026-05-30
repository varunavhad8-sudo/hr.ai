const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin Initialized');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error.message);
  }
}

if (process.env.BYPASS_AUTH === 'true') {
  console.log('[mockFirebase] Overriding Firebase Admin Auth with high-fidelity local mock...');
  admin.auth = () => ({
    verifyIdToken: async (token) => ({
      uid: 'mock-dev-user-id',
      email: 'dev@hr.ai',
      name: 'Developer',
      picture: ''
    }),
    setCustomUserClaims: async (uid, claims) => {
      console.log(`[mockFirebase] Simulated setting custom claims for ${uid}:`, claims);
      return;
    },
    getUser: async (uid) => ({
      uid,
      email: 'dev@hr.ai',
      displayName: 'Developer'
    })
  });
}

module.exports = admin;
