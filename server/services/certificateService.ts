import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { sendEmail } from './emailService';

interface CertificateData {
  type: 'individual' | 'organization';
  membershipNumber: string;
  name: string; // Full name for individual, Company name for organization
  memberType?: string; // For individuals
  businessType?: string; // For organizations
  registrationDate: Date;
  expiryDate: Date;
  email: string;
}

/**
 * Generate QR Code as base64 string
 * QR Code contains verification URL
 */
async function generateQRCode(membershipNumber: string): Promise<string> {
  const verificationUrl = `https://mms.estateagentscouncil.org/verify?member=${membershipNumber}`;
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
      margin: 1
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
}

/**
 * Format member type for display
 */
function formatMemberType(type: string): string {
  const typeMap: Record<string, string> = {
    'real_estate_agent': 'Real Estate Agent',
    'property_manager': 'Property Manager',
    'principal_agent': 'Principal Real Estate Agent',
    'negotiator': 'Real Estate Negotiator',
    'real_estate_firm': 'Real Estate Firm',
    'property_management_firm': 'Property Management Firm',
    'brokerage_firm': 'Brokerage Firm',
    'real_estate_development_firm': 'Real Estate Development Firm'
  };
  return typeMap[type] || type.replace(/_/g, ' ').toUpperCase();
}

/**
 * Format date for certificate
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

/**
 * Generate Membership Certificate PDF
 * Returns PDF as Buffer that can be attached to emails
 */
