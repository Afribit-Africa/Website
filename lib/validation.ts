import { z } from 'zod';

// Donation validation schemas
export const createDonationSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(1, 'Minimum donation is $1')
    .max(1000000, 'Maximum donation is $1,000,000'),
  tier: z.enum([
    'custom',
    'friend',
    'business',
    'education',
    'equipment',
    'upcycle',
    'waste',
    'supporter',
    'advocate',
    'champion'
  ], {
    message: 'Invalid donation tier'
  }),
  donationType: z.enum(['anonymous', 'named'], {
    message: 'Donation type must be anonymous or named'
  }),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    // If named donation, require name and email
    if (data.donationType === 'named') {
      return data.name && data.name.length >= 2 && data.email && z.string().email().safeParse(data.email).success;
    }
    return true;
  },
  {
    message: 'Named donations require a valid name and email',
    path: ['donationType'],
  }
);

export const sendReceiptSchema = z.object({
  invoiceId: z.string()
    .min(1, 'Invoice ID is required')
    .max(255, 'Invoice ID too long'),
  transactionId: z.string()
    .max(255, 'Transaction ID too long')
    .optional(),
});

// Email validation schema
export const testEmailSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
});

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
});

// Merchant invoice validation
export const merchantInvoiceSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(0.01, 'Minimum amount is $0.01')
    .max(1000000, 'Maximum amount is $1,000,000'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  merchantId: z.string()
    .min(1, 'Merchant ID is required')
    .max(100, 'Merchant ID too long')
    .optional(),
});

// Helper function to format Zod errors
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((err) => err.message).join(', ');
}

// Merchant submission validation
export const merchantSubmissionSchema = z.object({
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  categoryValue: z.string()
    .min(1, 'Category is required'),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  latitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  phoneNumber: z.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters'),
  contactEmail: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  paymentOnchain: z.boolean(),
  paymentLightning: z.boolean(),
  additionalInfo: z.string()
    .max(500, 'Additional info must be less than 500 characters')
    .optional(),
}).refine(
  (data) => data.paymentOnchain || data.paymentLightning,
  {
    message: 'At least one payment method must be selected',
    path: ['paymentOnchain'],
  }
);

// Edit request validation
export const editRequestSchema = z.object({
  merchantId: z.string()
    .min(1, 'Merchant ID is required'),
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .optional(),
  category: z.string()
    .min(1, 'Category is required')
    .optional(),
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters')
    .optional(),
  phoneNumber: z.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
  latitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .optional(),
  longitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .optional(),
  blinkAddress: z.string()
    .max(100, 'Blink address must be less than 100 characters')
    .optional(),
  submitterEmail: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  changeReason: z.string()
    .min(10, 'Please explain why these changes are needed (minimum 10 characters)')
    .max(500, 'Reason must be less than 500 characters'),
});

// Admin rejection validation
export const adminRejectionSchema = z.object({
  rejectionReason: z.string()
    .min(20, 'Rejection reason must be at least 20 characters')
    .max(1000, 'Rejection reason must be less than 1000 characters'),
  adminNotes: z.string()
    .max(500, 'Admin notes must be less than 500 characters')
    .optional(),
});

// Type exports for TypeScript
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type SendReceiptInput = z.infer<typeof sendReceiptSchema>;
export type TestEmailInput = z.infer<typeof testEmailSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type MerchantInvoiceInput = z.infer<typeof merchantInvoiceSchema>;
export type MerchantSubmissionInput = z.infer<typeof merchantSubmissionSchema>;
export type EditRequestInput = z.infer<typeof editRequestSchema>;
export type AdminRejectionInput = z.infer<typeof adminRejectionSchema>;
