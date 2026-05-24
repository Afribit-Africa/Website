import type { Metadata } from 'next'
import { LegalLayout, LegalSection, LegalP, LegalList } from '@/components/legal/legal-layout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Use',
  description: 'Terms and conditions for using the Afribit Africa website.',
  path: '/legal/terms',
  noIndex: true,
})

export default function TermsOfUsePage() {
  return (
    <LegalLayout title="Terms of Use" lastUpdated="May 2026">
      <LegalSection title="Agreement">
        <LegalP>
          By accessing this website, you agree to these terms. If you do not agree, please do not
          use the site. These terms govern your use of{' '}
          <span className="text-foreground">afribit.africa</span> and all its content.
        </LegalP>
      </LegalSection>

      <LegalSection title="Educational Content — Not Financial Advice">
        <LegalP>
          Everything on this website is for educational and informational purposes only. Nothing
          here constitutes financial advice, investment advice, or a recommendation to buy, sell,
          or hold Bitcoin or any other asset.
        </LegalP>
        <LegalP>
          Bitcoin is a volatile asset. Prices change. We make no guarantees about the future value
          of Bitcoin. You are solely responsible for your own financial decisions.
        </LegalP>
      </LegalSection>

      <LegalSection title="Your Responsibility">
        <LegalP>You are responsible for:</LegalP>
        <LegalList
          items={[
            'Keeping your own Bitcoin private keys secure — we cannot recover them',
            'Any transactions you make on-chain or via the Lightning Network',
            'Verifying information independently before acting on it',
            'Complying with laws applicable in your jurisdiction',
          ]}
        />
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <LegalP>You agree not to:</LegalP>
        <LegalList
          items={[
            'Use this website for any unlawful purpose',
            'Attempt to disrupt or compromise the security of the site',
            'Scrape or reproduce our content without permission',
            'Misrepresent your identity or affiliation with Afribit',
          ]}
        />
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <LegalP>
          Content on this website — including text, images, and logos — belongs to Afribit Africa
          unless otherwise noted. You may share and reference our content for non-commercial,
          educational purposes with attribution. Contact us for other uses.
        </LegalP>
      </LegalSection>

      <LegalSection title="External Links">
        <LegalP>
          We link to third-party platforms (Fedi, Geyser Fund, BTC Map, social media, etc.). These
          are independent services with their own terms and policies. We are not responsible for
          their content or actions.
        </LegalP>
      </LegalSection>

      <LegalSection title="Donations">
        <LegalP>
          Donations made through our BTCPay Server or Geyser Fund go directly to funding Afribit
          Africa programs in Kibera. Donations are voluntary and non-refundable. We publish
          regular impact reports to demonstrate how funds are used.
        </LegalP>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <LegalP>
          Afribit Africa is not liable for any direct, indirect, or consequential loss arising from
          your use of this website or any third-party service we link to. The site is provided
          &quot;as is&quot; without warranties of any kind.
        </LegalP>
      </LegalSection>

      <LegalSection title="Governing Law">
        <LegalP>
          These terms are governed by the laws of the Republic of Kenya. Any disputes will be
          subject to the jurisdiction of Kenyan courts.
        </LegalP>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalP>
          Questions about these terms? Reach us at{' '}
          <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:underline">
            connect@afribit.africa
          </a>
          .
        </LegalP>
      </LegalSection>
    </LegalLayout>
  )
}
