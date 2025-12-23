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
  History,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

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
  {
    title: 'Interview History',
    description: 'Review your past mock interviews and feedback.',
    icon: History,
    href: '/dashboard/history',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userName} 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your personal hub for career preparation. Let's get you hired.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`rounded-lg p-3 ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end justify-end">
              <Link href={feature.href} className="w-full">
                <Button variant="outline" className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
