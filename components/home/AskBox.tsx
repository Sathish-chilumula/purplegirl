'use client';

import React, { useState } from 'react';
import { Send, ShieldCheck, Lock, Loader2 } from 'lucide-react';

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
      {state === 'success' && answer ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-pg-rose/20 shadow-sm mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-pg-rose mb-3">Your Didi Says 💜</p>
            <p className="text-pg-gray-700 leading-relaxed whitespace-pre-line">{answer}</p>
          </div>
          <button
            onClick={reset}
            className="w-full text-sm font-bold text-pg-rose underline underline-offset-4 hover:text-pg-rose-dark"
          >
            Ask another question →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question here... you can be completely honest."
            className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-white focus:border-pg-rose outline-none text-pg-gray-900 text-lg shadow-sm transition-all resize-none h-32 pr-16"
            disabled={state === 'loading'}
          />
          <button
            type="submit"
            disabled={!query.trim() || state === 'loading'}
            className="absolute right-3 bottom-3 bg-pg-rose hover:bg-pg-rose-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md active:scale-95 flex items-center gap-2"
          >
            {state === 'loading' ? (
              <><Loader2 size={16} className="animate-spin" /> Getting answer...</>
            ) : (
              <>Get My Answer <Send size={14} /></>
            )}
          </button>

          {state === 'error' && (
            <p className="mt-3 text-sm text-red-500 text-center">
              Something went wrong. Please try again in a moment. 💜
            </p>
          )}
        </form>
      )}

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
