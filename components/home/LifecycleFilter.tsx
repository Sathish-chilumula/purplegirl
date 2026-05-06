'use client';

import React, { useState } from 'react';

interface Category {
  id: string;
  slug: string;
  name: string;
  icon_emoji: string;
  article_count: number;
  display_order?: number;
}

interface LifecycleFilterProps {
  categories: Category[];
}

// Life stage → category slugs mapping
const LIFECYCLE_MAP: Record<string, string[]> = {
  Single: [
    'skin-beauty', 'hair-care', 'mental-health-emotions', 'career-workplace',
    'finance-money', 'self-growth-confidence', 'fashion-style',
  ],
  'In a Relationship': [
    'relationships-marriage', 'mental-health-emotions', 'sex-intimacy',
    'self-growth-confidence', 'legal-rights',
  ],
  'Newly Married': [
    'relationships-marriage', 'legal-rights', 'womens-health',
    'family-parenting', 'finance-money', 'home-household',
  ],
  Pregnant: [
    'pregnancy-fertility', 'womens-health', 'baby-care-motherhood',
    'food-indian-cooking', 'mental-health-emotions',
  ],
  Mother: [
    'baby-care-motherhood', 'family-parenting', 'womens-health',
    'mental-health-emotions', 'food-indian-cooking', 'home-household',
  ],
  'Working Woman': [
    'career-workplace', 'finance-money', 'mental-health-emotions',
    'legal-rights', 'self-growth-confidence', 'weight-fitness',
  ],
};

const STAGES = ['All', ...Object.keys(LIFECYCLE_MAP)];

export function LifecycleFilter({ categories }: LifecycleFilterProps) {
  const [activeStage, setActiveStage] = useState<string>('All');

  const filteredCategories =
    activeStage === 'All'
      ? categories
      : categories.filter(cat =>
          LIFECYCLE_MAP[activeStage]?.includes(cat.slug)
        );

  return (
    <>
      {/* Lifecycle pill nav */}
      <div
        className="flex overflow-x-auto gap-2 pb-2 mb-8 hide-scrollbar"
        role="tablist"
        aria-label="Filter categories by life stage"
      >
        {STAGES.map(stage => (
          <button
            key={stage}
            role="tab"
            aria-selected={activeStage === stage}
            onClick={() => setActiveStage(stage)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              activeStage === stage
                ? 'bg-pg-rose text-white border-pg-rose shadow-sm'
                : 'bg-white text-pg-gray-700 border-pg-gray-200 hover:border-pg-rose hover:text-pg-rose'
            }`}
          >
            {stage === 'All' ? '✨ All' : stage}
          </button>
        ))}
      </div>

      {/* Filtered category grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(cat => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center text-center bg-white border border-pg-gray-100 rounded-2xl p-6 hover:border-pg-rose hover:bg-pg-rose-light/30 transition-all h-full shadow-sm"
            >
              <div className="text-[40px] mb-4">{cat.icon_emoji || '✨'}</div>
              <h3 className="font-sans text-[16px] font-bold text-pg-gray-900 mb-1 leading-tight">
                {cat.name}
              </h3>
              {cat.article_count > 0 ? (
                <span className="text-sm text-pg-gray-500">{cat.article_count} guides</span>
              ) : (
                <span className="text-xs text-pg-gray-400 italic">Coming soon</span>
              )}
            </a>
          ))
        ) : (
          <div className="col-span-2 md:col-span-4 text-center py-10 text-pg-gray-400 border border-dashed rounded-xl">
            No categories found for this stage yet — check back soon!
          </div>
        )}
      </div>
    </>
  );
}
