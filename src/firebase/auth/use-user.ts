'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';

interface UserState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export function useUser(): UserState {
  const auth = useAuth();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUserState({ user, isUserLoading: false, userError: null });
        },
        (error) => {
          setUserState({ user: null, isUserLoading: false, userError: error });
        }
      );
      return () => unsubscribe();
    } else {
      // If auth is not available, we are not loading and there is no user.
      // This can happen in server components or before Firebase is initialized.
      setUserState({ user: null, isUserLoading: false, userError: null });
    }
  }, [auth]);

  return userState;
}
