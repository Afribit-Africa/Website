import { StudioLibrary } from '@/components/education/studio-library'
import { StructuredData } from '@/components/seo/structured-data'
import { bitcoinLesson } from '@/lib/education'
import { generateMetadata, getBreadcrumbSchema, SITE_URL } from '@/lib/metadata'
import media from '../../../public/education/bitcoin-101-transcript.json'

export const metadata = generateMetadata({
  title: 'Afribit Studio | Bitcoin Education',
  description: 'Explore Bitcoin education in Afribit Studio. Listen to Bitcoin Podcast 101, read along with the narration, and learn about peer-to-peer money at your own pace.',
  path: '/studio', image: bitcoinLesson.artwork,
  keywords: ['Afribit Studio', 'Bitcoin audiobooks', 'Bitcoin education Kenya', 'Bitcoin Podcast 101', 'learn Bitcoin Kibera'],
})

export default function StudioPage() {
  return <>
    <StructuredData data={getBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Afribit Studio', url: '/studio' }])} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Afribit Studio', url: `${SITE_URL}/studio`,
      mainEntity: { '@type': 'ItemList', numberOfItems: 1, itemListElement: [{ '@type': 'ListItem', position: 1,
        item: { '@type': 'LearningResource', name: bitcoinLesson.title, url: `${SITE_URL}${bitcoinLesson.href}`, image: `${SITE_URL}${bitcoinLesson.artwork}` } }] } }} />
    <StudioLibrary duration={media.duration} chapters={media.chapters.length} />
  </>
}
