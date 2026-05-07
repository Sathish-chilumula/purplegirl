'use client';

import React, { useState } from 'react';
import { Send, ShieldCheck, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type State = 'idle' | 'loading' | 'success' | 'error';

export const AskBox = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [state, setState] = useState<State>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || state === 'loading') return;

    setState('loading');
    setAnswer('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAnswer(data.answer);
      setState('success');
    } catch {
      setState('error');
    }
  };

  const reset = () => {
    setQuery('');
    setAnswer('');
    setState('idle');
  };

  return (
    <div className="bg-pg-rose-light rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm border border-pg-rose/20">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Lock size={24} className="text-pg-rose" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-pg-gray-900 mb-4">
          Is there a question you've been Googling alone at night?
        </h2>
        <p className="text-pg-gray-700 text-lg max-w-2xl leading-relaxed">
          The one you can't ask your family. Or your husband. Or your friends.&nbsp;
          Ask it here. Completely anonymously. No name. No judgment.
        </p>
      </div>

      {/* Answer State */}
      <AnimatePresence mode="wait">
        {state === 'success' && answer ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pg-rose/20 shadow-xl mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={40} className="text-pg-rose" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-pg-rose mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pg-rose animate-pulse" />
                PurpleGirl Says 💜
              </p>
              <p className="text-pg-gray-700 text-lg leading-[1.8] whitespace-pre-line relative z-10 font-medium">
                {answer}
              </p>
            </div>
            <button
              onClick={reset}
              className="w-full text-sm font-bold text-pg-rose underline underline-offset-4 hover:text-pg-rose-dark transition-colors"
            >
              Ask another question →
            </button>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="max-w-2xl mx-auto flex flex-col gap-4"
          >
            <div className="relative group">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question here... be as honest as you need to be."
                className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-white focus:border-pg-rose outline-none text-pg-gray-900 text-lg shadow-sm transition-all resize-none placeholder:text-pg-gray-300"
                style={{ minHeight: '140px' }}
                disabled={state === 'loading'}
              />
              <div className="absolute bottom-4 left-6 text-[10px] text-pg-gray-300 font-bold uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
                Totally Anonymous 🔒
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!query.trim() || state === 'loading'}
              className="w-full md:w-auto md:self-end bg-pg-rose hover:bg-pg-rose-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-pg-rose/20 active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              {state === 'loading' ? (
                <><Loader2 size={20} className="animate-spin" /> Thinking...</>
              ) : (
                <>Get My Answer <Send size={18} /></>
              )}
            </button>

            {state === 'error' && (
              <p className="text-sm text-red-500 text-center font-medium">
                I need a moment to think. Please try again. 💜
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 text-pg-gray-500 text-xs md:text-sm">
        <div className="flex items-center gap-1"><ShieldCheck size={14} className="text-pg-success" /> No login required.</div>
        <span className="hidden md:inline">•</span>
        <div>Your IP is never stored.</div>
        <span className="hidden md:inline">•</span>
        <div>Your question may help other women.</div>
      </div>
    </div>
  );
};
