import { NextRequest, NextResponse } from 'next/server';
import { getAllDonors, getDonorStats } from '@/lib/donor-db';
import { handleAPIError } from '@/lib/api-helpers';
import { getSettledInvoices } from '@/lib/btcpay-client';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const source = searchParams.get('source') || 'btcpay'; // Default to BTCPay

    if (type === 'stats') {
      if (source === 'btcpay') {
        // Fetch stats from BTCPay Server
        const invoices = await getSettledInvoices(500); // Get more for accurate stats

        // Filter for perks donors
        const perksDonors = invoices.filter((inv: any) => {
          const donationType = inv.metadata?.donationType || inv.metadata?.donation_type;
          return donationType === 'named' || donationType === 'perks';
        });

        const totalAmount = perksDonors.reduce((sum: number, inv: any) => {
          return sum + parseFloat(inv.amount || '0');
        }, 0);

        const stats = {
          total_donations: perksDonors.length,
          total_amount: totalAmount,
          named_donations: perksDonors.length,
          anonymous_donations: invoices.length - perksDonors.length,
        };

        return NextResponse.json({
          success: true,
          stats,
        });
      } else {
        // Fallback to database
        const stats = await getDonorStats();
        return NextResponse.json({
          success: true,
          stats,
        });
      }
    }

    // Get donors list
    if (source === 'btcpay') {
      // Fetch from BTCPay Server
      const invoices = await getSettledInvoices(100);

      // Filter and transform invoices to donor format
      // Only include donors who chose "perks" (named) donation type
      const donors = invoices
        .filter((inv: any) => {
          const donationType = inv.metadata?.donationType || inv.metadata?.donation_type;
          return donationType === 'named' || donationType === 'perks';
        })
        .map((inv: any, index: number) => ({
          id: index + 1,
          invoice_id: inv.id,
          name: inv.metadata?.name || inv.metadata?.buyerName || 'Anonymous Supporter',
          email: inv.metadata?.email || inv.metadata?.buyerEmail || '',
          amount: parseFloat(inv.amount || '0'),
          tier: inv.metadata?.tier || 'supporter',
          donation_type: inv.metadata?.donationType || inv.metadata?.donation_type || 'named',
          created_at: new Date(inv.createdTime * 1000).toISOString(),
        }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return NextResponse.json({
        success: true,
        donors,
        count: donors.length,
        source: 'btcpay',
      });
    } else {
      // Fallback to database
      const donors = await getAllDonors();

      return NextResponse.json({
        success: true,
        donors,
        count: donors.length,
        source: 'database',
      });
    }
  } catch (error) {
    logger.error('Error in donors API:', error);
    return handleAPIError(error);
  }
}
