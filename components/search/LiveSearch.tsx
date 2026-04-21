'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  categories: {
    name: string;
  };
}

interface LiveSearchProps {
  initialValue?: string;
  placeholder?: string;
  variant?: 'hero' | 'header';
}

export default function LiveSearch({ initialValue = '', placeholder = "Type your question...", variant = 'hero' }: LiveSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);

      const { data, error } = await supabase
        .from('questions')
        .select(`
          id, title, slug,
          categories(name)
        `)
        .ilike('title', `%${query}%`)
        .eq('status', 'approved')
        .limit(5);

      if (!error && data) {
        setResults(data as any);
      }
      setLoading(false);

      // Log the search query for SEO/Analytics optimization (Admin can review these)
      // We try to insert into search_logs if it exists, otherwise ignore
      try {
        await supabase.from('search_logs').insert({
          query: query.trim(),
          results_count: data?.length || 0
        });
      } catch (e) {
        // Silent fail if table doesn't exist yet
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/q/${slug}`);
  };

  if (variant === 'header') {
    return (
      <div ref={searchRef} className="relative w-full max-w-md hidden md:block group">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-purple-50/50 border border-purple-100/50 rounded-2xl py-2.5 pl-5 pr-12 text-sm focus:ring-4 focus:ring-purple-200/50 outline-none transition-all placeholder:text-purple-300 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white border border-purple-50 flex items-center justify-center text-purple-400 group-focus-within:text-purple-600 transition-colors">
            <Search className="w-4 h-4" />
          </div>
        </form>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-3 w-[120%] -left-[10%] glass rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-purple-100/50 overflow-hidden z-[100] p-3"
            >
              {loading ? (
                <div className="p-6 flex flex-col items-center justify-center gap-3 text-gray-500 text-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="font-bold italic">Consulting the vault...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2 border-b border-purple-50 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Matched Conversations
                  </div>
                  {results.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleResultClick(res.slug)}
                      className="w-full text-left p-3.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all group flex flex-col gap-1.5 shadow-sm hover:shadow-lg hover:shadow-purple-200"
                    >
                      <span className="text-sm font-bold text-[#1F1235] group-hover:text-white transition-colors line-clamp-1 leading-snug">
                        {res.title}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full font-black uppercase tracking-tighter w-fit group-hover:bg-white/20 group-hover:text-white transition-colors">
                        {res.categories.name}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSearch()}
                    className="w-full p-4 mt-2 text-center text-xs font-black text-purple-600 hover:bg-purple-50 rounded-xl transition-all border-t border-purple-50 flex items-center justify-center gap-2 group/all"
                  >
                    <span>View all results for &ldquo;{query}&rdquo;</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50/50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-purple-50">
                    <Search className="w-6 h-6 text-purple-300" />
                  </div>
                  <p className="text-[#1F1235] font-black text-sm mb-1 uppercase tracking-tight">No direct matches</p>
                  <p className="text-xs text-gray-400 mb-6 font-medium">Try a different keyword or press enter for a deep search.</p>
                  <button 
                    onClick={() => handleSearch()}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-lg transition-all"
                  >
                    Deep Vault Search
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={searchRef} className="max-w-2xl mx-auto relative group mt-10">
      <form 
        onSubmit={handleSearch} 
        className="relative glass rounded-[2.5rem] p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex items-center gap-2 md:gap-4 group-hover:-translate-y-1.5 transition-all duration-500 border border-purple-100/50 ring-1 ring-purple-100/20"
      >
        <div className="pl-4 md:pl-6 text-purple-400">
          <Search className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          className="flex-1 bg-transparent py-4 md:text-xl font-medium text-[#1F1235] placeholder:text-purple-200 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <button 
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-sm md:text-base tracking-[0.05em] whitespace-nowrap hover:shadow-2xl hover:shadow-purple-300/50 transition-all active:scale-95 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Start Chat </span>}
          {!loading && <span className="opacity-70">&rarr;</span>}
        </button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="absolute top-full mt-5 w-full glass rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] border border-purple-100/50 overflow-hidden z-[100] p-5 md:p-6"
          >
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg animate-float">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
                <p className="text-gray-500 text-lg font-bold italic animate-pulse">Checking the archives...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <div className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-purple-400 mb-4 border-b border-purple-50 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                   Matched Conversations
                </div>
                {results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleResultClick(res.slug)}
                    className="w-full text-left p-5 rounded-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 group transition-all duration-300 border border-transparent shadow-sm hover:shadow-xl hover:shadow-purple-200"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-bold text-[#1F1235] group-hover:text-white transition-colors line-clamp-1 leading-snug">
                        {res.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-black uppercase tracking-widest group-hover:bg-white/20 group-hover:text-white transition-colors">
                          {res.categories.name}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleSearch()}
                  className="w-full p-6 mt-4 text-center text-sm font-black text-purple-600 hover:bg-purple-50 rounded-2xl transition-all border-t border-purple-50 flex items-center justify-center gap-3 group/all border-dashed"
                >
                  <span className="uppercase tracking-[0.1em]">Browse all matching results</span>
                  <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
                </button>
              </div>
            ) : (
              <div className="p-12 md:p-20 text-center bg-gray-50/50 rounded-[2rem]">
                <div className="w-20 h-20 glass rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-8 animate-float">
                  <Search className="w-10 h-10 text-purple-300" />
                </div>
                <h3 className="text-2xl font-playfair font-black text-[#1F1235] mb-3">No exact matches yet</h3>
                <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto font-medium">You might be the first to ask this! Press enter to search everywhere in the vault.</p>
                <button 
                  onClick={() => handleSearch()}
                  className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-black uppercase tracking-[0.25em] rounded-full hover:shadow-2xl hover:shadow-purple-300 transition-all hover:scale-105 active:scale-95"
                >
                  Deep Vault Search
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
  );
}
