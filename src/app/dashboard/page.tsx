
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  FileText,
  MessageSquare,
  Target,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

const features = [
  {
    title: 'Resume Analyzer',
    description:
      'Get an AI-powered ATS score and improvement tips for your resume.',
    icon: FileText,
    href: '/dashboard/resume-analyzer',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    title: 'Mock Interview',
    description: 'Practice with AI-driven questions and get instant feedback.',
    icon: MessageSquare,
    href: '/dashboard/mock-interview',
    color: 'text-sky-500',
    bgColor: 'bg-sky-100 dark:bg-sky-900/20',
  },
  {
    title: 'Skill-Gap Analyzer',
    description:
      'Identify missing skills for your target job and get a learning plan.',
    icon: Target,
    href: '/dashboard/skill-gap',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
  },
  {
    title: 'Job Matcher',
    description: 'See how well your resume matches a job description.',
    icon: Briefcase,
    href: '/dashboard/job-matcher',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
];

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const userName = user?.displayName?.split(' ')[0] || 'there';
  
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userName} 👋
        </h1>
        <p className="text-muted-foreground">
          <span className="font-semibold text-primary">{APP_NAME}</span> - {APP_TAGLINE}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className={`rounded-lg p-3 ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <div className='flex-1'>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="mt-1">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end justify-end pt-4">
              <Button asChild variant="ghost" className="w-full justify-end text-primary hover:text-primary">
                <Link href={feature.href}>
                  Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
