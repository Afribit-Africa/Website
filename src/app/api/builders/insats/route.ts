import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { INSATS_REPORT_URL } from '@/lib/insats'
import { parseInsatsReport } from '@/lib/insats-report'

export const runtime = 'nodejs'

const getReport = unstable_cache(
  async () => {
    // Fixed public source: no cookies, user-supplied URLs, or private research data.
    const response = await fetch(INSATS_REPORT_URL, {
      headers: { Accept: 'text/html' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
    })
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
      throw new Error('Insats public report unavailable')
    }
    const html = await response.text()
    if (html.length > 1_000_000) throw new Error('Unexpected report size')
    return parseInsatsReport(html)
  },
  ['builders-insats-report-v1'],
  { revalidate: 300 },
)

export async function GET() {
  try {
    return NextResponse.json(
      { success: true, data: await getReport() },
      {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300' },
      },
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'The Insats public report is temporarily unavailable.' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  }
}
