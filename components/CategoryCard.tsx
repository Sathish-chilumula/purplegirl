'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    image?: string | null;
  };
  staggerDelay?: number;
}

export function CategoryCard({ category, staggerDelay = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group"
      style={{
        display: 'block',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        aspectRatio: '4/5',
        position: 'relative',
        background: '#f0eefb',
        boxShadow: 'var(--shadow-md)',
        textDecoration: 'none',
        opacity: 0,
        animation: `fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}s forwards`,
        cursor: 'pointer',
      }}
    >
      {/* Background Image */}
      <img
        src={category.image || `/images/cat-${category.slug}.png`}
        alt={category.name}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="group-hover:scale-110"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Gradient Overlay — richer at bottom */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,0,30,0.92) 0%, rgba(10,0,30,0.5) 45%, rgba(10,0,30,0.05) 100%)',
          transition: 'opacity 0.5s',
        }}
      />

      {/* Top: icon badge */}
      <div
        style={{
          position: 'absolute', top: '1.25rem', left: '1.25rem',
          width: '44px', height: '44px',
          borderRadius: '0.875rem',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="group-hover:rotate-12 group-hover:scale-110"
      >
        {category.icon || '✨'}
      </div>

      {/* Bottom: text content */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.5rem',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'white',
            marginBottom: '0.4rem',
            lineHeight: 1.2,
            transition: 'color 0.3s',
          }}
        >
          {category.name}
        </h3>

        {/* Description — only visible on hover */}
        <p
          style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxHeight: 0,
            opacity: 0,
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="group-hover:max-h-16 group-hover:opacity-100"
        >
          {category.description || `Real answers about ${category.name} from your elder sister.`}
        </p>

        {/* Enter link */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-accent)',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(196, 166, 255, 0.85)',
            transition: 'gap 0.3s, color 0.3s',
          }}
          className="group-hover:text-white"
        >
          Explore <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Glowing border on hover */}
      <div
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '1.5rem',
          border: '2px solid transparent',
          transition: 'border-color 0.4s',
          pointerEvents: 'none',
        }}
        className="group-hover:border-purple-400/50"
      />
    </Link>
  );
}
