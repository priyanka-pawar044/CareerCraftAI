
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/TechLogos';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  const { user, isLoading, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user) {
      redirect('/dashboard');
    }
  }, [user, isLoading]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({ title: 'Success', description: 'Signed in with Google.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to sign in with Google.',
      });
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub();
      toast({ title: 'Success', description: 'Signed in with GitHub.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to sign in with GitHub.',
      });
    }
  };

  if (isLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-xl bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Logo className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">
                    {APP_NAME}
                </h1>
            </div>
            <p className="text-sm text-muted-foreground">
                {APP_TAGLINE}
            </p>
        </div>
        <div className="flex flex-col space-y-3">
            <Button
              className="w-full justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center gap-2"
              onClick={handleGitHubSignIn}
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>
        </div>
      </div>
    </div>
  );
}
