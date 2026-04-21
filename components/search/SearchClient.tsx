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
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-text-primary">
            {query ? `Results for "${query}"` : 'Discover Answers'}
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Browse through common questions asked by girls like you. Can&apos;t find what you need? <Link href="/ask" className="text-purple-primary font-bold hover:underline">Ask anonymously.</Link>
          </p>
          
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search questions by topic..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-purple-100 shadow-lg focus:ring-2 focus:ring-purple-primary/20 outline-none text-text-primary placeholder:text-purple-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-8 flex-shrink-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-between w-full p-4 bg-white rounded-xl border border-purple-50 shadow-sm font-bold text-purple-primary"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-8 p-6 bg-white rounded-3xl border border-purple-50 shadow-sm animate-in fade-in slide-in-from-top-4 lg:animate-none`}>
              <div>
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-primary" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => updateParams({ category: '' })}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryParam ? 'bg-purple-50 text-purple-primary font-bold' : 'text-text-secondary hover:bg-gray-50'}`}
                  >
                    All Topics
                  </button>
                  {initialCategories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => updateParams({ category: cat.slug })}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryParam === cat.slug ? 'bg-purple-50 text-purple-primary font-bold' : 'text-text-secondary hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-primary" />
                  Sort by
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Most Recent', value: 'recent' },
                    { label: 'Most Popular', value: 'metoo' },
                    { label: 'Most Viewed', value: 'views' },
                  ].map((s) => (
                    <button 
                      key={s.value}
                      onClick={() => updateParams({ sort: s.value })}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortParam === s.value ? 'bg-purple-50 text-purple-primary font-bold' : 'text-text-secondary hover:bg-gray-50'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-accent" />
                  Time period
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'All time', value: 'all' },
                    { label: 'Today', value: 'today' },
                    { label: 'Last 7 days', value: 'week' },
                    { label: 'Last 30 days', value: 'month' },
                  ].map((range) => (
                    <button 
                      key={range.value}
                      onClick={() => updateParams({ date: range.value })}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${dateParam === range.value ? 'bg-pink-50 text-pink-accent font-bold' : 'text-text-secondary hover:bg-gray-50'}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Keywords */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Period Health', 'Skin Care', 'Self Love', 'Career Advice', 'Anxiety', 'Grooming'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => updateParams({ q: kw })}
                      className="text-xs px-3 py-1.5 bg-gray-50 text-text-secondary rounded-full hover:bg-purple-100 hover:text-purple-primary transition-all border border-gray-100"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {(categoryParam || dateParam !== 'all' || query) && (
                <button 
                  onClick={clearFilters}
                  className="w-full text-center text-xs font-bold text-text-secondary hover:text-purple-primary transition-colors flex items-center justify-center gap-1 pt-4 border-t border-gray-100"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-purple-primary animate-spin" />
                <p className="text-text-secondary font-medium">Looking through the archive...</p>
              </div>
            ) : questions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q) => (
                  <Link 
                    key={q.id}
                    href={`/q/${q.slug}`}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all group flex flex-col h-full"
                  >
                    <div className="text-xs font-bold text-purple-primary uppercase tracking-wider mb-2">{q.categories?.name}</div>
                    <h3 className="font-bold text-lg text-text-primary mb-4 group-hover:text-purple-primary transition-colors flex-1 line-clamp-3 leading-snug">
                      {q.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-pink-accent" />
                        {q.metoo_count} asked this
                      </div>
                      <span>{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-purple-50 shadow-sm">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-text-primary mb-2">No matching questions found</h2>
                <p className="text-text-secondary mb-8">Try adjusting your filters or search for something else. Our sisters are always here to help.</p>
                <Link href="/ask" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-primary to-pink-accent text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Be the first to ask <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
