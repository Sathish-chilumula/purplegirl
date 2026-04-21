import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Eye, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import QuestionClient from '@/components/question/QuestionClient';
import FollowUpChat from '@/components/question/FollowUpChat';
import { SITE_NAME } from '@/lib/constants';

interface QuestionPageProps {
  params: Promise<{ slug: string }>;
}

async function getQuestionData(slug: string) {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      id, slug, title, description, created_at, view_count, metoo_count, category_id,
      categories (name, slug),
      answers (summary, detailed, bullet_points, faqs, disclaimer, products)
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

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) return { title: 'Question Not Found' };

  return {
    title: `${question.title} | ${SITE_NAME}`,
    description: question.answers?.summary || question.description || `Read expert advice and sisterly answers for "${question.title}" on ${SITE_NAME}.`,
    openGraph: {
      title: question.title,
      description: question.answers?.summary,
      type: 'article',
    }
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) notFound();

  // Fetch related questions
  const { data: related } = await supabase
    .from('questions')
    .select('slug, title')
    .eq('category_id', question.category_id)
    .neq('id', question.id)
    .eq('status', 'approved')
    .limit(4);

  const timeAgo = question.created_at ? new Date(question.created_at).toLocaleDateString() : 'Recently';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm font-medium text-text-secondary mb-8 gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <Link href="/" className="hover:text-purple-primary transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/search?category=${question.categories?.slug}`} className="hover:text-purple-primary transition-colors">{question.categories?.name}</Link>
        <span>›</span>
        <span className="text-text-primary truncate">{question.title}</span>
      </div>

      {/* Header */}
      <h1 className="font-playfair font-bold text-3xl md:text-5xl text-text-primary tracking-tight leading-tight mb-6">
        {question.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-8 pb-8 border-b border-purple-50">
        <span className="font-semibold text-purple-primary bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider text-xs">
          {question.categories?.name}
        </span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {timeAgo}</span>
        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {(question.view_count || 0).toLocaleString()}</span>
        <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-accent" /> {(question.metoo_count || 0).toLocaleString()}</span>
      </div>

      {question.answers ? (
        <>
          {/* Quick Answer */}
          <div className="bg-[#F3E8FF] border-l-4 border-[#7C3AED] rounded-2xl p-6 mb-8 shadow-sm">
            <div className="text-[#7C3AED] font-bold text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
              <span>💜</span> Quick Answer
            </div>
            <p className="text-text-primary font-medium text-lg leading-relaxed">
              {question.answers.summary}
            </p>
          </div>

          {/* Detailed Explanation */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl text-text-primary mb-4">Full Explanation</h2>
            <div className="text-lg text-text-primary leading-relaxed space-y-4">
              {question.answers.detailed?.split('\n\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* Practical Tips */}
          {question.answers.bullet_points && question.answers.bullet_points.length > 0 && (
            <section className="mb-12 bg-white border border-purple-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-bold text-2xl text-text-primary mb-6">Practical Tips</h2>
              <ul className="space-y-4">
                {question.answers.bullet_points.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-4 bg-[#FAF5FF] p-4 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-[#7C3AED] shrink-0 mt-0.5" />
                    <span className="text-text-primary font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {question.answers.faqs && question.answers.faqs.length > 0 && (
            <section className="mb-12">
              <h2 className="font-bold text-2xl text-text-primary mb-6">Common Questions</h2>
              <div className="space-y-4">
                {question.answers.faqs.map((faq: any, i: number) => (
                  <details key={i} className="group bg-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-6 font-bold text-text-primary cursor-pointer hover:bg-[#FAF5FF] transition-colors">
                      {faq.q}
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="p-6 pt-0 text-text-secondary leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Shop This (Monetization) */}
          {question.answers.products && question.answers.products.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🛍️</span>
                <h2 className="font-bold text-2xl text-text-primary">Shop Our Recommendations</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.answers.products.map((product: any, i: number) => (
                  <a 
                    key={i} 
                    href={product.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group"
                  >
                    <img 
                      src={product.image || 'https://picsum.photos/seed/purple/200/200'} 
                      alt={product.title}
                      className="w-20 h-20 rounded-2xl object-cover bg-gray-50"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/purple/200/200'; }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary text-sm line-clamp-2 group-hover:text-purple-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="text-pink-accent font-bold text-sm mt-1">{product.price}</div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          {question.answers.disclaimer && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500 mb-12 italic text-center">
              {question.answers.disclaimer}
            </div>
          )}

          {/* AI Follow Up Chat */}
          <FollowUpChat 
            questionTitle={question.title} 
            categoryName={question.categories?.name || 'General'} 
          />

          {/* Client Side Interaction Block */}
          <QuestionClient 
            questionId={question.id}
            initialMeToo={question.metoo_count}
            questionTitle={question.title}
            questionSlug={question.slug}
            bulletPoints={question.answers.bullet_points}
            summary={question.answers.summary}
          />
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-8 text-center mb-12">
          <p className="text-yellow-800 font-medium italic">Our sisters are currently writing an answer for this question. Please check back in a few minutes! 💜</p>
        </div>
      )}

      {/* Related Questions */}
      {related && related.length > 0 && (
        <section>
          <h2 className="font-bold text-2xl text-text-primary mb-6">Girls also asked…</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {related.map((q: any, i: number) => (
              <Link 
                key={i}
                href={`/q/${q.slug}`}
                className="bg-white p-5 rounded-2xl border border-purple-50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <h3 className="font-bold text-text-primary line-clamp-2">{q.title}</h3>
                <div className="text-purple-primary text-sm font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read answer <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

