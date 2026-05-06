import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/admin/',
        '/auth/',
        '/login/',
        '/ask', // Privacy: keep ask results out of general index unless published
        '/search',
        '/saved',
      ],
    },
    sitemap: 'https://purplegirl.in/sitemap.xml',
  };
}
