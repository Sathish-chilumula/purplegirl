import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import QASchema from '@/components/seo/QASchema';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { GlyphAvatar } from '@/components/GlyphAvatar';
import { IlluminatedDropCap } from '@/components/IlluminatedDropCap';
import { OrnDivider } from '@/components/OrnDivider';
import { PageBackground } from '@/components/PageBackground';
import { DustMotes } from '@/components/DustMotes';

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

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) return { title: 'Folio Not Found' };

  return {
    title: `${question.title} | ${SITE_NAME}`,
    description: question.answers?.summary || `Deciphering the cipher: ${question.title}`,
    openGraph: {
      title: question.title,
      description: question.answers?.summary || `Deciphering the cipher: ${question.title}`,
      type: 'article',
      url: `${SITE_URL}/q/${slug}`
    }
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const question = await getQuestionData(slug);

  if (!question) notFound();

  const { data: related } = await supabaseAdmin
    .from('questions')
    .select('slug, title')
    .eq('category_id', question.category_id)
    .neq('id', question.id)
    .eq('status', 'approved')
    .limit(3);

  const isBotanical = question.categories?.name?.toLowerCase().includes('botanical');
  const volumeName = question.categories?.name || 'VOL. I: THE BOTANICAL CODEX';

  return (
    <div className="relative min-h-screen bg-pg-parch-50 text-pg-ink-900 pb-32">
      <PageBackground />
      <DustMotes />

      <QASchema 
        question={{
          title: question.title,
          description: question.description || '',
          created_at: question.created_at,
          upvote_count: question.metoo_count
        }}
        answer={question.answers ? {
          text: question.answers.summary || (question.answers.chat_log && Array.isArray(question.answers.chat_log) ? question.answers.chat_log[0] : ''),
          created_at: question.created_at,
          upvote_count: 0
        } : undefined}
        url={`${SITE_URL}/q/${question.slug}`}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-24 relative z-10">
        
        {/* The 12-col Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ── LEFT SIDEBAR (Cols 1-3) ── */}
          <aside className="lg:col-span-3 flex flex-col gap-8 lg:sticky lg:top-24 h-max">
            <div>
              <Link href="/" className="font-cinzel text-[10px] tracking-widest text-pg-ink-400 hover:text-pg-crimson-600 transition-colors uppercase flex items-center gap-2">
                ← Return to Archives
              </Link>
            </div>

            <div className="surface-card p-6 border-t border-t-pg-gold-500">
              <div className="font-cinzel text-[9px] tracking-[0.2em] text-pg-crimson-600 mb-2 animate-pulse">
                CURRENT VOLUME
              </div>
              <h3 className="font-im-fell text-xl text-pg-ink-900 mb-4">{volumeName}</h3>
              <div className="w-12 h-12 rounded-full border border-pg-crimson-600 flex items-center justify-center opacity-70">
                <GlyphAvatar userId={question.id} className="scale-75" />
              </div>
            </div>

            <div className="font-cinzel text-[8px] tracking-[0.3em] text-pg-ink-400 uppercase space-y-2">
              <p>RECORDED: {new Date(question.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p>CIPHER KEY: {question.id.substring(0, 8)}</p>
              <p>VIEWS: {question.view_count || 0}</p>
            </div>
          </aside>

          {/* ── MAIN CONTENT (Cols 4-10) ── */}
          <main className="lg:col-span-7">
            <header className="relative mb-16 animate-slide-up">
              <IlluminatedDropCap letter="Q" variant="crimson" className="-left-12 -top-10" />
              <div className="font-cinzel text-[10px] tracking-[0.3em] text-pg-crimson-600 mb-6 uppercase opacity-80 pl-2">
                The Seekers Whisper
              </div>
              <h1 className="font-im-fell text-4xl lg:text-5xl text-pg-ink-900 leading-[1.15] italic pl-2 relative z-10">
                {question.title}
              </h1>
              {question.description && (
                <p className="mt-8 text-xl text-pg-ink-600 font-crimson pl-6 border-l border-pg-crimson-600/30">
                  {question.description}
                </p>
              )}
            </header>

            <OrnDivider variant="both" className="my-16" />

            <section className="prose prose-purplegirl max-w-none font-crimson text-lg text-pg-ink-800 leading-[1.8] animate-slide-up stagger-2">
              <div className="font-cinzel text-[10px] tracking-[0.3em] text-pg-gold-600 mb-8 uppercase opacity-80 text-center">
                The Oracle's Decipherment
              </div>

              {/* Apply inkSeep manually to paragraphs if they are in chat_log */}
              <style>{`
                .oracle-answer p { animation: inkSeep 0.8s var(--ease-out) both; margin-bottom: 1.5rem; }
                .oracle-answer p:nth-child(1) { animation-delay: 0.1s; }
                .oracle-answer p:nth-child(2) { animation-delay: 0.2s; }
                .oracle-answer p:nth-child(3) { animation-delay: 0.3s; }
                .oracle-answer p:nth-child(4) { animation-delay: 0.4s; }
                .oracle-answer em { color: var(--pg-crimson-600); font-style: italic; }
                .oracle-answer strong { color: var(--pg-gold-700); font-weight: normal; }
                .oracle-answer blockquote { border-left: 2px solid var(--pg-crimson-600); padding-left: 1.5rem; color: var(--pg-ink-600); font-style: italic; }
              `}</style>

              <div className="oracle-answer">
                {question.answers?.chat_log ? (
                  Array.isArray(question.answers.chat_log) ? (
                    question.answers.chat_log.map((msg: string, i: number) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: msg }} />
                    ))
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: question.answers.chat_log }} />
                  )
                ) : (
                  <p className="italic text-center text-pg-ink-400">The ink has not yet dried on this response...</p>
                )}
              </div>
            </section>

            {question.answers?.bullet_points && question.answers.bullet_points.length > 0 && (
              <section className="mt-16 bg-pg-parch-100 border border-pg-parch-200 p-8 rounded-sm animate-slide-up stagger-3">
                <h3 className="font-cinzel text-sm tracking-widest text-pg-ink-900 uppercase mb-6 text-center">
                  The Sacred Precepts
                </h3>
                <ul className="space-y-4">
                  {question.answers.bullet_points.map((pt: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start font-crimson text-pg-ink-700 text-lg">
                      <span className="font-cinzel text-pg-crimson-600 text-sm mt-1">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <OrnDivider variant="simple" className="my-16" />

            {/* Share & Follow Up */}
            <div className="flex flex-col items-center justify-center gap-6 animate-slide-up stagger-4">
              <p className="font-cinzel text-[10px] tracking-widest text-pg-ink-500 uppercase">
                Does this cipher resonate with you?
              </p>
              <div className="flex gap-4">
                <button className="bg-pg-parch-100 hover:bg-pg-parch-200 border border-pg-parch-300 px-6 py-3 font-cinzel text-[10px] tracking-widest uppercase transition-colors">
                  Share Whisper
                </button>
                <Link href={`/ask?q=${encodeURIComponent('I saw a similar question: ' + question.title)}`} className="bg-pg-crimson-600 hover:bg-pg-crimson-500 text-white px-6 py-3 font-cinzel text-[10px] tracking-widest uppercase shadow-sm transition-colors">
                  Ask Follow-up
                </Link>
              </div>
            </div>

          </main>

          {/* ── RIGHT MARGIN (Cols 11-12) ── */}
          <aside className="hidden lg:block lg:col-span-2">
             <div className="sticky top-24 pt-12 flex flex-col items-center gap-12 border-l border-pg-parch-200 pl-8 h-max">
                {/* Visual anchor point */}
                <div className="w-1 h-16 bg-pg-parch-300" />
                
                {related && related.length > 0 && (
                  <div className="space-y-6 w-full">
                    <div className="font-cinzel text-[8px] tracking-[0.2em] text-pg-ink-400 uppercase text-center mb-4">
                      Related Folios
                    </div>
                    {related.map(r => (
                      <Link key={r.slug} href={`/q/${r.slug}`} className="block group">
                        <h4 className="font-im-fell italic text-pg-ink-700 group-hover:text-pg-crimson-600 transition-colors leading-tight text-sm text-center">
                          {r.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                )}
             </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
