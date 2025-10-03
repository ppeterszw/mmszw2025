/**
 * Email Notifications for Authentication Events
 */

import { sendEmail } from "../services/emailService";

const BASE_URL = process.env.BASE_URL || "https://mms.estateagentscouncil.org";

export class AuthEmailService {
  /**
   * Send welcome email after registration
   */
  static async sendWelcomeEmail(
    email: string,
    name: string,
    verificationToken: string
  ): Promise<boolean> {
    const verificationLink = `${BASE_URL}/verify-email?token=${verificationToken}`;

    return await sendEmail({
      to: email,
      from: "sysadmin@estateagentscouncil.org",
      subject: "Welcome to Estate Agents Council of Zimbabwe",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #1a56db; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EACZ</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>Thank you for registering with the Estate Agents Council of Zimbabwe. We're excited to have you join us!</p>

              <p>To complete your registration, please verify your email address by clicking the button below:</p>

              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #1a56db;">${verificationLink}</p>

              <p><strong>This link will expire in 24 hours.</strong></p>

              <p>If you didn't create an account, please ignore this email.</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe<br>
              Email: info@estateagentscouncil.org<br>
              Website: estateagentscouncil.org</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Estate Agents Council of Zimbabwe!

Hello ${name},

Thank you for registering. To complete your registration, please verify your email address by visiting:

${verificationLink}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
Estate Agents Council of Zimbabwe
      `,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<boolean> {
    const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

    return await sendEmail({
      to: email,
      from: "sysadmin@estateagentscouncil.org",
      subject: "Password Reset Request - EACZ",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>We received a request to reset your password for your EACZ account.</p>

              <p>Click the button below to reset your password:</p>

              <p style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #dc2626;">${resetLink}</p>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                • This link will expire in 1 hour<br>
                • For security, you can only use this link once<br>
                • If you didn't request this reset, please ignore this email and contact support
              </div>

              <p>Need help? Contact our support team at support@estateagentscouncil.org</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe<br>
              Email: info@estateagentscouncil.org</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Reset Request

Hello ${name},

We received a request to reset your password for your EACZ account.

To reset your password, visit:
${resetLink}

SECURITY NOTICE:
- This link will expire in 1 hour
- You can only use this link once
- If you didn't request this reset, please ignore this email and contact support

Need help? Contact support@estateagentscouncil.org

Best regards,
Estate Agents Council of Zimbabwe
      `,
    });
  }

  /**
   * Send password changed confirmation
   */
  static async sendPasswordChangedEmail(
    email: string,
    name: string
  ): Promise<boolean> {
    return await sendEmail({
      to: email,
      from: "sysadmin@estateagentscouncil.org",
      subject: "Password Changed Successfully - EACZ",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Password Changed</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>This email confirms that your password was successfully changed.</p>

              <div class="warning">
                <strong>⚠️ Didn't make this change?</strong><br>
                If you didn't change your password, your account may be compromised. Please contact our support team immediately at:<br>
                <strong>support@estateagentscouncil.org</strong>
              </div>

              <p><strong>Changed:</strong> ${new Date().toLocaleString()}</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe<br>
              Email: info@estateagentscouncil.org</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Changed Successfully

Hello ${name},

This email confirms that your password was successfully changed.

DIDN'T MAKE THIS CHANGE?
If you didn't change your password, your account may be compromised. Please contact support immediately at: support@estateagentscouncil.org

Changed: ${new Date().toLocaleString()}

Best regards,
Estate Agents Council of Zimbabwe
      `,
    });
  }

  /**
   * Send account locked notification
   */
  static async sendAccountLockedEmail(
    email: string,
    name: string,
    unlockTime: Date
  ): Promise<boolean> {
    return await sendEmail({
      to: email,
      from: "sysadmin@estateagentscouncil.org",
      subject: "Account Locked - EACZ",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .alert { background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Account Locked</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <div class="alert">
                <strong>Your account has been temporarily locked due to multiple failed login attempts.</strong>
              </div>

              <p><strong>Unlock Time:</strong> ${unlockTime.toLocaleString()}</p>

              <p>Your account will automatically unlock at the time shown above.</p>

              <p><strong>For immediate assistance:</strong></p>
              <ul>
                <li>Contact support: support@estateagentscouncil.org</li>
                <li>Call: +263 XXX XXX XXX</li>
              </ul>

              <p>If you didn't attempt to login, please contact support immediately as your account may be under attack.</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Account Locked

Hello ${name},

Your account has been temporarily locked due to multiple failed login attempts.

Unlock Time: ${unlockTime.toLocaleString()}

Your account will automatically unlock at the time shown above.

For immediate assistance:
- Email: support@estateagentscouncil.org
- Phone: +263 XXX XXX XXX

If you didn't attempt to login, please contact support immediately.

Best regards,
Estate Agents Council of Zimbabwe
      `,
    });
  }

  /**
   * Send login notification (suspicious activity)
   */
  static async sendLoginNotification(
    email: string,
    name: string,
    loginDetails: {
      time: Date;
      ipAddress?: string;
      userAgent?: string;
      location?: string;
    }
  ): Promise<boolean> {
    return await sendEmail({
      to: email,
      from: "sysadmin@estateagentscouncil.org",
      subject: "New Login to Your Account - EACZ",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .details { background: white; border: 1px solid #e5e7eb; padding: 12px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Login Detected</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>We detected a new login to your EACZ account.</p>

              <div class="details">
                <strong>Login Details:</strong><br>
                • Time: ${loginDetails.time.toLocaleString()}<br>
                ${loginDetails.ipAddress ? `• IP Address: ${loginDetails.ipAddress}<br>` : ""}
                ${loginDetails.location ? `• Location: ${loginDetails.location}<br>` : ""}
                ${loginDetails.userAgent ? `• Device: ${loginDetails.userAgent}<br>` : ""}
              </div>

              <div class="warning">
                <strong>Was this you?</strong><br>
                If you didn't login, your account may be compromised. Please:
                <ol>
                  <li>Change your password immediately</li>
                  <li>Contact support: support@estateagentscouncil.org</li>
                </ol>
              </div>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Login Detected

Hello ${name},

We detected a new login to your EACZ account.

Login Details:
- Time: ${loginDetails.time.toLocaleString()}
${loginDetails.ipAddress ? `- IP Address: ${loginDetails.ipAddress}\n` : ""}
${loginDetails.location ? `- Location: ${loginDetails.location}\n` : ""}
${loginDetails.userAgent ? `- Device: ${loginDetails.userAgent}\n` : ""}

WAS THIS YOU?
If you didn't login, your account may be compromised. Please:
1. Change your password immediately
2. Contact support: support@estateagentscouncil.org

Best regards,
Estate Agents Council of Zimbabwe
      `,
    });
  }
}
