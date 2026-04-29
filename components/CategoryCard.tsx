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
    icon_emoji?: string | null;
    tier?: number;
  };
  staggerDelay?: number;
}

export function CategoryCard({ category, staggerDelay = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group card-base flex flex-col justify-between h-full fade-up"
      style={{ animationDelay: `${staggerDelay}s` }}
    >
      <div>
        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
          {category.icon_emoji || '✨'}
        </div>
        <h3 className="text-xl font-display font-bold text-pg-gray-900 mb-2 group-hover:text-pg-rose transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-pg-gray-500 line-clamp-2">
          {category.description || `Honest advice on ${category.name}.`}
        </p>
      </div>
      
      <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-pg-gray-700 group-hover:text-pg-rose transition-colors">
        Explore <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
