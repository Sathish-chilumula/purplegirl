import React from 'react';
import SmartProductWidget from '@/components/monetization/SmartProductWidget';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ArticleSchemas } from '@/components/seo/ArticleSchemas';
import { ChevronRight, Lock, AlertTriangle, Sparkles, ChevronDown, Shield } from 'lucide-react';
import { Metadata } from 'next';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { FeedbackWidget } from '@/components/articles/FeedbackWidget';
import { SaveGuideButton } from '@/components/articles/SaveGuideButton';
import { getDictionary } from '@/lib/dictionary';
import { getExpertForCategory } from '@/lib/experts';
import { Card } from '@/components/ui/Card';
import { OtherWomenAsked } from '@/components/articles/OtherWomenAsked';
import { LeadCaptureWidget } from '@/components/articles/LeadCaptureWidget';

export const runtime = 'edge';

async function getArticleData(slug: string, lang: string) {
  // Try to find exact slug match first (e.g., if they navigated to 'my-guide-hi' directly)
  const { data: exactMatch } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  // If we found it, and its language matches the route, or it's english, return it.
  if (exactMatch && exactMatch.language === lang) {
    return { article: exactMatch, redirectSlug: null };
  }

  // If the user requested an English slug (e.g. 'my-guide') but under a translated route (e.g. '/hi/')
  if (lang !== 'en') {
    // Attempt to find the translated version of this slug
    const { data: translatedMatch } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('language', lang)
      .or(`slug.eq.${slug}-${lang},slug.like.${slug.substring(0, 50)}%`)
      .eq('is_published', true)
      .limit(1)
      .single();
      
    if (translatedMatch) {
      // We found the translation! We should redirect the user to the correct native slug.
      return { article: null, redirectSlug: translatedMatch.slug };
    }
  }

  // Fallback to the exact match (even if it's the wrong language)
  return { article: exactMatch, redirectSlug: null };
}

/**
 * Fetches real related articles:
 * 1. First tries using the article's related_article_slugs array
 * 2. Falls back to other articles in the same category
 */
async function getRelatedQuiz(category: string) {
  // Find a quiz matching the article category, fallback to relationships
  const categoryMap: Record<string, string[]> = {
    'relationships-marriage': ['relationship-health-check', 'emotional-dependency-quiz', 'what-does-your-love-language-say-about-you', 'what-kind-of-wife-are-you', 'are-you-ready-for-marriage'],
    'mental-health-emotions': ['sacrifice-level-quiz', 'are-you-a-people-pleaser', 'what-triggers-your-anxiety', 'whats-your-self-sabotage-style'],
    'family-parenting': ['inlaw-boundary-quiz', 'what-kind-of-daughter-in-law-are-you'],
    'womens-health': ['pcos-mood-quiz', 'how-healthy-is-your-relationship-with-food'],
    'self-growth': ['bollywood-heroine-personality-match', 'which-indian-goddess-are-you', 'are-you-a-people-pleaser'],
    'career-workplace': ['sacrifice-level-quiz', 'whats-your-self-sabotage-style'],
    'health': ['pcos-mood-quiz', 'how-healthy-is-your-relationship-with-food'],
  };
  const preferred = categoryMap[category] || [];
  const slug = preferred[0] || 'relationship-health-check';
  const { data } = await supabaseAdmin
    .from('quizzes')
    .select('slug, title, category, thumbnail_emoji')
    .eq('is_published', true)
    .in('slug', preferred.length > 0 ? preferred : ['relationship-health-check'])
    .limit(1)
    .single();
  return data || { slug, title: 'Take a Quiz', category, thumbnail_emoji: '✨' };
}

async function getRelatedArticles(article: any) {
  // Try related_article_slugs first
  if (article.related_article_slugs && article.related_article_slugs.length > 0) {
    const { data } = await supabaseAdmin
      .from('articles')
      .select('slug, title')
      .in('slug', article.related_article_slugs.slice(0, 4))
      .eq('is_published', true);
    if (data && data.length > 0) return data;
  }
  // Fallback: same category, excluding current article
  const { data } = await supabaseAdmin
    .from('articles')
    .select('slug, title')
    .eq('category', article.category)
    .eq('is_published', true)
    .neq('slug', article.slug)
    .order('view_count', { ascending: false })
    .limit(4);
  return data || [];
}

