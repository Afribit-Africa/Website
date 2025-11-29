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

  const stack = {
    frontend: [
      {
        name: "Next.js 16",
        category: "Framework",
        purpose: "App Router, Server Components, API Routes, SSR/SSG",
        version: "16.0.0"
      },
      {
        name: "React 19",
        category: "Library",
        purpose: "UI Components, Hooks, State Management",
        version: "19.x"
      },
      {
        name: "TypeScript",
        category: "Language",
        purpose: "Type safety, Developer experience, Code quality",
        version: "5.x"
      },
      {
        name: "TailwindCSS",
        category: "Styling",
        purpose: "Utility-first CSS, Responsive design, Custom theming",
        version: "3.x"
      },
      {
        name: "Lucide React",
        category: "Icons",
        purpose: "Consistent icon system, 1000+ icons",
        version: "latest"
      }
    ],
    backend: [
      {
        name: "Next.js API Routes",
        category: "Backend",
        purpose: "Serverless functions, RESTful APIs",
        version: "16.0.0"
      },
      {
        name: "MySQL",
        category: "Database",
        purpose: "Relational data storage, ACID transactions",
        version: "8.x"
      },
      {
        name: "NextAuth.js",
        category: "Authentication",
        purpose: "OAuth, Credentials, JWT, Session management",
        version: "4.x"
      },
      {
        name: "bcryptjs",
        category: "Security",
        purpose: "Password hashing, Secure authentication",
        version: "2.x"
      }
    ],
    integrations: [
      {
        name: "BTCPay Server",
        category: "Payments",
        purpose: "Bitcoin/Lightning payments, Invoice generation",
        version: "API v1"
      },
      {
        name: "OpenStreetMap",
        category: "Mapping",
        purpose: "Merchant publishing, Map display, Geolocation",
        version: "API 0.6"
      },
      {
        name: "Resend",
        category: "Email",
        purpose: "Transactional emails, Email templates",
        version: "API v1"
      }
    ],
    infrastructure: [
      {
        name: "Vercel",
        category: "Hosting",
        purpose: "Edge deployment, Serverless functions, CDN",
        version: "Platform"
      },
      {
        name: "GitHub",
        category: "Version Control",
        purpose: "Code repository, CI/CD, Collaboration",
        version: "Platform"
      }
    ],
    apis: [
      {
        name: "Geolocation API",
        category: "Browser API",
        purpose: "User location, Proximity detection, GPS coordinates",
        version: "HTML5"
      },
      {
        name: "Permissions API",
        category: "Browser API",
        purpose: "Permission state management, UX optimization",
        version: "HTML5"
      },
      {
        name: "File API",
        category: "Browser API",
        purpose: "Photo uploads, CSV import/export",
        version: "HTML5"
      }
    ],
    devTools: [
      {
        name: "ESLint",
        category: "Linting",
        purpose: "Code quality, Best practices",
        version: "8.x"
      },
      {
        name: "Prettier",
        category: "Formatting",
        purpose: "Code formatting, Consistency",
        version: "3.x"
      },
      {
        name: "Git",
        category: "Version Control",
        purpose: "Source control, Collaboration",
        version: "2.x"
      }
    ]
  };

  return Response.json(
    {
      success: true,
      stack,
      summary: {
        totalTechnologies: Object.values(stack).reduce((sum, category) => sum + category.length, 0),
        categories: Object.keys(stack),
      },
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
