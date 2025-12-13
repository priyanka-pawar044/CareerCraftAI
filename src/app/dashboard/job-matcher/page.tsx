'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzeJobDescriptionAndMatch, type JobDescriptionAnalysisAndMatchOutput } from '@/ai/flows/job-description-analysis-and-matching';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  match: {
    label: "Match %",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function JobMatcherPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<JobDescriptionAnalysisAndMatchOutput | null>(null);
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
      const result = await analyzeJobDescriptionAndMatch({ resumeText, jobDescription });
      setAnalysisResult(result);
    } catch (e: any) {
      setError("An error occurred during analysis. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartData = analysisResult ? [{ name: "Match", match: analysisResult.matchPercentage }] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Job Description Matcher</CardTitle>
          <CardDescription>Paste a job description to see how well your resume matches and what keywords you're missing.</CardDescription>
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
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : 'Analyze Job Match'}
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
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Job Match Report</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Match Percentage</h3>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
                <BarChart accessibilityLayer data={chartData} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="match" fill="var(--color-match)" radius={5} barSize={40}>
                     <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-primary-foreground text-4xl font-bold">
                      {`${analysisResult.matchPercentage}%`}
                    </text>
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Experience Level</h3>
                    <Badge variant="outline">{analysisResult.experienceLevel}</Badge>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.requiredSkills.split(',').map(s => s.trim()).filter(s => s).map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Missing Keywords from Your Resume</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.split(',').map(s => s.trim()).filter(s => s).map((keyword, index) => (
                            <Badge key={index} variant="destructive">{keyword}</Badge>
                        ))}
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
