import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://purplegirl.in';

  // 1. Static Routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/quizzes`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ask`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ] as MetadataRoute.Sitemap;

  // 2. Dynamic Categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug');
  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  })) as MetadataRoute.Sitemap;

  // 3. Dynamic Articles
  // NOTE: articles table has: generated_at, published_at, created_at (no updated_at)
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('slug, generated_at, published_at, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const articleRoutes = (articles || []).map((article) => ({
    url: `${baseUrl}/how-to/${article.slug}`,
    lastModified: new Date(
      article.generated_at || article.published_at || article.created_at || Date.now()
    ),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  // 4. Dynamic Quizzes (published only)
  const { data: quizzes } = await supabaseAdmin
    .from('quizzes')
    .select('slug, created_at')
    .eq('is_published', true);

  const quizRoutes = (quizzes || []).map((quiz) => ({
    url: `${baseUrl}/quiz/${quiz.slug}`,
    lastModified: new Date(quiz.created_at || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  })) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...quizRoutes];
}
