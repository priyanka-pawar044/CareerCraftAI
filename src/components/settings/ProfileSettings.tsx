'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { auth, firestore } = initializeFirebase();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || '',
    },
    values: { name: user?.displayName || '' }, // Ensure form updates when user loads
  });

  const { isSubmitting, isDirty } = form.formState;

  async function onSubmit(data: ProfileFormValues) {
    if (!auth.currentUser) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    try {
      // Update Firebase Auth display name
      await updateProfile(auth.currentUser, { displayName: data.name });

      // Update Firestore user document
      const userRef = doc(firestore, 'users', auth.currentUser.uid);
      await setDoc(userRef, { name: data.name }, { merge: true });
      
      // Manually trigger re-render in auth context is tricky, usually a page reload or state lift is needed
      // For now, we can just show a success message. The AuthProvider will pick it up on next load.
      toast({
        title: 'Profile updated',
        description: 'Your name has been successfully updated.',
      });
      form.reset(data); // Resets form dirty state
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description:
          error.message || 'There was a problem updating your profile.',
      });
    }
  }

  const loginProvider =
    user && auth.currentUser?.providerData[0]?.providerId.split('.')[0];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user?.email || 'Loading...'} readOnly disabled />
          <p className="text-[0.8rem] text-muted-foreground">
            You cannot change your email address.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Login Provider</Label>
          <Input
            value={loginProvider ? loginProvider.charAt(0).toUpperCase() + loginProvider.slice(1) : 'Loading...'}
            readOnly
            disabled
          />
        </div>
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
}
