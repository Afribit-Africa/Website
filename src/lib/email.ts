import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, cc, replyTo, subject, html, text }: EmailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('Email credentials not configured. Skipping email send.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Afribit Africa'}" <${process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      replyTo,
      subject,
      html,
      text: text || stripHtml(html),
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper function to strip HTML tags for plain text version
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export default transporter;
