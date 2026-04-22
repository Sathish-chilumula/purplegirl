'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Briefcase, Pill, Shirt, Brain, Salad, Bath, ShoppingBag, Coffee, Baby, ArrowRight, Loader2, EyeOff, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LiveSearch from '@/components/search/LiveSearch';
import MeTooButton from '@/components/question/MeTooButton';
import WelcomeBackCard from '@/components/home/WelcomeBackCard';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'beauty-skincare': <Sparkles className="w-5 h-5" />,
  'fashion-style': <Shirt className="w-5 h-5" />,
  'haircare': <Bath className="w-5 h-5" />,
  'relationships-love': <Heart className="w-5 h-5" />,
  'mental-wellness': <Brain className="w-5 h-5" />,
  'health-basics': <Pill className="w-5 h-5" />,
  'lifestyle': <Coffee className="w-5 h-5" />,
  'self-care-glow-up': <Bath className="w-5 h-5" />,
  'food-nutrition': <Salad className="w-5 h-5" />,
  'shopping-product-advice': <ShoppingBag className="w-5 h-5" />,
  'pregnancy-baby-care': <Baby className="w-5 h-5" />,
};

interface TrendingQuestion { id: string; title: string; slug: string; metoo_count: number; categories: { name: string }; }
interface RecentQuestion { id: string; title: string; slug: string; created_at: string; answers: { chat_log: string[] } | null; }
interface Category { id: string; name: string; slug: string; color: string; }

const TRUST_STATS = [
  { value: '8K+', label: 'Questions Answered' },
  { value: '100%', label: 'Anonymous' },
  { value: '0', label: 'Judgment' },
  { value: '24/7', label: 'Available' },
];

