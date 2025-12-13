'use server';
/**
 * @fileOverview AI Mock Interview Evaluation Flow.
 *
 * This file defines a Genkit flow for evaluating student answers to interview questions.
 * It provides feedback on correctness, clarity, and confidence, along with model answers and suggestions for improvement.
 *
 * @exports aiMockInterviewEvaluation - The function to trigger the mock interview evaluation flow.
 * @exports AiMockInterviewEvaluationInput - The input type for the aiMockInterviewEvaluation function.
 * @exports AiMockInterviewEvaluationOutput - The output type for the aiMockInterviewEvaluation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMockInterviewEvaluationInputSchema = z.object({
  jobRole: z.string().describe('The job role the student is interviewing for.'),
  question: z.string().describe('The interview question asked.'),
  answer: z.string().describe('The student\'s answer to the interview question.'),
});
export type AiMockInterviewEvaluationInput = z.infer<typeof AiMockInterviewEvaluationInputSchema>;

const AiMockInterviewEvaluationOutputSchema = z.object({
  correctnessScore: z.number().describe('A score (0-100) indicating the correctness of the answer.'),
  clarityScore: z.number().describe('A score (0-100) indicating the clarity of the answer.'),
  confidenceScore: z.number().describe('A score (0-100) indicating the confidence level in the answer.'),
  modelAnswer: z.string().describe('A model answer to the interview question.'),
  suggestions: z.string().describe('Suggestions for improving the answer.'),
});
export type AiMockInterviewEvaluationOutput = z.infer<typeof AiMockInterviewEvaluationOutputSchema>;

export async function aiMockInterviewEvaluation(input: AiMockInterviewEvaluationInput): Promise<AiMockInterviewEvaluationOutput> {
  return aiMockInterviewEvaluationFlow(input);
}

const aiMockInterviewEvaluationPrompt = ai.definePrompt({
  name: 'aiMockInterviewEvaluationPrompt',
  input: {schema: AiMockInterviewEvaluationInputSchema},
  output: {schema: AiMockInterviewEvaluationOutputSchema},
  prompt: `You are an AI interview coach. Evaluate the student's answer to the interview question based on correctness, clarity, and confidence. Provide a model answer and suggestions for improvement.\n\nJob Role: {{{jobRole}}}\nQuestion: {{{question}}}\nAnswer: {{{answer}}}\n\nEvaluate the answer and provide the following:\n- correctnessScore: A score (0-100) indicating the correctness of the answer.\n- clarityScore: A score (0-100) indicating the clarity of the answer.\n- confidenceScore: A score (0-100) indicating the confidence level in the answer.\n- modelAnswer: A model answer to the interview question.\n- suggestions: Suggestions for improving the answer.
`,
});

const aiMockInterviewEvaluationFlow = ai.defineFlow(
  {
    name: 'aiMockInterviewEvaluationFlow',
    inputSchema: AiMockInterviewEvaluationInputSchema,
    outputSchema: AiMockInterviewEvaluationOutputSchema,
  },
  async input => {
    const {output} = await aiMockInterviewEvaluationPrompt(input);
    return output!;
  }
);
