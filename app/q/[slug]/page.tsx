import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Eye, Heart, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema';
import QuestionClient from '@/components/question/QuestionClient';
import FollowUpChat from '@/components/question/FollowUpChat';
import MeTooButton from '@/components/question/MeTooButton';
import AnswerWaiter from '@/components/question/AnswerWaiter';
import EmotionBar from '@/components/question/EmotionBar';
import LanguageSwitcher from '@/components/question/LanguageSwitcher';
import { SITE_NAME } from '@/lib/constants';

export const runtime = 'edge';
// SSR: Removed SSG generateStaticParams to fix 404 on new questions for Cloudflare


interface QuestionPageProps {
  params: Promise<{ slug: string }>;
}

async function getQuestionData(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('questions')
    .select(`
      id, slug, title, description, created_at, view_count, metoo_count, category_id,
      categories (name, slug),
      answers (chat_log, products, summary, detailed, bullet_points, faqs, disclaimer, chat_log_hi, chat_log_te)
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
    description: `Real support and advice for: "${question.title}"`,
    openGraph: {
      title: question.title,
      description: `Read the conversation for: ${question.title}`,
      type: 'article',
    }
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) notFound();

  // Build schema markup
  const faqSchema = buildFAQSchema({
    title: question.title,
    slug: question.slug,
    created_at: question.created_at,
    answers: question.answers,
    categories: question.categories,
  });
  const breadcrumbSchema = buildBreadcrumbSchema({
    title: question.title,
    slug: question.slug,
    categories: question.categories,
  });

  // Fetch related questions
  const { data: related } = await supabaseAdmin
    .from('questions')
    .select('slug, title')
    .eq('category_id', question.category_id)
    .neq('id', question.id)
    .eq('status', 'approved')
    .limit(4);

  const timeAgo = question.created_at ? new Date(question.created_at).toLocaleDateString() : 'Recently';

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Schema Markup for SEO */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Page-level orb backgrounds */}
      <div className="orb orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-25" />
      <div className="orb orb-pink w-[400px] h-[400px] bottom-[200px] left-[-80px] opacity-20" />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-40 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm font-medium text-gray-400 mb-8 gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar animate-slide-up">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href={`/search?category=${question.categories?.slug}`} className="hover:text-purple-600 transition-colors">{question.categories?.name}</Link>
          <span>›</span>
          <span className="text-[#1F1235] truncate max-w-[200px]">{question.title}</span>
        </div>

        {/* Header */}
        <h1 className="font-playfair font-bold text-3xl md:text-5xl text-[#1F1235] tracking-tight leading-tight mb-8 animate-slide-up">
          {question.title}
        </h1>
        
        <MeTooButton questionId={question.id} initialCount={question.metoo_count || 0} variant="prominent" />

        {/* Language Switcher for multilingual SEO */}
        <div className="mb-6 animate-slide-up">
          <LanguageSwitcher
            slug={question.slug}
            hasHindi={!!(question.answers?.chat_log_hi && (question.answers.chat_log_hi as any[]).length > 0)}
            hasTelugu={!!(question.answers?.chat_log_te && (question.answers.chat_log_te as any[]).length > 0)}
          />
        </div>

        {/* Category + Meta glass bar */}
        <div className="glass rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-3 mb-12 shadow-sm animate-slide-up stagger-1">
          <span className="font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-xs uppercase tracking-widest">
            {question.categories?.name}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Clock className="w-3.5 h-3.5" /> {timeAgo}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Eye className="w-3.5 h-3.5" /> {(question.view_count || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Heart className="w-3.5 h-3.5 text-pink-400" /> {(question.metoo_count || 0).toLocaleString()}
          </span>
        </div>

        {/* Emotion Intelligence Layer */}
        <div className="animate-slide-up stagger-1">
          <EmotionBar questionText={question.title} />
        </div>

        {question.answers ? (
          <div className="flex flex-col gap-8 animate-slide-up stagger-2">
            {/* User Bubble (The Question) */}
            <div className="flex justify-end">
              <div className="bubble-user text-white rounded-[2rem] rounded-tr-md px-6 py-4 max-w-[85%]">
                <p className="text-lg font-medium leading-relaxed">{question.title}</p>
                {question.description && (
                  <p className="text-sm mt-3 pt-3 border-t border-purple-400/50 opacity-85">{question.description}</p>
                )}
              </div>
            </div>

            {/* Sister Bubbles (The Answer) */}
            {question.answers.chat_log && Array.isArray(question.answers.chat_log) ? (
              question.answers.chat_log.map((msg: string, i: number) => (
                <div key={i} className="flex justify-start animate-slide-up" style={{ animationDelay: `${(i + 1) * 250}ms`, animationFillMode: 'both' }}>
                  <div className="flex items-end gap-3 max-w-[92%]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shrink-0 border-2 border-white shadow-md">
                      <span className="text-xl">💜</span>
                    </div>
                    <div className="bubble-sister rounded-[2rem] rounded-tl-md px-6 py-4 text-[#1F1235] text-base leading-relaxed border border-purple-50">
                      {String(msg).split('\n').map((line: string, lineIndex: number) => (
                        <p key={lineIndex} className={lineIndex > 0 ? "mt-3" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 italic">Asking our elders for the best advice...</p>
            )}

            {/* Affiliated Products */}
            {question.answers.products && question.answers.products.length > 0 && (
              <div className="flex justify-start w-full mt-4 animate-slide-up" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
                <div className="ml-12 w-full">
                  <div className="glass rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden">
                    <div className="orb orb-pink w-40 h-40 top-0 right-0 opacity-20" />
                    <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                      <Sparkles className="w-3.5 h-3.5" /> Curated just for you
                    </p>
                    <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar relative z-10">
                      {question.answers.products.map((p: any, i: number) => (
                        <a key={i} href={p.link} target="_blank" rel="noopener noreferrer"
                          className="card-premium min-w-[200px] p-3 hover:translate-y-[-4px] transition-transform">
                          <img src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-xl mb-3 bg-purple-50" />
                          <p className="font-bold text-sm text-[#1F1235] line-clamp-2">{p.title}</p>
                          <p className="text-xs font-bold text-pink-500 mt-1">{p.price}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Practical Tips */}
            {question.answers?.bullet_points && question.answers.bullet_points.length > 0 && (
              <section className="ml-12 glass rounded-[2rem] p-8 border border-purple-100 shadow-sm animate-slide-up" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
                <h2 className="font-playfair font-bold text-2xl text-[#1F1235] mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" /> Practical Tips
                </h2>
                <ul className="space-y-4">
                  {question.answers.bullet_points.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 bg-white/50 p-4 rounded-2xl border border-purple-50 transition-all hover:border-purple-200">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-[#1F1235] font-medium leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {question.answers?.faqs && question.answers.faqs.length > 0 && (
              <section className="ml-12 animate-slide-up" style={{ animationDelay: '1400ms', animationFillMode: 'both' }}>
                <h2 className="font-playfair font-bold text-2xl text-[#1F1235] mb-6">Common Questions</h2>
                <div className="space-y-3">
                  {question.answers.faqs.map((faq: any, i: number) => (
                    <details key={i} className="group glass rounded-2xl border border-purple-100 overflow-hidden transition-all duration-300">
                      <summary className="flex items-center justify-between p-5 font-bold text-[#1F1235] cursor-pointer hover:bg-purple-50/50 transition-colors list-none">
                        {faq.q}
                        <span className="transition-transform group-open:rotate-180">
                          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                      </summary>
                      <div className="p-5 pt-0 text-gray-600 leading-relaxed text-sm bg-white/30">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Disclaimer */}
            {question.answers?.disclaimer && (
              <div className="ml-12 mt-8 text-center animate-slide-up">
                <p className="text-xs text-gray-400 italic bg-gray-50/50 px-4 py-3 rounded-xl inline-block max-w-md">
                  {question.answers.disclaimer}
                </p>
              </div>
            )}

            {/* Me Too / Share / Interaction Block */}
            <div className="ml-12 animate-slide-up mt-8">
              <QuestionClient
                questionId={question.id}
                initialMeToo={question.metoo_count}
                questionTitle={question.title}
                questionSlug={question.slug}
                bulletPoints={question.answers?.bullet_points}
                summary={question.answers?.summary}
              />
            </div>

            {/* Follow-up Chat */}
            <div className="mt-12 pt-12 border-t border-purple-100/60 ml-12 animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-sm border-2 border-white shadow">💜</div>
                <p className="font-bold text-[#1F1235] text-sm">Continue the conversation…</p>
              </div>
              <FollowUpChat questionTitle={question.title} categoryName={question.categories?.name || 'General'} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-32 animate-slide-up">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-4xl border-4 border-white shadow-xl animate-pulse">💜</div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#1F1235] font-bold text-xl mb-2">PurpleGirl is thinking…</p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">We're gathering the best guidance just for you. This usually takes less than 30 seconds.</p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-typing" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-typing" style={{ animationDelay: '200ms' }} />
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-typing" style={{ animationDelay: '400ms' }} />
            </div>
            <AnswerWaiter questionId={question.id} />
          </div>
        )}

        {/* Related Questions */}
        {related && related.length > 0 && (
          <section className="mt-24 pt-12 border-t border-purple-100 animate-slide-up">
            <h2 className="font-playfair font-bold text-2xl text-[#1F1235] mb-8">More conversations you might like…</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((q: any, i: number) => (
                <Link key={i} href={`/q/${q.slug}`} className="card-premium p-6 group hover:translate-y-[-4px] transition-all">
                  <h3 className="font-bold text-[#1F1235] text-lg line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">{q.title}</h3>
                  <div className="text-purple-600 text-sm font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read answer <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

