import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Afribit Africa',
  description: 'Terms and conditions for using Afribit Africa services, merchant registration, and OpenStreetMap contributions',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-gradient">Terms of Service</span>
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: November 19, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-bitcoin max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Afribit Africa's website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. About Afribit Africa</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Afribit Africa is a community-driven initiative operating in Kibera, Nairobi, Kenya, focused on:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Promoting Bitcoin circular economy in underserved communities</li>
                <li>Onboarding local merchants to accept Bitcoin payments</li>
                <li>Environmental programs (waste management, upcycling)</li>
                <li>Education and capacity building</li>
                <li>Contributing merchant location data to OpenStreetMap</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Merchant Registration</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Eligibility</h3>
              <p className="text-gray-300 leading-relaxed">
                To register as a merchant, you must:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Operate a legitimate business in Kibera or surrounding areas</li>
                <li>Be at least 18 years old</li>
                <li>Accept or be willing to accept Bitcoin payments</li>
                <li>Provide accurate business information</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Verification Process</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                All merchant submissions undergo verification:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Ground Verification:</strong> Authorized verifiers may visit your business to confirm location, operations, and Bitcoin acceptance</li>
                <li><strong>Photo Evidence:</strong> Verifiers may take photos of your business, signage, and payment methods</li>
                <li><strong>Admin Review:</strong> Final approval by Afribit Africa administrators</li>
                <li><strong>Rejection:</strong> We reserve the right to reject submissions that do not meet criteria</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Merchant Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Maintain accurate business information</li>
                <li>Accept Bitcoin payments as advertised</li>
                <li>Update information promptly if business details change</li>
                <li>Notify us if you cease operations or no longer accept Bitcoin</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. OpenStreetMap Contribution</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 Data Licensing</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                By registering as a merchant, you agree that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Your business information will be contributed to OpenStreetMap (OSM)</li>
                <li>OSM data is licensed under the Open Database License (ODbL)</li>
                <li>Your data becomes part of the public OSM database</li>
                <li>OSM data can be freely used, shared, and modified by anyone under ODbL terms</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Data Published to OSM</h3>
              <p className="text-gray-300 leading-relaxed mb-4">The following information is published:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Business name and category</li>
                <li>Physical address and GPS coordinates</li>
                <li>Payment methods accepted (Bitcoin Lightning, on-chain, NFC)</li>
                <li>Contact information (if provided)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 OSM Attribution</h3>
              <p className="text-gray-300 leading-relaxed">
                Contributions are made under Afribit Africa's OSM account with proper attribution. Learn more at <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-bitcoin hover:underline">OpenStreetMap Copyright</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Donations</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1 Bitcoin Donations</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                All donations are processed via Bitcoin Lightning Network:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Donations are <strong>non-refundable</strong></li>
                <li>Donations support Afribit Africa programs and operations</li>
                <li>Tax receipts are not provided (we are not a registered tax-exempt entity)</li>
                <li>Anonymous donations are accepted</li>
                <li>Named donors may be publicly recognized on our website</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Use of Funds</h3>
              <p className="text-gray-300 leading-relaxed">
                Donations are used for program operations, merchant onboarding, community education, environmental initiatives, and administrative costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Unless otherwise stated:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Website content, design, and code are © 2025 Afribit Africa</li>
                <li>Logos and branding are trademarks of Afribit Africa</li>
                <li>Merchant-submitted data is licensed under ODbL via OSM</li>
                <li>User-generated content (reviews, photos) remains property of users but grants us usage rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Submit false or misleading information</li>
                <li>Impersonate others or misrepresent affiliation</li>
                <li>Use our services for illegal activities</li>
                <li>Attempt to hack, disrupt, or interfere with services</li>
                <li>Spam, scrape, or abuse our systems</li>
                <li>Violate intellectual property rights</li>
                <li>Harass or abuse other users, merchants, or staff</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers and Limitations</h2>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.1 No Warranties</h3>
              <p className="text-gray-300 leading-relaxed">
                Services are provided "as is" without warranties of any kind, express or implied. We do not guarantee accuracy, completeness, or reliability of merchant information.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.2 Limitation of Liability</h3>
              <p className="text-gray-300 leading-relaxed">
                Afribit Africa is not liable for any indirect, incidental, special, or consequential damages arising from use of our services, including but not limited to loss of funds, business interruption, or data loss.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.3 Bitcoin Transactions</h3>
              <p className="text-gray-300 leading-relaxed">
                Bitcoin transactions are irreversible. We are not responsible for transaction errors, lost funds, or merchant disputes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Suspend or terminate accounts for violations</li>
                <li>Remove merchant listings at our discretion</li>
                <li>Discontinue services at any time</li>
                <li>Modify features or terms with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These terms are governed by the laws of the Republic of Kenya. Disputes shall be resolved in Kenyan courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update these terms periodically. Continued use after changes constitutes acceptance. Material changes will be communicated via email or website notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact</h2>
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
