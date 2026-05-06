import React from 'react';
import SmartProductWidget from '@/components/monetization/SmartProductWidget';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ArticleSchemas } from '@/components/seo/ArticleSchemas';
import { ChevronRight, Lock, AlertTriangle, Sparkles, ChevronDown } from 'lucide-react';
import { Metadata } from 'next';
import AdSenseUnit from '@/components/ads/AdSenseUnit';

export const runtime = 'edge';

async function getArticleData(slug: string) {
  const { data } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

/**
 * Fetches real related articles:
 * 1. First tries using the article's related_article_slugs array
 * 2. Falls back to other articles in the same category
 */
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleData(params.slug);
  if (!article) return { title: 'Not Found' };
  
  const baseSlug = article.slug.replace('-hi', '').replace('-te', '');

  return {
    title: `${article.title} | PurpleGirl`,
    description: article.meta_description || article.intro,
    alternates: {
      canonical: `/how-to/${article.slug}`,
      languages: {
        'en-IN': `/how-to/${baseSlug}`,
        'hi-IN': `/how-to/${baseSlug}-hi`,
        'te-IN': `/how-to/${baseSlug}-te`,
      }
    },
    openGraph: {
      title: article.title,
      description: article.meta_description || article.intro,
      type: 'article',
    }
  };
}

export default async function HowToArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);

  if (!article) {
    notFound();
  }

  // Fetch real related articles in parallel with view count increment
  const [relatedArticles] = await Promise.all([
    getRelatedArticles(article),
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
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-pg-gray-500 font-medium">
                <span>By PurpleGirl Editors</span>
                <span>•</span>
                <span>Updated {new Date(article.published_at || article.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span>{article.reading_time_mins || 6} min read</span>
              </div>
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
                    <p className="text-[16px] leading-[1.8] text-pg-gray-700 mb-6">
                      {step.body}
                    </p>

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

            {/* Quiz Widget */}
            <div className="bg-pg-plum text-white rounded-2xl p-8 text-center">
              <h3 className="font-display font-bold text-2xl mb-3">Is Your Relationship Healthy or Toxic?</h3>
              <p className="text-sm text-pg-plum-light mb-6">Take our 3-minute quiz to find out anonymously.</p>
              <Link href="/quiz/relationship-health-check" className="inline-block bg-white text-pg-plum font-bold py-3 px-6 rounded-xl hover:bg-pg-plum-light transition-colors text-sm w-full">
                Take the Quiz →
              </Link>
            </div>

            {/* Sidebar Ad — hidden until AdSense approved */}
            <AdSenseUnit slot="sidebar" className="mt-4" />

          </aside>
        </div>
      </div>
    </>
  );
}
