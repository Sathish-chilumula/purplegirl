import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { AskBox } from '@/components/home/AskBox';
import { ChevronRight, Flame, Activity } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HeroIllustration } from '@/components/home/HeroIllustration';
import { LifecycleFilter } from '@/components/home/LifecycleFilter';
import { TrendingQuestions } from '@/components/home/TrendingQuestions';
import { FeaturedGuideOfWeek } from '@/components/home/FeaturedGuideOfWeek';
import * as motion from "motion/react-client";
import type { Metadata } from 'next';
import { HomeSchema } from '@/components/seo/HomeSchema';

const SITE_URL = 'https://purplegirl.in';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: "How-To Guides & Anonymous Advice for Indian Women",
    hi: "भारतीय महिलाओं के लिए गाइड और सलाह | PurpleGirl",
    te: "భారతీయ మహిళలకు గైడ్‌లు మరియు సలహా | PurpleGirl",
  };

  const descs: Record<string, string> = {
    en: "Honest how-to guides on relationships, health, career, skin, and more — written for Indian women. 100% anonymous Q&A, no login required.",
    hi: "रिश्तों, स्वास्थ्य, करियर और त्वचा पर ईमानदार गाइड — भारतीय महिलाओं के लिए। 100% गुमनाम सवाल-जवाब।",
    te: "సంబంధాలు, ఆరోగ్యం, కెరీర్ మరియు చర్మంపై నిజాయితీగా గైడ్‌లు — భారతీయ మహిళలకు. 100% అనామక ప్రశ్న-జవాబు.",
  };

  return {
    title: titles[lang] || titles.en,
    description: descs[lang] || descs.en,
    alternates: {
      canonical: lang === 'en' ? '/' : `/${lang}`,
      languages: {
        'en': SITE_URL,
        'hi': `${SITE_URL}/hi`,
        'te': `${SITE_URL}/te`,
      },
    },
  };
}

export const runtime = 'edge';

