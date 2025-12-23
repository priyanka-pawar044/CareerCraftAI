'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export function AccountSettings() {
  const { logout, user } = useAuth();
  const { auth, firestore } = initializeFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user || !auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'No user is logged in to delete.' });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const userId = user.uid;
      
      // 1. Delete all subcollections recursively (interview history etc.)
      const interviewSessionsRef = collection(firestore, 'users', userId, 'interviewSessions');
      const sessionsSnapshot = await getDocs(interviewSessionsRef);
      const batch = writeBatch(firestore);

      for (const sessionDoc of sessionsSnapshot.docs) {
        const questionsRef = collection(sessionDoc.ref, 'interviewQuestions');
        const questionsSnapshot = await getDocs(questionsRef);
        questionsSnapshot.forEach(questionDoc => batch.delete(questionDoc.ref));
        batch.delete(sessionDoc.ref);
      }
      
      // Delete preferences
      const prefRef = doc(firestore, 'users', userId, 'preferences', 'settings');
      batch.delete(prefRef);
      
      await batch.commit();

      // 2. Delete the user document itself
      const userDocRef = doc(firestore, 'users', userId);
      await deleteDoc(userDocRef);
      
      // 3. Delete the Firebase Auth user
      await deleteUser(auth.currentUser);
      
      toast({ title: 'Account deleted', description: 'Your account and all associated data have been permanently removed.' });
      router.push('/login');

    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast({ variant: 'destructive', title: 'Deletion failed', description: error.message || 'An error occurred while deleting your account. You may need to re-authenticate.' });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="text-lg font-medium">Log Out</h3>
            <p className="text-sm text-muted-foreground">
                End your current session on this browser.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
          </Button>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
          <div>
            <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
                Permanently delete your account and all of your content. This action is irreversible.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                   {isDeleting ? 'Deleting...' : 'Continue'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
    </div>
  );
}
