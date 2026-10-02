import { MetadataRoute } from 'next';
import { builderProjects } from '@/lib/builders';
import { listMerchantSitemapEntries } from '@/lib/content/merchants';
import { SITE_URL } from '@/lib/metadata';
import { programs } from '@/lib/programs';

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const merchantEntries = await listMerchantSitemapEntries()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/community`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/builders`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/studio`,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/studio/bitcoin-podcast-101`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/donate`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/merchants`,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/merchants/location-accuracy`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/programs`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  const programRoutes = programs.map((program) => ({
    url: `${SITE_URL}/programs/${program.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const builderRoutes = builderProjects.map((project) => ({
    url: `${SITE_URL}/builders/${project.slug}`,
    lastModified: new Date(`${project.modifiedDate}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const merchantRoutes = merchantEntries.map((merchant) => ({
    url: `${SITE_URL}/merchants/${merchant.slug}`,
    lastModified: merchant.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...merchantRoutes,
    ...programRoutes,
    ...builderRoutes,
  ];
}
