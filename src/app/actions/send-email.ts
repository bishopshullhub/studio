'use server';

import { formatEnquiryEmail } from '@/ai/flows/format-enquiry-email-flow';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Server Action to handle the logic of sending the enquiry email.
 * It uses Genkit to generate professional copy and Resend to dispatch it.
 */
export async function sendEnquiryEmailAction(enquiryData: any) {
  try {
    // 1. Use Genkit to format the email professionally
    const formattedEmail = await formatEnquiryEmail({ enquiryData });

    // 2. Send the real email if an API key is present
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'bishopshullhub@gmail.com',
        subject: formattedEmail.subject,
        html: formattedEmail.htmlBody,
        text: formattedEmail.textBody,
      });

      if (error) {
        console.error('Resend Error:', error);
        throw new Error('Failed to send email via Resend');
      }

      console.log('Email sent successfully:', data?.id);
    } else {
      console.log('Email content generated, but RESEND_API_KEY is not configured. Check .env file.');
      console.log('Subject:', formattedEmail.subject);
      console.log('Plain Text Body:', formattedEmail.textBody);
    }
    
    return { 
      success: true, 
      formatted: formattedEmail 
    };
  } catch (error) {
    console.error('Failed to process enquiry email:', error);
    return { success: false, error: 'Failed to process email copy' };
  }
}
