import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './firebase'; // Ensure Firebase is initialized

const getAuthToken = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    
    // If the user is already available, resolve immediately
    if (auth.currentUser) {
      auth.currentUser.getIdToken()
        .then(resolve)
        .catch(reject);
      return;
    }

    // Otherwise, wait for onAuthStateChanged to fire once
    let unsubscribe;
    const timeout = setTimeout(() => {
      if (unsubscribe) unsubscribe();
      reject(new Error('Not authenticated'));
    }, 5000); // 5 seconds timeout

    unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
      if (user) {
        user.getIdToken()
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('Not authenticated'));
      }
    });
  });
};

export default getAuthToken;
