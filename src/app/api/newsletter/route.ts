import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { newsletterWelcomeEmail } from '@/lib/email-templates'

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = newsletterSchema.parse(body)

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: validatedData.email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'ACTIVE') {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed to our newsletter.' },
          { status: 400 }
        )
      } else {
        // Re-activate if previously unsubscribed
        await prisma.subscriber.update({
          where: { email: validatedData.email },
          data: { status: 'ACTIVE' },
        })

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email: validatedData.email,
        name: validatedData.name || null,
        status: 'ACTIVE',
      },
    })

    // Send welcome email
    const emailTemplate = newsletterWelcomeEmail({
      name: validatedData.name,
    });

    await sendEmail({
      to: subscriber.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    }).catch(error => {
      console.error('Failed to send welcome email:', error);
      // Don't fail the request if email fails
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for a confirmation email.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
