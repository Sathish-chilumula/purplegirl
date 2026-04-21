'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Calendar, Heart, ArrowRight, Loader2, X, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  title: string;
  slug: string;
  metoo_count: number;
  created_at: string;
  categories: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const getDateRange = (range: string) => {
  const now = new Date();
  if (range === 'today') {
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  }
  if (range === 'week') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }
  if (range === 'month') {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString();
  }
  return null;
};

export default function SearchClient({ initialCategories }: { initialCategories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const dateParam = searchParams.get('date') || 'all';
  const sortParam = searchParams.get('sort') || 'recent';

  const [searchTerm, setSearchTerm] = useState(query);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let supabaseQuery = supabase
          .from('questions')
          .select(`
            id, title, slug, metoo_count, created_at,
            categories!inner(name, slug)
          `)
          .eq('status', 'approved');

        if (query) {
          supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
        }

        if (categoryParam) {
          supabaseQuery = supabaseQuery.eq('categories.slug', categoryParam);
        }

        if (dateParam !== 'all') {
          const dateLimit = getDateRange(dateParam);
          if (dateLimit) {
            supabaseQuery = supabaseQuery.gte('created_at', dateLimit);
          }
        }

        if (sortParam === 'metoo') {
          supabaseQuery = supabaseQuery.order('metoo_count', { ascending: false });
        } else if (sortParam === 'views') {
          supabaseQuery = supabaseQuery.order('view_count', { ascending: false });
        } else {
          supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
        }

        const { data, error } = await supabaseQuery.limit(24);

        if (error) throw error;
        setQuestions((data as any) || []);

        // Logging Search Result Count for Content Gap Analysis
        if (query && data) {
           await supabase.from('search_logs').insert({
             query: query.trim(),
             results_count: data.length
           });
        }

      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, categoryParam, dateParam, sortParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchTerm });
  };

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/search');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col gap-10">
        <div className="space-y-8 text-center md:text-left relative z-10 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-[#1F1235] tracking-tight">
            {query ? (
              <span>Results for &ldquo;<span className="gradient-text-animate">{query}</span>&rdquo;</span>
            ) : (
              <span>Discover <span className="gradient-text-animate">Conversations</span></span>
            )}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Browse through the honest guidance asked by others. Can&apos;t find your specific situation? <Link href="/ask" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">Ask your sisters privately.</Link>
          </p>
          
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto md:mx-0 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400 w-6 h-6 group-focus-within:scale-110 transition-transform" />
            <input 
              type="text"
              placeholder="Search conversations by topic..."
              className="w-full pl-16 pr-6 py-5 rounded-[2rem] border border-purple-100 glass shadow-2xl focus:ring-4 focus:ring-purple-200/50 outline-none text-[#1F1235] text-lg placeholder:text-purple-200 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-72 space-y-8 flex-shrink-0 relative z-10 animate-slide-up stagger-1">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-between w-full p-5 bg-white rounded-2xl border border-purple-100 shadow-lg font-bold text-purple-600"
            >
              <div className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                <span>Refine Search</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-10 p-8 glass rounded-[2.5rem] border border-purple-100 shadow-xl`}>
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h3 className="font-playfair font-bold text-[#1F1235] text-xl mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  Topics
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => updateParams({ category: '' })}
                    className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${!categoryParam ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 font-medium'}`}
                  >
                    All Conversations
                  </button>
                  {initialCategories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => updateParams({ category: cat.slug })}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${categoryParam === cat.slug ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 font-medium'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h3 className="font-playfair font-bold text-[#1F1235] text-xl mb-6 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                  Sort By
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Freshness', value: 'recent' },
                    { label: 'Popularity', value: 'metoo' },
                    { label: 'Recency', value: 'views' },
                  ].map((s) => (
                    <button 
                      key={s.value}
                      onClick={() => updateParams({ sort: s.value })}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${sortParam === s.value ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 font-medium'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <h3 className="font-playfair font-bold text-[#1F1235] text-xl mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  Timeframe
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Forever', value: 'all' },
                    { label: 'Today', value: 'today' },
                    { label: 'This Week', value: 'week' },
                    { label: 'This Month', value: 'month' },
                  ].map((range) => (
                    <button 
                      key={range.value}
                      onClick={() => updateParams({ date: range.value })}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${dateParam === range.value ? 'bg-pink-500 text-white font-bold shadow-md' : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500 font-medium'}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Keywords */}
              <div className="pt-6 border-t border-purple-100 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">
                  Trending Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Period Health', 'Skin Care', 'Self Love', 'Career Advice', 'Anxiety', 'Grooming'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => updateParams({ q: kw })}
                      className="text-[11px] font-bold px-4 py-2 bg-white text-gray-500 rounded-full hover:bg-purple-600 hover:text-white transition-all border border-purple-50 shadow-sm hover:shadow-md"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {(categoryParam || dateParam !== 'all' || query) && (
                <button 
                  onClick={clearFilters}
                  className="w-full text-center text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-1 pt-6 border-t border-purple-100 group"
                >
                  <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                  Reset all filters
                </button>
              )}
            </div>
          </aside>

          <main className="flex-1 relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shadow-lg">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <p className="text-gray-500 text-lg font-bold">Scanning the sisterhood vault...</p>
              </div>
            ) : questions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {questions.map((q, i) => (
                  <Link 
                    key={q.id}
                    href={`/q/${q.slug}`}
                    className="card-premium p-8 group flex flex-col h-full animate-slide-up"
                    style={{ animationDelay: `${(i % 6) * 100}ms` }}
                  >
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-[0.15em] mb-4 bg-purple-50 px-3 py-1 rounded-full w-fit">{q.categories?.name}</div>
                    <h3 className="font-bold text-xl text-[#1F1235] mb-6 group-hover:text-purple-600 transition-colors flex-1 line-clamp-3 leading-snug">
                      {q.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold mt-auto pt-6 border-t border-purple-50/60">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-pink-400 fill-pink-100" />
                        {q.metoo_count} girls asked
                      </div>
                      <span className="opacity-60">{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass rounded-[3rem] p-16 text-center border border-purple-100 shadow-2xl animate-slide-up">
                <div className="text-6xl mb-8 animate-float">🍂</div>
                <h2 className="text-2xl font-playfair font-bold text-[#1F1235] mb-4">No conversations found</h2>
                <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto">Try a different keyword or adjust your filters. Our sisters might be waiting for you to ask first!</p>
                <Link href="/ask" className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-all">
                  Be the first to ask <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
