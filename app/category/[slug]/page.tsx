import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, Heart, ArrowRight, Zap } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { buildItemListSchema } from '@/lib/schema';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { PageBackground } from '@/components/PageBackground';

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
    title: `${category.name} | ${SITE_NAME}`,
    description: category.description || `Explore honest questions and sisterly guidance about ${category.name}.`,
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

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-purple-600 mb-12 transition-colors font-bold text-xs uppercase tracking-[0.2em] group animate-slide-up">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to library
        </Link>
        
        {/* Category Header */}
        <div className="bg-white rounded-[2rem] p-10 md:p-16 mb-20 shadow-2xl border border-slate-100 relative overflow-hidden animate-slide-up stagger-1">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 text-center md:text-left relative z-10">
            <div className="bg-purple-100 w-32 h-32 rounded-3xl shadow-lg border border-white flex items-center justify-center text-6xl transform -rotate-6">
              {category.icon || '💜'}
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                <Zap size={14} className="fill-purple-600" /> Topic Archive
              </div>
              <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-none">
                {category.name}
              </h1>
              <p className="text-slate-500 text-xl leading-relaxed max-w-2xl font-medium">
                {category.description || `Explore honest questions and sisterly guidance about ${category.name}. No filters, no judgment.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Question List */}
        {questions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-12 animate-slide-up stagger-2">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="font-syne text-3xl font-bold text-slate-900">The Vault</h2>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {questions.length} Questions Answered
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {questions.map((q, i) => (
                <Link 
                  key={q.slug}
                  href={`/q/${q.slug}`}
                  className="bg-white rounded-3xl p-8 flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:border-purple-200 border border-slate-100 transition-all duration-500 animate-slide-up"
                  style={{ animationDelay: `${(i % 10) * 0.1}s` }}
                >
                  <h2 className="font-syne text-2xl font-bold text-slate-900 mb-6 group-hover:text-purple-600 transition-colors leading-tight">
                    {q.title}
                  </h2>
                  
                  <div className="flex items-center justify-between text-sm mt-auto pt-6 border-t border-slate-50">
                    <span className="flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <Heart className="w-4 h-4 mr-2 group-hover:text-pink-500 group-hover:fill-pink-500 transition-colors" />
                      {q.metoo_count || 0} Relate
                    </span>
                    <span className="text-purple-600 font-bold tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-4 transition-all uppercase">
                      Open Whisper <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 animate-slide-up stagger-2">
            <div className="text-6xl mb-8">🤫</div>
            <h3 className="font-syne text-2xl font-bold text-slate-900 mb-4 tracking-tight">The Vault is Silent... for now.</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-12">Be the first to break the silence. Ask your elder sisters anything about {category.name}.</p>
            <Link href="/ask" className="btn-premium px-12 py-5 text-lg">
              Ask A Question
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
