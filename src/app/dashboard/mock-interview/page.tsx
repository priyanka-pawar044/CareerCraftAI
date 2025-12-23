
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateRoleBasedInterviewQuestions } from '@/ai/flows/generate-role-based-interview-questions';
import {
  aiMockInterviewEvaluation,
  AiMockInterviewEvaluationOutput,
} from '@/ai/flows/ai-mock-interview-evaluation';
import {
  Loader2,
  ChevronLeft,
  CheckCircle,
  BrainCircuit,
  Timer as TimerIcon,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { initializeFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { APP_TAGLINE } from '@/lib/constants';

type InterviewState =
  | 'setup'
  | 'generating'
  | 'interviewing'
  | 'evaluating'
  | 'results';

const jobRoles = [
  'Software Engineer',
  'Data Analyst',
  'DevOps',
  'Cloud Engineer',
  'Frontend',
  'Backend',
  'Full Stack',
];

type Evaluation = AiMockInterviewEvaluationOutput & {
  question: string;
  answer: string;
};

const QUESTION_TIME_LIMIT = 300; // 5 minutes in seconds

export default function MockInterviewPage() {
  const { user } = useAuth();
  const { firestore } = initializeFirebase();
  const router = useRouter();

  const [interviewState, setInterviewState] =
    useState<InterviewState>('setup');
  const [jobRole, setJobRole] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [interviewSessionId, setInterviewSessionId] = useState<string | null>(
    null
  );
  const [isFetchingPrefs, setIsFetchingPrefs] = useState(true);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  
  useEffect(() => {
    async function fetchPreferences() {
      if (user) {
        setIsFetchingPrefs(true);
        const prefRef = doc(firestore, 'users', user.uid, 'preferences', 'settings');
        const prefSnap = await getDoc(prefRef);
        if (prefSnap.exists()) {
          const prefs = prefSnap.data();
          if (prefs.role) {
            setJobRole(prefs.role);
          }
        }
        setIsFetchingPrefs(false);
      } else {
        setIsFetchingPrefs(false);
      }
    }
    fetchPreferences();
  }, [user, firestore]);

  const submitAnswer = useCallback(async () => {
    if (!currentAnswer && timeLeft > 0) {
        setError('Please provide an answer.');
        return;
    }
    if (!user || !interviewSessionId) return;

    setError(null);
    setInterviewState('evaluating');
    setTimeLeft(0); // Stop timer

    try {
      const result = await aiMockInterviewEvaluation({
        jobRole,
        question: questions[currentQuestionIndex],
        answer: currentAnswer || "No answer provided.",
      });

      const newEvaluation = {
        ...result,
        question: questions[currentQuestionIndex],
        answer: currentAnswer || "No answer provided.",
      };

      // Save question and evaluation to Firestore
      const questionRef = doc(
        collection(
          firestore,
          'users',
          user.uid,
          'interviewSessions',
          interviewSessionId,
          'interviewQuestions'
        )
      );
      await setDoc(questionRef, {
        interviewSessionId: interviewSessionId,
        questionText: newEvaluation.question,
        userAnswer: newEvaluation.answer,
        correctnessScore: newEvaluation.correctnessScore,
        clarityScore: newEvaluation.clarityScore,
        confidenceScore: newEvaluation.confidenceScore,
        modelAnswer: newEvaluation.modelAnswer,
        improvementSuggestions: newEvaluation.suggestions,
        createdAt: serverTimestamp(),
      });

      setEvaluations((prev) => [...prev, newEvaluation]);
      setCurrentAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setInterviewState('interviewing');
        setTimeLeft(QUESTION_TIME_LIMIT); // Reset timer for next question
      } else {
        setInterviewState('results');
        const sessionRef = doc(
          firestore,
          'users',
          user.uid,
          'interviewSessions',
          interviewSessionId
        );
        await setDoc(
          sessionRef,
          { endTime: serverTimestamp() },
          { merge: true }
        );
      }
    } catch (e) {
      setError('Failed to evaluate your answer. Please try again.');
      setInterviewState('interviewing'); // Allow user to try again
    }
  }, [
    currentAnswer,
    jobRole,
    questions,
    currentQuestionIndex,
    user,
    interviewSessionId,
    firestore,
    timeLeft
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (interviewState === 'interviewing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (interviewState === 'interviewing' && timeLeft === 0) {
      submitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, interviewState, submitAnswer]);

  const startInterview = async () => {
    if (!jobRole || !user) {
      setError('Please select a job role.');
      return;
    }
    setError(null);
    setInterviewState('generating');
    try {
      const sessionRef = await addDoc(
        collection(firestore, 'users', user.uid, 'interviewSessions'),
        {
          userId: user.uid,
          jobRole: jobRole,
          startTime: serverTimestamp(),
          endTime: null,
        }
      );
      setInterviewSessionId(sessionRef.id);

      const { questions: generatedQuestions } =
        await generateRoleBasedInterviewQuestions({ jobRole });
      setQuestions(generatedQuestions.slice(0, 5)); // Limit to 5 questions
      setCurrentQuestionIndex(0);
      setEvaluations([]);
      setInterviewState('interviewing');
      setTimeLeft(QUESTION_TIME_LIMIT);
    } catch (e) {
      setError('Failed to generate questions. Please try again.');
      setInterviewState('setup');
    }
  };

  const restartInterview = () => {
    setInterviewState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setEvaluations([]);
    setError(null);
    setInterviewSessionId(null);
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  const viewHistory = () => {
    if (interviewSessionId) {
      router.push(`/dashboard/history/${interviewSessionId}`);
    } else {
      router.push('/dashboard/history');
    }
  };

  const renderContent = () => {
    if (isFetchingPrefs) {
       return (
          <Card className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Loading your preferences...
            </p>
          </Card>
        );
    }

    switch (interviewState) {
      case 'setup':
        return (
          <Card>
            <CardHeader>
              <CardTitle>AI Mock Interview Simulator</CardTitle>
              <CardDescription>
                {APP_TAGLINE}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setJobRole} value={jobRole}>
                <SelectTrigger className="w-full md:w-1/2">
                  <SelectValue placeholder="Select a job role..." />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={startInterview} disabled={!jobRole}>
                Start Interview
              </Button>
            </CardFooter>
          </Card>
        );

      case 'generating':
        return (
          <Card className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Generating your interview questions...
            </p>
          </Card>
        );

      case 'interviewing':
      case 'evaluating':
        const isEvaluating = interviewState === 'evaluating';
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerColor = timeLeft <= 30 ? 'text-destructive' : 'text-foreground';

        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Role: {jobRole}
                  </CardDescription>
                </div>
                <div
                  className={`flex items-center gap-2 font-mono text-xl font-semibold ${timerColor}`}
                >
                  <TimerIcon className="h-6 w-6" />
                  {String(minutes).padStart(2, '0')}:
                  {String(seconds).padStart(2, '0')}
                </div>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="font-semibold text-lg text-foreground mt-2 bg-muted p-6 rounded-lg">
                    {questions[currentQuestionIndex]}
                </p>
              <Textarea
                placeholder="Your answer..."
                className="min-h-[200px] text-base"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isEvaluating}
              />
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={submitAnswer}
                disabled={isEvaluating || !currentAnswer}
                size="lg"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </Button>
            </CardFooter>
          </Card>
        );

      case 'results':
        const avgScore =
          evaluations.length > 0 ?
          evaluations.reduce(
            (acc, curr) =>
              acc +
              curr.correctnessScore +
              curr.clarityScore +
              curr.confidenceScore,
            0
          ) / (evaluations.length * 3) : 0;
        return (
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle>Interview Complete!</CardTitle>
                <CardDescription>
                  Your average score was {avgScore.toFixed(0)}/100. You can
                  review your results now or in your history.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center gap-4">
                <Button onClick={restartInterview} variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Start New Interview
                </Button>
                <Button onClick={viewHistory}>View Full Report</Button>
              </CardFooter>
            </Card>

            {evaluations.map((evalItem, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    Question {index + 1}:{' '}
                    <span className="font-normal">{evalItem.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold">Your Answer</h3>
                    <p className="text-muted-foreground p-4 bg-muted rounded-md mt-2">
                      {evalItem.answer}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Correctness
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {evalItem.correctnessScore}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Clarity</p>
                      <p className="text-2xl font-bold text-primary">
                        {evalItem.clarityScore}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Confidence
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {evalItem.confidenceScore}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" /> Model
                      Answer
                    </h3>
                    <p className="text-muted-foreground p-4 border rounded-md mt-2">
                      {evalItem.modelAnswer}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Suggestions for Improvement
                    </h3>
                    <p className="text-muted-foreground p-4 border rounded-md mt-2">
                      {evalItem.suggestions}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="max-w-4xl mx-auto">{renderContent()}</div>;
}
