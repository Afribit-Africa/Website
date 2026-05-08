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

export const metadata: Metadata = {
  title: 'Afribit Africa — Empowering Communities Through Bitcoin',
  description:
    'Afribit is building a self-sustaining Bitcoin circular economy in Kibera, Nairobi — connecting 40+ merchants, 2000+ transactions, and 5 programs through the Lightning Network.',
  openGraph: {
    title: 'Afribit Africa — Bitcoin Circular Economy in Kibera',
    description:
      'Empowering African communities through Bitcoin education, financial inclusion, and on-the-ground programs in Kibera, Nairobi.',
  },
}

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

