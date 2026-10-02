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
    <LegalLayout title="Privacy Policy" lastUpdated="October 2026">
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
        <LegalP>When you submit a form, we collect the details needed to handle it:</LegalP>
        <LegalList
          items={[
            'Name and email address when you submit our contact form',
            'Phone number if you choose to include it in the contact form',
            'Message content you send us',
            'Email address and optional name when you subscribe to the newsletter',
          ]}
        />
        <LegalP>
          Administrator sign-in uses functional session cookies.
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
          The Afribit team handles contact messages using our database and email services.
          Newsletter subscription details are used for updates you request.
        </LegalP>
      </LegalSection>

      <LegalSection title="Data Storage and Retention">
        <LegalP>
          Contact submissions are stored in our database and sent to the team by email.
          Newsletter subscriptions are stored separately. To ask about stored information or
          request its removal, email connect@afribit.africa.
        </LegalP>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <LegalP>The site uses services to operate and links to community platforms:</LegalP>
        <LegalList
          items={[
            'Hosting, database, and email services used to handle site operations and submissions',
            'Google (administrator sign-in)',
            'hCaptcha (form abuse prevention) - verification is subject to hCaptcha\'s privacy policy',
            'Fedi (community messaging) — governed by Fedi\'s own privacy policy',
            'Blink (Lightning donation payments)',
            'BTC Map — an open-source community project',
            'Social platforms (X, Instagram, Telegram, YouTube)',
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
