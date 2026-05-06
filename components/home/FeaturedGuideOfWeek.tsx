'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';

interface FeaturedGuide {
  slug: string;
  title: string;
  intro?: string;
  category: string;
  reading_time_mins?: number;
  thumbnail_emoji?: string;
}

interface FeaturedGuideOfWeekProps {
  guide?: FeaturedGuide | null;
}

// Fallback if no DB guide is flagged as featured
const FALLBACK: FeaturedGuide = {
  slug: 'what-to-do-if-husband-controls-money',
  title: 'My Husband Controls All the Money in the House — What Are My Rights?',
  intro: 'Financial abuse is one of the most common and least-talked-about forms of domestic control in India. You have legal rights — and options.',
  category: 'legal-rights',
  reading_time_mins: 7,
  thumbnail_emoji: '⚖️',
};

export function FeaturedGuideOfWeek({ guide }: FeaturedGuideOfWeekProps) {
  const featured = guide ?? FALLBACK;

  return (
    <section className="py-6 px-6 bg-pg-cream border-b border-pg-gray-100">
      <div className="max-w-content mx-auto">
        <Link href={`/how-to/${featured.slug}`} className="group block">
          <div className="bg-white border border-pg-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-pg-rose transition-all shadow-sm hover:shadow-md">
            {/* Left: emoji + badge */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-pg-rose-light rounded-2xl flex items-center justify-center text-3xl">
                {featured.thumbnail_emoji || '✨'}
              </div>
              <div className="inline-flex items-center gap-1 bg-pg-rose text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap">
                <Star size={9} fill="white" /> Guide of the Week
              </div>
            </div>

            {/* Right: content */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-pg-gray-400 mb-2 capitalize">
                {featured.category.replace(/-/g, ' ')}
              </p>
              <h2 className="font-display font-extrabold text-[20px] md:text-[26px] text-pg-gray-900 leading-tight mb-3 group-hover:text-pg-rose transition-colors line-clamp-2">
                {featured.title}
              </h2>
              {featured.intro && (
                <p className="text-pg-gray-600 text-[15px] leading-relaxed mb-4 line-clamp-2">
                  {featured.intro}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-pg-gray-400 font-medium">
                  ⏱ {featured.reading_time_mins || 5} min read
                </span>
                <span className="inline-flex items-center gap-1 text-pg-rose font-bold group-hover:gap-2 transition-all">
                  Read Guide <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
