import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SITE_URL } from '@/lib/constants';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Helper to format date for strict Google compliance (no milliseconds)
  const formatDate = (date: Date) => date.toISOString().split('.')[0] + 'Z';

  // 1. Static routes
  const staticRoutes = [
    '',
    '/ask',
    '/search'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: formatDate(new Date()),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug');

  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: formatDate(new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Fetch all approved questions
  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('id, slug, updated_at')
    .in('status', ['approved', 'published']);

  const questionRoutes = (questions || []).map((q) => ({
    url: `${baseUrl}/q/${q.slug}`,
    lastModified: formatDate(new Date(q.updated_at || Date.now())),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...questionRoutes];
}
