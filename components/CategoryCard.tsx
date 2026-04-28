'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    image?: string;
  };
  staggerDelay?: number;
}

export function CategoryCard({ category, staggerDelay = 0 }: CategoryCardProps) {
  return (
    <Link 
      href={`/category/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl animate-slide-up"
      style={{ animationDelay: `${staggerDelay}s` }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={category.image || `/images/cat-${category.slug}.png`} 
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl shadow-lg border border-white/30 transform group-hover:rotate-12 transition-transform duration-500">
          {category.icon || '✨'}
        </div>
        
        <h3 className="font-syne text-2xl font-bold text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors">
          {category.name}
        </h3>
        
        <p className="text-sm text-slate-200 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          {category.description || `Real questions and judgment-free answers about ${category.name}.`}
        </p>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
          Enter The Vault <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>

      {/* Glowing Border on Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-3xl transition-all duration-500 pointer-events-none" />
    </Link>
  );
}
