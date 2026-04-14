'use server';

import { formatEnquiryEmail } from '@/ai/flows/format-enquiry-email-flow';

/**
 * Server Action to handle the logic of "sending" the enquiry email.
 * Currently, it generates the professional copy using AI.
 * To make this send real emails, you would integrate a service like Resend.
 */
export async function sendEnquiryEmailAction(enquiryData: any) {
  try {
    // 1. Use Genkit to format the email professionally
    const formattedEmail = await formatEnquiryEmail({ enquiryData });

    // 2. Integration Placeholder:
    // To send a real email, install 'resend' and use:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Hub Bookings <onboarding@resend.dev>',
    //   to: 'bishopshullhub@gmail.com',
    //   subject: formattedEmail.subject,
    //   html: formattedEmail.htmlBody,
    // });

    console.log('Email content generated successfully:', formattedEmail.subject);
    
    return { 
      success: true, 
      formatted: formattedEmail 
    };
  } catch (error) {
    console.error('Failed to process enquiry email:', error);
    return { success: false, error: 'Failed to process email copy' };
  }
}
