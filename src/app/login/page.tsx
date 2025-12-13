'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Chrome, Github } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/firebase/auth/use-auth';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { useUser } from '@/firebase/auth/use-user';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/firestore/use-firestore';

const tools = [
  // DevOps & Containerization
  { name: 'Docker', logo: '/tech-logos/docker.svg' },
  { name: 'Kubernetes', logo: '/tech-logos/kubernetes.svg' },
  { name: 'OpenShift', logo: '/tech-logos/openshift.svg' },
  { name: 'Jenkins', logo: '/tech-logos/jenkins.svg' },
  { name: 'Git', logo: '/tech-logos/git.svg' },
  { name: 'GitHub', logo: '/tech-logos/github.svg' },
  { name: 'GitLab', logo: '/tech-logos/gitlab.svg' },
  { name: 'Argo CD', logo: '/tech-logos/argocd.svg' },
  { name: 'Helm', logo: '/tech-logos/helm.svg' },
  // Cloud & Infrastructure
  { name: 'AWS', logo: '/tech-logos/aws.svg' },
  { name: 'Google Cloud', logo: '/tech-logos/google-cloud.svg' },
  { name: 'Microsoft Azure', logo: '/tech-logos/azure.svg' },
  { name: 'DigitalOcean', logo: '/tech-logos/digitalocean.svg' },
  { name: 'Oracle Cloud', logo: '/tech-logos/oracle.svg' },
  { name: 'IBM Cloud', logo: '/tech-logos/ibm-cloud.svg' },
];


// Custom styles for floating animations
const animationStyles = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-float {
    animation: none;
  }
}
`;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading } = useUser();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  const handleSignIn = async (provider: 'google' | 'github') => {
    if (!auth || !firestore) return;
    const authProvider =
      provider === 'google'
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;
      
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          providerId: result.providerId,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
      redirect('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if(user){
    return null;
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
        {tools.map((tool, index) => {
          const size = Math.floor(Math.random() * 48) + 32; // Random size between 32 and 80
          const top = `${Math.random() * 90}%`;
          const left = `${Math.random() * 90}%`;
          const animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5s and 10s
          const animationDelay = `${Math.random() * 2}s`;
          return (
            <div
              key={index}
              className="absolute animate-float"
              style={{
                top,
                left,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration,
                animationDelay,
              }}
            >
              <Image
                src={tool.logo}
                alt={tool.name}
                width={size}
                height={size}
                className="opacity-20 blur-[1px] "
              />
            </div>
          );
        })}

        <Card className="z-10 w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-10 duration-500 border-2 border-primary/20 bg-white/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              CareerPilot AI
            </CardTitle>
            <CardDescription className="pt-2 text-gray-600">
              Your one-stop platform for DevOps & Tech Careers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator className="my-4" />
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full hover:bg-primary/5"
                onClick={() => handleSignIn('google')}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full hover:bg-primary/5"
                onClick={() => handleSignIn('github')}
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
