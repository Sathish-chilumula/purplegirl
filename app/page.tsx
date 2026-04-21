'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Briefcase, Pill, Shirt, Brain, Salad, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LiveSearch from '@/components/search/LiveSearch';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'beauty-skincare': <Sparkles className="w-5 h-5" />,
  'relationships': <Heart className="w-5 h-5" />,
  'career-money': <Briefcase className="w-5 h-5" />,
  'health-basics': <Pill className="w-5 h-5" />,
  'fashion': <Shirt className="w-5 h-5" />,
  'mental-wellness': <Brain className="w-5 h-5" />,
  'food-nutrition': <Salad className="w-5 h-5" />,
};

interface TrendingQuestion {
  id: string;
  title: string;
  slug: string;
  metoo_count: number;
  categories: { name: string };
}

interface RecentQuestion {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  answers: { summary: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function Home() {
  const [trending, setTrending] = useState<TrendingQuestion[]>([]);
  const [recent, setRecent] = useState<RecentQuestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true);
      try {
        // 1. Fetch categories
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        setCategories(catData || []);

        // 2. Fetch trending (by metoo_count)
        const { data: trendData } = await supabase
          .from('questions')
          .select('id, title, slug, metoo_count, categories(name)')
          .eq('status', 'approved')
          .order('metoo_count', { ascending: false })
          .limit(6);
        setTrending((trendData as any) || []);

        // 3. Fetch recent with answers
        const { data: recentData } = await supabase
          .from('questions')
          .select('id, title, slug, created_at, answers(summary)')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(4);
        
        // Format to handle the array from the join
        const formattedRecent = (recentData as any)?.map((q: any) => ({
          ...q,
          answers: q.answers?.[0] || null
        })) || [];
        
        setRecent(formattedRecent);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    
    setSubStatus({ type: 'loading' });
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSubStatus({ type: 'success', message: data.message });
        setSubEmail('');
      } else {
        setSubStatus({ type: 'error', message: data.error });
      }
    } catch (err) {
      setSubStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-20">
      {/* 1. Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] py-12 md:py-20 px-4 mt-[-1px]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="font-playfair font-bold text-4xl md:text-6xl text-white tracking-tight drop-shadow-md">
            Ask anything you can&apos;t ask anyone 💜
          </h1>
          <p className="text-lg text-white/90 font-medium">
            1000+ real questions answered for girls like you
          </p>
          
          <LiveSearch variant="hero" placeholder="Type your question… (it's anonymous)" />
          
          <p className="text-sm text-white/80 mt-4 font-medium flex items-center justify-center gap-4">
            <span><span className="opacity-70">🔒</span> Anonymous</span>
            <span className="hidden sm:inline">·</span>
            <span><span className="opacity-70">💜</span> No Judgment</span>
            <span className="hidden sm:inline">·</span>
            <span><span className="opacity-70">⚡</span> Instant Answer</span>
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-purple-primary animate-spin" />
          <p className="text-text-secondary font-medium animate-pulse">Loading the sisterhood...</p>
        </div>
      ) : (
        <>
          {/* 2. Trending Questions */}
          {trending.length > 0 && (
            <section className="max-w-7xl mx-auto w-full px-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🔥</span>
                <h2 className="font-bold text-2xl text-text-primary">Girls are asking…</h2>
              </div>
              
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-6 snap-x snap-mandatory hide-scrollbar">
                {trending.map((q) => (
                  <Link 
                    key={q.id} 
                    href={`/q/${q.slug}`}
                    className="min-w-[280px] md:min-w-0 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 snap-start border border-purple-50 flex flex-col h-full"
                  >
                    <div className="text-xs font-semibold text-purple-primary mb-3 uppercase tracking-wider">{q.categories?.name}</div>
                    <h3 className="font-bold text-lg text-text-primary mb-4 flex-1 line-clamp-3">{q.title}</h3>
                    <div className="flex items-center text-sm font-medium text-text-secondary mt-auto">
                      <Heart className="w-4 h-4 text-pink-accent mr-1.5 fill-pink-accent/20" />
                      {q.metoo_count} girls asked this
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 3. Categories */}
          <section className="max-w-7xl mx-auto w-full px-4">
            <h2 className="font-bold text-2xl text-text-primary mb-6">Browse by topic</h2>
            
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-4">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all lg:flex-1 lg:min-w-[200px] border border-purple-50 hover:-translate-y-1 group`}
                >
                  <div className={`p-2.5 rounded-xl bg-purple-50 text-purple-primary group-hover:bg-purple-primary group-hover:text-white transition-colors`}>
                    {CATEGORY_ICONS[cat.slug] || <Heart className="w-5 h-5" />}
                  </div>
                  <span className="font-semibold text-text-primary text-sm md:text-base leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* 4. Recent Questions */}
          {recent.length > 0 && (
            <section className="max-w-4xl mx-auto w-full px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-2xl text-text-primary">Recently answered</h2>
                <Link href="/search?sort=recent" className="text-sm font-bold text-purple-primary hover:underline">View all</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recent.map((q) => (
                  <Link 
                    key={q.id}
                    href={`/q/${q.slug}`}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-purple-50"
                  >
                    <h3 className="font-bold text-lg text-text-primary mb-2 line-clamp-2">{q.title}</h3>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed h-[40px]">
                      {q.answers?.summary || 'Our sisters are currently writing an answer...'}
                    </p>
                    <div className="text-xs text-text-secondary font-medium mt-2">
                      {new Date(q.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 5. Newsletter CTA */}
      <section className="max-w-3xl mx-auto w-full px-4 md:px-0">
        <div className="bg-[#FDF2F8] rounded-3xl p-8 md:p-12 text-center border border-pink-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>
          <span className="text-4xl mb-4 block">💌</span>
          <h2 className="font-bold text-2xl md:text-3xl text-text-primary mb-3">Get our best answers weekly</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Join 10,000+ girls getting practical advice on beauty, career, and relationships straight to their inbox. It&apos;s free!
          </p>
          
          {subStatus.type === 'success' ? (
            <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl font-medium animate-in fade-in zoom-in">
              {subStatus.message}
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 rounded-full px-6 py-3 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-accent/50 text-text-primary"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
                disabled={subStatus.type === 'loading'}
              />
              <button 
                type="submit"
                disabled={subStatus.type === 'loading'}
                className="bg-text-primary text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {subStatus.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {subStatus.type === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}
          
          {subStatus.type === 'error' && (
            <p className="text-red-500 text-sm mt-3 font-medium">{subStatus.message}</p>
          )}
          
          <div className="text-xs text-text-secondary mt-4">We respect your privacy. Unsubscribe anytime.</div>
        </div>
      </section>
    </div>
  );
}


