'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Briefcase, Pill, Shirt, Brain, Salad, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';
import PersonalizedIntake from '@/components/question/PersonalizedIntake';
import { IntakeData, buildPersonalizedContext } from '@/lib/personalizedPrompt';

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
  const [intakeData, setIntakeData] = useState<IntakeData>({});

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
            status: 'approved', // Immediately approved so the page works on redirect
          },
        ]);

      if (error) throw error;

      // Trigger AI generation (non-blocking)
      try {
        const customContext = buildPersonalizedContext(intakeData);
        fetch('/api/generate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            questionId: questionId,
            customContext: customContext // Pass personalized context to backend
          }),
        });
      } catch (err) {
        console.error('Error triggering AI generation:', err);
      }

      router.push(`/q/${slug}`);
    } catch (err) {
      console.error('Error submitting question:', err);
      alert('Failed to submit question. Please check your Supabase configuration.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden aurora-bg">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 relative z-10">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8 transition-colors font-medium group animate-slide-up bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-purple-100 shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/60 animate-slide-up stagger-1">
          <div className="text-center mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg animate-glow-pulse border-4 border-white">
              💜
            </div>
            <p className="font-playfair italic text-gray-500 mb-2">Your sister is listening...</p>
            <h1 className="text-editorial text-4xl text-[#1F1235] tracking-tight mb-4">
              Ask <span className="gradient-text-animate">anything</span> you want
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="animate-slide-up stagger-2">
              <div className="relative group">
                <textarea
                  className="w-full bg-[#FAF5FF] rounded-3xl p-6 min-h-[140px] text-lg focus:outline-none focus:bg-white placeholder:text-purple-300 resize-none transition-all shadow-inner border border-transparent focus:border-transparent [border-image:linear-gradient(to_right,rgba(124,58,237,0.5),rgba(236,72,153,0.5))_1] focus:[box-shadow:inset_0_0_20px_rgba(124,58,237,0.1)]"
                  placeholder="Type what's on your heart... I'm listening. 💜"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={150}
                />
                <div className="absolute bottom-4 right-6 text-xs text-purple-400 font-bold">{title.length}/150</div>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-3">
              <label className="block text-editorial text-xl text-[#1F1235] mb-3">More details (optional)</label>
              <div className="relative">
                <textarea
                  className="w-full bg-[#FAF5FF] rounded-3xl p-6 min-h-[120px] focus:outline-none focus:bg-white placeholder:text-purple-300 resize-none transition-all shadow-inner border border-transparent focus:border-transparent focus:[border-image:linear-gradient(to_right,rgba(124,58,237,0.5),rgba(236,72,153,0.5))_1]"
                  placeholder="Give some context so we can give you a better answer..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
                <div className="absolute bottom-4 right-6 text-xs text-purple-400 font-bold">{description.length}/500</div>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-4">
              <label className="block text-editorial text-xl text-[#1F1235] mb-4">Choose a category</label>
              {isLoadingCats ? (
                <div className="flex items-center gap-2 text-purple-600 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-bold">Gathering topics...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const isSelected = categorySlug === cat.slug;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategorySlug(cat.slug)}
                        className={`relative flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-300 transform active:scale-95 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-purple-600 to-pink-500 border-transparent text-white font-bold shadow-lg shadow-purple-200' 
                            : 'glass border-white/50 text-gray-500 hover:border-purple-200 hover:bg-white/90 shadow-sm'
                        }`}
                      >
                        <span className={`${isSelected ? 'text-white' : 'text-purple-500'}`}>
                          {CATEGORY_ICONS[cat.slug] || <Heart className="w-5 h-5" />}
                        </span>
                        <span className="text-sm text-left">{cat.name}</span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-white text-purple-600 rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="animate-slide-up stagger-5">
              <PersonalizedIntake onIntakeChange={setIntakeData} />
            </div>
            
            <div className="pt-6 animate-slide-up stagger-5">
              <button
                type="submit"
                disabled={isSubmitting || !title || !categorySlug}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-300 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>✨</span>}
                {isSubmitting ? 'Sending securely...' : 'Submit Anonymously'}
              </button>
              
              <div className="text-center mt-3 text-sm font-medium text-purple-500">
                Estimated response time: ~30 seconds
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1.5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-green-100 text-green-600 rounded-full p-0.5"><Check className="w-3 h-3" /></div> Identity protected
                </div>
                <div className="flex items-center gap-1.5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-green-100 text-green-600 rounded-full p-0.5"><Check className="w-3 h-3" /></div> Not stored publicly
                </div>
                <div className="flex items-center gap-1.5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="bg-green-100 text-green-600 rounded-full p-0.5"><Check className="w-3 h-3" /></div> Answered with care
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
