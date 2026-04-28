import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, Star, Heart } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PageBackground } from '@/components/PageBackground';
import { CategoryCard } from '@/components/CategoryCard';
import { TickerBar } from '@/components/TickerBar';
import { CTAButton } from '@/components/CTAButton';

export const runtime = 'edge';

async function getInitialData() {
  const [categoriesRes, recentRes] = await Promise.all([
    supabaseAdmin.from('categories').select('*').order('name'),
    supabaseAdmin.from('questions')
      .select('slug, title')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(12),
  ]);
  return {
    categories: categoriesRes.data || [],
    recentQuestions: recentRes.data || [],
  };
}

const stats = [
  { value: '50K+', label: 'Questions Answered' },
  { value: '100%', label: 'Anonymous' },
  { value: '12',   label: 'Expert Categories' },
  { value: '24/7', label: 'Always Available' },
];

export default async function Home() {
  const { categories, recentQuestions } = await getInitialData();

  return (
    <div className="relative">
      <PageBackground />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">

          {/* Eyebrow badge */}
          <div className="flex justify-center mb-8">
            <div className="badge badge-purple fade-up">
              <Zap size={11} />
              India's #1 Anonymous Women's Advice Platform
            </div>
          </div>

          {/* Main headline — editorial style */}
          <div className="text-center mb-10">
            <h1
              className="fade-up stagger-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 8vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                color: 'var(--ink)',
                marginBottom: '0.2em',
              }}
            >
              The Questions
              <br />
              <span className="text-gradient" style={{ display: 'inline-block', paddingBottom: '0.05em' }}>
                You're Afraid to Ask.
              </span>
            </h1>

            <p
              className="fade-up stagger-2 mx-auto"
              style={{
                maxWidth: '36rem',
                fontSize: '1.15rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                marginTop: '1.5rem',
              }}
            >
              Your digital elder sister — warm, honest, and judgment-free.
              Ask about beauty, health, relationships, and everything in between.
            </p>
          </div>

          {/* CTA row */}
          <div className="fade-up stagger-3 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/ask" className="btn-primary text-base">
              Ask Anything <ArrowRight size={18} />
            </Link>
            <Link href="#categories" className="btn-ghost text-base">
              Browse Topics
            </Link>
          </div>

          {/* Stats strip */}
          <div
            className="fade-up stagger-4 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden mx-auto"
            style={{ maxWidth: '800px', background: 'var(--border-soft)' }}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                style={{ background: 'var(--surface-warm)' }}
                className="py-6 text-center"
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 800,
                    background: 'var(--grad-brand)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. TRENDING TICKER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <TickerBar questions={recentQuestions} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. CATEGORY GRID
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="categories" className="px-6 pb-32">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="section-label mb-4 flex items-center gap-2">
                <Sparkles size={13} /> Your Topics, Your Space
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: 'var(--ink)',
                  lineHeight: 1.15,
                }}
              >
                Choose Your{' '}
                <span className="text-gradient italic">Obsession.</span>
              </h2>
            </div>
            <p style={{ maxWidth: '28rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              From skincare to relationships — every topic handled with honesty, warmth, and zero judgment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} staggerDelay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. TESTIMONIAL / SOCIAL PROOF STRIP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="px-6 py-20 mb-8"
        style={{ background: 'linear-gradient(135deg, var(--purple-mist) 0%, var(--pink-mist) 100%)' }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6" style={{ justifyContent: 'center', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Star size={13} style={{ fill: 'var(--purple-mid)', color: 'var(--purple-mid)' }} /> Trusted by Women Across India
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
              color: 'var(--ink)',
              marginBottom: '3rem',
            }}
          >
            "Finally, someone who gives me a{' '}
            <span className="text-gradient">real answer."</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: 'I asked something I was too embarrassed to Google. Got a clear, kind answer in seconds.', name: 'A.', city: 'Mumbai' },
              { quote: 'No doctor talk, no shame. Just straight answers like an elder sister would give.', name: 'P.', city: 'Bangalore' },
              { quote: 'I wish this existed when I was 16. Every girl needs this resource.', name: 'R.', city: 'Delhi' },
            ].map((t, i) => (
              <div
                key={i}
                className="card-elevated p-8 text-left fade-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} style={{ fill: 'var(--purple-mid)', color: 'var(--purple-mid)' }} />
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                  "{t.quote}"
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  — {t.name} · {t.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. ASK CTA BANNER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-6 pb-32">
        <div
          style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '2rem', overflow: 'hidden', position: 'relative' }}
        >
          <div
            style={{
              background: 'var(--grad-purple)',
              padding: '5rem 3rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Background orbs inside CTA */}
            <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(236,72,153,0.15)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div className="relative z-10">
              <Heart size={40} style={{ color: 'rgba(255,255,255,0.3)', fill: 'rgba(255,255,255,0.3)', margin: '0 auto 1.5rem' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  color: 'white',
                  marginBottom: '1.25rem',
                }}
              >
                You Deserve a Real Answer.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                No topic is too taboo. No question is too small. Anonymous, safe, and always here.
              </p>
              <CTAButton href="/ask">
                <Shield size={18} /> Ask Your Question
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
