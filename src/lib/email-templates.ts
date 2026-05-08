// Email template functions

export function donationConfirmationEmail({
  donorName,
  amount,
  currency,
  program,
  invoiceId,
  isAnonymous,
}: {
  donorName: string;
  amount: string;
  currency: string;
  program?: string;
  invoiceId: string;
  isAnonymous: boolean;
}) {
  const programName = program ? getProgramName(program) : 'General Support';
  
  return {
    subject: `Thank You for Your ${currency} ${amount} Donation!`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #ffffff; }
    .donation-details { background: #f8f9fa; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
    .detail-label { font-weight: bold; }
    .footer { background: #1a1a1a; color: #ffffff; padding: 20px; text-align: center; font-size: 14px; }
    .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .impact { background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Thank You for Your Donation!</h1>
  </div>
  
  <div class="content">
    <p>Dear ${isAnonymous ? 'Anonymous Supporter' : donorName},</p>
    
    <p>Thank you for your generous donation to Afribit Africa! Your support is making a real difference in bringing Bitcoin financial freedom to African communities.</p>
    
    <div class="donation-details">
      <h3>Donation Details</h3>
      <div class="detail-row">
        <span class="detail-label">Amount:</span>
        <span>${currency} ${amount}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Program:</span>
        <span>${programName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Transaction ID:</span>
        <span style="font-family: monospace; font-size: 12px;">${invoiceId}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
    
    <div class="impact">
      <h3>Your Impact</h3>
      <p>Your donation helps us:</p>
      <ul>
        <li>Educate ${Math.floor(parseFloat(amount) / 5)} people about Bitcoin</li>
        <li>Support ${Math.floor(parseFloat(amount) / 50)} merchants in accepting Bitcoin payments</li>
        <li>Fund ${Math.floor(parseFloat(amount) / 25)} training sessions</li>
        <li>Set up ${Math.floor(parseFloat(amount) / 10)} Bitcoin wallets</li>
      </ul>
    </div>
    
    <p>We will send you updates on how your donation is being used to empower communities across Africa.</p>
    
    <p style="text-align: center;">
      <a href="https://afribit.africa/programs" class="button">See Our Programs in Action</a>
    </p>
    
    <p>Thank you for believing in our mission!</p>
    
    <p>With gratitude,<br>
    <strong>The Afribit Africa Team</strong></p>
  </div>
  
  <div class="footer">
    <p><strong>Afribit Africa</strong></p>
    <p>Empowering Africa Through Bitcoin</p>
    <p>
      <a href="https://afribit.africa" style="color: #f97316;">afribit.africa</a> | 
      <a href="mailto:connect@afribit.africa" style="color: #f97316;">connect@afribit.africa</a>
    </p>
    <p style="font-size: 12px; color: #999; margin-top: 15px;">
      This email was sent because you made a donation to Afribit Africa.<br>
      Questions? Reply to this email or contact us at connect@afribit.africa
    </p>
  </div>
</body>
</html>
    `,
  };
}

export function contactFormNotification({
  name,
  email,
  phone,
  subject,
  message,
  submittedAt,
}: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  submittedAt: Date;
}) {
  return {
    subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #1a1a1a; color: white; padding: 20px; }
    .content { padding: 30px; background: #ffffff; }
    .detail-box { background: #f8f9fa; border: 1px solid #e5e7eb; padding: 15px; margin: 15px 0; border-radius: 6px; }
    .detail-row { margin: 10px 0; }
    .label { font-weight: bold; color: #6b7280; }
    .message-box { background: #fef3c7; border-left: 4px solid #f97316; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h2>📧 New Contact Form Submission</h2>
  </div>
  
  <div class="content">
    <p>A new message has been received through the Afribit Africa contact form.</p>
    
    <div class="detail-box">
      <div class="detail-row">
        <span class="label">From:</span> ${name}
      </div>
      <div class="detail-row">
        <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
      </div>
      ${phone ? `<div class="detail-row"><span class="label">Phone:</span> ${phone}</div>` : ''}
      <div class="detail-row">
        <span class="label">Subject:</span> ${subject || 'General Inquiry'}
      </div>
      <div class="detail-row">
        <span class="label">Submitted:</span> ${submittedAt.toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
    
    <div class="message-box">
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
    
    <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
  </div>
</body>
</html>
    `,
  };
}

export function newsletterWelcomeEmail({ name }: { name?: string }) {
  return {
    subject: 'Welcome to Afribit Africa Newsletter!',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #ffffff; }
    .feature-box { display: inline-block; width: 100%; background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; }
    .footer { background: #1a1a1a; color: #ffffff; padding: 20px; text-align: center; font-size: 14px; }
    .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Our Community! 🚀</h1>
  </div>
  
  <div class="content">
    <p>Hi ${name || 'there'},</p>
    
    <p>Thank you for subscribing to the Afribit Africa newsletter! We're excited to have you join our community of Bitcoin enthusiasts and supporters.</p>
    
    <h3>What to Expect:</h3>
    
    <div class="feature-box">
      <strong>📰 Monthly Updates</strong><br>
      Stay informed about our latest programs, success stories, and community impact.
    </div>
    
    <div class="feature-box">
      <strong>💡 Bitcoin Education</strong><br>
      Learn about Bitcoin adoption in Africa and how it's transforming communities.
    </div>
    
    <div class="feature-box">
      <strong>🎉 Exclusive Content</strong><br>
      Get early access to event announcements, special initiatives, and ways to get involved.
    </div>
    
    <div class="feature-box">
      <strong>📊 Impact Reports</strong><br>
      See the real difference your support makes with detailed impact metrics.
    </div>
    
    <p style="text-align: center;">
      <a href="https://afribit.africa/about" class="button">Learn More About Us</a>
    </p>
    
    <p>Ready to make an even bigger impact? Consider supporting one of our programs!</p>
    
    <p style="text-align: center;">
      <a href="https://afribit.africa/donate" class="button">Support Our Mission</a>
    </p>
    
    <p>Thanks for being part of the movement!</p>
    
    <p>Best regards,<br>
    <strong>The Afribit Africa Team</strong></p>
  </div>
  
  <div class="footer">
    <p><strong>Afribit Africa</strong></p>
    <p>Empowering Africa Through Bitcoin</p>
    <p>
      <a href="https://afribit.africa" style="color: #f97316;">afribit.africa</a> | 
      <a href="mailto:connect@afribit.africa" style="color: #f97316;">connect@afribit.africa</a>
    </p>
    <p style="font-size: 12px; color: #999; margin-top: 15px;">
      You're receiving this because you subscribed to our newsletter.<br>
      <a href="https://afribit.africa/unsubscribe" style="color: #f97316;">Unsubscribe</a> if you no longer wish to receive updates.
    </p>
  </div>
</body>
</html>
    `,
  };
}

export function adminDonationNotification({
  donorName,
  donorEmail,
  amount,
  currency,
  program,
  invoiceId,
  isAnonymous,
}: {
  donorName: string;
  donorEmail?: string;
  amount: string;
  currency: string;
  program?: string;
  invoiceId: string;
  isAnonymous: boolean;
}) {
  const programName = program ? getProgramName(program) : 'General Support';
  
  return {
    subject: `New Donation Received: ${currency} ${amount}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #10b981; color: white; padding: 20px; }
    .content { padding: 30px; background: #ffffff; }
    .detail-box { background: #f8f9fa; border: 1px solid #e5e7eb; padding: 15px; margin: 15px 0; }
    .amount { font-size: 32px; font-weight: bold; color: #10b981; }
  </style>
</head>
<body>
  <div class="header">
    <h2>💰 New Donation Received!</h2>
  </div>
  
  <div class="content">
    <p class="amount">${currency} ${amount}</p>
    
    <div class="detail-box">
      <p><strong>Donor:</strong> ${isAnonymous ? 'Anonymous' : donorName}</p>
      ${!isAnonymous && donorEmail ? `<p><strong>Email:</strong> ${donorEmail}</p>` : ''}
      <p><strong>Program:</strong> ${programName}</p>
      <p><strong>Invoice ID:</strong> <code>${invoiceId}</code></p>
      <p><strong>Status:</strong> Completed</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <p><strong>Action:</strong> Donation confirmation email has been sent to the donor.</p>
  </div>
</body>
</html>
    `,
  };
}

// Helper function to get program display name
function getProgramName(slug: string): string {
  const programs: Record<string, string> = {
    'bitcoin-education': 'Bitcoin Education Program',
    'boda-boda-compliance': 'Boda-Boda Compliance & Education',
    'waste-management': 'Waste Management Expansion',
    'business-accelerator': 'Business Accelerator & Financing',
    'equipment-scaling': 'Equipment for Efficiency & Scaling',
  };
  return programs[slug] || slug;
}
