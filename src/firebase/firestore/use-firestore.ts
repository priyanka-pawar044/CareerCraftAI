'use client';
import { useFirebase } from '@/firebase/provider';
import { type Firestore } from 'firebase/firestore';

export const useFirestore = (): Firestore | null => {
  const firebase = useFirebase();
  return firebase?.firestore ?? null;
};