export default function Home() {
  const [trending, setTrending] = useState<TrendingQuestion[]>([]);
  const [recent, setRecent] = useState<RecentQuestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('categories').select('*').order('name');
        setCategories(catData || []);

        const { data: trendData } = await supabase
          .from('questions').select('id, title, slug, metoo_count, categories(name)')
          .eq('status', 'approved').order('metoo_count', { ascending: false }).limit(6);
        setTrending((trendData as any) || []);

        const { data: recentData } = await supabase
          .from('questions').select('id, title, slug, created_at, answers(chat_log)')
          .eq('status', 'approved').order('created_at', { ascending: false }).limit(4);

        setRecent(((recentData as any) || []).map((q: any) => ({ ...q, answers: q.answers?.[0] || null })));
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
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: subEmail }) });
      const data = await res.json();
      if (res.ok) { setSubStatus({ type: 'success', message: data.message }); setSubEmail(''); }
      else setSubStatus({ type: 'error', message: data.error });
    } catch { setSubStatus({ type: 'error', message: 'Something went wrong. Please try again.' }); }
  };

  return (
    <div className="flex flex-col gap-0 pb-20 overflow-x-hidden">

      {/* ─── HERO SECTION ─────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-[#FAF5FF]">
        {/* Animated orb backgrounds */}
        <div className="orb orb-purple w-[600px] h-[600px] top-[-100px] right-[-80px]" style={{ animationDelay: '0s' }} />
        <div className="orb orb-pink w-[500px] h-[500px] bottom-[-80px] left-[-60px]" style={{ animationDelay: '2s' }} />
        <div className="orb orb-violet w-[300px] h-[300px] top-[40%] left-[30%]" style={{ animationDelay: '4s' }} />

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 relative z-10">
          {/* Left — Copy */}
          <div className="space-y-7 text-center md:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 glass border border-purple-200/60 px-5 py-2.5 rounded-full text-sm font-bold text-purple-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Join 10,000+ girls already asking
            </div>

            <h1 className="font-playfair font-bold text-5xl md:text-6xl lg:text-7xl text-[#1F1235] tracking-tight leading-[1.08]">
              Ask{' '}
              <span className="gradient-text-animate">anything</span>
              <br />you can&apos;t ask anyone.
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0">
              Your private AI elder sister — for honest, judgment-free guidance on life, career, love, and everything in between.
            </p>

            <div className="max-w-lg mx-auto md:mx-0 pt-2">
              <LiveSearch variant="hero" placeholder="E.g. How do I deal with a toxic manager?" />
              <div className="flex items-center justify-center md:justify-start gap-6 mt-5 text-sm font-semibold text-gray-500">
                <span className="flex items-center gap-1.5"><span>🔒</span> Anonymous</span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1.5"><span>💜</span> No login</span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1.5"><span>⚡</span> Instant</span>
              </div>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-4 gap-3 pt-4 max-w-sm mx-auto md:mx-0">
              {TRUST_STATS.map(s => (
                <div key={s.value} className="text-center glass rounded-2xl p-3 shadow-sm">
                  <div className="font-playfair font-bold text-lg gradient-text">{s.value}</div>
                  <div className="text-xs text-gray-500 leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative flex items-center justify-center animate-slide-up stagger-2">
            {/* Glow ring behind image */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-3xl scale-110 animate-glow-pulse" />

            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/80 group animate-float">
              <Image
                src="/hero_women.png"
                alt="Women laughing and supporting each other"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-pink-200/10" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-5 py-3 rounded-2xl text-center shadow-lg border border-white/60 w-[80%]">
                <p className="font-bold text-[#1F1235] text-sm">💜 &ldquo;You are not alone in this&rdquo;</p>
                <p className="text-xs text-gray-500 mt-0.5">PurpleGirl AI answers you with empathy</p>
              </div>
            </div>

            {/* Floating sparkles */}
            <div className="absolute top-8 right-4 glass w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-2xl">✨</span>
            </div>
            <div className="absolute bottom-24 left-0 glass w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '2s' }}>
              <span className="text-2xl">💬</span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0 60L48 50C96 40 192 20 288 16.7C384 13.3 480 26.7 576 33.3C672 40 768 40 864 33.3C960 26.7 1056 13.3 1152 10C1248 6.7 1344 13.3 1392 16.7L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#FAF5FF" />
          </svg>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
            <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-pink-400 animate-pulse" />
          </div>
          <p className="text-purple-900/60 font-bold tracking-tight animate-pulse">Entering the sisterhood...</p>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <WelcomeBackCard />
          </div>

          {/* ─── TRENDING QUESTIONS ──────────────────────── */}
          <section className="relative w-full bg-[#FAF5FF] py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="text-3xl">🔥</span>
                <div>
                  <h2 className="font-playfair font-bold text-3xl text-[#1F1235]">Girls are asking…</h2>
                  <p className="text-gray-500 text-sm mt-1">Real questions from the sisterhood, answered with empathy</p>
                </div>
              </div>

              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-6 snap-x snap-mandatory hide-scrollbar">
                {trending.map((q) => (
                  <div 
                    key={q.id} 
                    className="min-w-[280px] md:min-w-0 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 snap-start border border-purple-50 flex flex-col h-full"
                  >
                    <div className="text-xs font-semibold text-purple-primary mb-3 uppercase tracking-wider">{q.categories?.name}</div>
                    <Link href={`/q/${q.slug}`} className="flex-1">
                      <h3 className="font-bold text-lg text-text-primary mb-4 line-clamp-3 hover:text-purple-primary transition-colors">{q.title}</h3>
                    </Link>
                    <div className="flex items-center justify-between text-sm font-medium text-text-secondary mt-auto pt-2 border-t border-purple-50/50">
                      <span className="text-xs font-bold text-pink-500">Trending</span>
                      <MeTooButton questionId={q.id} initialCount={q.metoo_count} variant="compact" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── CATEGORIES SECTION ─────────────────────── */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#FAF5FF]" />
        <div className="orb orb-pink w-[400px] h-[400px] top-0 right-0 opacity-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-playfair font-bold text-3xl text-[#1F1235] mb-3">What&apos;s on your mind?</h2>
            <p className="text-gray-500">Browse by topic and find your answer instantly</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="shimmer h-20 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="card-premium p-4 flex items-center gap-3 group animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 text-purple-600 group-hover:from-purple-600 group-hover:to-pink-500 group-hover:text-white transition-all duration-300 shrink-0">
                    {CATEGORY_ICONS[cat.slug] || <Heart className="w-5 h-5" />}
                  </div>
                  <span className="font-semibold text-[#1F1235] text-sm leading-tight group-hover:text-purple-600 transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHISPER MODE PROMO ──────────────────────── */}
      <section className="px-4 py-8">
        <Link 
          href="/whisper"
          className="max-w-7xl mx-auto block bg-gradient-to-r from-[#1A0F1D] to-[#2D1B2E] rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-900/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" /> New: Ephemeral Chat
              </div>
              <h2 className="font-playfair font-bold text-3xl md:text-4xl text-white">
                Enter <span className="text-purple-400">Whisper Mode</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Have a sensitive question you want 100% off the records? No logs, no history, just sisterly advice in the shadows.
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                <EyeOff className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────── */}
      <section className="py-16 px-4 bg-[#FAF5FF]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair font-bold text-3xl text-[#1F1235] mb-4">How PurpleGirl works</h2>
          <p className="text-gray-500 mb-12">Three steps to get the answers you deserve</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '💬', step: '01', title: 'Ask anonymously', desc: 'Type anything — no login, no name, no judgment. Your question is completely private.' },
              { emoji: '🧠', step: '02', title: 'AI elder sister responds', desc: 'Our empathetic AI understands the emotion behind your question and replies like a caring older sister.' },
              { emoji: '✨', step: '03', title: 'Continue the conversation', desc: 'Ask follow-up questions, get tailored advice, and explore product recommendations.' },
            ].map((item, i) => (
              <div key={i} className="card-premium p-8 text-center group animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${i}s` }}>{item.emoji}</div>
                <div className="text-xs font-bold text-purple-400 tracking-widest mb-3 uppercase">{item.step}</div>
                <h3 className="font-bold text-lg text-[#1F1235] mb-3 group-hover:text-purple-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENT ANSWERS ─────────────────────────── */}
      {!loading && recent.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-playfair font-bold text-3xl text-[#1F1235]">Recently answered</h2>
                <p className="text-gray-500 text-sm mt-1">Fresh answers from the sisterhood</p>
              </div>
              <Link href="/search?sort=recent" className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recent.map((q, i) => (
                <Link
                  key={q.id}
                  href={`/q/${q.slug}`}
                  className="card-premium p-6 group animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <h3 className="font-bold text-lg text-[#1F1235] mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">{q.title}</h3>
                  {q.answers?.chat_log?.[0] && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed italic">
                      &ldquo;{q.answers.chat_log[0]}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple-50">
                    <span className="text-xs text-gray-400 font-medium">{new Date(q.created_at).toLocaleDateString()}</span>
                    <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:gap-2 transition-all">Read conversation <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER CTA ─────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-[2.5rem]" />
          <div className="orb orb-pink w-72 h-72 top-0 right-0 opacity-25" />
          <div className="relative z-10 p-10 md:p-14 text-center">
            <span className="text-5xl mb-5 block animate-float">💌</span>
            <h2 className="font-playfair font-bold text-3xl text-white mb-3">Get answers in your inbox</h2>
            <p className="text-white/80 mb-8 max-w-sm mx-auto">Weekly answers on beauty, career, relationships and life. It&apos;s completely free.</p>

            {subStatus.type === 'success' ? (
              <div className="bg-white/20 backdrop-blur-sm text-white border border-white/30 p-4 rounded-2xl font-medium">
                {subStatus.message} 🎉
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
                <input
                  type="email" placeholder="Your email address"
                  className="flex-1 rounded-full px-6 py-3.5 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all"
                  value={subEmail} onChange={e => setSubEmail(e.target.value)} required
                  disabled={subStatus.type === 'loading'}
                />
                <button type="submit" disabled={subStatus.type === 'loading'}
                  className="bg-white text-purple-700 px-8 py-3.5 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap">
                  {subStatus.type === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {subStatus.type === 'loading' ? 'Joining…' : 'Subscribe'}
                </button>
              </form>
            )}
            {subStatus.type === 'error' && <p className="text-red-200 text-sm mt-3">{subStatus.message}</p>}
            <p className="text-white/50 text-xs mt-5">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
