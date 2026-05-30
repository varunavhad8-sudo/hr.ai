import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setStatus(user ? 'authenticated' : 'unauthenticated');
    });
    return () => unsub();
  }, []);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return <Navigate to="/signin" replace />;
  return children;
};

export default ProtectedRoute;
