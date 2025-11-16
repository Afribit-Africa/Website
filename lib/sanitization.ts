/**
 * Input Sanitization Utilities
 * Prevents XSS attacks by sanitizing user inputs
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text input
 * Strips all HTML tags
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize email input
 * Basic validation and sanitization
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';

  // Remove whitespace and convert to lowercase
  const sanitized = email.trim().toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitize URL input
 * Ensures URL is safe (http/https only)
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  const sanitized = url.trim();

  // Only allow http and https protocols
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return '';
  }

  // Use DOMPurify to sanitize the URL
  return DOMPurify.sanitize(sanitized, { ALLOWED_URI_REGEXP: /^https?:/ });
}

/**
 * Sanitize phone number input
 * Removes non-numeric characters except + and spaces
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  // Remove all characters except digits, +, spaces, and hyphens
  const cleaned = phone.replace(/[^\d+\s-]/g, '').trim();

  // Reject if too short (less than 7 digits)
  const digitCount = cleaned.replace(/[^\d]/g, '').length;
  if (digitCount < 7) return '';

  return cleaned;
}

/**
 * Sanitize merchant submission data
 * Comprehensive sanitization for merchant registration
 */
export function sanitizeMerchantSubmission(data: any): any {
  return {
    businessName: sanitizeText(data.businessName || ''),
    category: sanitizeText(data.category || ''),
    description: sanitizeHtml(data.description || ''),
    address: sanitizeText(data.address || ''),
    phoneNumber: sanitizePhone(data.phoneNumber || data.phone || ''),
    website: data.website ? sanitizeUrl(data.website) : '',
    contactName: sanitizeText(data.contactName || ''),
    contactEmail: sanitizeEmail(data.contactEmail || ''),
    additionalInfo: sanitizeText(data.additionalInfo || ''),
    // Numeric fields - ensure they're valid numbers
    latitude: parseFloat(data.latitude) || 0,
    longitude: parseFloat(data.longitude) || 0,
    // Boolean fields
    paymentOnchain: Boolean(data.paymentOnchain),
    paymentLightning: Boolean(data.paymentLightning),
    paymentLightningContactless: Boolean(data.paymentLightningContactless),
  };
}

/**
 * Sanitize contact form data
 */
export function sanitizeContactForm(data: any): any {
  return {
    name: sanitizeText(data.name || ''),
    email: sanitizeEmail(data.email || ''),
    subject: sanitizeText(data.subject || ''),
    message: sanitizeText(data.message || ''),
  };
}

/**
 * Generate CSRF token
 * For form protection
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Server-side
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;
  return token === sessionToken;
}
