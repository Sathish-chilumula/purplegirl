'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, CheckCircle, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Step {
  id: string;
  question: string;
  options: {
    label: string;
    nextStep?: string;
    result?: {
      title: string;
      advice: string;
      guides: { title: string; slug: string }[];
    };
  }[];
}

const STEPS: Record<string, Step> = {
  start: {
    id: 'start',
    question: "What's the general area of your concern?",
    options: [
      { label: "My Body & Health", nextStep: "health" },
      { label: "Love & Relationships", nextStep: "relationships" },
      { label: "Career & Money", nextStep: "career" },
      { label: "Something else", nextStep: "other" },
    ]
  },
  health: {
    id: 'health',
    question: "Is this about a specific symptom or general wellness?",
    options: [
      { label: "Specific Symptom (PCOS, Periods, etc)", nextStep: "symptoms" },
      { label: "Mental Health / Stress", result: {
        title: "Prioritize Your Peace",
        advice: "Stress and anxiety are common but manageable. It starts with small breaks and speaking up about your load.",
        guides: [
          { title: "How to Manage Burnout at Work", slug: "manage-burnout" },
          { title: "Simple Breathing Exercises for Anxiety", slug: "breathing-exercises" }
        ]
      }},
      { label: "Fitness & Diet", nextStep: "fitness" },
    ]
  },
  relationships: {
    id: 'relationships',
    question: "Are you dealing with a current partner, a crush, or family?",
    options: [
      { label: "My Partner / Husband", nextStep: "partner" },
      { label: "A Crush / New Guy", nextStep: "crush" },
      { label: "My Family / In-laws", nextStep: "family" },
    ]
  },
  partner: {
    id: 'partner',
    question: "What's the main issue?",
    options: [
      { label: "Communication / Fighting", result: {
        title: "Communication is a Skill",
        advice: "Healthy relationships require honest, non-accusatory conversations. Try 'I feel' statements instead of 'You always'.",
        guides: [
          { title: "How to Talk to Your Partner Without Fighting", slug: "couple-communication" },
          { title: "Setting Boundaries in Marriage", slug: "marriage-boundaries" }
        ]
      }},
      { label: "Trust / Infidelity", nextStep: "trust" },
      { label: "Losing the Spark", nextStep: "spark" },
    ]
  },
  // ... more steps could be added here
};

export function DecisionToolClient({ lang }: { lang: string }) {
  const [currentStepId, setCurrentStepId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const currentStep = STEPS[currentStepId];

  const handleOptionClick = (option: any) => {
    if (option.result) {
      setResult(option.result);
    } else if (option.nextStep) {
      setHistory([...history, currentStepId]);
      setCurrentStepId(option.nextStep);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      return;
    }
    if (history.length > 0) {
      const last = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStepId(last);
    }
  };

  const handleReset = () => {
    setCurrentStepId('start');
    setHistory([]);
    setResult(null);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-pg-gray-100"
      >
        <div className="flex items-center gap-3 text-pg-rose font-bold text-sm uppercase tracking-widest mb-6">
          <Sparkles size={18} />
          Our Guidance
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-pg-gray-900 mb-6">
          {result.title}
        </h2>
        <p className="text-lg text-pg-gray-700 leading-relaxed mb-10">
          {result.advice}
        </p>

        <div className="mb-10">
          <h3 className="font-bold text-pg-gray-900 mb-4 flex items-center gap-2">
            <Search size={18} className="text-pg-plum" />
            Recommended Guides for You:
          </h3>
          <div className="grid gap-3">
            {result.guides.map((guide: any, i: number) => (
              <Link key={i} href={`/${lang}/how-to/${guide.slug}`}>
                <div className="flex items-center justify-between p-4 bg-pg-cream rounded-xl hover:bg-pg-rose-light hover:text-pg-rose transition-all group border border-pg-gray-50">
                  <span className="font-bold">{guide.title}</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Start Over
          </Button>
          <Button onClick={handleBack} className="flex-1">
            <ArrowLeft className="mr-2" size={18} /> Back
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-pg-gray-100 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest">
              Step {history.length + 1}
            </span>
            {history.length > 0 && (
              <button onClick={handleBack} className="text-pg-rose text-sm font-bold flex items-center gap-1 hover:underline">
                <ArrowLeft size={14} /> Back
              </button>
            )}
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-pg-gray-900 mb-8 leading-tight">
            {currentStep?.question || "What's on your mind?"}
          </h2>

          <div className="grid gap-4">
            {currentStep?.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(option)}
                className="flex items-center justify-between w-full p-5 text-left bg-pg-cream hover:bg-pg-rose-light border border-pg-gray-100 hover:border-pg-rose/30 rounded-2xl transition-all group"
              >
                <span className="font-bold text-pg-gray-700 group-hover:text-pg-rose transition-colors">
                  {option.label}
                </span>
                <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm group-hover:bg-pg-rose group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 pt-8 border-t border-pg-gray-50 flex items-center justify-between">
        <p className="text-[11px] text-pg-gray-400 max-w-[70%]">
          PurpleGirl gives sisterly advice, not professional medical or legal help. 💜
        </p>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all ${i <= history.length ? 'w-4 bg-pg-rose' : 'w-2 bg-pg-gray-200'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
