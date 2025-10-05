import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Initialize Nodemailer transport for ZeptoMail SMTP
let transporter: Transporter | null = null;

if (!process.env.ZEPTOMAIL_API_KEY) {
  console.warn("ZEPTOMAIL_API_KEY environment variable not set - email functionality will be disabled");
} else {
  console.log("ZeptoMail SMTP configured successfully");
  try {
    transporter = nodemailer.createTransport({
      host: "smtp.zeptomail.eu",
      port: 587,
      auth: {
        user: "emailapikey",
        pass: process.env.ZEPTOMAIL_API_KEY
      }
    });
    console.log("Nodemailer transport initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Nodemailer transport:", error);
  }
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!process.env.ZEPTOMAIL_API_KEY || !transporter) {
      console.log('Email would be sent to:', params.to, 'Subject:', params.subject);
      console.log('Note: ZEPTOMAIL_API_KEY not configured - email functionality disabled');
      return true; // Return success for development without API key
    }

    // Nodemailer email format
    const mailOptions = {
      from: '"Estate Agents Council of Zimbabwe" <sysadmin@estateagentscouncil.org>',
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html
    };

    console.log('Sending email via ZeptoMail SMTP to:', params.to);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('Email sending error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    return false;
  }
}

export function generateWelcomeEmail(fullName: string, applicantId: string): { subject: string; html: string; text: string } {
  const subject = 'Welcome to EACZ - Your Application ID';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .applicant-id { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Estate Agents Council of Zimbabwe</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${fullName}!</h2>
          <p>Thank you for starting your individual membership application with the Estate Agents Council of Zimbabwe.</p>
          
          <div class="applicant-id">
            <h3>Your Applicant ID</h3>
            <strong style="font-size: 18px; color: #1e40af;">${applicantId}</strong>
            <p style="margin-top: 10px; font-size: 14px;">Please save this ID for your records</p>
          </div>
          
          <p>To continue with your application, please verify your email address by clicking the link in the verification email we're sending you.</p>
          
          <p>Once verified, you'll be able to complete your application form and upload the required documents.</p>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Welcome to EACZ, ${fullName}!
    
    Thank you for starting your individual membership application with the Estate Agents Council of Zimbabwe.
    
    Your Applicant ID: ${applicantId}
    Please save this ID for your records.
    
    To continue with your application, please verify your email address by clicking the link in the verification email we're sending you.
    
    Once verified, you'll be able to complete your application form and upload the required documents.
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateOrgApplicantVerificationEmail(companyName: string, verificationToken: string): { subject: string; html: string; text: string } {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}` 
    : 'http://localhost:5000';
  const verificationUrl = `${baseUrl}/organization/verify-email?token=${verificationToken}`;
  const subject = 'Verify Your Email Address - EACZ Organization Application';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification Required</h1>
        </div>
        <div class="content">
          <h2>Hello ${companyName},</h2>
          <p>Please verify your email address to continue with your EACZ organization membership application.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e0e7ff; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't request this verification email, please ignore this message.</p>
          
          <p>Contact us at info@eacz.co.zw if you need assistance.</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Email Verification Required - EACZ Organization Application
    
    Hello ${companyName},
    
    Please verify your email address to continue with your EACZ organization membership application.
    
    Click this link to verify: ${verificationUrl}
    
    This verification link will expire in 24 hours for security reasons.
    
    If you didn't request this verification email, please ignore this message.
    
    Contact us at info@eacz.co.zw if you need assistance.
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateVerificationEmail(fullName: string, verificationToken: string, baseUrl: string): { subject: string; html: string; text: string } {
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
  const subject = 'Verify Your Email Address - EACZ Application';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification Required</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Please verify your email address to continue with your EACZ membership application.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1e40af;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Hello ${fullName},
    
    Please verify your email address to continue with your EACZ membership application.
    
    Click this link to verify: ${verificationUrl}
    
    This verification link will expire in 24 hours.
    
    If you didn't request this verification, please ignore this email.
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateApplicationConfirmationEmail(
  applicantName: string, 
  applicationId: string, 
  applicationType: 'individual' | 'organization',
  feeAmount: number
): { subject: string; html: string; text: string } {
  const typeDisplayName = applicationType === 'individual' ? 'Individual Membership' : 'Organization Registration';
  const subject = `Application Submitted - ${applicationId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .application-id { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .fee-info { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Submitted Successfully</h1>
        </div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p>Your ${typeDisplayName} application has been successfully submitted to the Estate Agents Council of Zimbabwe.</p>
          
          <div class="application-id">
            <h3>Application ID</h3>
            <strong style="font-size: 18px; color: #1e40af;">${applicationId}</strong>
            <p style="margin-top: 10px; font-size: 14px;">Please save this ID for your records</p>
          </div>
          
          <div class="fee-info">
            <h4>Next Steps - Payment Required</h4>
            <p><strong>Application Fee: $${feeAmount} USD</strong></p>
            <p>To complete your application, please:</p>
            <ul>
              <li>Upload all required documents</li>
              <li>Pay the application fee</li>
              <li>Submit your application for review</li>
            </ul>
          </div>
          
          <p>Your application is currently in <strong>draft</strong> status. You can continue editing and uploading documents until you're ready to submit for review.</p>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Application Submitted Successfully
    
    Hello ${applicantName},
    
    Your ${typeDisplayName} application has been successfully submitted to the Estate Agents Council of Zimbabwe.
    
    Application ID: ${applicationId}
    Please save this ID for your records.
    
    Next Steps - Payment Required:
    Application Fee: $${feeAmount} USD
    
    To complete your application, please:
    - Upload all required documents
    - Pay the application fee
    - Submit your application for review
    
    Your application is currently in draft status. You can continue editing and uploading documents until you're ready to submit for review.
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateApprovedMemberWelcomeEmail(
  fullName: string,
  email: string,
  membershipNumber: string,
  passwordResetToken: string,
  baseUrl: string
): { subject: string; html: string; text: string } {
  const subject = 'Welcome to EACZ - Your Member Account is Ready!';
  const passwordResetUrl = `${baseUrl}/reset-password?token=${passwordResetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .credentials { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .password-button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .login-button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to EACZ!</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Congratulations! Your application has been approved and your member account has been created with the Estate Agents Council of Zimbabwe.</p>
          
          <div class="credentials">
            <h3>Your Member Details</h3>
            <p><strong>Member ID:</strong> ${membershipNumber}</p>
            <p><strong>Login Email:</strong> ${email}</p>
            <p><strong>Status:</strong> Account Ready - Password Setup Required</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${passwordResetUrl}" class="password-button">Set Your Password</a>
            <br>
            <a href="${baseUrl}" class="login-button">Visit Member Portal</a>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Click "Set Your Password" above to create your secure password</li>
            <li>Log in to the member portal with your email and new password</li>
            <li>Complete your member profile and upload required documents</li>
          </ol>
          
          <p>As a registered member, you now have access to:</p>
          <ul>
            <li>Member portal and resources</li>
            <li>CPD training and certification programs</li>
            <li>Industry updates and newsletters</li>
            <li>Professional networking opportunities</li>
          </ul>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Welcome to EACZ - Your Member Account is Ready!
    
    Hello ${fullName},
    
    Congratulations! Your application has been approved and your member account has been created with the Estate Agents Council of Zimbabwe.
    
    Your Member Details:
    - Member ID: ${membershipNumber}
    - Login Email: ${email}
    - Status: Account Ready - Password Setup Required
    
    Next Steps:
    1. Set your password: ${passwordResetUrl}
    2. Visit member portal: ${baseUrl}
    
    As a registered member, you now have access to:
    - Member portal and resources
    - CPD training and certification programs
    - Industry updates and newsletters
    - Professional networking opportunities
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateNewMemberWelcomeEmail(
  fullName: string, 
  membershipNumber: string, 
  educationLevel: string, 
  employmentStatus: string
): { subject: string; html: string; text: string } {
  const subject = 'Welcome to EACZ - Member Profile Created';
  
  const entryType = educationLevel === 'normal_entry' 
    ? 'Normal Entry (5 O\'levels + 2 A\'levels)' 
    : 'Mature Entry (27+ years, 5 O\'levels)';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .member-info { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .next-steps { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to EACZ</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Your member profile has been successfully created with the Estate Agents Council of Zimbabwe.</p>
          
          <div class="member-info">
            <h3>Your Member Details</h3>
            <p><strong>Membership Number:</strong> ${membershipNumber}</p>
            <p><strong>Entry Type:</strong> ${entryType}</p>
            <p><strong>Employment Status:</strong> ${employmentStatus}</p>
            <p><strong>Status:</strong> Pending Email Verification</p>
          </div>
          
          <div class="next-steps">
            <h4>Next Steps Required</h4>
            <p>To activate your membership, you'll need to:</p>
            <ol>
              <li><strong>Verify your email address</strong> (verification email sent separately)</li>
              <li><strong>Complete your profile</strong> with additional details</li>
              <li><strong>Upload required documents</strong></li>
              <li><strong>Pay membership fees</strong></li>
            </ol>
          </div>
          
          <p>Once you've verified your email, you'll be able to log in and complete your profile with additional information such as professional qualifications, work experience, and required documentation.</p>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Welcome to EACZ
    
    Hello ${fullName},
    
    Your member profile has been successfully created with the Estate Agents Council of Zimbabwe.
    
    Your Member Details:
    - Membership Number: ${membershipNumber}
    - Entry Type: ${entryType}
    - Employment Status: ${employmentStatus}
    - Status: Pending Email Verification
    
    Next Steps Required:
    1. Verify your email address (verification email sent separately)
    2. Complete your profile with additional details
    3. Upload required documents
    4. Pay membership fees
    
    Once you've verified your email, you'll be able to log in and complete your profile with additional information such as professional qualifications, work experience, and required documentation.
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateMemberVerificationEmail(
  fullName: string, 
  email: string, 
  membershipNumber: string, 
  verificationToken: string, 
  baseUrl: string
): { subject: string; html: string; text: string } {
  const verificationUrl = `${baseUrl}/member-verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;
  const subject = 'Verify Your Email - EACZ Member Profile';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .credentials { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification Required</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Please verify your email address to activate your EACZ member profile and complete your registration.</p>
          
          <div class="credentials">
            <h3>Your Login Details</h3>
            <p><strong>Membership Number:</strong> ${membershipNumber}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p style="font-size: 14px; color: #666;">You'll use these to log in after verification</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email & Activate Profile</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e0e7ff; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          
          <p>After verifying your email, you'll be able to:</p>
          <ul>
            <li>Log in to your member dashboard</li>
            <li>Complete your professional profile</li>
            <li>Upload required documents</li>
            <li>Make membership fee payments</li>
            <li>Access member resources and services</li>
          </ul>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't request this membership, please ignore this message.</p>
          
          <p>Contact us at info@eacz.co.zw if you need assistance.</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Email Verification Required - EACZ Member Profile
    
    Hello ${fullName},
    
    Please verify your email address to activate your EACZ member profile and complete your registration.
    
    Your Login Details:
    - Membership Number: ${membershipNumber}
    - Email: ${email}
    You'll use these to log in after verification
    
    Click this link to verify: ${verificationUrl}
    
    After verifying your email, you'll be able to:
    - Log in to your member dashboard
    - Complete your professional profile
    - Upload required documents
    - Make membership fee payments
    - Access member resources and services
    
    This verification link will expire in 24 hours for security reasons.
    
    If you didn't request this membership, please ignore this message.
    
    Contact us at info@eacz.co.zw if you need assistance.
    
    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  
  return { subject, html, text };
}

export function generateProfileUpdateNotification(userName: string): { subject: string; html: string; text: string } {
  const subject = "Profile Updated Successfully - EACZ";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .security-notice { background: #fef3cd; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Profile Updated Successfully</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your profile has been successfully updated in the EACZ system.</p>
          
          <div class="security-notice">
            <strong>Security Notice:</strong> If you did not make this change, please contact our support team immediately at info@eacz.co.zw or call our office during business hours.
          </div>
          
          <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Profile Updated Successfully - EACZ
    
Hello ${userName},

Your profile has been successfully updated in the EACZ system.

SECURITY NOTICE: If you did not make this change, please contact our support team immediately at info@eacz.co.zw or call our office during business hours.

Best regards,
Estate Agents Council of Zimbabwe`;
  
  return { subject, html, text };
}

export function generatePasswordChangeNotification(userName: string): { subject: string; html: string; text: string } {
  const subject = "Password Changed Successfully - EACZ";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .security-alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Changed Successfully</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          
          <div class="security-alert">
            <strong>Important Security Notice:</strong> If you did NOT make this change, your account may be compromised. Please contact our support team IMMEDIATELY at info@eacz.co.zw.
          </div>
          
          <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Password Changed Successfully - EACZ
    
Hello ${userName},

Your password has been successfully changed for your EACZ account.

IMPORTANT SECURITY NOTICE: If you did NOT make this change, your account may be compromised. Please contact our support team IMMEDIATELY at info@eacz.co.zw.

Best regards,
Estate Agents Council of Zimbabwe`;
  
  return { subject, html, text };
}
