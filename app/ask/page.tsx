'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';
import { AnswerCard } from '@/components/AnswerCard';
import { PageBackground } from '@/components/PageBackground';
import { Shield, Sparkles, Send, RefreshCcw } from 'lucide-react';

function AskContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQ = searchParams.get('q') || '';
  const [questionText, setQuestionText] = useState(initialQ);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQ && !result && !isSubmitting) {
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

      // 3. Fetch the full generated question/answer
      const { data: fullData, error: fetchErr } = await supabase
        .from('questions')
        .select('*, answers(*)')
        .eq('id', questionId)
        .single();

      if (fetchErr) throw fetchErr;

      setResult({
        question: fullData,
        answer: (fullData.answers as any)?.[0] || null
      });
      
    } catch (err: any) {
      console.error(err);
      setError("I'm sorry, girl. I couldn't process that right now. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuestionText('');
    setResult(null);
    setError(null);
    router.replace('/ask');
  };

  return (
    <div className="min-h-screen relative py-20 px-6">
      <PageBackground />
      
      <div className="max-w-4xl mx-auto">
        {result ? (
          <div className="animate-fade-in">
            <AnswerCard question={result.question} answer={result.answer} />
            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleReset} 
                className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors font-bold text-xs uppercase tracking-widest group"
              >
                <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Ask Another Secret
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl">
                <Sparkles size={32} />
              </div>
            </div>
            
            <h1 className="font-syne text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-6">
              Ask Anything<span className="text-purple-600">.</span>
            </h1>
            <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              No topic is too taboo. No question is too small. Get honest, kind, and 100% anonymous answers from your digital elder sister.
            </p>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSubmit(questionText); }}
              className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(76,29,149,0.15)] border border-purple-50 p-4 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
              
              <div className="relative z-10">
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Tell me what's on your mind, girl..."
                  className="w-full min-h-[200px] bg-transparent border-none outline-none font-medium text-xl md:text-2xl text-slate-800 placeholder:text-slate-300 resize-none px-4"
                  disabled={isSubmitting}
                />

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Shield size={14} className="text-purple-400" /> Anonymous • Encrypted • Safe
                  </div>
                  
                  {isSubmitting ? (
                    <div className="flex items-center gap-3 text-purple-600 font-bold text-sm italic">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      Thinking for you...
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={!questionText.trim()}
                      className="btn-premium w-full md:w-auto px-12 py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-95"
                    >
                      Ask Question <Send size={18} />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-6 text-red-500 font-bold text-sm animate-fade-in">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100" />
          <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">Entering the Vault...</div>
        </div>
      </div>
    }>
      <AskContent />
    </Suspense>
  );
}
