import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const runtime = 'edge';

async function getCategoryData(slug: string) {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

async function getCategoryArticles(categorySlug: string) {
  const { data } = await supabaseAdmin
    .from('articles')
    .select('slug, title, intro, reading_time_mins')
    .eq('category', categorySlug)
    .eq('is_published', true)
    .order('view_count', { ascending: false });
  return data || [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryData(params.slug);
  if (!category) return { title: 'Category Not Found' };
  
  return {
    title: `${category.name} Problems & Advice for Indian Women | PurpleGirl`,
    description: `How-to guides for Indian women facing ${category.name.toLowerCase()} problems. Honest, anonymous advice.`,
    alternates: {
      canonical: `/category/${params.slug}`
    },
    openGraph: {
      title: `${category.name} Advice | PurpleGirl`,
      description: category.description,
      type: 'website',
    }
  };
}

import AdSenseUnit from '@/components/ads/AdSenseUnit';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryData(params.slug);

  if (!category) {
    notFound();
  }

  const articles = await getCategoryArticles(category.slug);

  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          1. CATEGORY HERO
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="bg-pg-rose-light pt-20 pb-16 px-6 border-b border-pg-rose/10">
        <div className="max-w-content mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="text-[64px] bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-sm shrink-0">
            {category.icon_emoji || '✨'}
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-pg-gray-900 mb-3">
              {category.name}
            </h1>
            <p className="text-lg text-pg-gray-700 max-w-2xl mb-4">
              {category.description || `Honest advice and step-by-step guides for everything related to ${category.name.toLowerCase()}.`}
            </p>
            <Badge>{category.article_count || articles.length} Guides</Badge>
          </div>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          MAIN CONTENT GRID
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="max-w-content mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
        
        <div className="lg:w-[70%]">
          
          {/* 2. Subcategory Filter Pills (Static for now) */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
            <button className="shrink-0 px-4 py-2 rounded-full bg-pg-gray-900 text-white font-bold text-sm">
              All Guides
            </button>
            {['Most Popular', 'Recent', 'Toxic Patterns', 'Communication'].map(sub => (
              <button key={sub} className="shrink-0 px-4 py-2 rounded-full bg-white border border-pg-gray-300 text-pg-gray-700 hover:border-pg-rose hover:text-pg-rose font-bold text-sm transition-colors">
                {sub}
              </button>
            ))}
          </div>

          {/* 3. Article Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {articles.length > 0 ? articles.map((article) => (
              <Link key={article.slug} href={`/how-to/${article.slug}`}>
                <Card className="h-full hover:border-pg-rose transition-colors flex flex-col p-6">
                  <h3 className="font-display text-[20px] font-bold text-pg-gray-900 mb-3 leading-snug group-hover:text-pg-rose">
                    {article.title}
                  </h3>
                  <p className="text-pg-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {article.intro?.substring(0, 120)}...
                  </p>
                  <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mt-auto">
                    ⏱ {article.reading_time_mins || 6} min read
                  </div>
                </Card>
              </Link>
            )) : (
              <div className="col-span-2 py-16 text-center border border-dashed border-pg-gray-300 rounded-2xl">
                <p className="text-pg-gray-500 mb-4">Our editors are currently writing guides for this category.</p>
                <Link href="/ask">
                  <Button variant="secondary">Ask a Question Meanwhile</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {articles.length > 12 && (
            <div className="mt-12 text-center">
              <Button variant="ghost" className="w-full sm:w-auto">
                Load More Guides
              </Button>
            </div>
          )}

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━
            4. SIDEBAR
            ━━━━━━━━━━━━━━━━━━━━━━━ */}
        <aside className="lg:w-[30%] space-y-10 lg:sticky lg:top-28 self-start">
          
          {/* Quizzes Widget */}
          <div className="bg-pg-plum text-white rounded-2xl p-8">
            <h3 className="font-display font-bold text-2xl mb-3">Learn More About Yourself</h3>
            <p className="text-sm text-pg-plum-light mb-6">
              Take our completely private, anonymous quizzes related to {category.name.toLowerCase()}.
            </p>
            <Link href="/quiz/relationship-health-check" className="inline-block bg-white text-pg-plum font-bold py-3 px-6 rounded-xl hover:bg-pg-plum-light transition-colors text-sm w-full text-center">
              Explore Quizzes <ChevronRight size={16} className="inline ml-1" />
            </Link>
          </div>

          <AdSenseUnit slot="sidebar" className="mt-8" />

        </aside>

      </div>
    </div>
  );
}
