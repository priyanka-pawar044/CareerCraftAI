'use client';

import { useFirebase } from '../provider';
import type { UserHookResult } from '../provider';


export function useUser(): UserHookResult {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
}
