
'use server';
/**
 * @fileOverview An AI flow to format a review request email for the security team.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FormatReviewEmailInputSchema = z.object({
  enquiryData: z.any().describe('The full enquiry data object.'),
  reviewUrl: z.string().describe('The absolute URL for the security team to click and mark as reviewed.'),
});

const FormatReviewEmailOutputSchema = z.object({
  subject: z.string().describe('A subject line requesting security review.'),
  htmlBody: z.string().describe('A professional HTML body with clear review instructions and a big button.'),
  textBody: z.string().describe('A plain text version.'),
});

export async function formatReviewEmail(input: { enquiryData: any; reviewUrl: string }) {
  return formatReviewEmailFlow(input);
}

const formatReviewEmailFlow = ai.defineFlow(
  {
    name: 'formatReviewEmailFlow',
    inputSchema: FormatReviewEmailInputSchema,
    outputSchema: FormatReviewEmailOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are an automated system for the Bishops Hull Hub. 
      Format a "Review Requested" email for our Security Team.
      
      The email needs to present the booking details and ask them to confirm they are happy for this event to proceed.
      
      Details:
      - Event: ${input.enquiryData.typeOfEvent}
      - Date: ${input.enquiryData.dateRequired}
      - Times: ${input.enquiryData.startTime} to ${input.enquiryData.endTime}
      - Contact: ${input.enquiryData.name}
      - Attendance: ${input.enquiryData.estimatedAttendance}
      
      Include a prominent call-to-action button or link pointing to: ${input.reviewUrl}
      
      The button text should say "Review & Approve Event".
      
      Make the tone professional and urgent.`,
      output: { schema: FormatReviewEmailOutputSchema },
    });
    return output!;
  }
);
