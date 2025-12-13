'use server';
/**
 * @fileOverview Generates role-based interview questions using AI.
 *
 * - generateRoleBasedInterviewQuestions - A function that generates interview questions based on a selected job role.
 * - GenerateRoleBasedInterviewQuestionsInput - The input type for the generateRoleBasedInterviewQuestions function.
 * - GenerateRoleBasedInterviewQuestionsOutput - The return type for the generateRoleBasedInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoleBasedInterviewQuestionsInputSchema = z.object({
  jobRole: z
    .string()
    .describe("The job role for which to generate interview questions (e.g., Software Engineer, Data Analyst, DevOps, Cloud Engineer)."),
});
export type GenerateRoleBasedInterviewQuestionsInput = z.infer<typeof GenerateRoleBasedInterviewQuestionsInputSchema>;

const GenerateRoleBasedInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe("An array of interview questions tailored for the specified job role."),
});
export type GenerateRoleBasedInterviewQuestionsOutput = z.infer<typeof GenerateRoleBasedInterviewQuestionsOutputSchema>;

export async function generateRoleBasedInterviewQuestions(
  input: GenerateRoleBasedInterviewQuestionsInput
): Promise<GenerateRoleBasedInterviewQuestionsOutput> {
  return generateRoleBasedInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoleBasedInterviewQuestionsPrompt',
  input: {schema: GenerateRoleBasedInterviewQuestionsInputSchema},
  output: {schema: GenerateRoleBasedInterviewQuestionsOutputSchema},
  prompt: `You are an AI assistant designed to generate interview questions for job seekers.

  Generate a mix of technical and HR-related interview questions for the following job role:
  {{jobRole}}

  Return the questions in a JSON object with a "questions" array.
  `,
});

const generateRoleBasedInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateRoleBasedInterviewQuestionsFlow',
    inputSchema: GenerateRoleBasedInterviewQuestionsInputSchema,
    outputSchema: GenerateRoleBasedInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
