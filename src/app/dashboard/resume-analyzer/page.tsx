'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeResumeAts, type AnalyzeResumeAtsOutput } from '@/ai/flows/resume-ats-analysis';
import { fileToDataUri } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
  score: {
    label: "ATS Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ResumeAnalyzerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeAtsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumeFile(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      if (resumeFile) {
        const resumeDataUri = await fileToDataUri(resumeFile);
        const result = await analyzeResumeAts({ resumeDataUri });
        setAnalysisResult(result);
      } else {
        setError("Please upload a PDF resume for analysis.");
      }
    } catch (e: any) {
      setError("An error occurred during analysis. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartData = analysisResult ? [{ name: "ATS Score", score: analysisResult.atsScore }] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Resume Analyzer</CardTitle>
          <CardDescription>Upload your resume to get an AI-powered ATS score and improvement suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload PDF</TabsTrigger>
              <TabsTrigger value="paste" disabled>Paste Text (Coming Soon)</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="resume-file">Resume PDF</Label>
                <Input id="resume-file" type="file" accept=".pdf" onChange={handleFileChange} />
              </div>
            </TabsContent>
            <TabsContent value="paste" className="mt-4">
               <Textarea
                placeholder="Paste your resume content here..."
                className="min-h-[200px]"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isLoading || !resumeFile}>
            {isLoading ? 'Analyzing...' : 'Analyze Resume'}
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
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-48 w-64" />
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <CardDescription>Your resume scored {analysisResult.atsScore} out of 100.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center">
               <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="score" fill="var(--color-score)" radius={8} />
                  </BarChart>
                </ChartContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Improvement Suggestions</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                {analysisResult.suggestions}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
