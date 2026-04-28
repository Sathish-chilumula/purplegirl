import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { buildItemListSchema } from '@/lib/schema';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { PageBackground } from '@/components/PageBackground';
import { IlluminatedDropCap } from '@/components/IlluminatedDropCap';

export const runtime = 'edge';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

interface QuestionSummary {
  slug: string;
  title: string;
  description: string;
  metoo_count: number;
}

async function getCategoryData(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as CategoryData;
}

async function getCategoryQuestions(categoryId: string) {
  const { data } = await supabaseAdmin
    .from('questions')
    .select('slug, title, description, metoo_count')
    .eq('category_id', categoryId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (data || []) as QuestionSummary[];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) return { title: 'Topic Not Found' };

  return {
    title: `${category.name} — Questions & Advice | ${SITE_NAME}`,
    description: category.description || `Explore honest questions and sisterly guidance about ${category.name}. Real advice for Indian women.`,
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description,
      type: 'website',
      url: `${SITE_URL}/category/${slug}`
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) notFound();

  const questions = await getCategoryQuestions(category.id);
  const itemListSchema = buildItemListSchema(category, questions);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <Link href="/" className="inline-flex items-center text-pg-ink-500 hover:text-pg-violet-700 mb-12 transition-colors font-cinzel text-sm tracking-widest uppercase group animate-slide-up">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        
        {/* Category Header */}
        <div className="surface-card p-12 mb-16 relative overflow-hidden animate-slide-up stagger-1 border-t-4 border-pg-violet-800">
           <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left relative z-10">
            <div className="bg-pg-parch-100 w-24 h-24 rounded-sm shadow-inner border border-pg-parch-300 flex items-center justify-center text-5xl">
              {category.icon || '💜'}
            </div>
            <div>
              <h1 className="font-im-fell text-4xl md:text-6xl text-pg-ink-900 mb-4 tracking-tight">
                {category.name}
              </h1>
              <p className="text-pg-ink-600 text-xl leading-relaxed max-w-xl italic border-l-2 border-pg-gold-500 pl-4">
                {category.description || `Explore the honest questions and sisterly guidance about ${category.name}.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Question List */}
        {questions.length > 0 ? (
          <div>
            <div className="flex items-center gap-3 mb-10 animate-slide-up stagger-2">
              <Sparkles className="w-6 h-6 text-pg-violet-700" />
              <h2 className="font-cinzel text-2xl text-pg-ink-900 tracking-wider">Trending in {category.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {questions.map((q, i) => (
                <Link 
                  key={q.slug}
                  href={`/q/${q.slug}`}
                  className="surface-card p-8 flex flex-col group hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(90,48,160,0.1)] hover:border-pg-violet-400 transition-all duration-500 animate-slide-up"
                  style={{ animationDelay: `${(i % 10) * 0.1}s` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pg-violet-800 to-pg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <h2 className="font-im-fell text-2xl text-pg-ink-900 mb-4 group-hover:text-pg-violet-800 transition-colors leading-snug">
                    {q.title}
                  </h2>
                  
                  <div className="flex items-center justify-between text-sm mt-auto pt-6 border-t border-pg-parch-300">
                    <span className="flex items-center text-pg-ink-500 font-cinzel tracking-widest text-[10px]">
                      <Heart className="w-4 h-4 mr-2 text-pg-crimson-600" />
                      {q.metoo_count || 0} GIRLS ASKED
                    </span>
                    <span className="text-pg-violet-700 font-cinzel font-bold tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-3 transition-all uppercase">
                      Read answer <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 surface-card border-dashed border-pg-parch-400 animate-slide-up stagger-2">
            <div className="text-5xl mb-6 font-unifraktur">N</div>
            <h3 className="font-cinzel text-xl text-pg-ink-800 tracking-widest mb-4">No questions here yet</h3>
            <p className="text-pg-ink-500 italic mb-10">Be the first to ask your elder sisters about {category.name}!</p>
            <Link href="/ask" className="inline-block bg-pg-violet-800 text-pg-gold-300 font-cinzel text-xs tracking-[0.2em] uppercase px-10 py-4 shadow-lg hover:scale-105 transition-all">
              Ask a Question
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
