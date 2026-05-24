import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero'
import { BitcoinTicker } from '@/components/sections/bitcoin-ticker'
import { CampaignProgress } from '@/components/sections/campaign-progress'
import { ImpactStats } from '@/components/sections/impact-stats'
import { RealPeople } from '@/components/sections/real-people'
import { WhyKibera } from '@/components/sections/why-kibera'
import { Programs } from '@/components/sections/programs'
import { Testimonials } from '@/components/sections/testimonials'
import { Partners } from '@/components/sections/partners'
import { FediSection } from '@/components/sections/fedi-section'
import { MediaCoverage } from '@/components/sections/media-coverage'
import { FAQ } from '@/components/sections/faq'
import { StrategicGoals } from '@/components/sections/strategic-goals'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Afribit Africa',
  description:
    'Afribit advances urgent, strategic change in Kibera by challenging inequitable systems, mobilizing collective resources, and supporting root-cause solutions through Bitcoin.',
  path: '/',
  keywords: [
    'Bitcoin circular economy Kibera',
    'Afribit Africa',
    'Bitcoin Kibera',
    'community-led Bitcoin adoption',
  ],
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BitcoinTicker />
      <CampaignProgress />
      <ImpactStats />
      <RealPeople />
      <WhyKibera />
      <Programs />
      <Testimonials />
      <Partners />
      <FediSection />
      <MediaCoverage />
      <FAQ />
      <StrategicGoals />
    </>
  )
}

