
'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { GoogleIcon, TechLogos } from '@/components/icons/TechLogos';

export default function LoginPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const handleGoogleSignIn = () => {
    // This would trigger the Firebase Google Auth flow
    toast({ title: "Coming Soon!", description: "Google Sign-In will be available soon." });
  }

  const handleGitHubSignIn = () => {
    // This would trigger the Firebase GitHub Auth flow
    toast({ title: "Coming Soon!", description: "GitHub Sign-In will be available soon." });
  }

  const isLoading = isAuthLoading || isPageLoading;

  if (isAuthLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <TechLogos />
      <div className="z-10 w-full max-w-md">
        <div className="rounded-xl border border-border bg-card shadow-lg">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">CareerPilot AI</h1>
            <p className="mt-2 text-muted-foreground">Your one-stop platform for DevOps & Tech Careers</p>
          </div>

          <div className="p-8 pt-0">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-center gap-2" onClick={handleGoogleSignIn}>
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
              </Button>
              <Button variant="outline" className="w-full justify-center gap-2" onClick={handleGitHubSignIn}>
                  <Github className="h-5 w-5" />
                  Continue with GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
