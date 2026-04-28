import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { FOLIOS, getFolioForVolume } from '@/lib/folios';
import { PageBackground } from '@/components/PageBackground';
import { IlluminatedDropCap } from '@/components/IlluminatedDropCap';

export const runtime = 'edge';

interface VolumePageProps {
  params: Promise<{ id: string }>;
}

async function getVolumeQuestions(topics: string[]) {
  // Build an OR query to match any of the topics in the title or description
  const orQuery = topics.map(t => `title.ilike.%${t}%,description.ilike.%${t}%`).join(',');
  
  const { data } = await supabaseAdmin
    .from('questions')
    .select('slug, title, description, metoo_count, created_at')
    .eq('status', 'approved')
    .or(orQuery)
    .order('created_at', { ascending: false })
    .limit(50);

  return data || [];
}

export async function generateMetadata({ params }: VolumePageProps): Promise<Metadata> {
  const { id } = await params;
  const folio = FOLIOS.find(f => f.id === id);

  if (!folio) return { title: 'Volume Not Found' };

  return {
    title: `${folio.title} — ${folio.volumeLabel} | ${SITE_NAME}`,
    description: folio.description,
    openGraph: {
      title: `${folio.title} | ${SITE_NAME}`,
      description: folio.description,
      images: [folio.imageSrc],
      type: 'website',
      url: `${SITE_URL}/volumes/${id}`
    },
  };
}

export default async function VolumePage({ params }: VolumePageProps) {
  const { id } = await params;
  const folio = FOLIOS.find(f => f.id === id);

  if (!folio) notFound();

  const questions = await getVolumeQuestions(folio.topics);

  // Schema Markup for SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${folio.title} Questions`,
    'description': folio.description,
    'url': `${SITE_URL}/volumes/${folio.id}`,
    'itemListElement': questions.map((q, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Question',
        'name': q.title,
        'url': `${SITE_URL}/q/${q.slug}`,
      }
    }))
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <Link href="/" className="inline-flex items-center text-pg-ink-500 hover:text-pg-violet-700 mb-12 transition-colors font-cinzel text-sm tracking-widest uppercase group animate-slide-up">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to Library
        </Link>
        
        {/* Header section combining parchment and volume imagery */}
        <div className="surface-card p-8 md:p-16 mb-16 relative overflow-hidden animate-slide-up stagger-1 border-t-4 border-pg-violet-800">
          <div className="absolute inset-0 bg-gradient-to-r from-pg-parch-50 via-pg-parch-50/90 to-transparent z-10" />
          <img 
            src={folio.imageSrc} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover object-right opacity-30 mix-blend-multiply sepia-[0.3]"
          />
          
          <div className="relative z-20 max-w-2xl">
            <div className="text-pg-violet-700 font-cinzel tracking-[0.3em] text-sm mb-4">
              {folio.volumeLabel}
            </div>
            <h1 className="font-im-fell text-4xl md:text-6xl text-pg-ink-900 mb-6 drop-shadow-sm">
              {folio.title}
            </h1>
            <p className="text-pg-ink-600 text-xl leading-relaxed italic border-l-2 border-pg-gold-500 pl-4">
              "{folio.description}"
            </p>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="mb-12 flex items-center gap-4 animate-slide-up stagger-2">
          <BookOpen className="text-pg-violet-700" size={24} />
          <h2 className="font-cinzel text-2xl text-pg-ink-900 tracking-wider">Deciphered Whispers</h2>
        </div>

        {questions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {questions.map((q, i) => (
              <Link 
                key={q.slug}
                href={`/q/${q.slug}`}
                className="surface-card p-8 flex flex-col group hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(90,48,160,0.1)] hover:border-pg-violet-400 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${(i % 10) * 0.1}s` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pg-violet-800 to-pg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                <h3 className="font-im-fell text-2xl text-pg-ink-900 mb-4 group-hover:text-pg-violet-800 transition-colors leading-snug">
                  {q.title}
                </h3>
                
                <p className="text-pg-ink-600 italic line-clamp-3 mb-8 flex-grow">
                  {q.description}
                </p>

                <div className="flex items-center justify-between text-sm pt-6 border-t border-pg-parch-300">
                  <span className="flex items-center text-pg-ink-500 font-cinzel tracking-widest text-[10px]">
                    <Heart className="w-4 h-4 mr-2 text-pg-crimson-600" />
                    {q.metoo_count || 0} RESONANCES
                  </span>
                  <span className="text-pg-violet-700 font-cinzel font-bold tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-3 transition-all uppercase">
                    Read Cipher <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 surface-card border-dashed border-pg-parch-400 animate-slide-up stagger-3">
            <div className="text-4xl text-pg-parch-400 mb-6 font-unifraktur">V</div>
            <h3 className="font-cinzel text-xl text-pg-ink-800 tracking-widest mb-4">This Volume Remains Sealed</h3>
            <p className="text-pg-ink-500 italic mb-8 max-w-md mx-auto">
              No whispers have been inscribed into this codex yet. Be the first to break the silence.
            </p>
            <Link href="/ask" className="inline-block bg-pg-violet-800 text-pg-gold-300 font-cinzel text-xs tracking-[0.2em] uppercase px-8 py-4 shadow-lg hover:bg-pg-violet-700 hover:scale-105 transition-all">
              Write the first entry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
