import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/mentor/overview/'],
    },
    sitemap: 'https://www.dentispark.com/sitemap.xml',
  };
}
