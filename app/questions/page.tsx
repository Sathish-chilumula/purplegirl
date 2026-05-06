import { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Card } from '@/components/ui/Card';
import { HelpCircle, MessagesSquare, ChevronRight, MessageCircle } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: `Public Q&A Feed | ${SITE_NAME}`,
  description: 'Real questions from Indian women on relationships, family, and health, answered anonymously by PurpleGirl.',
  alternates: {
    canonical: '/questions',
  },
};

async function getQuestions() {
  const { data } = await supabaseAdmin
    .from('questions')
    .select(`
      slug, title, description, view_count, created_at,
      categories (name)
    `)
    .eq('is_published', true)
    .not('slug', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);
    
  return data || [];
}

export default async function QuestionsFeedPage() {
  const questions = await getQuestions();

  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-pg-plum border-b border-pg-plum-dark py-16 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <MessagesSquare className="mx-auto mb-4 text-pg-rose" size={48} />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Anonymous Q&A Feed
          </h1>
          <p className="text-lg text-pg-plum-light max-w-xl mx-auto mb-8">
            Browse real problems and situations shared by women just like you, answered securely and anonymously.
          </p>
          <Link 
            href="/ask"
            className="inline-block bg-pg-rose hover:bg-pg-rose-dark text-white font-bold px-8 py-3 rounded-full transition-colors"
          >
            Ask Your Own Question
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((q: any) => (
              <Link key={q.slug} href={`/q/${q.slug}`} className="block group">
                <Card className="p-6 md:p-8 hover:border-pg-rose transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-pg-rose-light text-pg-rose rounded-full p-3 shrink-0 hidden sm:block">
                      <MessageCircle size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-pg-gray-500 uppercase tracking-widest bg-pg-gray-100 px-3 py-1 rounded-full">
                          {(q.categories as any)?.name || 'General Advice'}
                        </span>
                        <span className="text-xs font-medium text-pg-gray-400">
                          {new Date(q.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h2 className="font-display text-xl md:text-2xl font-bold text-pg-gray-900 mb-2 leading-snug group-hover:text-pg-rose transition-colors">
                        {q.title}
                      </h2>
                      
                      {q.description && (
                        <p className="text-pg-gray-600 text-sm md:text-base line-clamp-2 mb-4 leading-relaxed">
                          "{q.description}"
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm font-bold text-pg-rose">
                        Read Answer <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-pg-gray-200 rounded-2xl">
            <HelpCircle className="mx-auto mb-4 text-pg-gray-300" size={48} />
            <h3 className="font-display text-2xl font-bold text-pg-gray-900 mb-2">No public questions yet</h3>
            <p className="text-pg-gray-500 mb-8 max-w-sm mx-auto">
              We're processing the latest anonymous questions. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
