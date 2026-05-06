'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Bookmark, Loader2, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // We need the client supabase to fetch data

interface Article {
  slug: string;
  title: string;
  intro: string;
  category: string;
  reading_time_mins: number;
}

export default function SavedGuidesPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const savedStr = localStorage.getItem('pg_saved_guides');
        if (!savedStr) {
          setIsLoading(false);
          return;
        }

        const slugs = JSON.parse(savedStr);
        if (!slugs || slugs.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch articles from Supabase
        const { data, error } = await supabase
          .from('articles')
          .select('slug, title, intro, category, reading_time_mins')
          .in('slug', slugs);

        if (data) {
          setSavedArticles(data);
        }
      } catch (e) {
        console.error('Failed to load saved guides', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadSaved();
  }, []);

  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-pg-rose-light border-b border-pg-rose/10 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Bookmark className="mx-auto mb-4 text-pg-rose" size={48} />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-pg-gray-900 mb-4">
            Your Saved Guides
          </h1>
          <p className="text-lg text-pg-gray-700 max-w-xl mx-auto">
            Your personal collection of helpful advice, saved securely on your device.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-pg-rose">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-pg-gray-500 font-medium">Loading your collection...</p>
          </div>
        ) : savedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {savedArticles.map((article) => (
              <Link key={article.slug} href={`/how-to/${article.slug}`}>
                <Card className="h-full hover:border-pg-rose transition-colors flex flex-col p-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-pg-rose uppercase tracking-widest mb-3">
                    {article.category.replace(/-/g, ' ')}
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-pg-gray-900 mb-3 leading-snug group-hover:text-pg-rose">
                    {article.title}
                  </h3>
                  <p className="text-pg-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {article.intro?.substring(0, 120)}...
                  </p>
                  <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mt-auto">
                    ⏱ {article.reading_time_mins || 3} min read
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-pg-gray-200 rounded-2xl">
            <Bookmark className="mx-auto mb-4 text-pg-gray-300" size={48} />
            <h3 className="font-display text-2xl font-bold text-pg-gray-900 mb-2">No saved guides yet</h3>
            <p className="text-pg-gray-500 mb-8 max-w-sm mx-auto">
              When you find an article you want to keep, just click the "Save" button at the top.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-pg-gray-900 hover:bg-pg-gray-800 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              <Home size={18} /> Browse Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
