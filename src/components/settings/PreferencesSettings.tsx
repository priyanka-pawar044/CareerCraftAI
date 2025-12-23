
'use client';

import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const preferencesFormSchema = z.object({
  duration: z.coerce.number().int().min(5).max(60),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  role: z.enum([
    'Frontend',
    'Backend',
    'Full Stack',
    'DevOps',
    'Data Analyst',
    'Cloud Engineer',
    'Software Engineer'
  ]),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export function PreferencesSettings() {
  const { user } = useAuth();
  const { firestore } = initializeFirebase();
  const { toast } = useToast();

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      duration: 15,
      difficulty: 'Intermediate',
      role: 'Software Engineer',
    },
  });

  const { isSubmitting, isDirty, isFetching } = form.formState;

  useEffect(() => {
    async function fetchPreferences() {
      if (user) {
        const prefRef = doc(firestore, 'users', user.uid, 'preferences', 'settings');
        const prefSnap = await getDoc(prefRef);
        if (prefSnap.exists()) {
          form.reset(prefSnap.data() as PreferencesFormValues);
        }
      }
    }
    fetchPreferences();
  }, [user, firestore, form]);


  async function onSubmit(data: PreferencesFormValues) {
     if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to update preferences.',
      });
      return;
    }
    
    try {
      const prefRef = doc(firestore, 'users', user.uid, 'preferences', 'settings');
      await setDoc(prefRef, data, { merge: true });
      toast({
        title: 'Preferences saved',
        description: 'Your interview preferences have been updated.',
      });
      form.reset(data);
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Update failed',
        description:
          error.message || 'There was a problem saving your preferences.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a preferred role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Full Stack">Full Stack</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                  <SelectItem value="Cloud Engineer">Cloud Engineer</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This will be your default role for mock interviews.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The default difficulty for questions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Interview Duration (minutes)</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The default total duration for a mock interview session.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !isDirty || isFetching}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </form>
    </Form>
  );
}
