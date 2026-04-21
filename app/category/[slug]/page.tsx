'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-10 h-10 text-purple-primary animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Loading sisterly topics...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Category not found</h1>
        <p className="text-text-secondary mb-8">This topic doesn&apos;t exist yet or has been moved.</p>
        <Link href="/" className="bg-purple-primary text-white px-8 py-3 rounded-full font-bold">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <Link href="/" className="inline-flex items-center text-text-secondary hover:text-purple-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
      </Link>
      
      {/* Category Header */}
      <div className={`bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/5 border border-purple-100 rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left shadow-sm`}>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-50 text-3xl">
          {category.icon || '💜'}
        </div>
        <div>
          <h1 className="font-playfair font-bold text-3xl md:text-5xl text-text-primary tracking-tight mb-3">
            {category.name}
          </h1>
          <p className="text-text-secondary text-lg max-w-xl">
            {category.description || `Explore the top questions about ${category.name}.`}
          </p>
        </div>
      </div>
      
      {/* Question List */}
      {questions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q, i) => (
            <Link 
              key={i}
              href={`/q/${q.slug}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col h-full group"
            >
              <h2 className="font-bold text-lg text-text-primary mb-4 flex-1 group-hover:text-purple-primary transition-colors">
                {q.title}
              </h2>
              <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-purple-50">
                <span className="flex items-center text-text-secondary font-medium">
                  <Heart className="w-4 h-4 mr-1.5 text-pink-accent fill-pink-accent/10" />
                  {q.metoo_count || 0} girls asked this
                </span>
                <span className="text-purple-primary font-bold">Read &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-purple-50 shadow-sm">
          <p className="text-text-secondary italic">No questions answered in this category yet. Be the first to ask! 💜</p>
          <Link href="/ask" className="inline-block mt-6 bg-purple-primary text-white px-8 py-3 rounded-full font-bold">
            Ask a Question
          </Link>
        </div>
      )}
      
      {/* Load More Mock */}
      {questions.length > 20 && (
        <div className="mt-12 text-center">
          <button className="bg-white border-2 border-purple-100 text-purple-primary px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors">
            Load More Questions
          </button>
        </div>
      )}
    </div>
  );
}

