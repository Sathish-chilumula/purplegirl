'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, Loader2, X, BookOpen, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SmartProductWidget from '@/components/monetization/SmartProductWidget';

interface Article {
  slug: string;
  title: string;
  intro: string;
  category: string;
  reading_time_mins: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'relationships-marriage': 'Relationships',
  'womens-health': "Women's Health",
  'mental-health-emotions': 'Mental Health',
  'skin-beauty': 'Skin & Beauty',
  'family-parenting': 'Family',
  'career-workplace': 'Career',
  'pregnancy-fertility': 'Pregnancy',
  'weight-fitness': 'Fitness',
  'food-indian-cooking': 'Food',
  'legal-rights': 'Legal Rights',
  'sex-intimacy': 'Intimacy',
  'finance-money': 'Finance',
  'hair-care': 'Hair Care',
  'home-household': 'Home',
  'festivals-traditions': 'Culture',
  'self-growth-confidence': 'Self Growth',
};

export default function SearchClient({ initialCategories }: { initialCategories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query && !categoryParam) {
      setArticles([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      setHasSearched(true);
      try {
        let q = supabase
          .from('articles')
          .select('slug, title, intro, category, reading_time_mins')
          .eq('is_published', true);

        if (query) {
          q = q.or(`title.ilike.%${query}%,intro.ilike.%${query}%`);
        }

        if (categoryParam) {
          q = q.eq('category', categoryParam);
        }

        q = q.order('view_count', { ascending: false }).limit(24);

        const { data, error } = await q;
        if (error) throw error;
        setArticles((data as Article[]) || []);
      } catch (err) {
        console.error('Search error:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, categoryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const updateCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearAll = () => {
    setSearchTerm('');
    router.push('/search');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Search Bar */}
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-pg-gray-900 mb-6 text-center">
          {query ? (
            <>Results for <span className="text-pg-rose">"{query}"</span></>
          ) : (
            <>Search <span className="text-pg-rose">How-To Guides</span></>
          )}
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-pg-rose w-5 h-5" />
          <input
            type="text"
            placeholder="Search guides... 'PCOS diet', 'toxic in-laws', 'career change'..."
            className="w-full pl-14 pr-32 py-4 rounded-full border-2 border-pg-gray-100 focus:border-pg-rose outline-none text-[#1F1235] text-base shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-pg-rose text-white px-6 rounded-full font-bold text-sm hover:bg-pg-rose-dark transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-pg-cream rounded-2xl p-6 border border-pg-gray-100">
            <h3 className="font-bold text-pg-gray-900 text-xs uppercase tracking-widest mb-4">Browse by Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => updateCategory('')}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  !categoryParam ? 'bg-pg-rose text-white' : 'text-pg-gray-600 hover:bg-pg-rose-light hover:text-pg-rose'
                }`}
              >
                All Guides
              </button>
              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateCategory(cat.slug)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                    categoryParam === cat.slug
                      ? 'bg-pg-rose text-white'
                      : 'text-pg-gray-600 hover:bg-pg-rose-light hover:text-pg-rose'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {(query || categoryParam) && (
              <button
                onClick={clearAll}
                className="mt-6 w-full text-center text-xs font-bold text-pg-gray-400 hover:text-pg-rose flex items-center justify-center gap-1 pt-4 border-t border-pg-gray-100 transition-colors"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {/* Popular topics */}
          {!hasSearched && (
            <div className="mt-6">
              <h3 className="font-bold text-pg-gray-900 text-xs uppercase tracking-widest mb-3">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['PCOS', 'Mother-in-law', 'Skin Care', 'Career Change', 'Anxiety', 'Period Pain'].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(kw)}`)}
                    className="text-xs font-bold px-3 py-1.5 bg-white text-pg-gray-600 rounded-full hover:bg-pg-rose hover:text-white transition-all border border-pg-gray-100 shadow-sm"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Results */}
        <main className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-full bg-pg-rose-light flex items-center justify-center shadow-lg">
                <Loader2 className="w-7 h-7 text-pg-rose animate-spin" />
              </div>
              <p className="text-pg-gray-500 font-bold">Finding guides for you…</p>
            </div>
          ) : hasSearched && articles.length === 0 ? (
            <div className="bg-pg-cream rounded-2xl p-12 text-center border border-dashed border-pg-gray-200">
              <div className="text-5xl mb-6">🔍</div>
              <h2 className="text-xl font-bold text-pg-gray-900 mb-3">No guides found</h2>
              <p className="text-pg-gray-500 mb-8 max-w-md mx-auto">
                Try different keywords, or ask your question anonymously and we&apos;ll write a guide for you!
              </p>
              <Link
                href="/ask"
                className="inline-flex items-center gap-2 bg-pg-rose text-white px-8 py-3 rounded-full font-bold hover:bg-pg-rose-dark transition-colors"
              >
                Ask Anonymously <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : hasSearched ? (
            <div className="space-y-8">
              <SmartProductWidget category={categoryParam || 'default'} title={query} />
              <div className="grid sm:grid-cols-2 gap-6">
                {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/how-to/${article.slug}`}
                  className="bg-white rounded-2xl p-6 border border-pg-gray-100 hover:border-pg-rose hover:shadow-md transition-all flex flex-col"
                >
                  <span className="inline-block bg-pg-rose-light text-pg-rose text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
                    {CATEGORY_LABELS[article.category] || article.category.replace(/-/g, ' ')}
                  </span>
                  <h3 className="font-display font-bold text-[17px] text-pg-gray-900 mb-3 line-clamp-2 leading-snug flex-1">
                    {article.title}
                  </h3>
                  <p className="text-pg-gray-500 text-sm line-clamp-2 mb-4">
                    {article.intro}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-pg-gray-400 mt-auto pt-4 border-t border-pg-gray-50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.reading_time_mins || 5} min read
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-pg-rose">
                      <BookOpen className="w-3 h-3" /> Read Guide
                    </span>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          ) : (
            /* Default state: no search yet */
            <div className="text-center py-16 text-pg-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-pg-gray-200" />
              <p className="font-bold text-lg text-pg-gray-500 mb-2">Type to find guides</p>
              <p className="text-sm">Search above or pick a category on the left</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
