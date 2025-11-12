import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/donors/', '/_next/'],
      },
    ],
    sitemap: 'https://afribit.africa/sitemap.xml',
  }
}
