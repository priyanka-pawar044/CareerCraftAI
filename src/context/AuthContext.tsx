
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  User as FirebaseUser 
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { auth, firestore } = initializeFirebase();

  const handleUser = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const { uid, email, displayName, photoURL } = firebaseUser;
      const appUser: AppUser = { uid, email, displayName, photoURL };
      
      // Check if user exists in Firestore, if not, create them
      const userRef = doc(firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        try {
          await setDoc(userRef, {
            id: uid,
            name: displayName,
            email: email,
            authProvider: firebaseUser.providerData[0]?.providerId || 'unknown',
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error creating user document:", error);
          toast({ variant: 'destructive', title: 'Database Error', description: 'Could not save user profile.' });
        }
      } else {
        // Optionally update last login time for existing users
        try {
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        } catch(error) {
            console.error("Error updating last login:", error);
        }
      }
      
      setUser(appUser);
      setIsLoading(false);
      return appUser;
    } else {
      setUser(null);
      setIsLoading(false);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [auth]);

  const socialSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Social sign in error", error);
      throw new Error(error.message || `Failed to sign in with ${provider.providerId}.`);
    }
  };
  
  const signInWithGoogle = () => socialSignIn(new GoogleAuthProvider());
  const signInWithGitHub = () => socialSignIn(new GithubAuthProvider());

  const logout = async () => {
    try {
      await signOut(auth);
      // handleUser(null) will be called by onAuthStateChanged
      toast({ title: 'Success', description: 'Logged out successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Logout failed.' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, signInWithGoogle, signInWithGitHub }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

    