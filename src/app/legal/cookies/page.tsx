import type { Metadata } from 'next'
import { LegalLayout, LegalSection, LegalP, LegalList } from '@/components/legal/legal-layout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Cookie Policy',
  description: 'How Afribit Africa uses cookies on its website.',
  path: '/legal/cookies',
  noIndex: true,
})

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="May 2026">
      <LegalSection title="What Are Cookies">
        <LegalP>
          Cookies are small text files stored on your device when you visit a website. They help
          websites remember your preferences and function correctly.
        </LegalP>
      </LegalSection>

      <LegalSection title="How We Use Cookies">
        <LegalP>
          Afribit Africa keeps cookie use minimal. We do not run advertising networks, tracking
          pixels, or third-party analytics on this site.
        </LegalP>
        <LegalP>The only cookies present are functional and session-based:</LegalP>
        <LegalList
          items={[
            'Session cookies that keep the site working correctly during your visit',
            'Preference cookies if you interact with embedded third-party content (e.g., YouTube videos)',
            'No marketing or retargeting cookies',
            'No cross-site tracking',
          ]}
        />
      </LegalSection>

      <LegalSection title="Third-Party Embeds">
        <LegalP>
          Some pages embed content from external platforms (such as YouTube videos). When you
          interact with these embeds, those platforms may set their own cookies under their own
          cookie policies. We recommend reviewing the cookie policies of YouTube, Fedi, or any
          external service you engage with.
        </LegalP>
      </LegalSection>

      <LegalSection title="How to Control Cookies">
        <LegalP>
          You can control and delete cookies through your browser settings. Instructions vary by
          browser:
        </LegalP>
        <LegalList
          items={[
            'Chrome: Settings → Privacy and security → Cookies and other site data',
            'Firefox: Settings → Privacy & Security → Cookies and Site Data',
            'Safari: Preferences → Privacy → Manage Website Data',
            'Edge: Settings → Cookies and site permissions',
          ]}
        />
        <LegalP>
          Disabling functional cookies may affect how parts of the site behave, but will not
          prevent you from accessing content.
        </LegalP>
      </LegalSection>

      <LegalSection title="No Consent Banners">
        <LegalP>
          Because we do not use tracking or advertising cookies, we do not display a cookie consent
          banner. If this changes in the future, we will update this policy and add appropriate
          notice.
        </LegalP>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalP>
          Questions about how we use cookies? Email us at{' '}
          <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:underline">
            connect@afribit.africa
          </a>
          .
        </LegalP>
      </LegalSection>
    </LegalLayout>
  )
}
