
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TechLogos } from '@/components/icons/TechLogos';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const { user, signup, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }
    setIsPageLoading(true);
    try {
      await signup(name, email, password);
      // Redirect is handled by the useEffect hook
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
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
             <h1 className="text-4xl font-bold">Create an Account</h1>
            <p className="mt-2 text-white/70">
              Join CareerCraft AI to boost your career.
            </p>
          </div>
          <div className="p-8 pt-0">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-white/80">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:ring-cyber-purple/50"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                   className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:ring-cyber-purple/50"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                   className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:ring-cyber-purple/50"
                />
              </div>
              <Button type="submit" className="w-full bg-primary-grad text-white font-bold transition-all duration-300 hover:shadow-primary-glow" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
               <span className="text-white/50">Already have an account?{' '}</span>
              <Link href="/login" className="font-semibold text-cyber-purple/90 hover:text-cyber-purple">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
