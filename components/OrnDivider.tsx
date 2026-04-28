'use client';

import React from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface OrnDividerProps {
  variant?: 'crimson' | 'gold' | 'both' | 'simple';
  className?: string;
}

export function OrnDivider({ variant = 'simple', className = '' }: OrnDividerProps) {
  const { elementRef, hasIntersected } = useIntersectionObserver({ threshold: 0.5, triggerOnce: true });

  const renderContent = () => {
    switch (variant) {
      case 'crimson':
        return <div className="px-4 flex gap-2 items-center text-pg-crimson-600 text-lg tracking-widest opacity-80">✦ ✦ ✦</div>;
      case 'gold':
        return <div className="px-4 flex gap-2 items-center text-pg-gold-500 text-lg tracking-widest opacity-80">✦ ✦ ✦</div>;
      case 'both':
        return (
          <div className="px-4 flex gap-2 items-center text-lg tracking-widest opacity-80">
            <span className="text-pg-gold-500">✦</span>
            <span className="text-pg-crimson-600">✦</span>
            <span className="text-pg-gold-500">✦</span>
          </div>
        );
      case 'simple':
      default:
        return <div className="px-4 flex gap-2 items-center text-pg-ink-400 text-sm tracking-widest opacity-50">♦ ♦ ♦</div>;
    }
  };

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`flex items-center justify-center my-12 opacity-80 ${className} ${hasIntersected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
    >
      <div className={`flex-1 h-px bg-gradient-to-r from-transparent to-pg-parch-300 ${hasIntersected ? 'rubrication-line' : ''}`} style={{ transformOrigin: 'right center' }} />
      {renderContent()}
      <div className={`flex-1 h-px bg-gradient-to-l from-transparent to-pg-parch-300 ${hasIntersected ? 'rubrication-line' : ''}`} />
    </div>
  );
}
