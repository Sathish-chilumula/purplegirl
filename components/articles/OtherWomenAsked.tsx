'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ChevronRight } from 'lucide-react';

interface Question {
  question: string;
  category: string;
  slug?: string;
}

interface OtherWomenAskedProps {
  questions?: Question[];
  articleCategory: string;
  articleTitle: string;
}

// Category-specific curated questions — real search intents per category
const QUESTIONS_BY_CATEGORY: Record<string, Question[]> = {
  'womens-health': [
    { question: 'My husband says PCOS is just an excuse. What do I do?', category: 'womens-health' },
    { question: 'Can I get pregnant with PCOS without treatment?', category: 'womens-health' },
    { question: 'Does PCOS go away after marriage?', category: 'womens-health' },
    { question: 'My periods are irregular for 6 months. Is it PCOS?', category: 'womens-health' },
  ],
  'relationships-marriage': [
    { question: 'How do I know if my marriage is emotionally abusive?', category: 'relationships-marriage' },
    { question: 'My mother-in-law reads all my messages. Is this normal?', category: 'relationships-marriage' },
    { question: 'My husband never apologises. What does that mean?', category: 'relationships-marriage' },
    { question: 'Is it okay to leave a husband who doesn\'t hit but emotionally hurts?', category: 'relationships-marriage' },
  ],
  'legal-rights': [
    { question: 'Can I file Section 498A from my parents\' house?', category: 'legal-rights' },
    { question: 'What happens to my jewellery if I get divorced?', category: 'legal-rights' },
    { question: 'Can my in-laws claim my salary?', category: 'legal-rights' },
    { question: 'Does my husband have to give maintenance if I earn too?', category: 'legal-rights' },
  ],
  'mental-health-emotions': [
    { question: 'I cry every day but I don\'t know why. Is that depression?', category: 'mental-health-emotions' },
    { question: 'My family says therapy is for crazy people. How do I convince them?', category: 'mental-health-emotions' },
    { question: 'I feel nothing after my divorce. Is that normal?', category: 'mental-health-emotions' },
    { question: 'How do I stop thinking about someone who hurt me?', category: 'mental-health-emotions' },
  ],
  'finance-money': [
    { question: 'Can I open a bank account without my husband\'s permission?', category: 'finance-money' },
    { question: 'What is the minimum amount to start SIP in India?', category: 'finance-money' },
    { question: 'Should I invest in PPF or NPS as a woman in India?', category: 'finance-money' },
    { question: 'How do I start saving money when my husband controls finances?', category: 'finance-money' },
  ],
  'pregnancy-fertility': [
    { question: 'How long does IVF take from start to finish in India?', category: 'pregnancy-fertility' },
    { question: 'I\'ve been trying for a year. When should I see a doctor?', category: 'pregnancy-fertility' },
    { question: 'Is morning sickness all day normal in the first trimester?', category: 'pregnancy-fertility' },
    { question: 'Can stress cause a miscarriage in early pregnancy?', category: 'pregnancy-fertility' },
  ],
  'career-workplace': [
    { question: 'My boss is promoting men over me even though I perform better. What can I do?', category: 'career-workplace' },
    { question: 'Can my employer fire me for being pregnant in India?', category: 'career-workplace' },
    { question: 'How do I negotiate salary without seeming aggressive?', category: 'career-workplace' },
    { question: 'Is it worth quitting a toxic job with no next job lined up?', category: 'career-workplace' },
  ],
};

const DEFAULT_QUESTIONS: Question[] = [
  { question: 'How do I stop feeling guilty for putting myself first?', category: 'mental-health-emotions' },
  { question: 'My family doesn\'t support my career. What should I do?', category: 'career-workplace' },
  { question: 'Is it normal to feel alone even in a marriage?', category: 'relationships-marriage' },
  { question: 'How do I rebuild confidence after a toxic relationship?', category: 'mental-health-emotions' },
];

export function OtherWomenAsked({ questions, articleCategory, articleTitle }: OtherWomenAskedProps) {
  const displayQuestions = questions?.length
    ? questions
    : (QUESTIONS_BY_CATEGORY[articleCategory] || DEFAULT_QUESTIONS);

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mt-16 bg-pg-cream rounded-2xl p-6 md:p-8 border border-pg-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-pg-rose-light rounded-lg flex items-center justify-center shrink-0">
          <MessageCircle size={15} className="text-pg-rose" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[18px] md:text-[20px] text-pg-gray-900 leading-tight">
            Other women also asked about this topic
          </h2>
          <p className="text-[11px] text-pg-gray-400 mt-0.5">
            Real anonymous questions from Indian women
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2 mb-6">
        {displayQuestions.slice(0, 4).map((q, i) => (
          <Link
            key={i}
            href={`/ask?q=${encodeURIComponent(q.question)}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group ${
              hovered === i
                ? 'border-pg-rose bg-white'
                : 'border-transparent bg-white hover:border-pg-rose'
            }`}
          >
            <span className="text-pg-rose font-display font-black text-lg leading-none shrink-0 mt-0.5 opacity-30 group-hover:opacity-100 transition-opacity">
              →
            </span>
            <p className="font-sans text-[14px] text-pg-gray-800 leading-snug group-hover:text-pg-rose transition-colors flex-1">
              "{q.question}"
            </p>
            <ChevronRight
              size={14}
              className="text-pg-gray-300 shrink-0 mt-0.5 group-hover:text-pg-rose group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/ask"
        className="inline-flex items-center gap-2 bg-pg-rose text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-pg-rose-dark transition-colors"
      >
        <MessageCircle size={14} />
        Ask your question anonymously
      </Link>
    </div>
  );
}
