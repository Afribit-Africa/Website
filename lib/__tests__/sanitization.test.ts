import {
  sanitizeText,
  sanitizeHtml,
  sanitizeEmail,
  sanitizeUrl,
  sanitizePhone,
  sanitizeMerchantSubmission,
} from '../sanitization';

describe('Sanitization Library', () => {
  describe('sanitizeText', () => {
    it('should remove HTML tags from text', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeText(input);
      expect(result).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(sanitizeText(null as any)).toBe('');
      expect(sanitizeText(undefined as any)).toBe('');
    });

    it('should preserve safe text', () => {
      const input = 'This is a safe text';
      expect(sanitizeText(input)).toBe(input);
    });

    it('should remove dangerous scripts', () => {
      const input = 'Hello<script>alert(1)</script>World';
      const result = sanitizeText(input);
      expect(result).not.toContain('script');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtml(input);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('should remove dangerous HTML', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('script');
      expect(result).toContain('Hello');
    });

    it('should remove onclick and other event handlers', () => {
      const input = '<div onclick="alert(1)">Click me</div>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('onclick');
    });

    it('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('javascript:');
    });
  });

  describe('sanitizeEmail', () => {
    it('should validate correct email addresses', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
      expect(sanitizeEmail('user.name+tag@example.co.uk')).toBe('user.name+tag@example.co.uk');
    });

    it('should reject invalid email addresses', () => {
      expect(sanitizeEmail('invalid')).toBe('');
      expect(sanitizeEmail('test@')).toBe('');
      expect(sanitizeEmail('@example.com')).toBe('');
      expect(sanitizeEmail('test @example.com')).toBe('');
    });

    it('should handle empty input', () => {
      expect(sanitizeEmail('')).toBe('');
      expect(sanitizeEmail(null as any)).toBe('');
    });

    it('should trim whitespace', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow http and https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should reject javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    });

    it('should reject data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('should handle empty input', () => {
      expect(sanitizeUrl('')).toBe('');
      expect(sanitizeUrl(null as any)).toBe('');
    });

    it('should preserve query parameters', () => {
      const url = 'https://example.com/path?param=value&other=test';
      expect(sanitizeUrl(url)).toBe(url);
    });
  });

  describe('sanitizePhone', () => {
    it('should allow valid phone numbers', () => {
      expect(sanitizePhone('+254712345678')).toBe('+254712345678');
      expect(sanitizePhone('0712345678')).toBe('0712345678');
      expect(sanitizePhone('+1-555-123-4567')).toBe('+1-555-123-4567');
    });

    it('should remove non-numeric characters except + and -', () => {
      const result = sanitizePhone('+254 (712) 345-678');
      expect(result).toContain('254');
      expect(result).toContain('712');
    });

    it('should handle empty input', () => {
      expect(sanitizePhone('')).toBe('');
      expect(sanitizePhone(null as any)).toBe('');
    });

    it('should reject phone numbers that are too short', () => {
      expect(sanitizePhone('123')).toBe('');
    });
  });

  describe('sanitizeMerchantSubmission', () => {
    const validSubmission = {
      businessName: 'Test Business',
      categoryValue: 'restaurant',
      address: '123 Main St, Nairobi',
      latitude: -1.2921,
      longitude: 36.8219,
      phoneNumber: '+254712345678',
      contactEmail: 'test@example.com',
      paymentOnchain: true,
      paymentLightning: false,
      additionalInfo: 'Some additional information',
    };

    it('should sanitize all text fields', () => {
      const maliciousSubmission = {
        ...validSubmission,
        businessName: '<script>alert("xss")</script>Test Business',
        address: '123 Main St<img src=x onerror=alert(1)>',
        additionalInfo: '<script>alert("xss")</script>Info',
      };

      const result = sanitizeMerchantSubmission(maliciousSubmission);

      expect(result.businessName).not.toContain('script');
      expect(result.businessName).toContain('Test Business');
      expect(result.address).not.toContain('onerror');
      expect(result.address).toContain('123 Main St');
      expect(result.additionalInfo).not.toContain('script');
    });

    it('should validate email format', () => {
      const invalidEmail = {
        ...validSubmission,
        contactEmail: 'not-an-email',
      };

      const result = sanitizeMerchantSubmission(invalidEmail);
      expect(result.contactEmail).toBe('');
    });

    it('should validate phone number', () => {
      const result = sanitizeMerchantSubmission(validSubmission);
      expect(result.phoneNumber).toBe(validSubmission.phoneNumber);
    });

    it('should preserve boolean values', () => {
      const result = sanitizeMerchantSubmission(validSubmission);
      expect(result.paymentOnchain).toBe(true);
      expect(result.paymentLightning).toBe(false);
    });

    it('should handle missing optional fields', () => {
      const minimalSubmission = {
        businessName: 'Test',
        categoryValue: 'shop',
        address: '123 St',
        latitude: 0,
        longitude: 0,
        phoneNumber: '+254712345678',
        contactEmail: 'test@example.com',
        paymentOnchain: true,
        paymentLightning: false,
      };

      const result = sanitizeMerchantSubmission(minimalSubmission);
      expect(result.additionalInfo).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const result = sanitizeText(longString);
      expect(result.length).toBeLessThanOrEqual(10000);
    });

    it('should handle special characters', () => {
      const input = 'Hello © 2024 • Trademark™';
      const result = sanitizeText(input);
      expect(result).toContain('Hello');
      expect(result).toContain('2024');
    });

    it('should handle Unicode characters', () => {
      const input = 'Hello 世界 مرحبا 🌍';
      const result = sanitizeText(input);
      expect(result).toContain('Hello');
    });
  });
});
