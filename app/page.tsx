import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { AskBox } from '@/components/home/AskBox';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HeroIllustration } from '@/components/home/HeroIllustration';
import * as motion from "motion/react-client";
import type { Metadata } from 'next';
import { HomeSchema } from '@/components/seo/HomeSchema';

export const metadata: Metadata = {
  title: "How-To Guides & Anonymous Advice for Indian Women",
  description: "Honest how-to guides on relationships, health, career, skin, and more — written for Indian women. 100% anonymous Q&A, no login required.",
  alternates: {
    canonical: '/',
  },
};

export const runtime = 'edge';

async function getHomeData() {
  const [categoriesRes, articlesRes, quizzesRes] = await Promise.all([
    supabaseAdmin
      .from('categories')
      .select('*')
      .lt('display_order', 99)          // exclude sex-intimacy (display_order = 99)
      .order('display_order', { ascending: true }),
    supabaseAdmin
      .from('articles')
      .select('slug, title, intro, reading_time_mins, category')
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(6),
    supabaseAdmin
      .from('quizzes')
      .select('slug, title, category, thumbnail_emoji')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  return {
    categories: categoriesRes.data || [],
    featuredArticles: articlesRes.data || [],
    latestQuizzes: quizzesRes.data || [],
  };
}

export default async function Home() {
  const { categories, featuredArticles, latestQuizzes } = await getHomeData();

  return (
    <>
      <HomeSchema />
      <div className="bg-pg-cream min-h-screen pb-20">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — Hero Search Bar
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pt-12 pb-16 md:pt-24 md:pb-20 px-6 relative bg-pg-rose-light overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E91E8C_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="max-w-[1100px] mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 fade-up">

          {/* Mobile: Illustration comes first (order-1), Desktop: Illustration goes right (order-2) */}
          <div className="w-full md:w-[45%] order-1 md:order-2 flex justify-center shrink-0">
            <HeroIllustration />
          </div>

          {/* Mobile: Text comes second (order-2), Desktop: Text goes left (order-1) */}
          <div className="w-full md:w-[55%] order-2 md:order-1 text-center md:text-left">
            {/* SEO: screen-reader only H1 */}
            <h1 className="sr-only">How-To Guides & Anonymous Advice for Indian Women</h1>

            {/* Visual headline — shown to users */}
            <p className="font-display text-[28px] md:text-[42px] font-bold text-pg-gray-900 leading-tight mb-4">
              The Safe Space for Indian Women.
              <span className="text-pg-rose block">Honest Advice & How-To Guides.</span>
            </p>
            <p className="font-sans text-[16px] md:text-[18px] text-pg-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
              Pain-first guides, honest quizzes, and anonymous Q&A — written for Indian women who can't ask anyone else.
            </p>

            <form action="/search" className="relative w-full max-w-xl mx-auto md:mx-0 mb-6">
              <input
                type="text"
                name="q"
                placeholder="Search... 'mother-in-law' or 'PCOS diet'"
                className="w-full h-[54px] pl-6 pr-32 rounded-[24px] border-2 border-white focus:border-pg-rose outline-none text-[16px] shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-pg-rose text-white px-6 rounded-full font-bold hover:bg-pg-rose-dark transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex overflow-x-auto md:flex-wrap justify-start gap-2 text-sm pb-2 hide-scrollbar w-full">
              {[
                { label: 'Period Pain', href: '/category/womens-health' },
                { label: 'Toxic Relationship', href: '/category/relationships-marriage' },
                { label: 'Career Change', href: '/category/career-workplace' },
                { label: 'Skin Care', href: '/category/skin-beauty' },
                { label: 'Pregnancy', href: '/category/pregnancy-fertility' },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="bg-white/60 hover:bg-white text-pg-gray-700 px-4 py-1.5 rounded-full transition-colors border border-pg-rose/10 shrink-0"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — Category Grid
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="categories" className="py-20 px-6 max-w-content mx-auto">
        <h2 className="font-sans text-[22px] font-bold text-pg-gray-900 mb-8 text-center md:text-left">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Card className="flex flex-col items-center text-center hover:border-pg-rose hover:bg-pg-rose-light/30 transition-all h-full p-6">
                <div className="text-[40px] mb-4">
                  {cat.icon_emoji || '✨'}
                </div>
                <h3 className="font-sans text-[16px] font-bold text-pg-gray-900 mb-1 leading-tight">
                  {cat.name}
                </h3>
                {/* Only show count if there are articles */}
                {cat.article_count > 0 ? (
                  <span className="text-sm text-pg-gray-500">{cat.article_count} guides</span>
                ) : (
                  <span className="text-xs text-pg-gray-400 italic">Coming soon</span>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — Featured "How To" Articles
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-12 px-4 max-w-content mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-[20px] md:text-[22px] font-bold text-pg-gray-900">
            Popular How-To Guides
          </h2>
          <Link href="/how-to" className="text-pg-rose text-sm font-bold hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {featuredArticles.length > 0 ? featuredArticles.map((article) => (
            <Link key={article.slug} href={`/how-to/${article.slug}`}>
              <Card className="h-full hover:border-pg-rose transition-colors flex flex-col p-3 md:p-6">
                <div className="mb-2 md:mb-4">
                  <Badge className="text-[9px] md:text-[10px]">{article.category.replace(/-/g, ' ')}</Badge>
                </div>
                <h3 className="font-display text-[13px] md:text-[18px] font-bold text-pg-gray-900 mb-2 md:mb-3 line-clamp-3 leading-snug">
                  {article.title}
                </h3>
                <p className="hidden md:block text-pg-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {article.intro?.substring(0, 100)}...
                </p>
                <div className="text-[10px] md:text-xs font-bold text-pg-gray-400 uppercase tracking-widest mt-auto">
                  ⏱ {article.reading_time_mins || 3} min
                </div>
              </Card>
            </Link>
          )) : (
            <div className="col-span-2 md:col-span-3 text-center py-12 text-pg-gray-500 border border-dashed rounded-xl">
              Guides are currently being written. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3.5 — Interactive Tools
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-content mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-[22px] md:text-[28px] font-bold text-pg-gray-900 mb-1">
                Interactive Tools
              </h2>
              <p className="text-pg-gray-500 text-sm">
                Private calculators and checkers
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/tools/period-calculator">
              <Card className="p-6 md:p-8 flex items-center gap-6 hover:border-pg-rose transition-colors group h-full">
                <div className="bg-pg-rose/10 text-pg-rose p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <Flame size={32} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-2 group-hover:text-pg-rose transition-colors">
                    Period & Ovulation Calculator
                  </h3>
                  <p className="text-pg-gray-500 text-sm">Track your cycle and predict your most fertile days. 100% private.</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — Quizzes Strip
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="quizzes" className="my-12 bg-pg-plum text-white py-10 md:py-14 px-4 overflow-hidden relative">
        <div className="max-w-content mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div className="text-center md:text-left">
              <h2 className="font-display text-[22px] md:text-[28px] font-bold mb-1">
                Take a Quiz — Know Yourself Better
              </h2>
              <p className="text-pg-plum-light/80 text-sm">
                Fun, insightful quizzes about relationships, health, and personality
              </p>
            </div>
            <Link href="/quizzes" className="text-white hover:text-pg-rose-light font-bold text-sm underline text-center md:text-right">
              View all →
            </Link>
          </div>

          {/* 2-col on mobile, 3-col on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {latestQuizzes.length > 0 ? latestQuizzes.map((quiz, i) => (
              <Link key={i} href={`/quiz/${quiz.slug}`}
                className="bg-white rounded-[14px] p-4 md:p-6 text-pg-gray-900 block hover:scale-[1.03] transition-all duration-300 shadow-lg border border-white/10 group">
                <div className="text-2xl md:text-3xl mb-3 bg-pg-rose-light/50 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl group-hover:bg-pg-rose-light transition-colors">
                  {quiz.thumbnail_emoji || '✨'}
                </div>
                <span className="inline-block px-2 py-0.5 bg-pg-plum-light text-pg-plum text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                  {quiz.category.replace(/-/g, ' ')}
                </span>
                <h3 className="font-sans font-bold text-[13px] md:text-[16px] mb-3 leading-tight group-hover:text-pg-rose transition-colors line-clamp-2">
                  {quiz.title}
                </h3>
                <div className="inline-flex items-center justify-center w-full bg-pg-rose text-white font-bold rounded-xl px-3 py-2 text-[11px] md:text-sm hover:bg-pg-rose-dark transition-all">
                  Start Quiz <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )) : (
              <div className="col-span-2 md:col-span-3 text-center py-12 text-pg-plum-light">
                Quizzes are coming soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — Anonymous Ask Box
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-6 max-w-content mx-auto">
        <AskBox />
      </section>

    </div>
  );
}
