import { validatePortfolioKey, getPortfolioCorsHeaders, handleCorsPreflightRequest } from '@/lib/portfolio/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/portfolio/rate-limit';

export async function OPTIONS() {
  return handleCorsPreflightRequest();
}

export async function GET(req: Request) {
  // Check authentication
  const authError = validatePortfolioKey(req);
  if (authError) return authError;

  // Check rate limit
  const rateLimitError = checkRateLimit(req);
  if (rateLimitError) return rateLimitError;

  // Note: These would be actual screenshot URLs stored in public folder or CDN
  // For now, providing structure that can be populated later
  const screenshots = [
    {
      id: "home-hero",
      title: "Homepage Hero Section",
      description: "Landing page with mission statement and call-to-action",
      url: "/portfolio/screenshots/home-hero.png",
      category: "landing",
      device: "desktop",
      width: 1920,
      height: 1080
    },
    {
      id: "merchant-map-desktop",
      title: "Interactive Merchant Map (Desktop)",
      description: "OpenStreetMap integration with merchant markers",
      url: "/portfolio/screenshots/merchant-map-desktop.png",
      category: "merchant-directory",
      device: "desktop",
      width: 1920,
      height: 1080
    },
    {
      id: "merchant-map-mobile",
      title: "Interactive Merchant Map (Mobile)",
      description: "Touch-optimized map interface for mobile devices",
      url: "/portfolio/screenshots/merchant-map-mobile.png",
      category: "merchant-directory",
      device: "mobile",
      width: 375,
      height: 812
    },
    {
      id: "verifier-dashboard-mobile",
      title: "Verifier Dashboard (Mobile)",
      description: "Mobile-first verification interface with proximity detection",
      url: "/portfolio/screenshots/verifier-dashboard-mobile.png",
      category: "verifier-system",
      device: "mobile",
      width: 375,
      height: 812
    },
    {
      id: "verifier-form-mobile",
      title: "Verification Form (Mobile)",
      description: "On-ground verification checklist with photo upload",
      url: "/portfolio/screenshots/verifier-form-mobile.png",
      category: "verifier-system",
      device: "mobile",
      width: 375,
      height: 812
    },
    {
      id: "admin-dashboard",
      title: "Admin Dashboard",
      description: "Comprehensive control panel for platform management",
      url: "/portfolio/screenshots/admin-dashboard.png",
      category: "admin",
      device: "desktop",
      width: 1920,
      height: 1080
    },
    {
      id: "merchant-registration",
      title: "Merchant Registration Form",
      description: "Public form for merchant submissions with geolocation",
      url: "/portfolio/screenshots/merchant-registration.png",
      category: "merchant-directory",
      device: "desktop",
      width: 1920,
      height: 1080
    },
    {
      id: "donation-page",
      title: "Bitcoin Donation Page",
      description: "BTCPay Server integration for Lightning/On-chain payments",
      url: "/portfolio/screenshots/donation-page.png",
      category: "payments",
      device: "desktop",
      width: 1920,
      height: 1080
    },
    {
      id: "merchant-profile",
      title: "Merchant Profile Page",
      description: "Detailed merchant information with map and contact details",
      url: "/portfolio/screenshots/merchant-profile.png",
      category: "merchant-directory",
      device: "desktop",
      width: 1920,
      height: 1080
    },
    {
      id: "donors-page",
      title: "Public Donors Wall",
      description: "Recognition page for Bitcoin donors with statistics",
      url: "/portfolio/screenshots/donors-page.png",
      category: "payments",
      device: "desktop",
      width: 1920,
      height: 1080
    }
  ];

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const device = searchParams.get('device');

  let filteredScreenshots = screenshots;

  if (category) {
    filteredScreenshots = filteredScreenshots.filter(s => s.category === category);
  }

  if (device) {
    filteredScreenshots = filteredScreenshots.filter(s => s.device === device);
  }

  return Response.json(
    {
      success: true,
      screenshots: filteredScreenshots,
      count: filteredScreenshots.length,
      categories: [...new Set(screenshots.map(s => s.category))],
      devices: [...new Set(screenshots.map(s => s.device))],
      note: "Screenshot URLs point to public assets. Actual screenshots should be captured and placed in /public/portfolio/screenshots/",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        ...getPortfolioCorsHeaders(),
        ...getRateLimitHeaders(req),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800', // Cache for 24 hours
      },
    }
  );
}
