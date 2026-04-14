'use server';

import { formatEnquiryEmail } from '@/ai/flows/format-enquiry-email-flow';
import { formatReviewEmail } from '@/ai/flows/format-review-email-flow';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'bishopshullhub@gmail.com';

/**
 * Server Action to handle the logic of sending the enquiry email to administrators.
 */
export async function sendEnquiryEmailAction(enquiryData: any) {
  try {
    const formattedEmail = await formatEnquiryEmail({ enquiryData });

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
      await resend.emails.send({
        from: 'Hub System <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
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
 * Note: While in Resend testing mode, we send to the verified ADMIN_EMAIL.
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
      // Fallback formatting if AI fails - now significantly more detailed
      formattedEmail = {
        subject: `Security Review Required: ${enquiryData.typeOfEvent} on ${enquiryData.dateRequired}`,
        htmlBody: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #1a4d46; color: white; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Security Review Requested</h1>
            </div>
            <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
              <p>A new booking enquiry requires your review for safety and appropriateness.</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Event Details</h2>
                <p><strong>Type:</strong> ${enquiryData.typeOfEvent}</p>
                <p><strong>Date:</strong> ${enquiryData.dateRequired}</p>
                <p><strong>Times:</strong> ${enquiryData.startTime} - ${enquiryData.endTime}</p>
                <p><strong>Attendance:</strong> ${enquiryData.estimatedAttendance} people</p>
                
                <h2 style="margin-top: 20px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Hirer Info</h2>
                <p><strong>Name:</strong> ${enquiryData.name}</p>
                <p><strong>Contact:</strong> ${enquiryData.emailAddress} / ${enquiryData.phoneNumber}</p>
                <p><strong>Requirements:</strong> ${enquiryData.additionalRequirements || 'None specified'}</p>
              </div>

              <div style="text-align: center; margin-top: 32px;">
                <a href="${reviewUrl}" style="background-color: #1a4d46; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Review & Approve Event</a>
              </div>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 32px; text-align: center;">
                Bishops Hull Hub Automated Management System
              </p>
            </div>
          </div>
        `,
        textBody: `
SECURITY REVIEW REQUESTED
-------------------------
Event: ${enquiryData.typeOfEvent}
Date: ${enquiryData.dateRequired}
Time: ${enquiryData.startTime} - ${enquiryData.endTime}
Hirer: ${enquiryData.name}
Attendance: ${enquiryData.estimatedAttendance}
Requirements: ${enquiryData.additionalRequirements}

Review here: ${reviewUrl}
        `.trim()
      };
    }

    // While Resend domain is unverified, we must send to the account owner (admin)
    const recipients = [ADMIN_EMAIL];

    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('re_your_api_key')) {
      const { error } = await resend.emails.send({
        from: 'Hub Security <onboarding@resend.dev>',
        to: recipients,
        subject: formattedEmail.subject,
        html: formattedEmail.htmlBody,
        text: formattedEmail.textBody,
      });
      
      if (error) {
        throw new Error(`Resend Error: ${error.message}`);
      }
    } else {
      console.log('--- SECURITY REVIEW EMAIL SIMULATION ---');
      console.log('To Recipient (Restricted Mode):', recipients[0]);
      console.log('Subject:', formattedEmail.subject);
      console.log('Review Link:', reviewUrl);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send security email:', error);
    return { success: false, error: error.message || 'Failed to dispatch security emails' };
  }
}
