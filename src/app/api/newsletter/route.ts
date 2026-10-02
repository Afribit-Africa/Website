import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { newsletterWelcomeEmail } from '@/lib/email-templates'
import { newsletterSchema, captchaSchema } from '@/lib/form-validation'
import { assertFormOrigin, readFormJson, limitFormRequests, verifyFormCaptcha, FormRequestError } from '@/lib/public-form-security'

export async function POST(request: NextRequest) {
  try {
    assertFormOrigin(request)
    await limitFormRequests(request, 'newsletter')
    const body = await readFormJson(request)

    // Validate input
    const validatedData = newsletterSchema.parse(body)
    if (validatedData.website) return NextResponse.json({ success: true, message: 'Thank you for subscribing to Afribit updates.' })
    await verifyFormCaptcha(captchaSchema.parse(body).captchaToken)

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: validatedData.email },
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'ACTIVE') {
        return NextResponse.json({ success: true, message: 'Thank you for subscribing to Afribit updates.' })
      } else {
        // Re-activate if previously unsubscribed
        await prisma.subscriber.update({
          where: { email: validatedData.email },
          data: { status: 'ACTIVE' },
        })

        return NextResponse.json({
          success: true,
          message: 'Thank you for subscribing to Afribit updates.',
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.upsert({
      where: { email: validatedData.email },
      update: {},
      create: {
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
      message: 'Thank you for subscribing to Afribit updates.',
    })
  } catch (error) {
    if (error instanceof FormRequestError) return NextResponse.json({ success: false, error: error.message }, {
      status: error.status, headers: error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : undefined,
    })
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
