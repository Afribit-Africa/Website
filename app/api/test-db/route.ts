import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Testing database connection from Vercel...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Test 1: Simple query
    const result = await executeQuery('SELECT 1 as test, NOW() as server_time');
    const duration = Date.now() - startTime;
    
    console.log('✅ Database connected successfully');
    console.log('Response time:', duration, 'ms');
    
    // Test 2: Check merchant table
    const tableCheck = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM merchant_submissions 
      WHERE status = 'published'
    `);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      duration: `${duration}ms`,
      test_query: result,
      published_merchants: tableCheck,
      server_region: process.env.VERCEL_REGION || 'unknown',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Database connection failed');
    console.error('Error:', error);
    
    const errorDetails = error instanceof Error ? {
      message: error.message,
      name: error.name,
      code: (error as any).code,
      errno: (error as any).errno,
    } : String(error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: errorDetails,
      duration: `${duration}ms`,
      server_region: process.env.VERCEL_REGION || 'unknown',
      timestamp: new Date().toISOString(),
      troubleshooting: {
        message: 'Connection timeout - database server may be blocking Vercel IPs',
        actions: [
          'Check cPanel Remote MySQL settings',
          'Whitelist Vercel IPs: 76.76.21.0/24 and 76.223.0.0/20',
          'Verify port 3306 is open',
          'Check if database accepts remote connections'
        ]
      }
    }, { status: 500 });
  }
}
