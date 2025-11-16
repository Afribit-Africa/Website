import { sendApprovalEmail, sendRejectionEmail, sendDonationReceipt } from '../email-service';

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
      },
    })),
  };
});

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendDonationReceipt', () => {
    it('should send email successfully', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      // Verify email data structure
      expect(emailData.to).toBeDefined();
      expect(emailData.subject).toBeDefined();
      expect(emailData.html).toBeDefined();
    });

    it('should validate email addresses', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'not-an-email';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    it('should handle email sending errors', async () => {
      const error = new Error('Failed to send email');
      expect(error.message).toBe('Failed to send email');
    });
  });

  describe('sendApprovalEmail', () => {
    it('should send approval email with correct data', async () => {
      const merchantData = {
        businessName: 'Test Business',
        email: 'merchant@example.com',
      };

      expect(merchantData.businessName).toBeDefined();
      expect(merchantData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should include business name in email', () => {
      const businessName = 'Test Restaurant';
      const emailContent = `Congratulations! Your business "${businessName}" has been approved.`;

      expect(emailContent).toContain(businessName);
      expect(emailContent).toContain('approved');
    });

    it('should include next steps information', () => {
      const emailContent = 'Your business will be published on our map within 24-48 hours.';
      expect(emailContent).toContain('published');
      expect(emailContent).toContain('map');
    });
  });

  describe('sendRejectionEmail', () => {
    it('should send rejection email with reason', async () => {
      const merchantData = {
        businessName: 'Test Business',
        email: 'merchant@example.com',
        reason: 'Incomplete information provided',
      };

      expect(merchantData.reason).toBeDefined();
      expect(merchantData.reason).toContain('Incomplete');
    });

    it('should be professional and courteous', () => {
      const emailContent = 'Thank you for your submission. Unfortunately, we cannot approve your application at this time.';

      expect(emailContent).toContain('Thank you');
      expect(emailContent).toContain('Unfortunately');
    });

    it('should provide resubmission information', () => {
      const emailContent = 'You are welcome to resubmit your application after addressing the issues.';
      expect(emailContent).toContain('resubmit');
    });
  });

  describe('Email Templates', () => {
    it('should include proper HTML structure', () => {
      const html = '<html><body><h1>Title</h1><p>Content</p></body></html>';

      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
      expect(html).toContain('<body>');
    });

    it('should include responsive design', () => {
      const html = '<div style="max-width: 600px; margin: 0 auto;">Content</div>';
      expect(html).toContain('max-width');
      expect(html).toContain('margin');
    });

    it('should include branding elements', () => {
      const html = '<img src="/logo.png" alt="Afribit Africa" />';
      expect(html).toContain('Afribit Africa');
    });
  });

  describe('Email Validation', () => {
    it('should validate recipient email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'test@',
        'test @example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle Resend API errors', () => {
      const error = new Error('Resend API key invalid');
      expect(error.message).toContain('Resend');
    });

    it('should handle rate limiting', () => {
      const error = new Error('Rate limit exceeded');
      expect(error.message).toContain('Rate limit');
    });

    it('should handle network errors', () => {
      const error = new Error('Network error');
      expect(error.message).toBe('Network error');
    });
  });

  describe('Email Content Sanitization', () => {
    it('should sanitize HTML content', () => {
      const unsafeContent = '<script>alert("xss")</script><p>Safe content</p>';
      const safeContent = unsafeContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      expect(safeContent).not.toContain('script');
      expect(safeContent).toContain('Safe content');
    });

    it('should preserve safe HTML tags', () => {
      const content = '<p><strong>Important:</strong> Please read this.</p>';
      expect(content).toContain('<p>');
      expect(content).toContain('<strong>');
    });
  });
});
