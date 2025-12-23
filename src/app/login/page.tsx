
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { GoogleIcon, TechLogos } from '@/components/icons/TechLogos';

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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      <TechLogos />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-lg">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            CareerPilot AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to start your journey
          </p>
        </div>
        <div className="p-8 pt-0">
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
    </div>
  );
}
    