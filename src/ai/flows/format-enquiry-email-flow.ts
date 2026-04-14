'use server';
/**
 * @fileOverview An AI flow to format booking enquiries into a professional email body.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FormatEnquiryEmailInputSchema = z.object({
  enquiryData: z.any().describe('The full enquiry data object from the booking form.'),
});

const FormatEnquiryEmailOutputSchema = z.object({
  subject: z.string().describe('A professional subject line for the email.'),
  htmlBody: z.string().describe('A well-formatted HTML body for the email.'),
  textBody: z.string().describe('A plain text version of the email body.'),
});

export async function formatEnquiryEmail(input: { enquiryData: any }) {
  return formatEnquiryEmailFlow(input);
}

const formatEnquiryEmailFlow = ai.defineFlow(
  {
    name: 'formatEnquiryEmailFlow',
    inputSchema: FormatEnquiryEmailInputSchema,
    outputSchema: FormatEnquiryEmailOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are an administrative assistant for the Bishops Hull Hub. 
      Format the following booking enquiry into a professional email for the bookings secretary.
      
      Enquiry Details:
      ${JSON.stringify(input.enquiryData, null, 2)}
      
      Provide:
      1. A clear subject line including the event type and date.
      2. A professional HTML body with clear sections.
      3. A matching plain text body.`,
      output: { schema: FormatEnquiryEmailOutputSchema },
    });
    return output!;
  }
);
