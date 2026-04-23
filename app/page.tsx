'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Briefcase, Pill, Shirt, Brain, Salad, Bath, ShoppingBag, Coffee, Baby, ArrowRight, Loader2, EyeOff, Shield, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LiveSearch from '@/components/search/LiveSearch';
import MeTooButton from '@/components/question/MeTooButton';
import WelcomeBackCard from '@/components/home/WelcomeBackCard';
import SisterhoodPulse from '@/components/home/SisterhoodPulse';
import MoodCheckin from '@/components/home/MoodCheckin';
import LifeStageSelector from '@/components/home/LifeStageSelector';
import { getLifeStageGreeting } from '@/lib/lifeStage';

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

interface TrendingQuestion { id: string; title: string; slug: string; metoo_count: number; categories: { name: string; color: string } }
interface RecentQuestion { id: string; title: string; slug: string; created_at: string; answers: { chat_log: string[] } | null; }
interface Category { id: string; name: string; slug: string; color: string; }

const ROTATING_WORDS = ["your skin", "your relationship", "your career", "your health", "your feelings"];

const TRUST_STATS = [
  { value: '12K+', label: 'Questions Answered' },
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
  const [wordIndex, setWordIndex] = useState(0);
  const [lifeStage, setLifeStage] = useState<string | null>(null);

  useEffect(() => {
    const updateLifeStage = () => {
      setLifeStage(localStorage.getItem('life_stage'));
    };
    updateLifeStage();
    window.addEventListener('life_stage_updated', updateLifeStage);
    return () => window.removeEventListener('life_stage_updated', updateLifeStage);
  }, []);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(wordInterval);
  }, []);

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
      <LifeStageSelector />
      
      {lifeStage && (
        <div className="w-full aurora-bg border-b border-purple-100 py-2 px-4 text-center animate-slide-down">
          <p className="text-sm font-medium text-[#1F1235] flex items-center justify-center gap-2">
            <span>{getLifeStageGreeting(lifeStage)}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('life_stage');
                localStorage.removeItem('life_stage_set_date');
                setLifeStage(null);
                window.location.reload();
              }}
              className="text-xs text-purple-600 hover:text-purple-800 underline ml-2 font-bold"
            >
              Change
            </button>
          </p>
        </div>
      )}

      {/* ─── HERO SECTION ─────────────────────────────── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden aurora-bg">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 relative z-10">
          {/* Left — Copy */}
          <div className="space-y-7 text-center md:text-left">
            <h1 className="text-editorial text-5xl md:text-6xl lg:text-7xl text-[#1F1235] tracking-tight leading-[1.05]">
              <div className="animate-reveal-up" style={{ animationDelay: '0.1s' }}>Ask what you</div>
              <div className="animate-reveal-up" style={{ animationDelay: '0.2s' }}>can't ask</div>
              <div className="animate-reveal-up" style={{ animationDelay: '0.3s' }}>anyone.</div>
            </h1>

            <div className="text-2xl md:text-3xl font-medium text-purple-800 h-10 relative overflow-hidden">
              About <span className="font-playfair italic absolute inset-y-0 left-20 transition-all duration-500 animate-fade-in" key={wordIndex}>{ROTATING_WORDS[wordIndex]}</span>
            </div>

            <div className="max-w-lg mx-auto md:mx-0 pt-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ask sister anything..." 
                  className="w-full pl-14 pr-16 py-4 rounded-full border-4 border-purple-200 text-lg shadow-purple-200/50 shadow-xl focus:outline-none focus:border-purple-400 transition-colors bg-white"
                  onClick={() => document.getElementById('search-trigger')?.click()}
                  readOnly
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">💜</div>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform" onClick={() => document.getElementById('search-trigger')?.click()}>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden" id="search-trigger">
                <LiveSearch variant="hero" placeholder="E.g. How do I deal with a toxic manager?" />
              </div>
              
              <div className="flex justify-center md:justify-start gap-4 mt-6">
                <span className="pill-badge bg-white/60 backdrop-blur text-purple-800 border border-white/50 shadow-sm">🔒 Anonymous</span>
                <span className="pill-badge bg-white/60 backdrop-blur text-purple-800 border border-white/50 shadow-sm">💜 No login</span>
                <span className="pill-badge bg-white/60 backdrop-blur text-purple-800 border border-white/50 shadow-sm">⚡ Instant answers</span>
              </div>
            </div>

            {/* Trust stats as horizontal frosted glass bar */}
            <div className="max-w-xl mx-auto md:mx-0 pt-4 hidden md:block">
              <div className="glass flex items-center justify-between rounded-2xl p-4 divide-x divide-purple-100 shadow-sm">
                {TRUST_STATS.map(s => (
                  <div key={s.value} className="text-center px-4 flex-1">
                    <div className="font-playfair font-bold text-xl gradient-text-animate">{s.value}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Image with Chat Bubble Overlay */}
          <div className="relative flex items-center justify-center animate-slide-up stagger-2">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/80 group">
              <Image
                src="/hero_women.png"
                alt="Women laughing and supporting each other"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-pink-200/10" />

              {/* Chat Bubble Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="self-end bg-purple-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-lg border border-purple-400">
                  How do I handle my toxic manager?
                </div>
                <div className="self-start glass-purple px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-lg border border-purple-200 flex gap-2">
                  <span className="text-lg">💜</span>
                  <span className="text-[#1F1235] font-medium">Oh honey, I'm so sorry you're dealing with this. Let's talk about setting firm boundaries first...</span>
                </div>
              </div>
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

      {/* Pulse Counter */}
      <SisterhoodPulse />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-[#FAF5FF]">
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
            
            {/* Skin Check Promo Banner */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden mb-12 shadow-2xl group animate-slide-up">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors" />
              <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/20 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-white/10 text-pink-200 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-white/20 backdrop-blur-sm">
                    New AI Feature ✨
                  </span>
                  <h3 className="font-playfair font-bold text-3xl md:text-4xl mb-3">
                    Skin Photo Analysis
                  </h3>
                  <p className="text-purple-100 text-lg">
                    Got a dark spot or acne breakout? Upload a photo privately and our AI will suggest potential causes and home remedies.
                  </p>
                </div>
                <Link 
                  href="/skin-check"
                  className="shrink-0 bg-white text-purple-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group-hover:bg-pink-50"
                >
                  <Camera className="w-5 h-5 text-pink-500" />
                  Check My Skin
                </Link>
              </div>
            </div>

            <MoodCheckin questions={trending} />
          </div>

          {/* ─── TRENDING QUESTIONS ──────────────────────── */}
          <section className="relative w-full bg-[#FAF5FF] py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="text-3xl">🔥</span>
                <div>
                  <h2 className="text-editorial text-3xl md:text-4xl italic text-[#1F1235]">The Sisterhood is asking...</h2>
                </div>
              </div>

              {/* Magazine Layout */}
              {trending.length > 0 && (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Featured Large Card */}
                  <div className="md:w-1/2 shimmer-card group">
                    <div className="h-full bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 shadow-xl border border-purple-300 flex flex-col justify-between">
                      <div>
                        <span className="pill-badge bg-white/20 text-white border border-white/30 mb-6">{trending[0].categories?.name}</span>
                        <Link href={`/q/${trending[0].slug}`}>
                          <h3 className="font-playfair font-bold text-3xl md:text-4xl text-white leading-tight mt-4 group-hover:underline decoration-2 underline-offset-4">
                            {trending[0].title}
                          </h3>
                        </Link>
                      </div>
                      <div className="mt-12 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/90 text-sm font-bold">
                          <Heart className="w-5 h-5 fill-white animate-heartbeat" />
                          {trending[0].metoo_count?.toLocaleString()} sisters asked this
                        </div>
                        <Link href={`/q/${trending[0].slug}`} className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                          Read Answer →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Smaller Cards Grid */}
                  <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trending.slice(1, 5).map((q) => (
                      <Link key={q.id} href={`/q/${q.slug}`} className="card-premium shimmer-card p-6 flex flex-col border-t-[3px] border-t-purple-400">
                        <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">{q.categories?.name}</div>
                        <h3 className="font-bold text-lg text-[#1F1235] mb-4 flex-1 line-clamp-3">{q.title}</h3>
                        <div className="flex items-center gap-1.5 text-pink-500 text-sm font-bold">
                          <Heart className="w-4 h-4 fill-pink-500" /> {q.metoo_count?.toLocaleString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ─── CATEGORIES SECTION ─────────────────────── */}
      <section className="relative py-16 px-4 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-editorial text-3xl text-[#1F1235] mb-3">What's on your mind?</h2>
            <p className="text-gray-500">Browse by topic and find your answer instantly</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="shimmer h-20 rounded-2xl" />)}
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 snap-x snap-mandatory hide-scrollbar">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="min-w-[200px] md:min-w-0 shimmer-card card-premium p-4 flex items-center justify-between group animate-slide-up snap-start"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                      {CATEGORY_ICONS[cat.slug] || <Heart className="w-5 h-5" />}
                    </div>
                    <span className="font-bold text-[#1F1235] text-sm group-hover:text-purple-600 transition-colors">{cat.name}</span>
                  </div>
                </Link>
              ))}
              <div className="min-w-[150px] md:hidden flex items-center justify-center snap-start pr-4">
                <Link href="/search" className="text-purple-600 font-bold text-sm bg-purple-50 px-6 py-3 rounded-full">See all →</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────── */}
      <section className="py-20 px-4 bg-[#FAF5FF] overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          
          {/* Fake Chat Demonstration */}
          <div className="w-full md:w-1/2 relative flex justify-center perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl rounded-full" />
            <div className="w-full max-w-sm bg-[#F9F9FB] rounded-[3rem] p-6 shadow-2xl border-[8px] border-white relative z-10 flex flex-col gap-4" style={{ height: '500px' }}>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center text-lg border-2 border-white shadow-sm">💜</div>
                <div>
                  <div className="font-bold text-sm text-[#1F1235]">PurpleGirl</div>
                  <div className="text-xs text-green-500 font-medium">Online</div>
                </div>
              </div>

              <div className="flex flex-col gap-4 flex-1 overflow-hidden pt-2">
                <div className="self-end bubble-user text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md animate-fade-in">
                  Why do I always feel so exhausted even after sleeping?
                </div>
                <div className="self-start bubble-sister text-[#1F1235] border border-purple-100 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] shadow-sm animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
                  Oh honey, this is so much more common than you think. You're not just physically tired, you might be mentally drained. 💜
                </div>
                <div className="self-end bubble-user text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md animate-fade-in" style={{ animationDelay: '2.5s', animationFillMode: 'both' }}>
                  Is it something serious?
                </div>
                <div className="self-start bubble-sister text-[#1F1235] border border-purple-100 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] shadow-sm animate-fade-in" style={{ animationDelay: '3.5s', animationFillMode: 'both' }}>
                  Let me walk you through the most common reasons. Often it's low Vitamin D or B12, or just carrying too much stress. Have you checked your...
                </div>
              </div>
            </div>
          </div>

          {/* Text Descriptions */}
          <div className="w-full md:w-1/2 space-y-12">
            <div>
              <h2 className="text-editorial text-4xl text-[#1F1235] mb-4">How PurpleGirl works</h2>
              <p className="text-gray-500 text-lg">Three steps to get the answers you deserve.</p>
            </div>

            <div className="space-y-8">
              {[
                { emoji: '💬', step: '01', title: 'Ask anonymously', desc: 'Type anything — no login, no name, no judgment. Your question is completely private.' },
                { emoji: '🧠', step: '02', title: 'AI elder sister responds', desc: 'Our empathetic AI understands the emotion behind your question and replies like a caring older sister.' },
                { emoji: '✨', step: '03', title: 'Continue the conversation', desc: 'Ask follow-up questions, get tailored advice, and explore product recommendations.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white shadow-sm border border-purple-50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-md transition-all">
                    {item.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-purple-400 tracking-widest mb-1 uppercase">{item.step}</div>
                    <h3 className="font-bold text-lg text-[#1F1235] mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHISPER MODE PROMO ──────────────────────── */}
      <section className="px-4 py-16 bg-white">
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

      {/* ─── NEWSLETTER CTA ─────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-[2.5rem] noise-overlay" />
          <div className="orb orb-pink w-72 h-72 top-0 right-0 opacity-25" />
          <div className="relative z-10 p-10 md:p-14 text-center">
            <span className="text-5xl mb-5 block animate-float">💌</span>
            <h2 className="text-editorial text-3xl text-white mb-3">Get answers in your inbox</h2>
            <p className="text-white/80 mb-8 max-w-sm mx-auto">Weekly answers on beauty, career, relationships and life. It's completely free.</p>

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
                  className="bg-white text-purple-700 px-8 py-3.5 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap hover:scale-105">
                  {subStatus.type === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {subStatus.type === 'loading' ? 'Joining…' : 'Subscribe'}
                </button>
              </form>
            )}
            <p className="text-white/50 text-xs mt-5">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
