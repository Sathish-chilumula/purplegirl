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
      <Link href={`/volumes/${folio.id}`} className="block h-full outline-none">
        <article className="surface-card card-lift rounded-sm overflow-hidden h-full flex flex-col group relative">
          
          {/* Inner animated border on hover */}
          <div className="absolute inset-[3px] rounded-[2px] border border-transparent group-hover:border-pg-crimson-600/15 pointer-events-none z-10 transition-colors duration-300" />
          
          <div className="h-[185px] relative overflow-hidden bg-pg-parch-200">
            {/* Using img for external wikipedia images */}
            <img 
              src={folio.imageSrc} 
              alt={folio.title}
              className="w-full h-full object-cover opacity-85 sepia-[0.2] saturate-[0.8] brightness-[1.05] group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pg-parch-50 to-transparent" />
            
            <div className="absolute top-2 right-2 bg-pg-parch-50 border border-pg-crimson-600 text-pg-crimson-600 font-cinzel text-[8px] tracking-[1.5px] px-2 py-0.5 rounded-[1px] shadow-sm">
              {folio.volumeLabel}
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col bg-pg-parch-50 z-10">
            <h3 className="font-im-fell text-lg text-pg-ink-900 mb-2 leading-snug">
              {folio.title}
            </h3>
            <p className="text-sm italic text-pg-ink-600 leading-relaxed">
              {folio.description}
            </p>
          </div>
          
        </article>
      </Link>
    </div>
  );
}
