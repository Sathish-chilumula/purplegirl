'use client';

import React, { useState } from 'react';
import { Send, ShieldCheck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AskBox = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // In Phase 5 we will hook this up to the API, for now it routes to a search/ask page
      router.push(`/ask?q=${encodeURIComponent(query)}`);
    }
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
          The one you can't ask your family. Or your husband. Or your friends. 
          Ask it here. Completely anonymously. No name. No judgment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here... you can be completely honest."
          className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-white focus:border-pg-rose outline-none text-pg-gray-900 text-lg shadow-sm transition-all resize-none h-32 pr-16"
        />
        <button
          type="submit"
          className="absolute right-3 bottom-3 bg-pg-rose hover:bg-pg-rose-dark text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md active:scale-95"
        >
          Get My Answer
        </button>
      </form>
      
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
