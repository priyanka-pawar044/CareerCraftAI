'use server';

/**
 * @fileOverview Skill gap analysis flow that compares resume skills against job role requirements to identify missing skills and generate a personalized learning roadmap with free resources.
 *
 * - personalizedSkillGapAnalysis - A function that handles the skill gap analysis process.
 * - SkillGapAnalysisInput - The input type for the personalizedSkillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the personalizedSkillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillGapAnalysisInputSchema = z.object({
  resumeText: z.string().describe('The text content of the user\'s resume.'),
  jobDescription: z.string().describe('The job description for the desired role.'),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  missingSkills: z.array(z.string()).describe('A list of skills missing from the resume compared to the job description.'),
  learningRoadmap: z.string().describe('A personalized learning roadmap with free resources to acquire the missing skills.'),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function personalizedSkillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const skillGapAnalysisPrompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: SkillGapAnalysisInputSchema},
  output: {schema: SkillGapAnalysisOutputSchema},
  prompt: `You are a career coach helping students identify skill gaps and create a learning roadmap.

  Compare the skills listed in the resume with the skills required in the job description.
  Identify the missing skills and generate a personalized learning roadmap with free resources (e.g., Coursera, edX, YouTube tutorials) to acquire those skills.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}`,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await skillGapAnalysisPrompt(input);
    return output!;
  }
);
