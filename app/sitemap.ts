import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { FOLIOS } from '@/lib/folios';
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

  // 2. Volume routes (from FOLIOS)
  const volumeRoutes = FOLIOS.map((folio) => ({
    url: `${baseUrl}/volumes/${folio.id}`,
    lastModified: formatDate(new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Fetch all approved questions
  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('id, slug, updated_at')
    .in('status', ['approved', 'published']);

  const questionIds = (questions || []).map((q) => q.id).filter(Boolean);

  // 4. Fetch translation availability
  let translationMap = new Map<string, { hasHindi: boolean; hasTelugu: boolean }>();
  if (questionIds.length > 0) {
    const { data: answers } = await supabaseAdmin
      .from('answers')
      .select('question_id, chat_log_hi, chat_log_te')
      .in('question_id', questionIds);

    for (const a of answers || []) {
      if (a.question_id) {
        translationMap.set(a.question_id, {
          hasHindi: Array.isArray(a.chat_log_hi) && (a.chat_log_hi as any[]).length > 0,
          hasTelugu: Array.isArray(a.chat_log_te) && (a.chat_log_te as any[]).length > 0,
        });
      }
    }
  }

  // 5. Build question routes
  const questionRoutes: MetadataRoute.Sitemap = [];
  for (const q of questions || []) {
    const lastMod = formatDate(new Date(q.updated_at || Date.now()));
    const trans = translationMap.get(q.id);

    questionRoutes.push({
      url: `${baseUrl}/q/${q.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    if (trans?.hasHindi) {
      questionRoutes.push({
        url: `${baseUrl}/q/${q.slug}/hindi`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }

    if (trans?.hasTelugu) {
      questionRoutes.push({
        url: `${baseUrl}/q/${q.slug}/telugu`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  return [...staticRoutes, ...volumeRoutes, ...questionRoutes];
}
