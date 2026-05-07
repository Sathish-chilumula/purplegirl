'use client';

import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';

interface ProductRecommendationProps {
  category: string;
  lang: string;
}

const RECOMMENDATIONS: Record<string, any[]> = {
  'finance-career': [
    {
      name: 'Groww',
      description: 'Best app for beginners to start Mutual Fund SIPs with zero commission.',
      url: 'https://groww.in/',
      rating: 4.9,
      tag: 'Top Choice'
    },
    {
      name: 'PolicyBazaar',
      description: 'Compare and buy the best health insurance for women and family.',
      url: 'https://www.policybazaar.com/',
      rating: 4.8,
    }
  ],
  'baby-care': [
    {
      name: 'FirstCry',
      description: 'Largest online store for newborn baby clothes and essentials.',
      url: 'https://www.firstcry.com/',
      rating: 4.7,
      tag: 'Best Discounts'
    },
    {
      name: 'Amazon Family',
      description: 'Get regular deliveries of diapers and wipes at discounted prices.',
      url: 'https://www.amazon.in/family',
      rating: 4.8,
    }
  ],
  'fashion-style': [
    {
      name: 'Myntra',
      description: 'Shop top fashion brands for everyday office and casual wear.',
      url: 'https://www.myntra.com/',
      rating: 4.8,
      tag: 'Trending'
    },
    {
      name: 'Nykaa',
      description: 'Authentic beauty, skincare, and wellness products.',
      url: 'https://www.nykaa.com/',
      rating: 4.9,
    }
  ]
};

export default function ProductRecommendation({ category, lang }: ProductRecommendationProps) {
  const products = RECOMMENDATIONS[category];

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-pg-rose/5 border border-pg-rose/20 rounded-2xl p-6 my-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold text-pg-gray-900">
          {lang === 'hi' ? 'हमारे सुझाव (Recommended)' : lang === 'te' ? 'మా సిఫార్సులు (Recommended)' : 'Highly Recommended'}
        </h3>
        <span className="text-[10px] uppercase tracking-widest font-bold text-pg-gray-400">Sponsored</span>
      </div>
      
      <div className="space-y-4">
        {products.map((p, idx) => (
          <Link href={p.url} key={idx} target="_blank" rel="nofollow noopener" 
            className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl p-4 border border-pg-gray-100 hover:border-pg-rose/40 hover:shadow-md transition-all gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-pg-gray-900 group-hover:text-pg-rose transition-colors">{p.name}</h4>
                {p.tag && (
                  <span className="bg-pg-plum/10 text-pg-plum text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {p.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-pg-gray-600 line-clamp-2">{p.description}</p>
            </div>
            
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
              <div className="flex items-center text-yellow-400 text-sm font-bold">
                <Star size={14} className="fill-yellow-400 mr-1" />
                {p.rating}
              </div>
              <span className="flex items-center text-xs font-bold text-pg-rose bg-pg-rose/10 px-3 py-1.5 rounded-lg group-hover:bg-pg-rose group-hover:text-white transition-colors">
                View Offer <ExternalLink size={12} className="ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-[11px] text-pg-gray-400 mt-4 text-center">
        If you purchase through these links, PurpleGirl may earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}
