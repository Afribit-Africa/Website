import { MetadataRoute } from 'next';
import { listMerchantSlugs } from '@/lib/content/merchants';
import { SITE_URL } from '@/lib/metadata';
import { programs } from '@/lib/programs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const merchantSlugs = await listMerchantSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/community`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/merchants`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/merchants/location-accuracy`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/programs`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  const programRoutes = programs.map((program) => ({
    url: `${SITE_URL}/programs/${program.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const merchantRoutes = merchantSlugs.map((slug) => ({
    url: `${SITE_URL}/merchants/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...merchantRoutes,
    ...programRoutes,
  ];
}
