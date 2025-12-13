"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateRoleBasedInterviewQuestions } from "@/ai/flows/generate-role-based-interview-questions";
import { aiMockInterviewEvaluation, AiMockInterviewEvaluationOutput } from "@/ai/flows/ai-mock-interview-evaluation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, ChevronLeft, ChevronRight, CheckCircle, BrainCircuit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type InterviewState = "setup" | "generating" | "interviewing" | "evaluating" | "results";

const jobRoles = ["Software Engineer", "Data Analyst", "DevOps", "Cloud Engineer"];

type Evaluation = AiMockInterviewEvaluationOutput & { question: string; answer: string };

export default function MockInterviewPage() {
  const [interviewState, setInterviewState] = useState<InterviewState>("setup");
  const [jobRole, setJobRole] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startInterview = async () => {
    if (!jobRole) {
      setError("Please select a job role.");
      return;
    }
    setError(null);
    setInterviewState("generating");
    try {
      const { questions: generatedQuestions } = await generateRoleBasedInterviewQuestions({ jobRole });
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setEvaluations([]);
      setInterviewState("interviewing");
    } catch (e) {
      setError("Failed to generate questions. Please try again.");
      setInterviewState("setup");
    }
  };
  
  const submitAnswer = async () => {
    if (!currentAnswer) {
      setError("Please provide an answer.");
      return;
    }
    setError(null);
    setInterviewState("evaluating");
    try {
      const result = await aiMockInterviewEvaluation({
        jobRole,
        question: questions[currentQuestionIndex],
        answer: currentAnswer,
      });
      setEvaluations([...evaluations, { ...result, question: questions[currentQuestionIndex], answer: currentAnswer }]);
      setCurrentAnswer("");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setInterviewState("interviewing");
      } else {
        setInterviewState("results");
      }
    } catch (e) {
      setError("Failed to evaluate your answer. Please try again.");
      setInterviewState("interviewing");
    }
  };

  const restartInterview = () => {
    setInterviewState("setup");
    setJobRole("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setEvaluations([]);
    setError(null);
  }

  const renderContent = () => {
    switch (interviewState) {
      case "setup":
        return (
          <Card>
            <CardHeader>
              <CardTitle>AI Mock Interview Simulator</CardTitle>
              <CardDescription>Select a job role to start your practice interview.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setJobRole} value={jobRole}>
                <SelectTrigger className="w-full md:w-1/2">
                  <SelectValue placeholder="Select a job role..." />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={startInterview} disabled={!jobRole}>Start Interview</Button>
            </CardFooter>
          </Card>
        );
      
      case "generating":
        return (
          <Card className="flex flex-col items-center justify-center p-8 space-y-4">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <p className="text-muted-foreground">Generating your interview questions...</p>
          </Card>
        );

      case "interviewing":
      case "evaluating":
        const isEvaluating = interviewState === "evaluating";
        const progress = ((currentQuestionIndex) / questions.length) * 100;

        return (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
              <CardDescription className="font-semibold text-lg text-foreground">{questions[currentQuestionIndex]}</CardDescription>
               <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Your answer..."
                className="min-h-[200px]"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isEvaluating}
              />
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={submitAnswer} disabled={isEvaluating || !currentAnswer}>
                {isEvaluating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</> : "Submit Answer"}
              </Button>
            </CardFooter>
          </Card>
        );

      case "results":
        const avgScore = evaluations.reduce((acc, curr) => acc + curr.correctnessScore + curr.clarityScore + curr.confidenceScore, 0) / (evaluations.length * 3);
        return (
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <CardTitle>Interview Complete!</CardTitle>
                  <CardDescription>Your average score was {avgScore.toFixed(0)}/100. Review your feedback below.</CardDescription>
              </CardHeader>
              <CardFooter className="justify-center">
                <Button onClick={restartInterview}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Start New Interview
                </Button>
              </CardFooter>
            </Card>

            {evaluations.map((evalItem, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Question {index + 1}: <span className="font-normal">{evalItem.question}</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div>
                      <h3 className="font-semibold">Your Answer</h3>
                      <p className="text-muted-foreground p-4 bg-muted rounded-md mt-2">{evalItem.answer}</p>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-secondary rounded-lg">
                          <p className="text-sm text-muted-foreground">Correctness</p>
                          <p className="text-2xl font-bold text-primary">{evalItem.correctnessScore}</p>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg">
                          <p className="text-sm text-muted-foreground">Clarity</p>
                          <p className="text-2xl font-bold text-primary">{evalItem.clarityScore}</p>
                      </div>
                       <div className="p-4 bg-secondary rounded-lg">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="text-2xl font-bold text-primary">{evalItem.confidenceScore}</p>
                      </div>
                   </div>
                   <div>
                       <h3 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary"/> Model Answer</h3>
                       <p className="text-muted-foreground p-4 border rounded-md mt-2">{evalItem.modelAnswer}</p>
                   </div>
                   <div>
                       <h3 className="font-semibold">Suggestions for Improvement</h3>
                       <p className="text-muted-foreground p-4 border rounded-md mt-2">{evalItem.suggestions}</p>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      
      default: return null;
    }
  };

  return <div className="max-w-4xl mx-auto">{renderContent()}</div>;
}
