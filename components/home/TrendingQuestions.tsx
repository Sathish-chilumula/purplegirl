'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';

interface TrendingQuestion {
  question: string;
  category: string;
  slug?: string;
}

interface TrendingQuestionsProps {
  questions?: TrendingQuestion[];
}

// Curated evergreen questions — real search intents from Indian women
const DEFAULT_QUESTIONS: TrendingQuestion[] = [
  { question: 'My husband controls all my money. What can I do?', category: 'legal-rights' },
  { question: 'How do I know if I have PCOS?', category: 'womens-health' },
  { question: 'Can I take maternity leave if I\'m on contract?', category: 'legal-rights' },
  { question: 'My in-laws want me to quit my job after marriage. Is it legal?', category: 'career-workplace' },
  { question: 'How do I ask my gynaecologist about something embarrassing?', category: 'womens-health' },
  { question: 'What happens to my jewellery if I get divorced?', category: 'legal-rights' },
];

export function TrendingQuestions({ questions }: TrendingQuestionsProps) {
  const displayQuestions = (questions && questions.length > 0) ? questions : DEFAULT_QUESTIONS;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-14 px-6 bg-white border-y border-pg-gray-100">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pg-rose-light rounded-lg flex items-center justify-center">
              <MessageCircle size={16} className="text-pg-rose" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-pg-rose mb-0.5">
                Real Questions
              </p>
              <h2 className="font-display font-bold text-[20px] text-pg-gray-900 leading-tight">
                Women are asking right now...
              </h2>
            </div>
          </div>
          <Link
            href="/ask"
            className="hidden sm:inline-flex items-center gap-1 text-pg-rose font-bold text-sm hover:underline shrink-0"
          >
            Ask yours → 
          </Link>
        </div>

        {/* Questions list */}
        <div className="grid md:grid-cols-2 gap-3">
          {displayQuestions.map((q, i) => (
            <Link
              key={i}
              href={`/ask?q=${encodeURIComponent(q.question)}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all group ${
                hovered === i
                  ? 'border-pg-rose bg-pg-rose-light/40'
                  : 'border-pg-gray-100 bg-pg-cream hover:border-pg-rose'
              }`}
            >
              {/* Quote mark */}
              <span className="text-pg-rose font-display font-black text-2xl leading-none shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                "
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[15px] text-pg-gray-900 leading-snug group-hover:text-pg-rose transition-colors line-clamp-2">
                  {q.question}
                </p>
                <p className="text-[11px] text-pg-gray-400 font-medium uppercase tracking-widest mt-1.5 capitalize">
                  {q.category.replace(/-/g, ' ')}
                </p>
              </div>
              <ChevronRight
                size={16}
                className={`text-pg-gray-300 shrink-0 mt-0.5 transition-all ${
                  hovered === i ? 'text-pg-rose translate-x-1' : 'group-hover:translate-x-1 group-hover:text-pg-rose'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* CTA for mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 bg-pg-rose text-white font-bold px-6 py-3 rounded-xl text-sm"
          >
            Ask your question anonymously <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
