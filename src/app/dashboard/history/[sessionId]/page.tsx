'use client';

import { useAuth } from '@/context/AuthContext';
import { initializeFirebase } from '@/firebase';
import {
  collection,
  doc,
  query,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { useDoc, type UseDocResult } from '@/firebase/firestore/use-doc';
import {
  useCollection,
  type UseCollectionResult,
} from '@/firebase/firestore/use-collection';
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
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface InterviewSession {
  jobRole: string;
  startTime: Timestamp;
}

interface InterviewQuestion {
  questionText: string;
  userAnswer: string;
  correctnessScore: number;
  clarityScore: number;
  confidenceScore: number;
  modelAnswer: string;
  improvementSuggestions: string;
}

export default function HistoryDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const { user } = useAuth();
  const { firestore } = initializeFirebase();

  const sessionRef = useMemo(() => {
    if (!user || !params.sessionId) return null;
    return doc(
      firestore,
      'users',
      user.uid,
      'interviewSessions',
      params.sessionId
    );
  }, [user, params.sessionId, firestore]);

  const questionsQuery = useMemo(() => {
    if (!user || !params.sessionId) return null;
    const ref = collection(
      firestore,
      'users',
      user.uid,
      'interviewSessions',
      params.sessionId,
      'interviewQuestions'
    );
    return query(ref, orderBy('createdAt', 'asc'));
  }, [user, params.sessionId, firestore]);

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  }: UseDocResult<InterviewSession> = useDoc(sessionRef);
  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error: questionsError,
  }: UseCollectionResult<InterviewQuestion> = useCollection(questionsQuery);

  if (isLoadingSession || isLoadingQuestions) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionError || questionsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load interview details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!session) {
    return (
      <Alert>
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          This interview session could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  const overallScore =
    questions && questions.length > 0
      ? questions.reduce(
          (acc, q) =>
            acc +
            q.correctnessScore +
            q.clarityScore +
            q.confidenceScore,
          0
        ) / (questions.length * 3)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {session.jobRole} Interview Report
        </h1>
        <p className="text-muted-foreground">
          {format(session.startTime.toDate(), 'PPP p')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>
            Your average score for this session was {overallScore.toFixed(0)}
            /100.
          </CardDescription>
        </CardHeader>
      </Card>

      {questions &&
        questions.map((q, index) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>
                Question {index + 1}:{' '}
                <span className="font-normal">{q.questionText}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold">Your Answer</h3>
                <p className="text-muted-foreground p-4 bg-muted rounded-md mt-2">
                  {q.userAnswer}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Correctness</p>
                  <p className="text-2xl font-bold text-primary">
                    {q.correctnessScore}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Clarity</p>
                  <p className="text-2xl font-bold text-primary">
                    {q.clarityScore}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold text-primary">
                    {q.confidenceScore}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" /> Model
                  Answer
                </h3>
                <p className="text-muted-foreground p-4 border rounded-md mt-2">
                  {q.modelAnswer}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Suggestions for Improvement</h3>
                <p className="text-muted-foreground p-4 border rounded-md mt-2">
                  {q.improvementSuggestions}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
