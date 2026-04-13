'use server';
/**
 * @fileOverview An AI assistant to help administrators generate clear and concise descriptions
 * for new weekly schedule activities or one-off events for the Bishops Hull Hub website.
 *
 * - aiScheduleDescriptionAssistant - A function that handles the generation of schedule descriptions.
 * - AIScheduleDescriptionAssistantInput - The input type for the aiScheduleDescriptionAssistant function.
 * - AIScheduleDescriptionAssistantOutput - The return type for the aiScheduleDescriptionAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIScheduleDescriptionAssistantInputSchema = z.object({
  activityName: z.string().describe('The name of the activity or event, e.g., "Rich Parkers Fitness", "Tai Chi", "Youth Club".'),
  category: z.string().describe('The category of the activity, e.g., "Fitness", "Wellness", "Youth", "Community".'),
  targetAudience: z.string().describe('The target audience for the activity, e.g., "Adults", "Secondary-school age children", "All ages".'),
  dayOfWeek: z.string().describe('The day(s) of the week or frequency, e.g., "Monday", "Every 3rd Saturday", "Weekly".'),
  startTime: z.string().describe('The start time of the activity, e.g., "06:30", "14:00".'),
  endTime: z.string().describe('The end time of the activity, e.g., "07:00", "16:00".'),
  additionalDetails: z.string().optional().describe('Any additional specific details or unique selling points about the activity.'),
});
export type AIScheduleDescriptionAssistantInput = z.infer<typeof AIScheduleDescriptionAssistantInputSchema>;

const AIScheduleDescriptionAssistantOutputSchema = z.object({
  description: z.string().describe('A clear, concise, and engaging description for the activity or event.'),
});
export type AIScheduleDescriptionAssistantOutput = z.infer<typeof AIScheduleDescriptionAssistantOutputSchema>;

export async function aiScheduleDescriptionAssistant(input: AIScheduleDescriptionAssistantInput): Promise<AIScheduleDescriptionAssistantOutput> {
  return aiScheduleDescriptionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiScheduleDescriptionAssistantPrompt',
  input: { schema: AIScheduleDescriptionAssistantInputSchema },
  output: { schema: AIScheduleDescriptionAssistantOutputSchema },
  prompt: `You are an expert copywriter for community events and activities, writing descriptions for the Bishops Hull Hub website.
Your goal is to create clear, concise, and engaging descriptions that inform and attract potential participants.
Focus on the benefits and key details of the activity.

Generate a description based on the following details:

Activity Name: {{{activityName}}}
Category: {{{category}}}
Target Audience: {{{targetAudience}}}
Day/Frequency: {{{dayOfWeek}}}
Time: {{{startTime}}} - {{{endTime}}}

{{#if additionalDetails}}Additional Details: {{{additionalDetails}}}{{/if}}

Write a short paragraph (2-3 sentences) for the 'description' field in JSON output. Ensure the tone is welcoming and informative.`,
});

const aiScheduleDescriptionAssistantFlow = ai.defineFlow(
  {
    name: 'aiScheduleDescriptionAssistantFlow',
    inputSchema: AIScheduleDescriptionAssistantInputSchema,
    outputSchema: AIScheduleDescriptionAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
