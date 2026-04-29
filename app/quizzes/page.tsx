import { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Card } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { AdSenseUnit } from '@/components/ads/AdSenseUnit';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Personality & Advice Quizzes for Indian Women | PurpleGirl',
  description: 'Take fun, insightful, and completely anonymous quizzes about relationships, health, and personality tailored for Indian women.',
};

async function getQuizzes() {
  const { data } = await supabaseAdmin
    .from('quizzes')
    .select('slug, title, description, category, thumbnail_emoji, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  return data || [];
}

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="bg-pg-bg min-h-screen">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER SECTION
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white border-b border-pg-gray-100 py-16 px-6">
        <div className="max-w-content mx-auto text-center">
          <span className="inline-block bg-pg-rose-light text-pg-rose text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Self-Discovery
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-pg-gray-900 mb-6">
            PurpleGirl Quizzes
          </h1>
          <p className="text-lg text-pg-gray-500 max-w-2xl mx-auto">
            Fun, relatable, and completely private personality quizzes designed to help you understand yourself better.
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━
          2. QUIZZES GRID
          ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="max-w-content mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link key={quiz.slug} href={`/quiz/${quiz.slug}`}>
              <Card className="h-full hover:border-pg-rose hover:-translate-y-1 transition-all duration-300 flex flex-col p-8 group border-2">
                <div className="text-5xl mb-6 bg-pg-rose-light/50 w-20 h-20 flex items-center justify-center rounded-3xl group-hover:bg-pg-rose-light transition-colors transform group-hover:scale-110 duration-300">
                  {quiz.thumbnail_emoji || '✨'}
                </div>
                <div className="mb-4">
                  <Badge>{quiz.category.replace(/-/g, ' ')}</Badge>
                </div>
                <h3 className="font-display text-[22px] font-bold text-pg-gray-900 mb-3 leading-snug group-hover:text-pg-rose transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-pg-gray-500 text-sm line-clamp-3 mb-8 flex-grow">
                  {quiz.description}
                </p>
                <div className="flex items-center text-pg-rose font-bold text-sm mt-auto">
                  Take Quiz <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
          
          {quizzes.length === 0 && (
            <div className="col-span-3 py-20 text-center border-2 border-dashed border-pg-gray-200 rounded-3xl">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-pg-gray-900 mb-2">New Quizzes Coming Soon</h3>
              <p className="text-pg-gray-500">Our AI engine is currently generating fresh personality quizzes.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-content mx-auto px-6 pb-16">
        <AdSenseUnit slot="quizzes-bottom" />
      </div>
    </div>
  );
}
