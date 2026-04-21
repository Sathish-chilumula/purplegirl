'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Briefcase, Pill, Shirt, Brain, Salad, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'beauty-skincare': <Sparkles className="w-5 h-5" />,
  'relationships': <Heart className="w-5 h-5" />,
  'career-money': <Briefcase className="w-5 h-5" />,
  'health-basics': <Pill className="w-5 h-5" />,
  'fashion': <Shirt className="w-5 h-5" />,
  'mental-wellness': <Brain className="w-5 h-5" />,
  'food-nutrition': <Salad className="w-5 h-5" />,
};

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AskPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCats(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categorySlug) return;
    
    setIsSubmitting(true);
    try {
      const selectedCat = categories.find(c => c.slug === categorySlug);
      if (!selectedCat) throw new Error('Category not found');

      const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

      const { data, error } = await supabase
        .from('questions')
        .insert([
          {
            title,
            description,
            slug,
            category_id: selectedCat.id,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Trigger AI generation (non-blocking if possible, but for this demo we can wait or just fire and forget)
      try {
        fetch('/api/generate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: data.id }),
        });
      } catch (err) {
        console.error('Error triggering AI generation:', err);
      }

      alert('Question submitted successfully! Our sisters are writing an answer for you. It will be ready in 1-2 minutes 💜');
      router.push(`/q/${slug}`);
    } catch (err) {
      console.error('Error submitting question:', err);
      alert('Failed to submit question. Please check your Supabase configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:py-12">
      <Link href="/" className="inline-flex items-center text-text-secondary hover:text-purple-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
      </Link>
      
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-purple-100">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">💜</span>
          <h1 className="font-playfair font-bold text-3xl text-text-primary tracking-tight">Ask anything you want</h1>
          <p className="text-text-secondary mt-2">100% anonymous. No judgments. Get a helpful answer.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-bold text-text-primary mb-2 text-lg">What&apos;s your question?</label>
            <textarea
              className="w-full bg-[#FAF5FF] border border-purple-200 rounded-2xl p-4 min-h-[120px] text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300 resize-none"
              placeholder="E.g. How do I ask for a salary hike as a fresher..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={150}
            />
            <div className="text-right text-xs text-text-secondary mt-1">{title.length}/150</div>
          </div>
          
          <div>
            <label className="block font-bold text-text-primary mb-2">More details (optional)</label>
            <textarea
              className="w-full bg-[#FAF5FF] border border-purple-200 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300 resize-none"
              placeholder="Give some context so we can give you a better answer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <div className="text-right text-xs text-text-secondary mt-1">{description.length}/500</div>
          </div>
          
          <div>
            <label className="block font-bold text-text-primary mb-3">Choose a category</label>
            {isLoadingCats ? (
              <div className="flex items-center gap-2 text-purple-primary animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading categories...</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategorySlug(cat.slug)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      categorySlug === cat.slug 
                        ? 'bg-purple-100 border-purple-500 text-purple-primary font-medium shadow-sm' 
                        : 'bg-white border-gray-200 text-text-secondary hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <span className={`${categorySlug === cat.slug ? 'text-purple-primary' : 'text-gray-400'}`}>
                      {CATEGORY_ICONS[cat.slug] || <Heart className="w-5 h-5" />}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-purple-50">
            <button
              type="submit"
              disabled={isSubmitting || !title || !categorySlug}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? 'Submitting securely...' : 'Submit Question Anonymously'}
            </button>
            <p className="text-center text-xs text-text-secondary mt-4 flex items-center justify-center gap-1">
              <span className="opacity-70">🔒</span> We don&apos;t track who asks what. Your identity is safe.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

