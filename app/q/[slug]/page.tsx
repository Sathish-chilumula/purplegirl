import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import QASchema from '@/components/seo/QASchema';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { PageBackground } from '@/components/PageBackground';
import { AnswerCard } from '@/components/AnswerCard';

export const runtime = 'edge';

interface QuestionPageProps {
  params: Promise<{ slug: string }>;
}

async function getQuestionData(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('questions')
    .select(`
      id, slug, title, description, created_at, view_count, metoo_count, category_id,
      categories (name, slug),
      answers (id, chat_log, products, summary, detailed, bullet_points, faqs, disclaimer)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    categories: (data.categories as any),
    answers: (data.answers as any)?.[0] || null
  };
}

async function getRelatedQuestions(categoryId: string, excludeId: string) {
  const { data } = await supabaseAdmin
    .from('questions')
    .select('slug, title')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .eq('status', 'approved')
    .limit(4);
  return data || [];
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) return { title: 'Folio Not Found' };

  return {
    title: `${question.title} | ${SITE_NAME}`,
    description: question.answers?.summary || `Honest advice for: ${question.title}`,
    openGraph: {
      title: question.title,
      description: question.answers?.summary || `Honest advice for: ${question.title}`,
      type: 'article',
      url: `${SITE_URL}/q/${slug}`
    }
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) notFound();

  const related = await getRelatedQuestions(question.category_id, question.id);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      
      {/* Schema for Google Rich Results */}
      <QASchema 
        question={question.title}
        answer={question.answers?.summary || 'Thinking...'}
        url={`${SITE_URL}/q/${slug}`}
      />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-purple-600 mb-8 transition-colors font-bold text-xs uppercase tracking-[0.2em] group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to library
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <AnswerCard question={question} answer={question.answers} />
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-32 space-y-8">
              {/* Category Context */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Topic Archive</div>
                <Link href={`/category/${question.categories?.slug}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-syne font-bold">
                    {question.categories?.name?.charAt(0)}
                  </div>
                  <div className="font-syne font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {question.categories?.name}
                  </div>
                </Link>
              </div>

              {/* Related Questions */}
              {related.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={16} className="text-purple-600" />
                    <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">More Whispers</div>
                  </div>
                  <div className="space-y-6">
                    {related.map((r: any) => (
                      <Link key={r.slug} href={`/q/${r.slug}`} className="block group">
                        <h4 className="text-sm font-bold text-slate-700 leading-snug group-hover:text-purple-600 transition-colors">
                          {r.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
                <Sparkles className="mb-4 opacity-50" size={24} />
                <h3 className="font-syne font-bold text-xl mb-4">Have your own secret?</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Ask anything. 100% anonymous. We're here to listen and help.</p>
                <Link href="/ask" className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold text-sm block text-center hover:scale-105 transition-transform">
                  Ask Your Question
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
