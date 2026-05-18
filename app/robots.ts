import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/login/',
          '/saved',
          '/search?*',  // Block search result pages with query params (not the page itself)
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/auth/'],
      },
    ],
    sitemap: 'https://purplegirl.in/sitemap.xml',
  };
}
