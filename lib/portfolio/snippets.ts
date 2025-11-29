/**
 * Code snippets library for portfolio showcase
 * Returns sanitized code examples for specific features
 */

export interface CodeSnippet {
  title: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
}

export const FEATURE_SNIPPETS: Record<string, CodeSnippet[]> = {
  geolocation: [
    {
      title: "Advanced Permission Check with Permissions API",
      language: "typescript",
      description: "Pre-check geolocation permissions before requesting location to provide better UX",
      code: `const checkLocationPermission = async () => {
  if ('permissions' in navigator) {
    try {
      const result = await navigator.permissions.query({
        name: 'geolocation' as PermissionName
      });

      // Listen for permission changes
      result.addEventListener('change', () => {
        if (result.state === 'granted') {
          requestLocation();
        }
      });

      return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      // Permissions API not supported, fallback to direct request
      return 'unknown';
    }
  }
  return 'unknown';
};`,
      tags: ["geolocation", "permissions-api", "browser-compatibility", "ux"]
    },
    {
      title: "Platform-Specific Timeout Handling",
      language: "typescript",
      description: "Device-specific timeout values for reliable location access across iOS, Android, and desktop",
      code: `const getUserLocation = async () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: isIOS ? 30000 : (isAndroid ? 15000 : 10000),
      maximumAge: isMobile ? 5000 : 0,
    });
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
};`,
      tags: ["mobile-optimization", "geolocation", "cross-platform", "ios", "android"]
    },
    {
      title: "Haversine Distance Calculation",
      language: "typescript",
      description: "Calculate distance between two GPS coordinates in meters",
      code: `function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
}`,
      tags: ["geolocation", "distance-calculation", "haversine", "mathematics"]
    }
  ],

  "btcpay-integration": [
    {
      title: "Create BTCPay Invoice",
      language: "typescript",
      description: "Generate a Bitcoin payment invoice with Lightning support",
      code: `async function createBTCPayInvoice(amount: number, email: string) {
  const response = await fetch(\`\${BTCPAY_SERVER_URL}/api/v1/stores/\${STORE_ID}/invoices\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`token \${BTCPAY_API_KEY}\`,
    },
    body: JSON.stringify({
      amount: amount,
      currency: 'USD',
      checkout: {
        paymentMethods: ['BTC-LightningNetwork', 'BTC'],
        redirectURL: \`\${APP_URL}/donate/success\`,
      },
      metadata: {
        buyerEmail: email,
        itemDesc: 'Donation to Afribit',
      },
    }),
  });

  const invoice = await response.json();
  return invoice;
}`,
      tags: ["btcpay", "bitcoin", "lightning-network", "payments"]
    },
    {
      title: "Payment Status Polling",
      language: "typescript",
      description: "Poll BTCPay Server for payment confirmation",
      code: `async function pollPaymentStatus(invoiceId: string) {
  const maxAttempts = 60; // Poll for 5 minutes
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(
          \`\${BTCPAY_SERVER_URL}/api/v1/stores/\${STORE_ID}/invoices/\${invoiceId}\`,
          {
            headers: {
              'Authorization': \`token \${BTCPAY_API_KEY}\`,
            },
          }
        );

        const invoice = await response.json();

        if (invoice.status === 'Settled' || invoice.status === 'Processing') {
          clearInterval(interval);
          resolve(invoice);
        } else if (invoice.status === 'Expired' || attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('Payment timeout or expired'));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 5000); // Check every 5 seconds
  });
}`,
      tags: ["btcpay", "polling", "async", "payment-confirmation"]
    }
  ],

  "mobile-responsive": [
    {
      title: "Mobile-First Button Sizing",
      language: "typescript",
      description: "Touch-optimized button sizing with Tailwind CSS responsive utilities",
      code: `<button
  className="
    px-3 py-1.5              // Mobile: compact
    md:px-4 md:py-2          // Tablet: medium
    lg:px-6 lg:py-3          // Desktop: large
    text-xs md:text-sm lg:text-base
    bg-bitcoin hover:bg-bitcoin/90
    text-white rounded-lg
    font-medium transition-colors
    min-h-[44px]             // iOS minimum touch target
  "
>
  {/* Mobile: shorter text, Desktop: full text */}
  <span className="hidden sm:inline">Verify Now</span>
  <span className="sm:hidden">Verify</span>
</button>`,
      tags: ["mobile-first", "responsive-design", "tailwindcss", "accessibility"]
    },
    {
      title: "Responsive Card Layout",
      language: "typescript",
      description: "Adaptive card spacing and typography for all screen sizes",
      code: `<div className="
  p-3 md:p-4 lg:p-6           // Responsive padding
  space-y-2 md:space-y-3      // Responsive spacing
  rounded-lg
  bg-[#1A1A1A] border border-white/10
">
  <h3 className="
    text-base md:text-lg lg:text-xl
    font-semibold text-white
  ">
    {title}
  </h3>

  <p className="
    text-xs md:text-sm
    text-gray-400
    line-clamp-2 md:line-clamp-3
  ">
    {description}
  </p>
</div>`,
      tags: ["responsive-design", "tailwindcss", "mobile-first", "cards"]
    }
  ],

  "osm-integration": [
    {
      title: "Publish Merchant to OpenStreetMap",
      language: "typescript",
      description: "Create a node on OpenStreetMap with Bitcoin payment tags",
      code: `async function publishToOSM(merchant: Merchant) {
  const nodeXml = \`<?xml version="1.0" encoding="UTF-8"?>
  <osm version="0.6">
    <node lat="\${merchant.latitude}" lon="\${merchant.longitude}">
      <tag k="name" v="\${merchant.businessName}" />
      <tag k="amenity" v="cafe" />
      <tag k="payment:bitcoin" v="yes" />
      <tag k="payment:lightning" v="yes" />
      <tag k="currency:XBT" v="yes" />
      <tag k="contact:email" v="\${merchant.email}" />
    </node>
  </osm>\`;

  const response = await fetch(\`\${OSM_API_URL}/api/0.6/node/create\`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': \`OAuth \${osmToken}\`,
    },
    body: nodeXml,
  });

  const nodeId = await response.text();
  return nodeId;
}`,
      tags: ["openstreetmap", "osm", "xml", "bitcoin-tags"]
    }
  ],

  "auth-system": [
    {
      title: "NextAuth with Multiple Providers",
      language: "typescript",
      description: "Configure Google OAuth and credentials-based authentication",
      code: `export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await executeQuery(
          'SELECT * FROM admin_users WHERE email = ?',
          [credentials?.email]
        );

        if (!user || !await bcrypt.compare(credentials?.password, user.password_hash)) {
          return null;
        }

        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Role-based access control
      const isAdmin = ALLOWED_ADMIN_EMAILS.includes(user.email);
      const isVerifier = ALLOWED_VERIFIER_EMAILS.includes(user.email);

      return isAdmin || isVerifier;
    },
    async redirect({ url, baseUrl }) {
      // Role-based routing
      if (user.role === 'verifier') {
        return \`\${baseUrl}/verifier/dashboard\`;
      }
      return \`\${baseUrl}/admin/dashboard\`;
    }
  }
};`,
      tags: ["nextauth", "authentication", "oauth", "multi-provider"]
    }
  ],

  "verifier-proximity": [
    {
      title: "Radius-Based Merchant Filtering",
      language: "typescript",
      description: "SQL query to find merchants within specified radius using Haversine formula",
      code: `async function getNearbyMerchants(lat: number, lng: number, radiusMeters: number = 20) {
  const query = \`
    SELECT
      *,
      (
        6371000 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )
      ) AS distance
    FROM merchant_submissions
    WHERE verification_status = 'pending'
    HAVING distance <= ?
    ORDER BY distance ASC
  \`;

  const merchants = await executeQuery(query, [lat, lng, lat, radiusMeters]);
  return merchants;
}`,
      tags: ["geolocation", "sql", "haversine", "proximity-detection"]
    }
  ],

  "email-automation": [
    {
      title: "Send Email with Resend API",
      language: "typescript",
      description: "Send transactional email using Resend with custom template",
      code: `import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMerchantApprovalEmail(merchant: Merchant) {
  const { data, error } = await resend.emails.send({
    from: 'Afribit <noreply@afribit.co.ke>',
    to: merchant.email,
    subject: 'Your Merchant Application is Approved! 🎉',
    html: \`
      <h2>Congratulations!</h2>
      <p>Your business <strong>\${merchant.businessName}</strong> has been approved.</p>
      <p>You will appear on our merchant map within 24 hours.</p>
      <a href="https://afribit.co.ke/merchants/\${merchant.slug}">View Your Profile</a>
    \`,
  });

  if (error) {
    throw new Error(\`Failed to send email: \${error.message}\`);
  }

  return data;
}`,
      tags: ["email", "resend", "notifications", "transactional-email"]
    }
  ]
};

export function getSnippetsForFeature(feature: string): CodeSnippet[] | null {
  return FEATURE_SNIPPETS[feature] || null;
}

export function getAllFeatures(): string[] {
  return Object.keys(FEATURE_SNIPPETS);
}
