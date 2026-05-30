import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBwh2jtwbEpn9LoLScrwBEniSN_HetXmsM",
  authDomain: "hrai-8a656.firebaseapp.com",
  projectId: "hrai-8a656",
  storageBucket: "hrai-8a656.firebasestorage.app",
  messagingSenderId: "800941606671",
  appId: "1:800941606671:web:686c6f169d6e9b85cfe07a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
