import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { AskBox } from '@/components/Home/AskBox';
import { Search, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const runtime = 'edge';

// Add AdSense placeholder component
const AdPlaceholder = () => (
  <div className="w-full my-8">
    {/* ezoic-ad placeholder replacing logic, now using Google AdSense */}
    <div className="bg-pg-gray-100 border border-pg-gray-300 border-dashed rounded-lg h-[90px] flex items-center justify-center text-pg-gray-400 text-sm">
      Advertisement
    </div>
  </div>
);

async function getHomeData() {
  const [categoriesRes, articlesRes] = await Promise.all([
    supabaseAdmin.from('categories').select('*').order('display_order', { ascending: true }),
    supabaseAdmin.from('articles')
      .select('slug, title, intro, reading_time_mins, category')
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(6),
  ]);

  return {
    categories: categoriesRes.data || [],
    featuredArticles: articlesRes.data || [],
  };
}

export default async function Home() {
  const { categories, featuredArticles } = await getHomeData();

  return (
    <div className="bg-pg-cream min-h-screen pb-20">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — Hero Search Bar
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="pt-24 pb-20 px-6 relative bg-pg-rose-light">
        <div className="absolute inset-0 bg-[radial-gradient(#E91E8C_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10 fade-up">
          <h1 className="font-display text-4xl md:text-[42px] font-bold text-pg-gray-900 leading-tight mb-4">
            Find Your Answer. Safely. Anonymously.
          </h1>
          <p className="font-sans text-lg md:text-[18px] text-pg-gray-700 mb-10">
            How-to guides, quizzes, and honest advice — made for Indian women
          </p>

          <form action="/search" className="relative max-w-2xl mx-auto mb-6">
            <input
              type="text"
              name="q"
              placeholder="Search... 'how to deal with mother-in-law' or 'PCOS diet'"
              className="w-full h-[54px] pl-6 pr-32 rounded-[24px] border-2 border-white focus:border-pg-rose outline-none text-lg shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-pg-rose text-white px-6 rounded-full font-bold hover:bg-pg-rose-dark transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {['Period Pain', 'Toxic Relationship', 'Career Change', 'Skin Care', 'Pregnancy'].map((tag) => (
              <Link 
                key={tag} 
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="bg-white/60 hover:bg-white text-pg-gray-700 px-4 py-1.5 rounded-full transition-colors border border-pg-rose/10"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — Category Grid
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 px-6 max-w-content mx-auto fade-up stagger-1">
        <h2 className="font-sans text-[22px] font-bold text-pg-gray-900 mb-8 text-center md:text-left">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Card className="flex flex-col items-center text-center hover:border-pg-rose hover:bg-pg-rose-light/30 transition-all h-full p-6">
                <div className="text-[40px] mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon_emoji || '✨'}
                </div>
                <h3 className="font-sans text-[16px] font-bold text-pg-gray-900 mb-1 leading-tight">
                  {cat.name}
                </h3>
                <span className="text-sm text-pg-gray-500">
                  {cat.article_count} articles
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-content mx-auto px-6">
        <AdPlaceholder />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — Featured "How To" Articles
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-6 max-w-content mx-auto fade-up stagger-2">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-sans text-[22px] font-bold text-pg-gray-900">
            Popular How-To Guides
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredArticles.length > 0 ? featuredArticles.map((article) => (
            <Link key={article.slug} href={`/how-to/${article.slug}`}>
              <Card className="h-full hover:border-pg-rose transition-colors flex flex-col p-6">
                <div className="mb-4">
                  <Badge>{article.category.replace(/-/g, ' ')}</Badge>
                </div>
                <h3 className="font-display text-[18px] font-bold text-pg-gray-900 mb-3 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-pg-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {article.intro?.substring(0, 100)}...
                </p>
                <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mt-auto">
                  ⏱ {article.reading_time_mins || 5} min read
                </div>
              </Card>
            </Link>
          )) : (
            <div className="col-span-3 text-center py-12 text-pg-gray-500 border border-dashed rounded-xl">
              Guides are currently being written. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — Quizzes Strip
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="my-16 bg-pg-plum text-white py-16 px-6 overflow-hidden relative fade-up">
        <div className="max-w-content mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-display text-[32px] font-bold mb-2">
              Take a Quiz — Know Yourself Better
            </h2>
            <p className="text-pg-plum-light/80">
              Fun, insightful quizzes about relationships, health, and personality
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
            {/* Hardcoded placeholders until we hook up DB quizzes */}
            {[
              { title: "Is Your Relationship Healthy or Toxic?", category: "relationships" },
              { title: "How Much Are You Sacrificing for Others?", category: "mental-health" },
              { title: "Are Your In-Laws Crossing the Line?", category: "family" }
            ].map((quiz, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] bg-white rounded-[12px] p-6 text-pg-gray-900 snap-center shrink-0">
                <span className="inline-block px-3 py-1 bg-pg-plum-light text-pg-plum text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                  {quiz.category}
                </span>
                <h3 className="font-sans font-bold text-lg mb-6 leading-tight h-12">
                  {quiz.title}
                </h3>
                <Button variant="secondary" className="w-full py-2">
                  Start Quiz <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — Anonymous Ask Box
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-6 max-w-content mx-auto fade-up">
        <AskBox />
      </section>

    </div>
  );
}
