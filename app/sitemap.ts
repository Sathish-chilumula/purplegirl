import { MetadataRoute } from 'next';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAllWikiSlugs } from '@/lib/wiki-terms';
import { getAllCompareSlugs } from '@/lib/compare-data';
import { getAllCityTopicPairs } from '@/lib/city-data';

const SITE_URL = 'https://purplegirl.in';
const locales = ['en', 'hi', 'te', 'bn', 'mr', 'ta', 'gu'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles, error: articlesError } = await supabaseAdmin
    .from('articles')
    .select('slug, language, published_at, created_at')
    .eq('is_published', true);

  if (articlesError) {
    console.error('Sitemap: Error fetching articles:', articlesError);
  }

  // 2. Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug');

  // 3. Fetch published quizzes
  const { data: quizzes } = await supabaseAdmin
    .from('quizzes')
    .select('slug, created_at')
    .eq('is_published', true);

  // 4. Fetch published questions (Q&A feed)
  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('slug, created_at')
    .eq('is_published', true)
    .not('slug', 'is', null);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static Pages — English canonical only.
  // These pages do NOT have translated content so we only include the English URL.
  // Adding /hi/about, /te/privacy etc. causes duplicate content (they serve English via middleware).
  const staticPages = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/about', priority: 0.7, freq: 'monthly' as const },
    { path: '/quizzes', priority: 0.7, freq: 'weekly' as const },
    { path: '/contact', priority: 0.5, freq: 'monthly' as const },
    { path: '/questions', priority: 0.7, freq: 'weekly' as const },
    { path: '/tools/period-calculator', priority: 0.8, freq: 'monthly' as const },
    { path: '/tools/symptom-checker', priority: 0.8, freq: 'monthly' as const },
    { path: '/experts', priority: 0.6, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, freq: 'monthly' as const },
    { path: '/terms', priority: 0.3, freq: 'monthly' as const },
    { path: '/disclaimer', priority: 0.3, freq: 'monthly' as const },
  ];

  for (const page of staticPages) {
    sitemapEntries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.freq,
      priority: page.priority,
      alternates: { languages: { 'x-default': `${SITE_URL}${page.path}`, 'en': `${SITE_URL}${page.path}` } },
    });
  }

  // Categories — English only (no translated category pages exist)
  if (categories) {
    for (const cat of categories) {
      sitemapEntries.push({
        url: `${SITE_URL}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: { 'en': `${SITE_URL}/category/${cat.slug}` } },
      });
    }
  }

  // Articles (already have language info — only English gets bare path)
  if (articles) {
    for (const article of articles) {
      const lang = article.language || 'en';
      const prefix = lang === 'en' ? '' : `/${lang}`;
      sitemapEntries.push({
        url: `${SITE_URL}${prefix}/how-to/${article.slug}`,
        lastModified: new Date(article.published_at || article.created_at),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // Quizzes (English only — no translated quiz slugs yet)
  if (quizzes) {
    for (const quiz of quizzes) {
      sitemapEntries.push({
        url: `${SITE_URL}/quiz/${quiz.slug}`,
        lastModified: new Date(quiz.created_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Q&A public feed individual question pages
  if (questions) {
    for (const q of questions) {
      if (q.slug) {
        sitemapEntries.push({
          url: `${SITE_URL}/q/${q.slug}`,
          lastModified: new Date(q.created_at),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  // Wiki definition pages (English only — static content)
  const wikiSlugs = getAllWikiSlugs();
  for (const slug of wikiSlugs) {
    sitemapEntries.push({
      url: `${SITE_URL}/wiki/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  }

  // Compare pages (English only — static content)
  const compareSlugs = getAllCompareSlugs();
  for (const slug of compareSlugs) {
    sitemapEntries.push({
      url: `${SITE_URL}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  }

  // City-specific pages (English only)
  const cityTopicPairs = getAllCityTopicPairs();
  for (const { city, topic } of cityTopicPairs) {
    sitemapEntries.push({
      url: `${SITE_URL}/city/${city}/${topic}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return sitemapEntries;
}
