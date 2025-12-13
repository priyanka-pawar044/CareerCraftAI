import { config } from 'dotenv';
config();

import '@/ai/flows/resume-ats-analysis.ts';
import '@/ai/flows/job-description-analysis-and-matching.ts';
import '@/ai/flows/generate-role-based-interview-questions.ts';
import '@/ai/flows/personalized-skill-gap-analysis.ts';
import '@/ai/flows/ai-mock-interview-evaluation.ts';