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

      const questionId = crypto.randomUUID();
      const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

      const { error } = await supabase
        .from('questions')
        .insert([
          {
            id: questionId,
            title,
            description,
            slug,
            category_id: selectedCat.id,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      // Trigger AI generation (non-blocking)
      try {
        fetch('/api/generate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: questionId }),
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
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Page-level orb backgrounds */}
      <div className="orb orb-purple w-[600px] h-[600px] top-[-100px] left-[-100px] opacity-20" />
      <div className="orb orb-pink w-[500px] h-[500px] bottom-[-80px] right-[-60px] opacity-15" />

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-8 transition-colors font-medium group animate-slide-up">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        
        <div className="glass rounded-[2rem] p-8 md:p-12 shadow-xl border border-purple-100/60 animate-slide-up stagger-1">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-4xl mx-auto mb-6 shadow-md animate-float">💜</div>
            <h1 className="font-playfair font-bold text-4xl text-[#1F1235] tracking-tight mb-4">
              Ask <span className="gradient-text-animate">anything</span> you want
            </h1>
            <p className="text-gray-500 text-lg">100% anonymous. No judgments. Get a helpful answer from your AI elder sister.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="animate-slide-up stagger-2">
              <label className="block font-playfair font-bold text-[#1F1235] mb-3 text-xl">What&apos;s on your mind?</label>
              <div className="relative">
                <textarea
                  className="w-full bg-[#FAF5FF]/50 border border-purple-100 rounded-3xl p-6 min-h-[140px] text-lg focus:outline-none focus:ring-4 focus:ring-purple-200/50 placeholder:text-purple-300 resize-none transition-all"
                  placeholder="E.g. How do I deal with a toxic manager?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={150}
                />
                <div className="absolute bottom-4 right-6 text-xs text-purple-400 font-bold">{title.length}/150</div>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-3">
              <label className="block font-playfair font-bold text-[#1F1235] mb-3 text-lg">More details (optional)</label>
              <div className="relative">
                <textarea
                  className="w-full bg-[#FAF5FF]/50 border border-purple-100 rounded-3xl p-6 min-h-[140px] focus:outline-none focus:ring-4 focus:ring-purple-200/50 placeholder:text-purple-300 resize-none transition-all"
                  placeholder="Give some context so we can give you a better answer..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
                <div className="absolute bottom-4 right-6 text-xs text-purple-400 font-bold">{description.length}/500</div>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-4">
              <label className="block font-playfair font-bold text-[#1F1235] mb-4 text-lg">Choose a category</label>
              {isLoadingCats ? (
                <div className="flex items-center gap-2 text-purple-600 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-bold">Gathering topics...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategorySlug(cat.slug)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-300 transform active:scale-95 ${
                        categorySlug === cat.slug 
                          ? 'bg-gradient-to-br from-purple-600 to-pink-500 border-transparent text-white font-bold shadow-lg shadow-purple-200' 
                          : 'bg-white border-purple-50 text-gray-500 hover:border-purple-200 hover:bg-purple-50/50'
                      }`}
                    >
                      <span className={`${categorySlug === cat.slug ? 'text-white' : 'text-purple-400'}`}>
                        {CATEGORY_ICONS[cat.slug] || <Heart className="w-5 h-5" />}
                      </span>
                      <span className="text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-purple-50/60 animate-slide-up stagger-5">
              <button
                type="submit"
                disabled={isSubmitting || !title || !categorySlug}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>✨</span>}
                {isSubmitting ? 'Sending securely...' : 'Submit Anonymously'}
              </button>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                <span className="text-green-500 text-lg">🔒</span> 
                Your identity is 100% protected. We never track who you are.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
  );
}

