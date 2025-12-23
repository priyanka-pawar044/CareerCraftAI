'use client';
import { useAuth } from '@/context/AuthContext';
import { initializeFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowRight, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface InterviewSession {
  jobRole: string;
  startTime: Timestamp;
  endTime?: Timestamp;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { firestore } = initializeFirebase();

  const sessionsQuery = useMemo(() => {
    if (!user) return null;
    const ref = collection(firestore, 'users', user.uid, 'interviewSessions');
    return query(ref, orderBy('startTime', 'desc'));
  }, [user, firestore]);

  const {
    data: sessions,
    isLoading,
    error,
  } = useCollection<InterviewSession>(sessionsQuery);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load interview history. Please try again.
          </AlertDescription>
        </Alert>
      );
    }

    if (!sessions || sessions.length === 0) {
      return (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <History className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle>No Interview History Found</CardTitle>
          <CardDescription className="mt-2">
            You haven't completed any mock interviews yet.
          </CardDescription>
          <Button asChild className="mt-4">
            <Link href="/dashboard/mock-interview">Start Your First Interview</Link>
          </Button>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{session.jobRole} Interview</CardTitle>
              <CardDescription>
                {session.startTime
                  ? format(session.startTime.toDate(), 'PPP p')
                  : 'Date not available'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/history/${session.id}`}>
                  View Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
      {renderContent()}
    </div>
  );
}
