
'use server';

import { formatEnquiryEmail } from '@/ai/flows/format-enquiry-email-flow';
import { formatReviewEmail } from '@/ai/flows/format-review-email-flow';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Server Action to handle the logic of sending the enquiry email to administrators.
 */
export async function sendEnquiryEmailAction(enquiryData: any) {
  try {
    const formattedEmail = await formatEnquiryEmail({ enquiryData });

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
      await resend.emails.send({
        from: 'Hub System <onboarding@resend.dev>',
        to: 'bishopshullhub@gmail.com',
        subject: formattedEmail.subject,
        html: formattedEmail.htmlBody,
        text: formattedEmail.textBody,
      });
    } else {
      console.log('--- ADMIN EMAIL SIMULATION ---');
      console.log('Subject:', formattedEmail.subject);
      console.log('Body:', formattedEmail.textBody);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send admin email:', error);
    return { success: false, error: error.message || 'Failed to process email' };
  }
}

/**
 * Server Action to send review requests to the Security Team.
 */
export async function sendSecurityReviewEmailAction(enquiryData: any, securityContacts: any[], baseUrl: string) {
  try {
    if (!securityContacts || securityContacts.length === 0) {
      return { success: false, error: 'No security contacts found. Please add team members in the Security tab.' };
    }

    const reviewUrl = `${baseUrl}/review/${enquiryData.id}`;
    
    // Attempt AI formatting
    let formattedEmail;
    try {
      formattedEmail = await formatReviewEmail({ enquiryData, reviewUrl });
    } catch (aiError: any) {
      console.error('AI Formatting failed, using fallback:', aiError);
      // Fallback formatting if AI fails
      formattedEmail = {
        subject: `Review Requested: ${enquiryData.typeOfEvent} on ${enquiryData.dateRequired}`,
        htmlBody: `<h1>Review Requested</h1><p>Event: ${enquiryData.typeOfEvent}</p><p><a href="${reviewUrl}">Click here to Review & Approve</a></p>`,
        textBody: `Review Requested: ${enquiryData.typeOfEvent}. Review here: ${reviewUrl}`
      };
    }

    const emails = securityContacts.map(contact => contact.email).filter(Boolean);

    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('re_your_api_key')) {
      const { error } = await resend.emails.send({
        from: 'Hub Security <onboarding@resend.dev>',
        to: emails,
        subject: formattedEmail.subject,
        html: formattedEmail.htmlBody,
        text: formattedEmail.textBody,
      });
      
      if (error) {
        throw new Error(`Resend Error: ${error.message}`);
      }
    } else {
      console.log('--- SECURITY REVIEW EMAIL SIMULATION ---');
      console.log('To Recipients:', emails.join(', '));
      console.log('Subject:', formattedEmail.subject);
      console.log('Review Link:', reviewUrl);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send security email:', error);
    return { success: false, error: error.message || 'Failed to dispatch security emails' };
  }
}
