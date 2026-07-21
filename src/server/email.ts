// Email sending utility for JHUB Africa contact form submissions
// This is a placeholder implementation. For production, integrate with a real email service
// such as SendGrid, Mailgun, AWS SES, or Nodemailer with SMTP

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email with the provided data
 * In development, this logs to console. In production, integrate with your email service.
 * 
 * To integrate with a real email service:
 * 1. Install the required package (e.g., npm install @sendgrid/mail or nodemailer)
 * 2. Add your API keys or SMTP credentials to environment variables
 * 3. Replace the console.log with the actual email sending code
 * 
 * Example with SendGrid:
 * import sgMail from '@sendgrid/mail';
 * sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 * await sgMail.send({ to, from: 'noreply@jhubafrica.ke', subject, text, html });
 * 
 * Example with Nodemailer:
 * import nodemailer from 'nodemailer';
 * const transporter = nodemailer.createTransport({
 *   host: process.env.SMTP_HOST,
 *   port: Number(process.env.SMTP_PORT),
 *   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
 * });
 * await transporter.sendMail({ from: 'noreply@jhubafrica.ke', to, subject, text, html });
 */
export async function sendEmail(data: EmailData): Promise<void> {
  // Development: Log email details to console
  console.log("=== EMAIL SENDING (Development Mode) ===");
  console.log(`To: ${data.to}`);
  console.log(`Subject: ${data.subject}`);
  console.log(`Text: ${data.text}`);
  if (data.html) {
    console.log(`HTML: ${data.html}`);
  }
  console.log("========================================");

  // Production: Replace this with your actual email service integration
  // await sendGridClient.send({ ... });
  // or
  // await transporter.sendMail({ ... });
}

/**
 * Send notification email for new contact form submission
 */
export async function sendContactNotification(
  fullName: string,
  email: string,
  phone: string,
  reason: string,
  message: string,
  source: string
): Promise<void> {
  const recipient = process.env.CONTACT_EMAIL_RECIPIENT || "info.jhub@jkuat.ac.ke";

  const subject = `New Contact Form Submission from ${fullName} (${reason})`;

  const text = `
New contact form submission received:

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Reason: ${reason}
Source: ${source}

Message:
${message}

---
Submitted at: ${new Date().toISOString()}
  `.trim();

  const html = `
<h2>New Contact Form Submission</h2>
<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Reason:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${reason}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Source:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${source}</td>
  </tr>
</table>

<h3>Message:</h3>
<p style="white-space: pre-wrap;">${message}</p>

<hr>
<p><small>Submitted at: ${new Date().toISOString()}</small></p>
  `.trim();

  await sendEmail({
    to: recipient,
    subject,
    text,
    html,
  });
}

/**
 * Send confirmation email to the user who submitted the form
 */
export async function sendConfirmationEmail(
  fullName: string,
  email: string,
  reason: string
): Promise<void> {
  const subject = "Thank you for contacting JHUB Africa";

  const text = `
Dear ${fullName},

Thank you for reaching out to JHUB Africa. We have received your message and our team will get back to you within 2-3 business days.

Your submission details:
- Reason: ${reason}
- Email: ${email}

If you have any urgent inquiries, please contact us directly at info.jhub@jkuat.ac.ke.

Best regards,
JHUB Africa Team
JKUAT
  `.trim();

  const html = `
<h2>Thank you for contacting JHUB Africa</h2>

<p>Dear ${fullName},</p>

<p>Thank you for reaching out to JHUB Africa. We have received your message and our team will get back to you within 2-3 business days.</p>

<p><strong>Your submission details:</strong></p>
<ul>
  <li>Reason: ${reason}</li>
  <li>Email: ${email}</li>
</ul>

<p>If you have any urgent inquiries, please contact us directly at <a href="mailto:info.jhub@jkuat.ac.ke">info.jhub@jkuat.ac.ke</a>.</p>

<p>Best regards,<br>
<strong>JHUB Africa Team</strong><br>
JKUAT</p>
  `.trim();

  await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}
