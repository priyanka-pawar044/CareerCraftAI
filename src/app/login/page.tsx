
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Loader2 } from 'lucide-react';
import { GoogleIcon, TechLogos } from '@/components/icons/TechLogos';

export default function LoginPage() {
  const { user, login, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPageLoading(true);
    try {
      await login(email, password);
      // Redirect is handled by the useEffect hook
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsPageLoading(false);
    }
  };
  
  const isLoading = isAuthLoading || isPageLoading;

  if (isAuthLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-slate-900 to-cyber-purple p-4">
      <TechLogos />
      <div className="z-10 w-full max-w-md">
        <div className="glassmorphism-card rounded-xl border border-white/10 shadow-2xl">
          <div className="p-8 text-center text-white">
            <h1 className="text-4xl font-bold">CareerCraft AI</h1>
            <p className="mt-2 text-white/70">Sign in to your enterprise account</p>
          </div>

          <div className="p-8 pt-0">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                 <Button variant="outline" className="w-full justify-center gap-2 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20">
                    <GoogleIcon className="h-5 w-5" />
                    Sign in with Google
                  </Button>
                  <Button variant="outline" className="w-full justify-center gap-2 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20">
                    <Github className="h-5 w-5" />
                    Sign in with GitHub
                  </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background-gl px-2 text-white/50">
                    Or continue with
                  </span>
                </div>
              </div>


              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:ring-cyber-purple/50"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="password"  className="text-white/80">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:ring-cyber-purple/50"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary-grad text-white font-bold transition-all duration-300 hover:shadow-primary-glow" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-white/50">Don&apos;t have an account?{' '}</span>
              <Link href="/signup" className="font-semibold text-cyber-purple/90 hover:text-cyber-purple">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
