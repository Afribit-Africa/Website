import { NextRequest, NextResponse } from 'next/server';
import { getAllDonors, getDonorStats } from '@/lib/donor-db';
import { handleAPIError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      const stats = await getDonorStats();
      return NextResponse.json({
        success: true,
        stats,
      });
    }

    // Get all named donors (default)
    const donors = await getAllDonors();
    
    return NextResponse.json({
      success: true,
      donors,
      count: donors.length,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
