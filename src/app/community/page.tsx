import type { Metadata } from 'next'
import { CommunityHero } from '@/components/community/community-hero'
import { CommunityFedi } from '@/components/community/community-fedi'
import { CommunitySocial } from '@/components/community/community-social'
import { CommunityCTA } from '@/components/community/community-cta'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join Kibera\'s Bitcoin community on Fedi, Telegram, and across social media. Learn, earn, and spend Bitcoin with thousands of Kibera residents.',
  openGraph: {
    title: 'Community | Afribit Africa',
    description: 'Join Kibera\'s Bitcoin community on Fedi, Telegram, and across social media.',
  },
}

export default function CommunityPage() {
  return (
    <>
      <CommunityHero />
      <CommunityFedi />
      <CommunitySocial />
      <CommunityCTA />
    </>
  )
}
