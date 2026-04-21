'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MessageSquare } from 'lucide-react';
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
      <div ref={searchRef} className="relative w-full max-w-md hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-purple-primary transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </form>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2"
            >
              {loading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-primary" />
                  Searching The Vault...
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleResultClick(res.slug)}
                      className="w-full text-left p-3 rounded-xl hover:bg-purple-50 transition-colors group flex flex-col gap-1"
                    >
                      <span className="text-sm font-medium text-text-primary group-hover:text-purple-primary line-clamp-1">
                        {res.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {res.categories.name}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSearch()}
                    className="w-full p-2 mt-2 text-center text-xs font-bold text-purple-primary hover:bg-purple-100 rounded-lg transition-colors border-t border-gray-50 pt-3"
                  >
                    See all results for &quot;{query}&quot;
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">No results found...</p>
                  <button 
                    onClick={() => handleSearch()}
                    className="text-xs font-bold text-purple-primary hover:underline"
                  >
                    Try advanced search
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
    <div ref={searchRef} className="max-w-2xl mx-auto relative group mt-8">
      <form 
        onSubmit={handleSearch} 
        className="relative bg-white rounded-2xl p-2 md:p-3 shadow-lg flex items-center gap-2 group-hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/5"
      >
        <input 
          type="text" 
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3 px-4 md:text-lg text-text-primary placeholder:text-purple-300 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <button 
          type="submit"
          className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold whitespace-nowrap hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Answer \u2192'}
        </button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-3"
          >
            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-primary" />
                <p className="text-sm font-medium italic">Consulting the sisterhood...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-bottom border-gray-50 flex items-center gap-2 mb-2">
                   <MessageSquare className="w-3 h-3" />
                   Matched Questions
                </div>
                {results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleResultClick(res.slug)}
                    className="w-full text-left p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-white transition-all group border border-transparent hover:border-purple-100"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-text-primary group-hover:text-purple-primary transition-colors line-clamp-1">
                        {res.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">
                          {res.categories.name}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleSearch()}
                  className="w-full p-4 mt-2 text-center text-sm font-extrabold text-purple-primary hover:bg-purple-50 rounded-xl transition-all border-t border-gray-50 flex items-center justify-center gap-2"
                >
                  See all results for &quot;{query}&quot; &rarr;
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50/50 rounded-xl">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-text-primary font-bold mb-1">No exact matches yet</p>
                <p className="text-sm text-gray-500 mb-4">You might be the first to ask this! Press enter to search everywhere.</p>
                <button 
                  onClick={() => handleSearch()}
                  className="px-6 py-2 bg-purple-primary text-white text-xs font-bold rounded-full hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Global Search
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
