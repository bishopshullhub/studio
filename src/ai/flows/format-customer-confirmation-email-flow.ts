
'use server';
/**
 * @fileOverview An AI flow to format a professional confirmation email for the enquirer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FormatCustomerConfirmationEmailInputSchema = z.object({
  enquiryData: z.any().describe('The full enquiry data object from the booking form.'),
  faqUrl: z.string().describe('The absolute URL to the FAQ page.'),
});

const FormatCustomerConfirmationEmailOutputSchema = z.object({
  subject: z.string().describe('A professional subject line for the enquirer.'),
  htmlBody: z.string().describe('A well-formatted HTML body for the customer confirmation email.'),
  textBody: z.string().describe('A plain text version of the email body.'),
});

export async function formatCustomerConfirmationEmail(input: { enquiryData: any; faqUrl: string }) {
  return formatCustomerConfirmationEmailFlow(input);
}

const formatCustomerConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'formatCustomerConfirmationEmailFlow',
    inputSchema: FormatCustomerConfirmationEmailInputSchema,
    outputSchema: FormatCustomerConfirmationEmailOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are the automated booking assistant for the Bishops Hull Hub. 
      Format a professional confirmation email to the enquirer who just submitted a booking request.
      
      The email should:
      1. Thank them for their interest in hiring the Hub.
      2. State that our volunteer booking secretary will be in touch within 3 days to arrange a visit and confirm arrangements.
      3. Provide a clear summary of the details they submitted:
         - Event: ${input.enquiryData.typeOfEvent}
         - Date: ${input.enquiryData.dateRequired}
         - Time: ${input.enquiryData.startTime} - ${input.enquiryData.endTime}
      4. Include a helpful link to the FAQ page: ${input.faqUrl}
      5. Maintain a warm, community-focused, and professional tone.

      Enquiry Details:
      ${JSON.stringify(input.enquiryData, null, 2)}
      
      Provide:
      1. A clear subject line (e.g., "Booking Enquiry Received: [Event Name]").
      2. A professional HTML body with clear sections and Hub branding.
      3. A matching plain text body.`,
      output: { schema: FormatCustomerConfirmationEmailOutputSchema },
    });
    return output!;
  }
);
