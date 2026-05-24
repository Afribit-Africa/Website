import type { Metadata } from 'next'
import { LegalLayout, LegalSection, LegalP, LegalList } from '@/components/legal/legal-layout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy',
  description: 'How Afribit Africa collects, uses, and protects your personal information.',
  path: '/legal/privacy',
  noIndex: true,
})

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 2026">
      <LegalSection title="Who We Are">
        <LegalP>
          Afribit Africa is a grassroots Bitcoin organisation based in Kibera, Nairobi, Kenya. We
          build financial access for underserved communities through Bitcoin education, merchant
          networks, and the Lightning Network. You can reach us at{' '}
          <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:underline">
            connect@afribit.africa
          </a>
          .
        </LegalP>
      </LegalSection>

      <LegalSection title="What We Collect">
        <LegalP>We collect only what you give us directly:</LegalP>
        <LegalList
          items={[
            'Name and email address when you submit our contact form',
            'Phone number if you choose to include it in the contact form',
            'Message content you send us',
          ]}
        />
        <LegalP>
          We do not run advertising trackers, analytics scripts, or third-party cookies on this
          website. We do not collect data passively.
        </LegalP>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <LegalP>Information you submit is used solely to:</LegalP>
        <LegalList
          items={[
            'Respond to your inquiry or message',
            'Follow up on partnership or volunteer requests',
            'Send updates you explicitly request',
          ]}
        />
        <LegalP>
          We do not sell, rent, or share your data with third parties. We do not use your
          information for automated decision-making or profiling.
        </LegalP>
      </LegalSection>

      <LegalSection title="Data Storage and Retention">
        <LegalP>
          Contact form submissions are received via email and stored only as long as necessary to
          respond to your inquiry. We do not maintain a marketing database. If you would like your
          information removed, email us and we will delete it promptly.
        </LegalP>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <LegalP>This website links to external platforms we use as a community:</LegalP>
        <LegalList
          items={[
            'Fedi (community messaging) — governed by Fedi\'s own privacy policy',
            'Geyser Fund (donations) — governed by Geyser\'s own privacy policy',
            'BTC Map — an open-source community project',
            'Social platforms (X, Instagram, Telegram, YouTube, Medium)',
          ]}
        />
        <LegalP>
          We are not responsible for the data practices of any external service. Review their
          policies before sharing personal information with them.
        </LegalP>
      </LegalSection>

      <LegalSection title="Your Rights">
        <LegalP>
          Under Kenya&apos;s Data Protection Act 2019, you have the right to access, correct, or
          delete any personal information we hold about you. To exercise these rights, contact us
          at{' '}
          <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:underline">
            connect@afribit.africa
          </a>
          .
        </LegalP>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <LegalP>
          We may update this policy as our website evolves. Changes will be reflected with a new
          &quot;Last updated&quot; date. Continued use of the site after changes means you accept
          the updated policy.
        </LegalP>
      </LegalSection>
    </LegalLayout>
  )
}
