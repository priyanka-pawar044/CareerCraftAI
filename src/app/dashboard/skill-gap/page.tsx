'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { personalizedSkillGapAnalysis, type SkillGapAnalysisOutput } from '@/ai/flows/personalized-skill-gap-analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function SkillGapPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both your resume text and a job description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await personalizedSkillGapAnalysis({ resumeText, jobDescription });
      setAnalysisResult(result);
    } catch (e: any) {
      setError("An error occurred during analysis. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Skill-Gap Analyzer</CardTitle>
          <CardDescription>Compare your resume against a job description to find skill gaps and get a personalized learning plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resume-text">Your Resume Text</Label>
              <Textarea
                id="resume-text"
                placeholder="Paste the full text of your resume here..."
                className="min-h-[250px]"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Target Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the full job description here..."
                className="min-h-[250px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isLoading || !resumeText || !jobDescription}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : 'Analyze Skill Gap'}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missingSkills.length > 0 ? (
                  analysisResult.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No significant skill gaps found. Great job!</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" /> Personalized Learning Roadmap
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground p-4 border rounded-md whitespace-pre-wrap">
                {analysisResult.learningRoadmap}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
