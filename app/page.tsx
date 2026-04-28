import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PageBackground } from '@/components/PageBackground';
import { CategoryCard } from '@/components/CategoryCard';

export const runtime = 'edge';

async function getInitialData() {
  const [categoriesRes, recentRes] = await Promise.all([
    supabaseAdmin.from('categories').select('*').order('name'),
    supabaseAdmin.from('questions').select('slug, title').eq('status', 'approved').order('created_at', { ascending: false }).limit(10)
  ]);

  return {
    categories: categoriesRes.data || [],
    recentQuestions: recentRes.data || []
  };
}

export default async function Home() {
  const { categories, recentQuestions } = await getInitialData();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      
      {/* 1. HERO SECTION — High Impact & Provocative */}
      <section className="relative pt-20 pb-32 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-slide-up">
          <Zap size={14} className="fill-purple-700" /> 100% Anonymous Insider Advice
        </div>
        
        <h1 className="font-syne text-5xl md:text-8xl font-extrabold text-slate-900 tracking-tighter mb-8 leading-[0.9] animate-slide-up stagger-1">
          The Secrets Your <br />
          <span className="text-gradient">Mother Never Told You.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-12 leading-relaxed animate-slide-up stagger-2">
          No judgment. No filters. Just the blunt truth about bodies, beauty, and the things girls are afraid to ask. Join the elite circle of insiders today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
          <Link href="/ask" className="btn-premium px-10 py-5 text-lg flex items-center gap-2 group">
            Ask A Taboo Question <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link href="#categories" className="px-10 py-5 text-lg font-bold text-slate-900 hover:text-purple-600 transition-colors">
            Browse The Vault
          </Link>
        </div>
      </section>

      {/* 2. TRENDING TICKER — Social Proof */}
      <div className="ticker-wrap mb-24">
        <div className="ticker-move">
          {[...recentQuestions, ...recentQuestions].map((q, i) => (
            <Link 
              key={i} 
              href={`/q/${q.slug}`}
              className="flex items-center gap-4 px-8 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors uppercase tracking-widest border-r border-slate-200"
            >
              <TrendingUp size={16} /> {q.title}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. CATEGORY GRID — The Vault */}
      <section id="categories" className="px-6 md:px-12 pb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl text-slate-900 mb-4">Choose Your <span className="text-gradient italic">Obsession.</span></h2>
            <p className="text-slate-500 max-w-lg">Everything you need to level up, from skincare secrets to relationship reality checks.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-purple-600 uppercase tracking-widest">
            <Sparkles size={18} /> 12 Categories Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              staggerDelay={i * 0.1}
            />
          ))}
        </div>
      </section>

      {/* 4. TRUST STRIP */}
      <section className="bg-slate-900 py-20 px-6 md:px-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent z-0" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Shield size={32} className="text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl mb-6">Encrypted. Anonymous. <span className="text-purple-400">Safe.</span></h2>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed">
            Your identity is never stored. Your questions are processed by a private AI engine trained on sisterly wisdom and 100% honesty. Speak freely.
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
             <span>No Logs</span>
             <span>No Tracking</span>
             <span>No Judgment</span>
          </div>
        </div>
      </section>
    </div>
  );
}
