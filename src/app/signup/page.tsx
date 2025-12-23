
'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { GoogleIcon, TechLogos } from '@/components/icons/TechLogos';
import Link from 'next/link';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { Logo } from '@/components/icons';


export default function SignupPage() {
  const { user, isLoading: isAuthLoading, signInWithGoogle, signInWithGitHub } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

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

  if (isAuthLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background">
      <TechLogos />
      <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm"></div>
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center p-4">
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
                Sign up with Google
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-center gap-2"
                onClick={handleGitHubSignIn}
              >
                <Github className="h-5 w-5" />
                Sign up with GitHub
              </Button>
          </div>
          <div className="mt-6 text-center text-sm">
             <span className="text-muted-foreground">Already have an account?{' '}</span>
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
