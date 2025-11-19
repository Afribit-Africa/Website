import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Afribit Africa',
  description: 'Learn how Afribit Africa collects, uses, and protects your personal information in compliance with Kenya Data Protection Act 2019',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: November 19, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-bitcoin max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Afribit Africa ("we," "us," or "our") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <Link href="/" className="text-bitcoin hover:underline">www.afribit.africa</Link> and use our services. This policy complies with the Kenya Data Protection Act, 2019.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Information You Provide</h3>
              <p className="text-gray-300 leading-relaxed mb-4">We collect information that you voluntarily provide to us:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Merchant Registration:</strong> Business name, category, description, physical address, coordinates (latitude/longitude), phone number, email address, website, Lightning address, payment methods accepted, and contact person details</li>
                <li><strong>Donations:</strong> Donor name and email (optional for named donations), donation amount and tier</li>
                <li><strong>Verifier Applications:</strong> Name, email, phone number, address, and verification credentials</li>
                <li><strong>Contact Forms:</strong> Name, email, and message content</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, time spent on pages</li>
                <li><strong>Geolocation Data:</strong> GPS coordinates when you use "Use My Location" feature (with your explicit permission)</li>
                <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Third-Party Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>OpenStreetMap:</strong> We contribute merchant location data to OpenStreetMap under the ODbL license</li>
                <li><strong>BTCPay Server:</strong> Bitcoin payment transaction data (anonymous, no personal information stored)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We use collected information for:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> Processing merchant registrations, verifying submissions, displaying merchant locations on maps</li>
                <li><strong>Donations:</strong> Creating Lightning invoices, sending payment receipts, recognizing donors (if chosen)</li>
                <li><strong>Communication:</strong> Sending confirmation emails, verification updates, donation receipts, program updates</li>
                <li><strong>OpenStreetMap Contribution:</strong> Publishing verified merchant data to OSM to improve global mapping data</li>
                <li><strong>Analytics:</strong> Understanding website usage, improving user experience</li>
                <li><strong>Security:</strong> Detecting fraud, preventing abuse, rate limiting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 Public Data</h3>
              <p className="text-gray-300 leading-relaxed mb-4">The following data is published publicly:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Merchant Information:</strong> Business name, category, description, address, coordinates, payment methods, contact details (if provided) are displayed on our website and maps</li>
                <li><strong>OpenStreetMap:</strong> Verified merchant data is published to OSM under ODbL license, becoming part of the global public database</li>
                <li><strong>Named Donors:</strong> Names of donors who choose recognition are displayed on our website</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Service Providers</h3>
              <p className="text-gray-300 leading-relaxed mb-4">We share data with trusted third-party providers:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Email Service (Resend):</strong> To send transactional emails</li>
                <li><strong>Database Hosting:</strong> Secure MySQL database for storing submissions</li>
                <li><strong>Payment Processing (BTCPay Server):</strong> Self-hosted, no data shared with third parties</li>
                <li><strong>Analytics:</strong> Anonymous usage statistics</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Legal Requirements</h3>
              <p className="text-gray-300 leading-relaxed">
                We may disclose information if required by law, court order, or government request, or to protect rights, property, or safety.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Verifier Image Collection</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Ground verifiers may capture photos during merchant verification visits:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Purpose:</strong> Evidence of business operations, payment methods acceptance, location accuracy</li>
                <li><strong>Storage:</strong> Images are uploaded to our secure server and linked to merchant submissions</li>
                <li><strong>Usage:</strong> For admin review and verification purposes only; not published unless explicitly approved by merchant</li>
                <li><strong>Retention:</strong> Stored for verification period, deleted after merchant approval/rejection or upon merchant request</li>
                <li><strong>Consent:</strong> Merchants consent to verification photography during registration process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We implement security measures including:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>HTTPS/TLS encryption for all data transmission</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Input validation and sanitization</li>
                <li>Access controls and authentication for admin/verifier areas</li>
                <li>Regular security audits</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, no internet transmission is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Merchant Data:</strong> Retained indefinitely for map display purposes unless deletion is requested</li>
                <li><strong>Submission Data:</strong> Pending submissions retained for 90 days, then archived</li>
                <li><strong>Donation Data:</strong> Retained for tax and accounting purposes (7 years minimum)</li>
                <li><strong>Verification Images:</strong> Deleted after 30 days of merchant approval/rejection</li>
                <li><strong>Analytics Data:</strong> Aggregated, anonymous data retained indefinitely</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Your Rights (Kenya Data Protection Act)</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Under Kenya's Data Protection Act 2019, you have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Object:</strong> Object to processing of your data</li>
                <li><strong>Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise your rights, contact us at <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">info@afribit.africa</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not directed to individuals under 18. We do not knowingly collect data from children. If you believe we have collected data from a child, contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be transferred to and stored on servers outside Kenya. We ensure appropriate safeguards are in place for such transfers, including encryption and secure protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. The "Last Updated" date at the top indicates the latest revision. Continued use of our services after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For questions, concerns, or to exercise your rights:
              </p>
              <div className="bg-white/5 border border-bitcoin/30 rounded-lg p-6">
                <p className="text-white font-semibold mb-2">Afribit Africa</p>
                <p className="text-gray-300">Email: <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">info@afribit.africa</a></p>
                <p className="text-gray-300">Location: Kibera, Nairobi, Kenya</p>
                <p className="text-gray-300 mt-4 text-sm">
                  Data Protection Officer: <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">info@afribit.africa</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Complaints</h2>
              <p className="text-gray-300 leading-relaxed">
                If you believe your data protection rights have been violated, you may file a complaint with the Office of the Data Protection Commissioner (ODPC) of Kenya:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4">
                <p className="text-white font-semibold mb-2">Office of the Data Protection Commissioner</p>
                <p className="text-gray-300">Website: <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-bitcoin hover:underline">www.odpc.go.ke</a></p>
                <p className="text-gray-300">Email: <a href="mailto:info@odpc.go.ke" className="text-bitcoin hover:underline">info@odpc.go.ke</a></p>
              </div>
            </section>

          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/legal/terms" className="btn btn-secondary px-6 py-3">
            Terms of Service
          </Link>
          <Link href="/legal/cookies" className="btn btn-secondary px-6 py-3">
            Cookie Policy
          </Link>
          <Link href="/" className="btn btn-primary px-6 py-3">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
