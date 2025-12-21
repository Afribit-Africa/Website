import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    console.log('🔍 Testing Neon PostgreSQL connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    // Test 1: Simple query
    const result = await executeQuery<any[]>('SELECT 1 as test, NOW() as server_time');
    const duration = Date.now() - startTime;

    console.log('✅ Database connected successfully');
    console.log('Response time:', duration, 'ms');

    // Test 2: Check merchant table
    const tableCheck = await executeQuery<any[]>(`
      SELECT COUNT(*) as count
      FROM merchant_submissions
      WHERE status = 'published'
    `);

    // Test 3: Check all tables exist
    const tables = await executeQuery<any[]>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    return NextResponse.json({
      success: true,
      message: 'Neon PostgreSQL connection successful',
      database: 'Neon PostgreSQL',
      duration: `${duration}ms`,
      test_query: result[0],
      published_merchants: tableCheck[0]?.count || 0,
      tables: tables.map((t: any) => t.table_name),
      server_region: process.env.VERCEL_REGION || 'local',
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
    } : String(error);

    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: errorDetails,
      duration: `${duration}ms`,
      server_region: process.env.VERCEL_REGION || 'local',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
