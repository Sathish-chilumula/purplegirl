import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SITE_NAME } from '@/lib/constants';
import LanguageSwitcher from '@/components/question/LanguageSwitcher';
import TranslationTrigger from '@/components/question/TranslationTrigger';
import FollowUpChat from '@/components/question/FollowUpChat';

export const runtime = 'edge';

interface HindiPageProps {
  params: Promise<{ slug: string }>;
}

async function getHindiData(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('questions')
    .select(`
      id, slug, title, title_hi, category_id,
      categories (name, slug),
      answers (chat_log_hi, summary_hi, bullet_points_hi, chat_log, summary, bullet_points)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    categories: (data.categories as any),
    answers: (data.answers as any)?.[0] || null,
  };
}

export async function generateMetadata({ params }: HindiPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await getHindiData(slug);
  if (!question) return { title: 'Not Found' };

  const hindiTitle = question.title_hi || question.title;

  return {
    title: `${hindiTitle} | ${SITE_NAME}`,
    description: `${hindiTitle} — PurpleGirl AI की सलाह हिंदी में`,
    openGraph: { title: hindiTitle, description: `हिंदी में जवाब: ${hindiTitle}` },
    alternates: {
      languages: {
        'en': `/q/${slug}`,
        'hi': `/q/${slug}/hindi`,
        'te': `/q/${slug}/telugu`,
      },
    },
  };
}

export default async function HindiQuestionPage({ params }: HindiPageProps) {
  const { slug } = await params;
  const question = await getHindiData(slug);

  if (!question) notFound();

  const answer = question.answers;
  const hasTranslation = answer?.chat_log_hi && (answer.chat_log_hi as any[]).length > 0;
  const hindiTitle = question.title_hi || question.title;

  return (
    <div lang="hi" className="relative min-h-screen bg-white">
      {/* hreflang alternates for SEO */}
      <link rel="alternate" hrefLang="en" href={`https://purplegirl.in/q/${slug}`} />
      <link rel="alternate" hrefLang="hi" href={`https://purplegirl.in/q/${slug}/hindi`} />
      <link rel="alternate" hrefLang="te" href={`https://purplegirl.in/q/${slug}/telugu`} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back + Language Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link href={`/q/${slug}`} className="flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> English Version
          </Link>
          <LanguageSwitcher slug={slug} hasHindi={true} hasTelugu={!!answer?.chat_log_hi} />
        </div>

        {/* Language badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full text-sm font-bold text-orange-700 mb-6">
          🇮🇳 हिंदी संस्करण
        </div>

        {/* Question title in Hindi */}
        <h1 className="font-playfair font-bold text-3xl md:text-4xl text-[#1F1235] leading-tight mb-8">
          {hindiTitle}
        </h1>

        {hasTranslation ? (
          <div className="flex flex-col gap-8">
            {/* Chat bubbles in Hindi */}
            <div className="flex flex-col gap-4">
              {/* PurpleGirl avatar */}
              <div className="flex items-end gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-lg border-2 border-white shadow-md shrink-0">💜</div>
                <div className="text-xs text-gray-400 font-medium pb-1">PurpleGirl Sister</div>
              </div>

              {(answer.chat_log_hi as string[]).map((bubble: string, i: number) => (
                <div key={i} className="flex justify-start ml-12 animate-slide-up" style={{ animationDelay: `${i * 200}ms` }}>
                  <div className="bubble-ai text-white rounded-[2rem] rounded-tl-md px-6 py-4 max-w-[88%]">
                    <p className="leading-relaxed text-lg">{bubble}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bullet points */}
            {answer.bullet_points_hi && (answer.bullet_points_hi as string[]).length > 0 && (
              <section className="ml-12 glass rounded-[2rem] p-8 border border-purple-100">
                <h2 className="font-playfair font-bold text-2xl text-[#1F1235] mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" /> व्यावहारिक सुझाव
                </h2>
                <ul className="space-y-4">
                  {(answer.bullet_points_hi as string[]).map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 bg-white/50 p-4 rounded-2xl border border-purple-50">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-[#1F1235] font-medium leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Follow up chat */}
            <div className="mt-8 pt-8 border-t border-purple-100/60 ml-12">
              <p className="font-bold text-[#1F1235] text-sm mb-4">💜 बातचीत जारी रखें…</p>
              <FollowUpChat questionTitle={question.title} categoryName={(question.categories as any)?.name || 'General'} />
            </div>
          </div>
        ) : (
          /* First-time visitor — trigger translation */
          <TranslationTrigger questionId={question.id} lang="hi" langName="हिंदी" />
        )}
      </div>
    </div>
  );
}
