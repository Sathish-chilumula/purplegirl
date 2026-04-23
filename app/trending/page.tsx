import { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SITE_NAME } from '@/lib/constants';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: `Trending Questions | ${SITE_NAME}`,
  description: 'See what the sisterhood is asking right now.',
};

export default async function TrendingPage() {
  const { data: trendingQuestions, error } = await supabaseAdmin
    .from('questions')
    .select('id, title, slug, metoo_count, categories(name)')
    .eq('status', 'approved')
    .order('metoo_count', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching trending questions:', error);
  }

  const questions = (trendingQuestions as any[]) || [];

  return (
    <div className="min-h-screen bg-[#FAF5FF] py-16 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="orb orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-20" />
      <div className="orb orb-pink w-[400px] h-[400px] bottom-[200px] left-[-80px] opacity-15" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl text-[#1F1235] tracking-tight mb-4">
            Trending <span className="gradient-text-animate">Questions</span>
          </h1>
          <p className="text-gray-500 text-lg">Top 50 questions resonating with the sisterhood right now.</p>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <Link 
              key={q.id} 
              href={`/q/${q.slug}`}
              className="card-premium glass p-6 flex flex-col md:flex-row md:items-center gap-4 group animate-slide-up hover:translate-y-[-4px] transition-all border border-purple-50"
              style={{ animationDelay: `${Math.min(i * 0.05, 1)}s` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-50 text-purple-600 group-hover:from-purple-600 group-hover:to-pink-500 group-hover:text-white transition-all flex items-center justify-center font-bold text-lg">
                #{String(i + 1).padStart(2, '0')}
              </div>
              
              <div className="flex-grow">
                <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
                  {q.categories?.name}
                </div>
                <h2 className="font-bold text-[#1F1235] text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                  {q.title}
                </h2>
              </div>
              
              <div className="flex-shrink-0 flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full text-pink-600 font-bold text-sm border border-pink-100">
                <span>❤️</span> {q.metoo_count?.toLocaleString() || 0}
              </div>
            </Link>
          ))}
          
          {questions.length === 0 && !error && (
            <div className="text-center py-20 text-gray-500">
              No trending questions found right now. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
