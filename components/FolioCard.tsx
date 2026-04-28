'use client';

import React from 'react';
import Link from 'next/link';
import { FolioData } from '@/lib/types';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface FolioCardProps {
  folio: FolioData;
  className?: string;
  staggerDelay?: number;
}

export function FolioCard({ folio, className = '', staggerDelay = 0 }: FolioCardProps) {
  const { elementRef, hasIntersected } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${hasIntersected ? 'parchment-unfurl' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${staggerDelay}s` }}
    >
      <Link 
        href={`/volumes/${folio.id}`}
        className="folio-card block bg-pg-parch-50 border border-pg-parch-200 p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(90,48,160,0.15)] hover:border-pg-violet-400 transition-all duration-500 h-full flex flex-col"
      >
        {/* Ambient violet glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pg-violet-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative aspect-[3/4] w-full mb-6 overflow-hidden border border-pg-parch-200 rounded-sm shrink-0">
          <img 
            src={folio.imageSrc} 
            alt={folio.title}
            className="object-cover w-full h-full mix-blend-multiply opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 sepia-[0.2]"
          />
          <div className="absolute top-2 right-2 bg-pg-parch-100 px-2 py-1 border border-pg-parch-300">
            <span className="font-cinzel text-[8px] tracking-[0.2em] text-pg-ink-500 group-hover:text-pg-violet-600 transition-colors uppercase">
              {folio.volumeLabel}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative z-10">
          <h3 className="font-im-fell text-lg text-pg-ink-900 mb-2 leading-snug group-hover:text-pg-violet-700 transition-colors">
            {folio.title}
          </h3>
          <p className="text-sm italic text-pg-ink-600 leading-relaxed">
            {folio.description}
          </p>
        </div>
      </Link>
    </div>
  );
}
