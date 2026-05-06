import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';

const SITE_URL = 'https://purplegirl.in';
const locales = ['en', 'hi', 'te'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all articles
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('slug, language, updated_at, created_at')
    .eq('is_published', true);

  // 2. Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug');

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static Pages for each locale
  const staticPages = ['', '/about', '/quizzes', '/contact'];
  
  for (const lang of locales) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${SITE_URL}${prefix}${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: page === '' ? 1.0 : 0.5,
      });
    }

    // Categories for each locale
    if (categories) {
      for (const cat of categories) {
        sitemapEntries.push({
          url: `${SITE_URL}${prefix}/category/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  // Articles (already have language info)
  if (articles) {
    for (const article of articles) {
      const lang = article.language || 'en';
      const prefix = lang === 'en' ? '' : `/${lang}`;
      
      sitemapEntries.push({
        url: `${SITE_URL}${prefix}/how-to/${article.slug}`,
        lastModified: new Date(article.updated_at || article.created_at),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return sitemapEntries;
}
