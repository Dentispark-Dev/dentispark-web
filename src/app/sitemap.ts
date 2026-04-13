import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.dentispark.com';

  const staticRoutes = [
    '',
    '/about-us',
    '/contact-us',
    '/pricing',
    '/resources',
    '/scholarships',
    '/become-a-mentor',
    '/login',
    '/sign-up',
    '/success-stories',
    '/terms',
    '/privacy',
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
