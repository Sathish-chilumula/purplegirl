'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

interface QuestionSummary {
  slug: string;
  title: string;
  metoo_count: number;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryData() {
      if (!slug) return;
      setLoading(true);
      try {
        // 1. Fetch category details
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (catError || !catData) {
          console.error('Category error:', catError);
          return;
        }
        setCategory(catData);

        // 2. Fetch questions in this category
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .select('slug, title, metoo_count')
          .eq('category_id', catData.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (qError) {
          console.error('Questions error:', qError);
          return;
        }
        setQuestions(qData || []);
      } catch (err) {
        console.error('General error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shadow-lg animate-float">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
        <p className="text-gray-500 font-bold animate-pulse">Gathering sisterly topics...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🏜️</div>
        <h1 className="font-playfair font-bold text-4xl mb-4 text-[#1F1235]">Topic not found</h1>
        <p className="text-gray-500 mb-10 text-lg">This topic doesn&apos;t exist yet or has been moved to a new home.</p>
        <Link href="/" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-transform inline-block">
          Explore other topics
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Page-level orb backgrounds */}
      <div className="orb orb-purple w-[600px] h-[600px] top-[-100px] right-[-100px] opacity-20" />
      <div className="orb orb-pink w-[500px] h-[500px] bottom-[-80px] left-[-60px] opacity-15" />

      <div className="max-w-4xl mx-auto px-4 py-12 pb-40 relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-8 transition-colors font-medium group animate-slide-up">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        
        {/* Category Header */}
        <div className="glass rounded-[2rem] p-8 md:p-12 mb-16 shadow-xl border border-purple-100/60 relative overflow-hidden animate-slide-up stagger-1">
          <div className="orb orb-violet w-64 h-64 top-0 right-0 opacity-20" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative z-10">
            <div className="bg-white w-20 h-20 rounded-[1.5rem] shadow-lg border border-purple-50 flex items-center justify-center text-4xl animate-float">
              {category.icon || '💜'}
            </div>
            <div>
              <h1 className="font-playfair font-bold text-4xl md:text-6xl text-[#1F1235] tracking-tight mb-4">
                {category.name}
              </h1>
              <p className="text-gray-500 text-xl leading-relaxed max-w-xl">
                {category.description || `Explore the honest questions and sisterly guidance about ${category.name}.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Question List */}
        {questions.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-8 animate-slide-up stagger-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="font-playfair font-bold text-2xl text-[#1F1235]">Trending in {category.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((q, i) => (
                <Link 
                  key={i}
                  href={`/q/${q.slug}`}
                  className="card-premium p-8 flex flex-col h-full group animate-slide-up"
                  style={{ animationDelay: `${(i + 2) * 100}ms` }}
                >
                  <h2 className="font-bold text-xl text-[#1F1235] mb-6 flex-1 group-hover:text-purple-600 transition-colors leading-snug">
                    {q.title}
                  </h2>
                  <div className="flex items-center justify-between text-sm mt-auto pt-6 border-t border-purple-50/60">
                    <span className="flex items-center text-gray-400 font-bold">
                      <Heart className="w-4 h-4 mr-2 text-pink-400 fill-pink-100" />
                      {q.metoo_count || 0} girls asked this
                    </span>
                    <span className="text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read answer <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-[2.5rem] border border-purple-100 shadow-xl animate-slide-up stagger-2">
            <div className="text-5xl mb-6">🍂</div>
            <h3 className="font-playfair font-bold text-2xl text-[#1F1235] mb-2">No questions here yet</h3>
            <p className="text-gray-500 italic mb-10">Be the first to ask your elder sisters about {category.name}!</p>
            <Link href="/ask" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-transform">
              Ask a Question
            </Link>
          </div>
        )}
        
        {/* Load More Mock */}
        {questions.length > 20 && (
          <div className="mt-16 text-center animate-slide-up stagger-4">
            <button className="bg-white border-2 border-purple-100 text-purple-600 px-10 py-4 rounded-full font-bold hover:bg-purple-50 transition-all shadow-md active:scale-95">
              Load more conversations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