export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      // Collect PDF data into buffer
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Generate QR Code
      const qrCodeDataUrl = await generateQRCode(data.membershipNumber);
      const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

      // Certificate dimensions
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const centerX = pageWidth / 2;

      // Colors
      const egyptianBlue = '#1034A6';
      const powderBlue = '#B0E0E6';
      const gold = '#FFD700';

      // ===== DECORATIVE BORDER =====
      doc.lineWidth(3);
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
        .stroke(egyptianBlue);

      doc.lineWidth(1);
      doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
        .stroke(powderBlue);

      // ===== HEADER: LOGO PLACEHOLDER =====
      // Note: In production, replace this with actual logo image
      // For now, we'll create a circular placeholder
      doc.save();
      doc.circle(centerX, 100, 40)
        .fillAndStroke(powderBlue, egyptianBlue);

      doc.fontSize(14)
        .fillColor(egyptianBlue)
        .text('EACZ', centerX - 20, 92);
      doc.restore();

      // ===== ORGANIZATION NAME =====
      doc.fontSize(16)
        .fillColor(egyptianBlue)
        .font('Helvetica-Bold')
        .text('ESTATE AGENTS COUNCIL OF ZIMBABWE', 50, 160, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== CERTIFICATE TITLE =====
      doc.fontSize(28)
        .fillColor(gold)
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF REGISTRATION', 50, 210, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== MEMBER TYPE =====
      const memberTypeText = data.type === 'individual'
        ? 'Individual Member'
        : 'Company Member';

      doc.fontSize(14)
        .fillColor(egyptianBlue)
        .font('Helvetica')
        .text(memberTypeText, 50, 260, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== DIVIDER LINE =====
      doc.moveTo(150, 290)
        .lineTo(pageWidth - 150, 290)
        .stroke(powderBlue);

      // ===== MEMBER/ORGANIZATION NAME =====
      doc.fontSize(11)
        .fillColor('#333333')
        .font('Helvetica')
        .text('This is to certify that', 50, 320, {
          align: 'center',
          width: pageWidth - 100
        });

      doc.fontSize(20)
        .fillColor(egyptianBlue)
        .font('Helvetica-Bold')
        .text(data.name, 50, 345, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== MEMBERSHIP TYPE =====
      const typeDisplay = data.type === 'individual'
        ? formatMemberType(data.memberType || '')
        : formatMemberType(data.businessType || '');

      doc.fontSize(12)
        .fillColor('#666666')
        .font('Helvetica-Oblique')
        .text(typeDisplay, 50, 380, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== REGISTRATION TEXT =====
      doc.fontSize(11)
        .fillColor('#333333')
        .font('Helvetica')
        .text('is registered with the Estate Agents Council of Zimbabwe', 50, 410, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== CERTIFICATE DETAILS BOX =====
      const detailsY = 450;
      const detailsBoxHeight = 120;

      doc.rect(100, detailsY, pageWidth - 200, detailsBoxHeight)
        .fillAndStroke('#F5F5F5', egyptianBlue);

      // Details - Left Column
      const leftX = 120;
      const rightX = centerX + 20;
      let detailY = detailsY + 20;

      doc.fontSize(10)
        .fillColor('#666666')
        .font('Helvetica')
        .text('Membership Number:', leftX, detailY);

      doc.fontSize(12)
        .fillColor(egyptianBlue)
        .font('Helvetica-Bold')
        .text(data.membershipNumber, leftX, detailY + 15);

      doc.fontSize(10)
        .fillColor('#666666')
        .font('Helvetica')
        .text('Date of Registration:', leftX, detailY + 45);

      doc.fontSize(11)
        .fillColor('#333333')
        .font('Helvetica')
        .text(formatDate(data.registrationDate), leftX, detailY + 60);

      // Details - Right Column
      doc.fontSize(10)
        .fillColor('#666666')
        .font('Helvetica')
        .text('Date of Expiry:', rightX, detailY);

      doc.fontSize(11)
        .fillColor('#333333')
        .font('Helvetica')
        .text(formatDate(data.expiryDate), rightX, detailY + 15);

      doc.fontSize(10)
        .fillColor('#666666')
        .font('Helvetica')
        .text('Status:', rightX, detailY + 45);

      doc.fontSize(11)
        .fillColor('#22c55e')
        .font('Helvetica-Bold')
        .text('ACTIVE', rightX, detailY + 60);

      // ===== QR CODE =====
      const qrY = 600;
      const qrSize = 120;
      doc.image(qrCodeBuffer, centerX - qrSize / 2, qrY, {
        width: qrSize,
        height: qrSize
      });

      doc.fontSize(8)
        .fillColor('#999999')
        .font('Helvetica')
        .text('Scan to verify authenticity', 50, qrY + qrSize + 10, {
          align: 'center',
          width: pageWidth - 100
        });

      // ===== REGISTRAR SIGNATURE =====
      const sigY = 750;

      // Signature line
      doc.moveTo(centerX - 100, sigY)
        .lineTo(centerX + 100, sigY)
        .stroke(egyptianBlue);

      // Signature placeholder (simulated signature)
      doc.fontSize(18)
        .fillColor(egyptianBlue)
        .font('Helvetica-Oblique')
        .text('Registrar', centerX - 100, sigY - 30, {
          align: 'center',
          width: 200
        });

      doc.fontSize(9)
        .fillColor('#666666')
        .font('Helvetica')
        .text('Estate Agents Council of Zimbabwe', centerX - 100, sigY + 10, {
          align: 'center',
          width: 200
        });

      // ===== FOOTER =====
      doc.fontSize(8)
        .fillColor('#999999')
        .font('Helvetica')
        .text(
          '© Estate Agents Council of Zimbabwe. All rights reserved.',
          50,
          pageHeight - 50,
          {
            align: 'center',
            width: pageWidth - 100
          }
        );

      doc.fontSize(7)
        .text(
          'This is an official document. Any alteration or unauthorized use is prohibited.',
          50,
          pageHeight - 35,
          {
            align: 'center',
            width: pageWidth - 100
          }
        );

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate and send certificate email
 */
export async function sendCertificateEmail(data: CertificateData): Promise<boolean> {
  try {
    // Generate certificate PDF
    const certificatePDF = await generateCertificate(data);

    const typeDisplay = data.type === 'individual' ? 'Membership' : 'Organization';
    const subject = `Your ${typeDisplay} Certificate - EACZ`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: linear-gradient(135deg, #1034A6 0%, #B0E0E6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .certificate-box { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; color: white; }
          .details { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1034A6; }
          .button { display: inline-block; background: #1034A6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p style="font-size: 18px; margin: 10px 0 0 0;">Your Registration is Complete</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We are delighted to inform you that your ${data.type === 'individual' ? 'membership' : 'organization registration'} with the Estate Agents Council of Zimbabwe has been <strong>approved and activated</strong>.</p>

            <div class="certificate-box">
              <h3 style="margin-top: 0;">Your Membership Certificate is Ready!</h3>
              <p style="font-size: 14px; margin: 5px 0;">Please find your official registration certificate attached to this email</p>
            </div>

            <div class="details">
              <h3 style="color: #1034A6; margin-top: 0;">Your Membership Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Membership Number:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #1034A6;">${data.membershipNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">${data.type === 'individual' ? 'Member Type:' : 'Business Type:'}</td>
                  <td style="padding: 8px 0; font-weight: bold;">${data.type === 'individual' ? formatMemberType(data.memberType || '') : formatMemberType(data.businessType || '')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Registration Date:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.registrationDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Expiry Date:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.expiryDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Status:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #22c55e;">ACTIVE</td>
                </tr>
              </table>
            </div>

            <p><strong>What's included with your membership:</strong></p>
            <ul>
              <li>Official Registration Certificate (attached)</li>
              <li>Access to the Member Portal</li>
              <li>CPD training and certification programs</li>
              <li>Professional networking opportunities</li>
              <li>Industry updates and newsletters</li>
              <li>Public verification on our website</li>
            </ul>

            <p><strong>Verify Your Certificate:</strong></p>
            <p>Your certificate includes a QR code that anyone can scan to verify your registration status. You can also verify online at:</p>
            <p><a href="https://mms.estateagentscouncil.org/verify?member=${data.membershipNumber}">https://mms.estateagentscouncil.org/verify</a></p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mms.estateagentscouncil.org" class="button">Access Member Portal</a>
            </div>

            <p><strong>Important:</strong> Please keep your certificate safe. You can download additional copies from your member portal.</p>

            <p>If you have any questions or need assistance, please contact us at <a href="mailto:info@eacz.co.zw">info@eacz.co.zw</a></p>

            <p>Welcome to the EACZ family!</p>

            <p>Best regards,<br>
            <strong>Estate Agents Council of Zimbabwe</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">Certificate Number: ${data.membershipNumber}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Congratulations ${data.name}!

      Your ${data.type === 'individual' ? 'membership' : 'organization registration'} with the Estate Agents Council of Zimbabwe has been approved and activated.

      Your Membership Details:
      - Membership Number: ${data.membershipNumber}
      - ${data.type === 'individual' ? 'Member Type' : 'Business Type'}: ${data.type === 'individual' ? formatMemberType(data.memberType || '') : formatMemberType(data.businessType || '')}
      - Registration Date: ${formatDate(data.registrationDate)}
      - Expiry Date: ${formatDate(data.expiryDate)}
      - Status: ACTIVE

      Your official registration certificate is attached to this email.

      Verify your certificate online at:
      https://mms.estateagentscouncil.org/verify?member=${data.membershipNumber}

      Access your member portal:
      https://mms.estateagentscouncil.org

      If you have any questions, contact us at info@eacz.co.zw

      Welcome to the EACZ family!

      © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
    `;

    // Send email with certificate attachment
    const result = await sendEmail({
      to: data.email,
      from: 'sysadmin@estateagentscouncil.org',
      subject,
      html,
      text,
      attachments: [{
        filename: `EACZ_Certificate_${data.membershipNumber}.pdf`,
        content: certificatePDF,
        contentType: 'application/pdf'
      }]
    });

    return result;
  } catch (error) {
    console.error('Certificate email error:', error);
    return false;
  }
}
