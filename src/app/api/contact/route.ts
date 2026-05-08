import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { contactFormNotification } from '@/lib/email-templates'

const CONTACT_NOTIFICATION_RECIPIENTS = ['connect@afribit.africa', 'ronnie@afribit.africa']
const TECHNICAL_CONTACT_RECIPIENT = 'eddie@afribit.africa'
const TECHNICAL_INQUIRY_PATTERN =
  /\b(technical|website|web|bug|error|issue|checkout|payment|invoice|integration|api|developer|dev|code)\b/i

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject || 'General Inquiry',
        message: validatedData.message,
        status: 'PENDING',
      },
    })

    const inquiryText = `${validatedData.subject || ''}\n${validatedData.message}`
    const isTechnicalInquiry = TECHNICAL_INQUIRY_PATTERN.test(inquiryText)

    // Send contact notification email
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const emailTemplate = contactFormNotification({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        submittedAt: submission.createdAt,
      });

      await sendEmail({
        to: CONTACT_NOTIFICATION_RECIPIENTS,
        cc: isTechnicalInquiry ? TECHNICAL_CONTACT_RECIPIENT : undefined,
        replyTo: validatedData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      }).catch(error => {
        console.error('Failed to send contact notification email:', error);
        // Don't fail the request if email fails
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.',
      data: { id: submission.id },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