async function getHomeData(lang: string) {
  const [categoriesRes, articlesRes, quizzesRes, featuredRes, questionsRes] = await Promise.all([
    supabaseAdmin
      .from('categories')
      .select('*')
      .lt('display_order', 99)
      .order('display_order', { ascending: true }),
    supabaseAdmin
      .from('articles')
      .select('slug, title, intro, reading_time_mins, category')
      .eq('language', lang)
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(6),
    supabaseAdmin
      .from('quizzes')
      .select('slug, title, category, thumbnail_emoji')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    // Featured Guide of the Week
    supabaseAdmin
      .from('articles')
      .select('slug, title, intro, reading_time_mins, category')
      .eq('language', lang)
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(1)
      .single(),
    // Live trending questions from Q&A feed
    supabaseAdmin
      .from('questions')
      .select('slug, question_text, category')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  return {
    categories: categoriesRes.data || [],
    featuredArticles: articlesRes.data || [],
    latestQuizzes: quizzesRes.data || [],
    featuredGuide: featuredRes.data || null,
    trendingQuestions: (questionsRes.data || []).map((q: any) => ({
      question: q.question_text,
      category: q.category || 'general',
      slug: q.slug,
    })),
  };
}

export default async function Home({ params }: HomePageProps) {
  const { lang } = await params;
  const [{ categories, featuredArticles, latestQuizzes, featuredGuide, trendingQuestions }, dict] = await Promise.all([
    getHomeData(lang),
    getDictionary(lang),
  ]);

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

            {/* Visual headline — honest, direct, human */}
            <p className="font-display text-[28px] md:text-[44px] font-bold text-pg-gray-900 leading-tight mb-4">
              Questions you can't ask anyone.
              <span className="text-pg-rose block">Answers you actually need.</span>
            </p>
            <p className="font-sans text-[16px] md:text-[18px] text-pg-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
              Honest guides on relationships, health, money, and rights — for Indian women. No login, no tracking, completely private.
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
          SECTION 1.2 — Featured Guide of the Week
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <FeaturedGuideOfWeek guide={featuredGuide} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1.5 — Social Proof Bar
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white border-y border-pg-gray-100 py-4 px-6">
        <div className="max-w-content mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
          {[
            { value: '1,20,000+', label: 'Women Helped' },
            { value: '245+', label: 'How-To Guides' },
            { value: '100%', label: 'Anonymous' },
            { value: '18', label: 'Categories' },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="font-display font-bold text-pg-rose text-[18px]">{value}</span>
              <span className="text-pg-gray-500 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1.7 — Trending Questions (live from DB)
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <TrendingQuestions questions={trendingQuestions} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — Category Grid with Lifecycle Filter
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="categories" className="py-20 px-6 max-w-content mx-auto">
        <h2 className="font-sans text-[22px] font-bold text-pg-gray-900 mb-4 text-center md:text-left">
          Browse by Category
        </h2>
        <p className="text-pg-gray-500 text-sm mb-6 text-center md:text-left">
          Select your life stage to find the most relevant guides for you.
        </p>
        <LifecycleFilter categories={categories} />
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
              <Card className="h-full hover:border-pg-rose hover:-translate-y-1 hover:shadow-lg hover:shadow-pg-rose/10 transition-all duration-300 flex flex-col p-3 md:p-6 cursor-pointer">
                <div className="mb-2 md:mb-4">
                  <Badge className="text-[9px] md:text-[10px]">{article.category.replace(/-/g, ' ')}</Badge>
                </div>
                <h3 className="font-display text-[13px] md:text-[18px] font-bold text-pg-gray-900 mb-2 md:mb-3 line-clamp-3 leading-snug group-hover:text-pg-rose transition-colors">
                  {article.title}
                </h3>
                <p className="hidden md:block text-pg-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {article.intro?.substring(0, 100)}...
                </p>
                <div className="text-[10px] md:text-xs font-bold text-pg-gray-400 uppercase tracking-widest mt-auto flex items-center gap-2">
                  <span>⏱ {article.reading_time_mins || 3} min</span>
                  <span className="text-pg-rose ml-auto">Read →</span>
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
                {lang === 'hi' ? 'इंटरैक्टिव टूल्स' : lang === 'te' ? 'ఇంటరాక్టివ్ సాధనాలు' : 'Interactive Tools'}
              </h2>
              <p className="text-pg-gray-500 text-sm">
                {lang === 'hi' ? 'निजी कैलकुलेटर और जांच' : lang === 'te' ? 'ప్రైవేట్ కాల్కులేటర్లు మరియు తనిఖీలు' : 'Private calculators and symptom checkers'}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Period Calculator */}
            <Link href="/tools/period-calculator">
              <Card className="p-6 md:p-8 flex items-center gap-6 hover:border-pg-rose transition-colors group h-full">
                <div className="bg-pg-rose/10 text-pg-rose p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <Flame size={32} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-2 group-hover:text-pg-rose transition-colors">
                    {dict.calculator_period_title}
                  </h3>
                  <p className="text-pg-gray-500 text-sm">{dict.calculator_period_desc}</p>
                </div>
              </Card>
            </Link>
            {/* Symptom Checker */}
            <Link href="/tools/symptom-checker">
              <Card className="p-6 md:p-8 flex items-center gap-6 hover:border-pg-plum transition-colors group h-full">
                <div className="bg-pg-plum/10 text-pg-plum p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <Activity size={32} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-2 group-hover:text-pg-plum transition-colors">
                    {lang === 'hi' ? 'लक्षण जांचकर्ता' : lang === 'te' ? 'లక్షణ తనిఖీ' : 'Symptom Checker'}
                  </h3>
                  <p className="text-pg-gray-500 text-sm">
                    {lang === 'hi' ? 'PCOS, थायराइड, या हार्मोनल असंतुलन के लक्षण जांचें।' : lang === 'te' ? 'PCOS, థైరాయిడ్ లేదా హార్మోన్ లక్షణాలు తనిఖీ చేయండి.' : 'Check if your symptoms match PCOS, thyroid, or hormonal imbalance.'}
                  </p>
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
          SECTION 5 — Anonymous Ask CTA
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-6 max-w-content mx-auto">
        <AskBox />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5.5 — Regional Language Section
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-6 bg-white border-y border-pg-gray-100">
        <div className="max-w-content mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-pg-rose mb-1">
                Your Language, Your Safe Space
              </p>
              <h2 className="font-display text-[24px] md:text-[32px] font-bold text-pg-gray-900 leading-tight">
                PurpleGirl speaks your language
              </h2>
            </div>
            <div className="hidden md:block">
              <span className="text-4xl">🇮🇳</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Hindi Card */}
            <Link href="/hi" className="group">
              <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 hover:border-[#FF9933] transition-all duration-300">
                <div className="bg-[#FF9933]/10 text-[#FF9933] w-16 h-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold group-hover:scale-110 transition-transform">
                  अ
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-2 group-hover:text-[#FF9933] transition-colors">
                    हिंदी में पढ़ें
                  </h3>
                  <p className="text-pg-gray-500 text-sm mb-4">
                    महिलाओं का स्वास्थ्य, रिश्ते और कानूनी अधिकारों पर विश्वसनीय जानकारी।
                  </p>
                  <span className="inline-flex items-center text-sm font-bold text-[#FF9933]">
                    Explore Hindi Guides →
                  </span>
                </div>
              </Card>
            </Link>

            {/* Telugu Card */}
            <Link href="/te" className="group">
              <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 hover:border-[#138808] transition-all duration-300">
                <div className="bg-[#138808]/10 text-[#138808] w-16 h-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold group-hover:scale-110 transition-transform">
                  అ
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-2 group-hover:text-[#138808] transition-colors">
                    తెలుగులో చదవండి
                  </h3>
                  <p className="text-pg-gray-500 text-sm mb-4">
                    మహిళల ఆరోగ్యం, సంబంధాలు మరియు చట్టపరమైన హక్కులపై నమ్మకమైన సమాచారం.
                  </p>
                  <span className="inline-flex items-center text-sm font-bold text-[#138808]">
                    Explore Telugu Guides →
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — Emotional Private CTA
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-6 bg-gradient-to-br from-pg-plum via-pg-plum/90 to-rose-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-rose-200 mb-4">You are not alone</p>
          <h2 className="font-display text-[28px] md:text-[38px] font-bold leading-tight mb-6">
            There's a question you haven't asked anyone.
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Maybe your family doesn't know. Maybe you're scared of being judged.<br />
            But you still need a clear, honest answer.
          </p>
          <Link
            href="/ask"
            className="inline-flex items-center gap-3 bg-white text-pg-plum font-bold px-8 py-4 rounded-2xl text-[16px] hover:bg-pg-rose hover:text-white transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Ask it here, completely privately
            <ChevronRight size={20} />
          </Link>
          <p className="mt-6 text-white/40 text-sm">No name. No email. No login. Just an honest answer.</p>
        </div>
      </section>

    </div>
  </>
  );
}
