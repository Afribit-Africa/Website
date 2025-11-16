import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * Test Sentry Integration
 * This endpoint intentionally throws an error to verify Sentry is capturing errors correctly
 * Visit: http://localhost:3000/api/test-sentry
 */
export async function GET() {
  try {
    // Intentionally throw an error
    throw new Error('🎉 Sentry test error - If you see this in Sentry, everything is working!');
  } catch (error) {
    // Capture the error in Sentry
    Sentry.captureException(error, {
      tags: {
        test: 'true',
        endpoint: 'test-sentry'
      },
      extra: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Error sent to Sentry! Check your dashboard at https://sentry.io',
      instructions: [
        '1. Go to https://sentry.io',
        '2. Click on your "afribit" project',
        '3. Click "Issues" in the left sidebar',
        '4. You should see the test error within 30 seconds',
        '5. Click on it to see the full stack trace'
      ]
    }, { status: 200 });
  }
}
