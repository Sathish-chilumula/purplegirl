import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://purplegirl.in';

  // 1. Static routes
  const staticRoutes = [
    '',
    '/ask',
    '/search',
    '/trending',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Fetch all approved questions
  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('slug, updated_at')
    .in('status', ['approved', 'featured']);

  const questionRoutes = (questions || []).map((q) => ({
    url: `${baseUrl}/q/${q.slug}`,
    lastModified: new Date(q.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Fetch all categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug');

  const categoryRoutes = (categories || []).map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...questionRoutes];
}
