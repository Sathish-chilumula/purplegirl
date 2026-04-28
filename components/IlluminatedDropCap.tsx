'use client';

import React from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface IlluminatedDropCapProps {
  letter: string;
  className?: string;
  variant?: 'crimson' | 'gold';
}

export function IlluminatedDropCap({ letter, className = '', variant = 'crimson' }: IlluminatedDropCapProps) {
  const { elementRef, hasIntersected } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const colorClass = variant === 'crimson' ? 'text-pg-crimson-600' : 'text-pg-gold-500';

  return (
    <span
      ref={elementRef as React.RefObject<HTMLSpanElement>}
      aria-hidden="true"
      className={`font-unifraktur text-[120px] leading-[0.8] opacity-5 pointer-events-none select-none absolute transition-opacity duration-1000 ${colorClass} ${hasIntersected ? 'opacity-10' : 'opacity-0'} ${className}`}
    >
      {letter}
    </span>
  );
}
