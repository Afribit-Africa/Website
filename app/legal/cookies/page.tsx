import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | Afribit Africa',
  description: 'Information about how Afribit Africa uses cookies and similar tracking technologies',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">Cookie Policy</span>
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: November 19, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-bitcoin max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies are small text files placed on your device when you visit our website. They help us provide, secure, and improve our services by remembering your preferences, settings, and activity.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Similar technologies include web beacons, local storage, and session tokens.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Essential Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Purpose:</strong> Required for core functionality and security.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong>Session Management:</strong> Keeps you logged in during admin/verifier sessions</li>
                  <li><strong>Authentication Tokens:</strong> Verifies your identity (NextAuth.js)</li>
                  <li><strong>Security:</strong> CSRF protection, rate limiting</li>
                  <li><strong>Form Data:</strong> Preserves registration form progress</li>
                </ul>
              </div>
              <p className="text-gray-300 text-sm italic">These cookies cannot be disabled as they're necessary for the website to function.</p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Preference Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Purpose:</strong> Remember your choices and settings.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong>Language Preferences:</strong> Selected language (English/Swahili)</li>
                  <li><strong>Map Settings:</strong> Last viewed location, zoom level</li>
                  <li><strong>Theme:</strong> Display preferences (if applicable)</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Analytics Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Purpose:</strong> Understand how visitors use our site to improve services.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong>Page Views:</strong> Which pages are most visited</li>
                  <li><strong>User Flow:</strong> How users navigate the site</li>
                  <li><strong>Performance:</strong> Page load times, errors</li>
                  <li><strong>Device Info:</strong> Browser, OS, screen size (anonymous)</li>
                </ul>
              </div>
              <p className="text-gray-300 text-sm">
                We may use Google Analytics or similar services with IP anonymization enabled.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.4 Third-Party Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Purpose:</strong> Services provided by external platforms.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong>Google OAuth:</strong> Authentication via Google sign-in</li>
                  <li><strong>OpenStreetMap:</strong> Interactive maps</li>
                  <li><strong>BTCPay Server:</strong> Payment processing</li>
                  <li><strong>YouTube/Vimeo:</strong> Embedded video players</li>
                </ul>
              </div>
              <p className="text-gray-300 text-sm">
                These services have their own privacy policies and cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Why We Use Cookies</h2>
              <div className="bg-white/5 border border-bitcoin/30 rounded-lg p-6">
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><strong>Security:</strong> Protect against unauthorized access and spam</li>
                  <li><strong>User Experience:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics:</strong> Understand how the site is used to improve features</li>
                  <li><strong>Authentication:</strong> Keep admin and verifier users logged in</li>
                  <li><strong>Performance:</strong> Optimize page loading and reduce server load</li>
                  <li><strong>Compliance:</strong> Meet legal and regulatory requirements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Cookie Duration</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Session Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Temporary cookies deleted when you close your browser. Used for session management and security.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Persistent Cookies</h3>
              <p className="text-gray-300 leading-relaxed">
                Remain on your device for a set period or until manually deleted. Used for preferences and analytics. Typical duration: 30 days to 1 year.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. How to Control Cookies</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1 Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Most browsers allow you to manage cookies through settings:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Cookie Management Options</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Block All Cookies:</strong> Most restrictive, may break website functionality</li>
                <li><strong>Block Third-Party Cookies:</strong> Allows our cookies, blocks external services</li>
                <li><strong>Delete Cookies:</strong> Clear cookies from your browser history</li>
                <li><strong>Private/Incognito Mode:</strong> Temporary session, cookies deleted after closing</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Impact of Blocking Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Blocking essential cookies may result in:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Inability to log in as admin or verifier</li>
                <li>Loss of saved preferences</li>
                <li>Reduced functionality (e.g., maps, forms)</li>
                <li>Security vulnerabilities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the following third-party services that may set cookies:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-white font-semibold">Google (OAuth, Analytics)</p>
                  <p className="text-gray-400 text-sm">Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-bitcoin hover:underline">policies.google.com/privacy</a></p>
                </div>
                <div>
                  <p className="text-white font-semibold">OpenStreetMap</p>
                  <p className="text-gray-400 text-sm">Privacy Policy: <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-bitcoin hover:underline">osmfoundation.org/wiki/Privacy_Policy</a></p>
                </div>
                <div>
                  <p className="text-white font-semibold">BTCPay Server</p>
                  <p className="text-gray-400 text-sm">Self-hosted payment processor, no data shared with third parties</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Cookie Policy periodically to reflect changes in technology, legal requirements, or our practices. Check this page regularly for updates. Last updated date is shown at the top.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Questions about our cookie practices? Contact us:
              </p>
              <div className="bg-white/5 border border-bitcoin/30 rounded-lg p-6">
                <p className="text-white font-semibold mb-2">Afribit Africa</p>
                <p className="text-gray-300">Email: <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">info@afribit.africa</a></p>
                <p className="text-gray-300">Location: Kibera, Nairobi, Kenya</p>
              </div>
            </section>

          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/legal/privacy" className="btn btn-secondary px-6 py-3">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="btn btn-secondary px-6 py-3">
            Terms of Service
          </Link>
          <Link href="/" className="btn btn-primary px-6 py-3">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