const SITE_URL = 'https://purplegirl.in';

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

import { redirect, notFound } from 'next/navigation';
import { autoLink } from '@/lib/auto-link';

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const { article, redirectSlug } = await getArticleData(slug, lang);
  
  if (redirectSlug) {
    return { title: 'Redirecting...' };
  }

  if (!article) return { title: 'Not Found' };
  
  return {
    // Let the layout template append " | PurpleGirl" — don't add it here to avoid double-branding
    title: article.title,
    description: article.meta_description || article.intro,
    alternates: {
      canonical: lang === 'en' ? `/how-to/${slug}` : `/${lang}/how-to/${slug}`,
      languages: {
        'en': `${SITE_URL}/how-to/${slug}`,
        'hi': `${SITE_URL}/hi/how-to/${slug}`,
        'te': `${SITE_URL}/te/how-to/${slug}`,
        'x-default': `${SITE_URL}/how-to/${slug}`,
      }
    },
    openGraph: {
      title: article.title,
      description: article.meta_description || article.intro,
      type: 'article',
      url: lang === 'en' ? `${SITE_URL}/how-to/${slug}` : `${SITE_URL}/${lang}/how-to/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description || article.intro,
    },
  };
}

export default async function HowToArticlePage({ params }: ArticlePageProps) {
  const { lang, slug } = await params;
  const { article, redirectSlug } = await getArticleData(slug, lang);

  if (redirectSlug) {
    redirect(`/${lang}/how-to/${redirectSlug}`);
  }

  if (!article) {
    notFound();
  }

  const dict = await getDictionary(lang as any);

  // Fetch related articles, matching quiz, and increment views in parallel
  const [relatedArticles, relatedQuiz] = await Promise.all([
    getRelatedArticles(article),
    getRelatedQuiz(article.category),
    supabaseAdmin.rpc('increment_view_count', { article_id: article.id }).then(),
  ]);

  return (
    <>
      <ArticleSchemas article={article} />
      
      <div className="bg-white min-h-screen">
        <div className="max-w-content mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
          
          {/* ━━━━━━━━━━━━━━━━━━━━━━━
              LEFT COLUMN (70%)
              ━━━━━━━━━━━━━━━━━━━━━━━ */}
          <article className="lg:w-[70%] max-w-article">
            
            {/* 1. Breadcrumb */}
            <nav className="flex items-center text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-8" aria-label="breadcrumb">
              <Link href="/" className="hover:text-pg-rose">Home</Link>
              <ChevronRight size={14} className="mx-2" />
              <Link href={`/category/${article.category}`} className="hover:text-pg-rose">
                {article.category.replace(/-/g, ' ')}
              </Link>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-pg-gray-900 truncate max-w-[200px] sm:max-w-none">
                {article.title}
              </span>
            </nav>

            {/* 2. Article Header */}
            <header className="mb-10">
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-pg-gray-900 leading-[1.1] mb-6">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-pg-gray-500 font-medium">
                  <span>By PurpleGirl Editors</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Updated {new Date(article.published_at || article.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    {(() => {
                      const words = (article.intro + ' ' + (article.content_json?.steps?.map((s: any) => s.headline + ' ' + s.body).join(' ') || '')).split(/\s+/).length;
                      return Math.ceil(words / 200);
                    })()} min read
                  </span>
                </div>
                <SaveGuideButton slug={article.slug} saveLabel={dict.article_save} savedLabel={dict.article_saved} />
              </div>

              {/* In-Article Language Switcher */}
              <div className="mt-8 p-4 bg-pg-rose/5 border border-pg-rose/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-pg-gray-800">
                  <span className="text-xl">🌐</span>
                  Read this guide in your language:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/how-to/${slug}`} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-pg-rose text-white' : 'bg-white text-pg-gray-600 hover:text-pg-rose border border-pg-gray-200 hover:border-pg-rose/30'}`}>🇺🇸 English</Link>
                  <Link href={`/hi/how-to/${slug}`} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${lang === 'hi' ? 'bg-pg-rose text-white' : 'bg-white text-pg-gray-600 hover:text-pg-rose border border-pg-gray-200 hover:border-pg-rose/30'}`}>🇮🇳 हिन्दी</Link>
                  <Link href={`/te/how-to/${slug}`} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${lang === 'te' ? 'bg-pg-rose text-white' : 'bg-white text-pg-gray-600 hover:text-pg-rose border border-pg-gray-200 hover:border-pg-rose/30'}`}>🇮🇳 తెలుగు</Link>
                </div>
              </div>

              {/* Expert Reviewer Badge */}
              {(() => {
                const expert = getExpertForCategory(article.category);
                return (
                  <Link
                    href="/experts"
                    className="mt-5 flex items-center gap-3 bg-pg-cream border border-pg-gray-100 rounded-xl px-4 py-3 hover:border-pg-rose transition-colors group w-full sm:w-auto sm:inline-flex"
                  >
                    <div className="w-9 h-9 rounded-full bg-pg-rose-light border border-pg-rose/20 flex items-center justify-center shrink-0">
                      <Shield size={14} className="text-pg-rose" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-pg-gray-400">Reviewed by</p>
                      <p className="text-[13px] font-bold text-pg-gray-900 group-hover:text-pg-rose transition-colors truncate">
                        {expert.name} · <span className="font-normal text-pg-gray-600">{expert.credentials}</span>
                      </p>
                    </div>
                  </Link>
                );
              })()}
            </header>

            {/* 3. Intro (Mirror Moment) */}
            <p className="text-[18px] leading-[1.8] text-pg-gray-700 mb-10">
              {article.intro}
            </p>

            {/* 4. Ad Slot 1 — hidden until AdSense approved */}
            <AdSenseUnit slot="top-article" className="my-8" />

            {/* 8. Things You'll Need (Moved up for WikiHow style if exists) */}
            {article.content_json?.things_needed && article.content_json.things_needed.length > 0 && (
              <div className="bg-pg-rose-light p-6 rounded-2xl mb-12 border border-pg-rose/20">
                <h3 className="font-display text-2xl font-bold mb-4 text-pg-gray-900">What You'll Need</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {article.content_json.things_needed.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-pg-gray-700 text-sm">
                      <div className="w-2 h-2 rounded-full bg-pg-rose mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Steps Section */}
            <div className="space-y-16">
              {article.content_json?.steps?.map((step: any, index: number) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pg-rose text-white flex items-center justify-center font-bold text-xl shrink-0 mt-1">
                      {step.step_number || index + 1}
                    </div>
                    <h2 className="font-sans text-2xl font-bold text-pg-gray-900 leading-tight">
                      {step.headline}
                    </h2>
                  </div>
                  
                  <div className="pl-14">
                    <p
                      className="text-[16px] leading-[1.8] text-pg-gray-700 mb-6"
                      dangerouslySetInnerHTML={{ __html: autoLink(step.body, lang) }}
                    />

                    {step.tip && (
                      <div className="bg-pg-success/10 border border-pg-success/20 p-4 rounded-xl mb-4 text-sm text-pg-gray-900">
                        <strong className="text-pg-success block mb-1">💡 Tip:</strong>
                        {step.tip}
                      </div>
                    )}

                    {step.warning && (
                      <div className="bg-pg-warning/10 border border-pg-warning/20 p-4 rounded-xl mb-4 text-sm text-pg-gray-900">
                        <strong className="text-pg-warning block mb-1 flex items-center gap-1">
                          <AlertTriangle size={16} /> Warning:
                        </strong>
                        {step.warning}
                      </div>
                    )}

                    {/* Internal CTA to Anonymous Ask (after step 2) */}
                    {index === 1 && (
                      <div className="my-8 bg-pg-cream border border-pg-gray-100 p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
                        <div className="flex items-start gap-3">
                          <Lock className="text-pg-rose shrink-0 mt-1" />
                          <p className="text-sm font-medium text-pg-gray-700">
                            Have a specific question you can't ask anyone? 
                            Ask it anonymously. No name. No judgment.
                          </p>
                        </div>
                        <Link href="/ask" className="shrink-0 bg-pg-white border-2 border-pg-rose text-pg-rose hover:bg-pg-rose hover:text-white px-6 py-2 rounded-lg font-bold transition-colors text-sm">
                          Ask Here →
                        </Link>
                      </div>
                    )}

                    {/* Ad Slot 2 (after step 3) — hidden until AdSense approved */}
                    {index === 2 && <AdSenseUnit slot="mid-article" className="my-8" />}
                  </div>
                </div>
              ))}
            </div>

            {/* 7. Expert Tip */}
            {article.expert_tip && (
              <div className="mt-16 bg-pg-rose-light border-l-4 border-pg-rose p-6 rounded-r-2xl">
                <div className="flex items-center gap-2 text-pg-rose font-bold uppercase text-xs tracking-widest mb-3">
                  <Sparkles size={16} /> PurpleGirl Insight
                </div>
                <p className="font-display italic text-lg text-pg-gray-900 leading-relaxed">
                  "{article.expert_tip}"
                </p>
              </div>
            )}

            {/* 10. Feedback Widget */}
            <FeedbackWidget articleId={article.id} dict={dict} />

            {/* 11. Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-20">
                <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-8">
                  Related Guides
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map((rel: any) => (
                    <Link key={rel.slug} href={`/how-to/${rel.slug}`}>
                      <Card className="p-6 hover:border-pg-rose transition-colors h-full flex flex-col">
                        <h3 className="font-sans font-bold text-pg-gray-900 mb-2 leading-tight">
                          {rel.title}
                        </h3>
                        <span className="text-pg-rose text-sm font-bold mt-auto inline-flex items-center gap-1">
                          Read Guide <ChevronRight size={14} />
                        </span>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="my-16 border-t border-pg-gray-100" />

            {/* 9. FAQ Section */}
            {article.content_json?.faqs && article.content_json.faqs.length > 0 && (
              <div className="mb-16">
                <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {article.content_json.faqs.map((faq: any, i: number) => (
                    <details key={i} className="group bg-pg-cream rounded-xl border border-pg-gray-100 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-lg text-pg-gray-900">
                        {faq.q}
                        <ChevronDown className="shrink-0 transition-transform group-open:rotate-180 text-pg-rose" />
                      </summary>
                      <div className="px-6 pb-6 text-pg-gray-700 leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Product Affiliate Widget */}
            <SmartProductWidget category={article.category} title={article.title} />

            {/* Other Women Also Asked */}
            <OtherWomenAsked
              articleCategory={article.category}
              articleTitle={article.title}
            />

            {/* Lead Capture — WhatsApp + Email */}
            <LeadCaptureWidget
              category={article.category}
              articleTitle={article.title}
            />

            {/* 11. Ad Slot 3 — hidden until AdSense approved */}
            <AdSenseUnit slot="end-article" className="my-8" />

          </article>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━
              RIGHT SIDEBAR (30%)
              ━━━━━━━━━━━━━━━━━━━━━━━ */}
          <aside className="lg:w-[30%] space-y-10 lg:sticky lg:top-28 self-start">
            
            {/* Real Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-pg-cream rounded-2xl p-6 border border-pg-gray-100">
                <h3 className="font-bold text-pg-gray-900 uppercase text-xs tracking-widest mb-6">
                  More in {article.category.replace(/-/g, ' ')}
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((related: any) => (
                    <Link key={related.slug} href={`/how-to/${related.slug}`} className="block group">
                      <h4 className="font-display font-bold text-[15px] leading-tight text-pg-gray-900 group-hover:text-pg-rose transition-colors">
                        {related.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Related Quiz Widget */}
            {relatedQuiz && (
              <div className="bg-gradient-to-br from-pg-plum to-pg-plum/80 text-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-3">{relatedQuiz.thumbnail_emoji || '✨'}</div>
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                  {relatedQuiz.category?.replace(/-/g, ' ')}
                </span>
                <h3 className="font-display font-bold text-lg leading-tight mb-3">{relatedQuiz.title}</h3>
                <p className="text-xs text-white/70 mb-5">3 minutes · 100% anonymous</p>
                <Link
                  href={`/quiz/${relatedQuiz.slug}`}
                  className="block bg-white text-pg-plum font-bold py-3 px-6 rounded-xl hover:bg-pg-rose hover:text-white transition-all text-sm"
                >
                  Take Quiz →
                </Link>
              </div>
            )}

            {/* Sidebar Ad — hidden until AdSense approved */}
            <AdSenseUnit slot="sidebar" className="mt-4" />

          </aside>
        </div>
      </div>
    </>
  );
}
