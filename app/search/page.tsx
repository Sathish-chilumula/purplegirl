import { Metadata } from 'next';
import { Suspense } from 'react';

export const runtime = 'edge';
import { supabaseAdmin } from '@/lib/supabase-admin';
import SearchClient from '@/components/search/SearchClient';
import { SITE_NAME } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q, category } = await searchParams;

  let title = `Search How-To Guides | ${SITE_NAME}`;
  let description = 'Find honest, actionable how-to guides for Indian women on relationships, health, career, skin and more.';

  if (q) {
    title = `Results for "${q}" | ${SITE_NAME}`;
    description = `Find guides and advice for "${q}" on ${SITE_NAME}.`;
  } else if (category) {
    const { data } = await supabaseAdmin
      .from('categories')
      .select('name')
      .eq('slug', category)
      .single();
    if (data) {
      title = `${data.name} Guides | ${SITE_NAME}`;
      description = `How-to guides and advice for ${data.name} topics on ${SITE_NAME}.`;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: '/search',
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { category } = await searchParams;

  // Fetch categories for the sidebar filter
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug')
    .lt('display_order', 99)
    .order('display_order', { ascending: true });

  return (
    <div className="min-h-screen bg-pg-cream">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-14 h-14 rounded-full bg-pg-rose-light flex items-center justify-center shadow-lg">
              <Loader2 className="w-7 h-7 text-pg-rose animate-spin" />
            </div>
            <p className="text-pg-gray-500 font-bold animate-pulse">Searching guides…</p>
          </div>
        }
      >
        <SearchClient initialCategories={categories || []} />
      </Suspense>
    </div>
  );
}
