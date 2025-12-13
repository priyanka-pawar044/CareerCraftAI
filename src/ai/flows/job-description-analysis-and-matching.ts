'use server';
/**
 * @fileOverview Analyzes a job description and compares it against a user's resume.
 *
 * - analyzeJobDescriptionAndMatch - A function that handles the job description analysis and resume matching process.
 * - JobDescriptionAnalysisAndMatchInput - The input type for the analyzeJobDescriptionAndMatch function.
 * - JobDescriptionAnalysisAndMatchOutput - The return type for the analyzeJobDescriptionAndMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobDescriptionAnalysisAndMatchInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description text to analyze.'),
  resumeText: z.string().describe('The text content of the user\u2019s resume.'),
});
export type JobDescriptionAnalysisAndMatchInput = z.infer<
  typeof JobDescriptionAnalysisAndMatchInputSchema
>;

const JobDescriptionAnalysisAndMatchOutputSchema = z.object({
  requiredSkills: z
    .string()
    .describe('A comma-separated list of required skills extracted from the job description.'),
  experienceLevel: z
    .string()
    .describe('The experience level required for the job (e.g., Entry-level, Mid-level, Senior-level).'),
  missingKeywords: z
    .string()
    .describe('A comma-separated list of keywords present in the job description but missing from the resume.'),
  matchPercentage: z
    .number()
    .describe('The percentage match between the resume and the job description (0-100).'),
});
export type JobDescriptionAnalysisAndMatchOutput = z.infer<
  typeof JobDescriptionAnalysisAndMatchOutputSchema
>;

export async function analyzeJobDescriptionAndMatch(
  input: JobDescriptionAnalysisAndMatchInput
): Promise<JobDescriptionAnalysisAndMatchOutput> {
  return analyzeJobDescriptionAndMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobDescriptionAnalysisAndMatchPrompt',
  input: {schema: JobDescriptionAnalysisAndMatchInputSchema},
  output: {schema: JobDescriptionAnalysisAndMatchOutputSchema},
  prompt: `You are an expert career advisor. Analyze the following job description and compare it to the provided resume. Extract the required skills, experience level, and identify keywords missing from the resume.  Calculate a match percentage between the resume and job description.

Job Description:
{{jobDescription}}

Resume:
{{resumeText}}

Output the required skills as a comma separated list.
Output the missing keywords as a comma separated list.
Output the match percentage as a number between 0 and 100.  If it is impossible to calculate the match percentage, output 0.
Output the experience level as a string, for example \"Entry-level\", \"Mid-level\", or \"Senior-level\".
`,
});

const analyzeJobDescriptionAndMatchFlow = ai.defineFlow(
  {
    name: 'analyzeJobDescriptionAndMatchFlow',
    inputSchema: JobDescriptionAnalysisAndMatchInputSchema,
    outputSchema: JobDescriptionAnalysisAndMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
