import { z } from 'zod';

// Donation validation schemas
export const createDonationSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(1, 'Minimum donation is $1')
    .max(1000000, 'Maximum donation is $1,000,000'),
  tier: z.enum(['supporter', 'advocate', 'champion', 'friend', 'business', 'education', 'custom'], {
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

// Type exports for TypeScript
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type SendReceiptInput = z.infer<typeof sendReceiptSchema>;
export type TestEmailInput = z.infer<typeof testEmailSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type MerchantInvoiceInput = z.infer<typeof merchantInvoiceSchema>;
