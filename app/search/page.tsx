import { Metadata } from 'next';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import SearchClient from '@/components/search/SearchClient';
import { SITE_NAME } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; date?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q, category } = await searchParams;
  
  let title = `Browse Questions | ${SITE_NAME}`;
  let description = "Search our vault of 1000+ real questions answered for girls. Anonymous, safe, and judgment-free.";

  if (q) {
    title = `Answers for "${q}" | ${SITE_NAME}`;
    description = `Find results and sisterly advice for "${q}" on ${SITE_NAME}.`;
  } else if (category) {
    // Optionally fetch category name for cleaner title
    const { data } = await supabase.from('categories').select('name').eq('slug', category).single();
    if (data) {
      title = `${data.name} Questions & Advice | ${SITE_NAME}`;
      description = `Expert answers and peer support for ${data.name} topics on ${SITE_NAME}.`;
    }
  }

  return { title, description };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // SSR fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-purple-primary animate-spin" />
      </div>
    }>
      <SearchClient initialCategories={categories || []} />
    </Suspense>
  );
}
