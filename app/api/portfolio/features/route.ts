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

  const features = [
    {
      id: "merchant-directory",
      name: "Merchant Directory System",
      category: "Core Platform",
      description: "Interactive map-based merchant discovery with real-time data synchronization and category filtering",
      technologies: ["Next.js", "OpenStreetMap", "MySQL", "Geolocation API", "React Server Components"],
      highlights: [
        "Real-time location-based search within custom radius",
        "20+ merchant categories with filtering",
        "Integrated with OpenStreetMap for global visibility",
        "Mobile-optimized responsive interface",
        "Dynamic merchant profiles with business hours",
        "CSV import/export for bulk operations"
      ],
      complexity: "high",
      status: "production",
      impact: "Enables Bitcoin adoption through merchant discovery"
    },
    {
      id: "verifier-system",
      name: "Field Verification System",
      category: "Quality Assurance",
      description: "Mobile-first verification tool for on-ground merchant validation with proximity detection",
      technologies: ["React", "Geolocation API", "Permissions API", "TypeScript", "Mobile-First Design"],
      highlights: [
        "20-meter proximity detection for field verification",
        "Cross-browser geolocation handling (iOS, Android, Desktop)",
        "Photo evidence collection with multi-upload",
        "Platform-specific UX optimization",
        "Real-time distance calculation",
        "Verification history tracking"
      ],
      complexity: "high",
      status: "production",
      impact: "Ensures merchant data quality and trust"
    },
    {
      id: "btcpay-integration",
      name: "Bitcoin Payment Processing",
      category: "Payments",
      description: "Full BTCPay Server integration for Lightning and on-chain Bitcoin donations",
      technologies: ["BTCPay Server API", "Lightning Network", "Webhooks", "Next.js API Routes"],
      highlights: [
        "Lightning Network support for instant payments",
        "On-chain Bitcoin payments",
        "Real-time invoice generation",
        "Payment status polling and webhooks",
        "Automated email receipts",
        "Public donor wall with privacy options"
      ],
      complexity: "high",
      status: "production",
      impact: "Facilitates Bitcoin donations for social impact"
    },
    {
      id: "authentication-system",
      name: "Multi-Provider Authentication",
      category: "Security",
      description: "Comprehensive auth system with role-based access control and multiple providers",
      technologies: ["NextAuth.js", "Google OAuth", "bcryptjs", "JWT", "MySQL"],
      highlights: [
        "Google OAuth for social login",
        "Credentials-based authentication",
        "Role-based routing (Admin/Verifier)",
        "Email allowlist for access control",
        "Password reset with email tokens",
        "Session management with secure cookies"
      ],
      complexity: "medium",
      status: "production",
      impact: "Secure access control for platform operations"
    },
    {
      id: "osm-publishing",
      name: "OpenStreetMap Integration",
      category: "Mapping",
      description: "Two-way sync with OpenStreetMap for global merchant visibility",
      technologies: ["OSM API v0.6", "OAuth 1.0a", "XML Processing", "Node.js"],
      highlights: [
        "Automated merchant publishing to OSM",
        "Bitcoin payment tag formatting",
        "OAuth authentication with OSM",
        "Coordinate validation",
        "Update existing OSM nodes",
        "Changeset management"
      ],
      complexity: "medium",
      status: "production",
      impact: "Global visibility for Bitcoin merchants"
    },
    {
      id: "mobile-responsive",
      name: "Mobile-First Responsive Design",
      category: "UI/UX",
      description: "Fully responsive interface optimized for mobile devices across all features",
      technologies: ["TailwindCSS", "Responsive Design", "Touch Optimization", "PWA"],
      highlights: [
        "Touch-optimized button sizes (44px minimum)",
        "Adaptive typography across breakpoints",
        "Platform-specific UI adaptations",
        "Progressive Web App support",
        "Mobile geolocation optimization",
        "Offline-first capabilities"
      ],
      complexity: "medium",
      status: "production",
      impact: "Accessible on all devices for users in Kenya"
    },
    {
      id: "admin-dashboard",
      name: "Admin Management Dashboard",
      category: "Administration",
      description: "Comprehensive control panel for merchant and user management",
      technologies: ["Next.js", "React Server Components", "MySQL", "File Handling"],
      highlights: [
        "Merchant CRUD operations",
        "Submission approval workflow",
        "User management (admin/verifier roles)",
        "CSV bulk import/export",
        "Analytics and reporting",
        "Email notification management"
      ],
      complexity: "medium",
      status: "production",
      impact: "Efficient platform administration"
    },
    {
      id: "email-automation",
      name: "Email Notification System",
      category: "Communication",
      description: "Automated transactional emails for all platform activities",
      technologies: ["Resend API", "React Email", "Template System"],
      highlights: [
        "Merchant submission confirmations",
        "Approval/rejection notifications",
        "Donation receipts",
        "Password reset emails",
        "Custom email templates",
        "Delivery tracking"
      ],
      complexity: "low",
      status: "production",
      impact: "Keeps users informed of platform activities"
    }
  ];

  return Response.json(
    {
      success: true,
      features,
      count: features.length,
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
