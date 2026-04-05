import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logOut } from '../lib/firebase';
import { verifyUser } from '../api/authApi';
import useAuthStore from '../store/authStore';

export default function useAuth() {
  const { user, token, loading, setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setUser(firebaseUser);
        setToken(idToken);
        try {
          await verifyUser();
        } catch (e) {
          console.error('Failed to verify user on backend', e);
        }
      } else {
        logout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const { user: u, token: t } = await signInWithGoogle();
      setUser(u);
      setToken(t);
      await verifyUser();
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const handleLogout = async () => {
    await logOut();
    logout();
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout: handleLogout,
  };
}
