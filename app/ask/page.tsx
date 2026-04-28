'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategoryDetect } from '@/lib/hooks/useCategoryDetect';
import { QuillWriting } from '@/components/QuillWriting';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';
import { Question } from '@/lib/types';
import { AnswerCard } from '@/components/AnswerCard';
import { FOLIOS } from '@/lib/folios';

function AskChamberContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQ = searchParams.get('q') || '';
  const [question, setQuestion] = useState(initialQ);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer, setAnswer] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectedFolio = useCategoryDetect(question) || FOLIOS[0];

  useEffect(() => {
    // If we landed here with a question from the homepage, auto-submit it
    if (initialQ && !answer && !isSubmitting) {
      handleSubmit(initialQ);
    }
  }, [initialQ]);

  const handleSubmit = async (qText: string) => {
    if (!qText.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const questionId = crypto.randomUUID();
      const slug = `${slugify(qText).substring(0, 40)}-${Math.random().toString(36).substring(2, 7)}`;

      // 1. Insert question
      const { data: qData, error: qErr } = await supabase
        .from('questions')
        .insert({
          id: questionId,
          title: qText.trim(),
          slug,
          status: 'pending'
        })
        .select()
        .single();

      if (qErr) throw qErr;

      // 2. Trigger generation
      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      });

      if (!res.ok) throw new Error('Oracle generation failed');
      const genData = await res.json();

      // 3. Fetch the full generated question/answer
      const { data: fullAnswer, error: fetchErr } = await supabase
        .from('questions')
        .select('*, answers(*)')
        .eq('id', questionId)
        .single();

      if (fetchErr) throw fetchErr;

      setAnswer(fullAnswer as Question);
      
    } catch (err: any) {
      console.error(err);
      setError("The oracle could not read the cipher. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer(null);
    setError(null);
    router.replace('/ask');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-pg-parch-50 text-pg-ink-900">
      
      {/* ── LEFT PANEL: THE FOLIO VIEW ───────────────── */}
      <div className="w-full md:w-[38%] relative flex flex-col border-r border-pg-parch-200 bg-pg-parch-100 overflow-hidden min-h-[30vh] md:min-h-screen shrink-0">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <img 
            src={detectedFolio.imageSrc} 
            alt="Folio background" 
            className="w-full h-full object-cover opacity-60 sepia-[0.3] saturate-[0.8]"
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-pg-parch-100/40 via-pg-parch-100/60 to-pg-parch-50/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(45,32,16,0.4)_100%)] pointer-events-none mix-blend-multiply opacity-50" />

        <div className="relative z-10 flex-1 flex flex-col p-8 md:p-12">
          <div className="font-cinzel text-[9px] tracking-[0.3em] text-pg-gold-600 mb-auto">
            THE ARCHIVES
          </div>
          
          <div className="mt-auto pt-20">
            <div className="font-cinzel text-[9px] tracking-[0.2em] text-pg-crimson-600 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pg-crimson-600 animate-pulse" />
              CURRENTLY CONSULTING: {detectedFolio.volumeLabel}
            </div>
            <h2 className="font-im-fell text-3xl md:text-4xl italic text-pg-ink-900 leading-tight mb-4">
              {detectedFolio.title}
            </h2>
            <p className="text-pg-ink-600 font-crimson italic max-w-sm">
              {detectedFolio.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: THE ORACLE CHAMBER ──────────── */}
      <div className="flex-1 flex flex-col p-6 md:p-12 lg:p-20 relative overflow-y-auto">
        <div className="max-w-2xl w-full mx-auto my-auto">
          
          {answer ? (
            <div className="animate-fade-in">
              <AnswerCard question={answer} folio={detectedFolio} />
              
              <div className="mt-8 flex gap-4 justify-center">
                <button onClick={handleReset} className="font-cinzel text-[10px] tracking-[0.2em] border border-pg-parch-300 text-pg-ink-600 hover:text-pg-crimson-600 hover:border-pg-crimson-600 px-6 py-3 rounded-sm transition-colors uppercase">
                  Ask Another
                </button>
                <button onClick={() => navigator.clipboard.writeText(answer.cipher_key || answer.id)} className="font-cinzel text-[10px] tracking-[0.2em] border border-pg-parch-300 text-pg-ink-600 hover:text-pg-gold-600 hover:border-pg-gold-500 px-6 py-3 rounded-sm transition-colors uppercase">
                  Copy Cipher Key
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="font-unifraktur text-6xl text-pg-crimson-600 opacity-20 mb-4 select-none">O</div>
              <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-pg-ink-900 mb-2 uppercase tracking-wide">
                Speak to the Cipher
              </h1>
              <p className="font-crimson italic text-lg text-pg-ink-500 mb-10">
                Write what you cannot say aloud. The sisterhood will answer.
              </p>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSubmit(question); }}
                className="relative bg-white border border-pg-parch-200 rounded shadow-sm focus-within:border-pg-crimson-600/50 transition-colors p-6"
              >
                <span className="absolute top-6 left-6 font-im-fell text-3xl text-pg-crimson-600 opacity-50">¶</span>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask the question that has no other home..."
                  className="w-full min-h-[160px] pl-10 bg-transparent border-none outline-none font-im-fell text-2xl text-pg-ink-900 placeholder:text-pg-ink-400 placeholder:italic resize-none"
                  disabled={isSubmitting}
                />

                <div className="mt-6 flex justify-between items-center border-t border-pg-parch-100 pt-4">
                  <div className="font-cinzel text-[9px] tracking-widest text-pg-ink-400 uppercase">
                    Anonymous. Not stored.
                  </div>
                  {isSubmitting ? (
                    <QuillWriting text="Consulting Vol. III..." />
                  ) : (
                    <button 
                      type="submit"
                      disabled={!question.trim()}
                      className="bg-pg-crimson-600 hover:bg-pg-crimson-500 text-white font-cinzel text-[11px] tracking-[0.2em] px-8 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase"
                    >
                      Reveal
                    </button>
                  )}
                </div>
              </form>

              {error && (
                <div className="mt-4 text-pg-crimson-600 font-crimson italic animate-fade-in text-center">
                  {error}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function AskChamber() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pg-parch-50">
        <QuillWriting text="Entering the chamber..." />
      </div>
    }>
      <AskChamberContent />
    </Suspense>
  );
}
