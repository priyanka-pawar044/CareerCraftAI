'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a resume and providing an ATS score and improvement suggestions.
 *
 * - analyzeResumeAts - A function that takes resume data as input and returns an ATS score and improvement suggestions.
 * - AnalyzeResumeAtsInput - The input type for the analyzeResumeAts function, expects a data URI.
 * - AnalyzeResumeAtsOutput - The return type for the analyzeResumeAts function, containing the ATS score and suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeAtsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      'The resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Ensure correct format description
    ),
});
export type AnalyzeResumeAtsInput = z.infer<typeof AnalyzeResumeAtsInputSchema>;

const AnalyzeResumeAtsOutputSchema = z.object({
  atsScore: z
    .number()
    .describe('The ATS score of the resume, ranging from 0 to 100.'),
  suggestions: z
    .string()
    .describe('Suggestions for improving the resume to increase its ATS score.'),
});
export type AnalyzeResumeAtsOutput = z.infer<typeof AnalyzeResumeAtsOutputSchema>;

export async function analyzeResumeAts(input: AnalyzeResumeAtsInput): Promise<AnalyzeResumeAtsOutput> {
  return analyzeResumeAtsFlow(input);
}

const analyzeResumeAtsPrompt = ai.definePrompt({
  name: 'analyzeResumeAtsPrompt',
  input: {schema: AnalyzeResumeAtsInputSchema},
  output: {schema: AnalyzeResumeAtsOutputSchema},
  prompt: `You are an expert resume analyst specializing in Applicant Tracking Systems (ATS). Analyze the provided resume and provide an ATS score (0-100) and suggestions on how to improve it. Focus on keywords, formatting, and overall structure.

Resume: {{media url=resumeDataUri}}`,
});

const analyzeResumeAtsFlow = ai.defineFlow(
  {
    name: 'analyzeResumeAtsFlow',
    inputSchema: AnalyzeResumeAtsInputSchema,
    outputSchema: AnalyzeResumeAtsOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumeAtsPrompt(input);
    return output!;
  }
);
