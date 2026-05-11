import type { Metadata } from 'next'
import { AboutHero } from '@/components/about/about-hero'
import { AboutVideo } from '@/components/about/about-video'
import { MissionVision } from '@/components/about/mission-vision'
import { OurStory } from '@/components/about/our-story'
import { CoreValues } from '@/components/about/core-values'
import { AboutCTA } from '@/components/about/about-cta'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Afribit is a grassroots organisation building a Bitcoin circular economy in Kibera, Nairobi — empowering unbanked communities through Bitcoin education, merchant adoption, and the Lightning Network.',
  openGraph: {
    title: 'About Afribit Africa',
    description:
      'Built in Kibera. Powered by Bitcoin. Learn the story behind Africa\'s most grassroots Bitcoin circular economy.',
  },
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutVideo />
      <MissionVision />
      <OurStory />
      <CoreValues />
      <AboutCTA />
    </>
  )
}
