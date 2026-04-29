'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Assuming canvas-confetti will be loaded via script tag or installed. For now, we mock it if not available.
const triggerConfetti = () => {
  if (typeof window !== 'undefined' && (window as any).confetti) {
    (window as any).confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E91E8C', '#FCE4F3', '#6B21A8']
    });
  }
};

interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

interface QuizResult {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
}

interface QuizEngineProps {
  quiz: {
    title: string;
    description: string;
    category: string;
    questions_json: QuizQuestion[] | { questions: QuizQuestion[] };
    result_types_json: QuizResult[] | { results: QuizResult[] };
  };
}

export const QuizEngine = ({ quiz }: QuizEngineProps) => {
  const [state, setState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Normalize both possible data shapes
  const questions: QuizQuestion[] = Array.isArray(quiz.questions_json)
    ? quiz.questions_json
    : (quiz.questions_json as any)?.questions || [];

  const resultTypes: QuizResult[] = Array.isArray(quiz.result_types_json)
    ? quiz.result_types_json
    : (quiz.result_types_json as any)?.results || [];

  const totalQuestions = questions.length;

  useEffect(() => {
    // Add canvas-confetti script if not present
    if (typeof window !== 'undefined' && !(window as any).confetti) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleStart = () => {
    setState('playing');
    setCurrentQuestionIndex(0);
    setScores([]);
  };

  const handleAnswerSelect = (score: number) => {
    const newScores = [...scores];
    newScores[currentQuestionIndex] = score;
    setScores(newScores);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const totalScore = scores.reduce((sum, s) => sum + (s || 0), 0);
    const matched = resultTypes.find(r => totalScore >= r.minScore && totalScore <= r.maxScore)
      || resultTypes[resultTypes.length - 1];
    setResult(matched);
    setState('result');
    setTimeout(triggerConfetti, 300);
  };

  if (state === 'intro') {
    return (
      <div className="bg-white rounded-[24px] p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm border border-pg-gray-100 fade-up">
        <span className="inline-block bg-pg-rose-light text-pg-rose text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          {quiz.category.replace(/-/g, ' ')}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-pg-gray-900 mb-6 leading-tight">
          {quiz.title}
        </h1>
        <p className="text-lg text-pg-gray-700 mb-10">
          {quiz.description}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm font-bold text-pg-gray-500 mb-10">
          <span>{totalQuestions} Questions</span>
          <span>•</span>
          <span>~3 min</span>
        </div>
        <Button onClick={handleStart} className="px-10 py-4 text-lg w-full sm:w-auto">
          Start Quiz <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>
    );
  }

  if (state === 'playing') {
    const currentQ = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    const selectedScore = scores[currentQuestionIndex];
    const hasSelected = selectedScore !== undefined;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-pg-gray-500 uppercase tracking-widest mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-pg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pg-rose transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-sm border border-pg-gray-100">
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-pg-gray-900 mb-10 text-center leading-tight">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options?.map((opt, i) => {
              const isSelected = selectedScore === opt.score;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(opt.score)}
                  className={`w-full text-left px-6 py-5 rounded-2xl border-2 font-bold text-lg transition-all ${
                    isSelected 
                      ? 'border-pg-rose bg-pg-rose-light text-pg-rose' 
                      : 'border-pg-gray-100 bg-white hover:bg-pg-gray-100 text-pg-gray-700'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!hasSelected}
              className={`inline-flex items-center gap-2 bg-pg-rose text-white font-bold rounded-xl px-8 py-3 transition-all ${
                !hasSelected ? 'opacity-40 cursor-not-allowed' : 'hover:bg-pg-rose-dark'
              }`}
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'See My Result' : 'Next'} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'result' && result) {
    return (
      <div className="bg-white rounded-[24px] p-8 md:p-12 max-w-3xl mx-auto shadow-sm border border-pg-rose-light text-center">
        <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-6">
          Your Result
        </div>
        
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-pg-rose mb-6 leading-tight">
          {result.title}
        </h2>
        
        <p className="text-lg text-pg-gray-700 leading-[1.8] mb-12">
          {result.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(result.title + ' - purplegirl.in')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] text-white font-bold rounded-xl px-8 py-4 transition-colors hover:bg-[#1ebd5a]"
          >
            <Share2 size={20} className="mr-2" /> Share on WhatsApp
          </a>
          <button onClick={handleStart} className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-pg-gray-300 text-pg-gray-700 font-bold rounded-xl px-8 py-4 hover:bg-pg-gray-100 transition-colors">
            <RefreshCw size={18} className="mr-2" /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
};
