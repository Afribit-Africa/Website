import { z } from 'zod'

const singleLine = (max: number) => z.string().trim().max(max).refine(value => !/[\r\n]/.test(value), 'Use a single line')
const optionalText = (max: number, min = 0) => singleLine(max).refine(value => !value || value.length >= min, `Use at least ${min} characters`).optional()

export const contactSchema = z.object({
  name: singleLine(100).pipe(z.string().min(2, 'Name must be at least 2 characters')),
  email: singleLine(254).pipe(z.email('Invalid email address')).transform(value => value.toLowerCase()),
  phone: optionalText(40),
  subject: optionalText(160, 3),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  website: z.string().max(200).optional(),
})

export const newsletterSchema = z.object({
  email: singleLine(254).pipe(z.email('Invalid email address')).transform(value => value.toLowerCase()),
  name: optionalText(100, 2),
  website: z.string().max(200).optional(),
})

export const captchaSchema = z.object({ captchaToken: z.string().max(4096).optional() })
