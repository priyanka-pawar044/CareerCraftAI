'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from './use-auth';

interface UserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UserState {
  const auth = useAuth();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUserState({ user, loading: false, error: null });
        },
        (error) => {
          setUserState({ user: null, loading: false, error });
        }
      );
      return () => unsubscribe();
    } else {
      setUserState({ user: null, loading: false, error: null });
    }
  }, [auth]);

  return userState;
}
