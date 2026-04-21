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
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Page-level orb backgrounds */}
      <div className="orb orb-purple w-[600px] h-[600px] top-[-100px] right-[-100px] opacity-20" />
      <div className="orb orb-pink w-[500px] h-[500px] bottom-[-80px] left-[-60px] opacity-15" />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40 gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shadow-lg animate-float">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <p className="text-gray-500 font-bold animate-pulse">Scanning the vault...</p>
        </div>
      }>
        <div className="relative z-10">
          <SearchClient initialCategories={categories || []} />
        </div>
      </Suspense>
    </div>
  );
}
