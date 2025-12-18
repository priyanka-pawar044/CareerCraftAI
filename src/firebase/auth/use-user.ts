'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuthContext } from '../provider';

interface UserState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UserState {
  const auth = useAuthContext();
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
      // If auth is not available, we are not loading and there is no user.
      // This can happen in server components or before Firebase is initialized.
      setUserState({ user: null, loading: false, error: null });
    }
  }, [auth]);

  return userState;
}
