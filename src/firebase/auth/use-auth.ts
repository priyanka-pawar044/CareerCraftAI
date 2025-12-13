'use client';
import { useFirebase } from '@/firebase/provider';
import { type Auth } from 'firebase/auth';

export const useAuth = (): Auth | null => {
  const firebase = useFirebase();
  return firebase?.auth ?? null;
};
