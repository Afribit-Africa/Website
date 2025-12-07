/**
 * Input Sanitization Utilities
 * Prevents XSS attacks by sanitizing user inputs
 * Server-safe version for API routes
 */

import type { MerchantSubmission } from './types';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface RawMerchantData {
  businessName?: string;
  category?: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  phone?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  additionalInfo?: string;
  latitude?: number | string;
  longitude?: number | string;
  paymentOnchain?: boolean;
  paymentLightning?: boolean;
  paymentLightningContactless?: boolean;
}

interface RawContactData {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface DOMPurifyInstance {
  sanitize: (dirty: string, config?: any) => string;
}

// Use DOMPurify only in browser environment
const isBrowser = typeof window !== 'undefined';
let DOMPurify: DOMPurifyInstance | null = null;

if (isBrowser) {
  // Only import DOMPurify in browser
  import('isomorphic-dompurify').then(module => {
    DOMPurify = module.default;
  });
}

/**
 * Server-safe HTML sanitization without DOM
 * Removes all HTML tags and dangerous characters
 */
function sanitizeHtmlServer(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // Remove all HTML tags
  let clean = dirty.replace(/<[^>]*>/g, '');

  // Encode special characters
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return clean.trim();
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // Use server-safe sanitization on server
  if (!isBrowser || !DOMPurify) {
    return sanitizeHtmlServer(dirty);
  }

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

  // Use server-safe sanitization on server
  if (!isBrowser || !DOMPurify) {
    return sanitizeHtmlServer(input);
  }

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

  // Use server-safe sanitization on server or if DOMPurify not loaded
  if (!isBrowser || !DOMPurify) {
    // Basic URL sanitization without DOMPurify
    return sanitized.replace(/[<>"']/g, '');
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
export function sanitizeMerchantSubmission(data: RawMerchantData): Partial<MerchantSubmission> {
  return {
    businessName: sanitizeText(data.businessName || ''),
    categoryValue: sanitizeText(data.category || ''),
    address: sanitizeText(data.address || ''),
    phoneNumber: sanitizePhone(data.phoneNumber || data.phone || ''),
    contactEmail: sanitizeEmail(data.contactEmail || ''),
    additionalInfo: sanitizeText(data.additionalInfo || ''),
    // Numeric fields - ensure they're valid numbers
    latitude: parseFloat(data.latitude as string) || 0,
    longitude: parseFloat(data.longitude as string) || 0,
    // Boolean fields
    paymentOnchain: Boolean(data.paymentOnchain),
    paymentLightning: Boolean(data.paymentLightning),
  };
}

/**
 * Sanitize contact form data
 */
export function sanitizeContactForm(data: RawContactData): ContactFormData {
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
