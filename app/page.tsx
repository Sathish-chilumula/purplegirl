'use client';

import React, { useState, useEffect } from 'react';
import { PageBackground } from '@/components/PageBackground';
import { IlluminatedDropCap } from '@/components/IlluminatedDropCap';
import { OrnDivider } from '@/components/OrnDivider';
import { AskBox } from '@/components/AskBox';
import { FolioCard } from '@/components/FolioCard';
import { FOLIOS } from '@/lib/folios';
import { DustMotes } from '@/components/DustMotes';
import { supabase } from '@/lib/supabase';
import { Question } from '@/lib/types';
import { AnswerCard } from '@/components/AnswerCard';

export default function Home() {
  const [liveQuestion, setLiveQuestion] = useState<Question | null>(null);

  useEffect(() => {
    // Fetch one recent question to show the live answer card format
    async function fetchRecent() {
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('status', 'approved')
        .not('chat_log', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        setLiveQuestion(data as Question);
      }
    }
    fetchRecent();
  }, []);

  return (
    <div className="app relative overflow-hidden">
      <PageBackground />
      <DustMotes />

      {/* ── 1. HERO SECTION ───────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-12 z-10" id="whisper">
        <IlluminatedDropCap letter="Q" className="-left-4 top-1/4" />
        
        <div className="type-eyebrow mb-6 animate-slide-up stagger-1">
          ✦ SPEAK FREELY · NO NAME · NO TRACE ✦
        </div>
        
        <h1 className="type-h1 mb-6 animate-slide-up stagger-2 max-w-4xl mx-auto flex flex-col items-center gap-2">
          <span>Ask the</span>
          <span className="text-pg-crimson-600">Eternal Cipher</span>
          <span className="font-im-fell font-normal text-pg-parch-400">of the Sisterhood</span>
        </h1>

        <div className="type-lead max-w-2xl mx-auto mb-12 animate-slide-up stagger-3">
          The question your family told you to forget is the one that needs answering. 
          Step into the shadows of the vault—anonymous, untraceable, understood.
        </div>

        <OrnDivider variant="both" className="mb-12" />

        <div className="w-full relative z-20">
          <AskBox />
        </div>

        {liveQuestion && (
          <div className="mt-20 w-full animate-slide-up stagger-3">
            <div className="type-eyebrow mb-4 opacity-50">Recently Deciphered</div>
            <AnswerCard question={liveQuestion} folio={FOLIOS[0]} />
          </div>
        )}
      </section>

      {/* ── 2. HOW IT WORKS ───────────────────────────── */}
      <section className="section-alt py-24 relative border-y border-pg-parch-200 z-10" id="cipher">
        <IlluminatedDropCap letter="T" variant="gold" className="-right-8 top-12" />
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="type-eyebrow mb-3">The Ritual</div>
            <h2 className="type-h2">How the Cipher Protects You</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { num: 'I', title: 'The Whisper', desc: 'You ask without a name. We do not ask for a login. We do not track your stars.' },
              { num: 'II', title: 'The Illumination', desc: 'Our Oracle reads the history of the Sisterhood, pulling truth from thousands of anonymous voices.' },
              { num: 'III', title: 'The Dispersal', desc: 'The answer is given, and the cipher is burned. No trace of your whisper remains.' }
            ].map((step, i) => (
              <div key={step.num} className="surface-card p-8 text-center flex flex-col items-center relative overflow-hidden group parchment-unfurl" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="text-4xl font-cinzel text-pg-parch-200 font-black mb-4 group-hover:text-pg-gold-300 transition-colors duration-500">{step.num}</div>
                <h3 className="type-h3 mb-4">{step.title}</h3>
                <p className="type-body text-pg-ink-600">{step.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-pg-crimson-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FOLIO GALLERY ──────────────────────────── */}
      <section className="py-24 relative z-10" id="volumes">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <OrnDivider variant="simple" className="mb-6" />
            <div className="type-eyebrow mb-3">The Library of Shadows</div>
            <h2 className="type-h2 mb-4">Browse the Four Volumes</h2>
            <p className="type-lead max-w-2xl mx-auto text-base">
              Systematic knowledge distilled from the anonymous whispers of the women who came before you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOLIOS.map((folio, i) => (
              <FolioCard key={folio.id} folio={folio} staggerDelay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CTA ────────────────────────────────────── */}
      <section className="relative py-32 bg-pg-crimson-600 border-t-4 border-pg-gold-500 z-10 overflow-hidden" id="sisterhood">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'5\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'400\\' height=\\'400\\' filter=\\'url(%23n)\\' opacity=\\'0.15\\'/%3E%3C/svg%3E')] mix-blend-multiply opacity-50" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="font-unifraktur text-6xl text-pg-gold-500 mb-6 opacity-80">A</div>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-8 leading-tight drop-shadow-md">
            Ask the question that <br /> has no other home.
          </h2>
          <button onClick={() => document.getElementById('whisper')?.scrollIntoView({ behavior: 'smooth' })} className="bg-pg-gold-500 hover:bg-pg-gold-400 text-pg-ink-900 font-cinzel text-sm font-bold tracking-[0.2em] uppercase px-10 py-4 shadow-xl transition-transform hover:-translate-y-1">
            OPEN THE CIPHER
          </button>
        </div>
      </section>
    </div>
  );
}
