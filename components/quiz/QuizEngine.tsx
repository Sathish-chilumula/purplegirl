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

interface QuizEngineProps {
  quiz: {
    title: string;
    description: string;
    category: string;
    questions_json: { questions: any[] };
    result_types_json: { results: any[], scoring: string };
  };
}

export const QuizEngine = ({ quiz }: QuizEngineProps) => {
  const [state, setState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);
  
  const questions = quiz.questions_json?.questions || [];
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
    setAnswers({});
  };

  const handleAnswerSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    // Basic "most frequent" scoring logic
    const counts: Record<string, number> = {};
    Object.values(answers).forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });

    let topType = '';
    let maxCount = 0;
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topType = type;
      }
    });

    const results = quiz.result_types_json?.results || [];
    const matchedResult = results.find(r => r.type === topType) || results[0];
    
    setResult(matchedResult);
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
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;
    const hasSelected = !!answers[currentQuestionIndex];

    return (
      <div className="max-w-2xl mx-auto fade-in">
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
            {currentQ.text}
          </h2>

          <div className="space-y-4">
            {currentQ.options?.map((opt: any, i: number) => {
              const isSelected = answers[currentQuestionIndex] === opt.value;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(opt.value)}
                  className={`w-full text-left px-6 py-5 rounded-2xl border-2 font-bold text-lg transition-all ${
                    isSelected 
                      ? 'border-pg-rose bg-pg-rose-light text-pg-rose' 
                      : 'border-pg-gray-100 bg-white hover:bg-pg-gray-100 text-pg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end">
            <Button 
              onClick={handleNext} 
              disabled={!hasSelected}
              className={`px-8 transition-opacity ${!hasSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Next'} <ChevronRight size={20} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'result' && result) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`${result.share_text || 'I took this quiz!'} ${shareUrl}`);

    return (
      <div className="bg-white rounded-[24px] p-8 md:p-12 max-w-3xl mx-auto shadow-sm border border-pg-rose-light text-center fade-up">
        <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-6">
          Your Result
        </div>
        
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-pg-rose mb-6 leading-tight">
          {result.title}
        </h2>
        
        <p className="text-lg text-pg-gray-700 leading-[1.8] mb-12">
          {result.description}
        </p>

        {result.advice && (
          <div className="bg-pg-rose-light border-l-4 border-pg-rose p-6 rounded-r-2xl mb-12 text-left">
            <div className="flex items-center gap-2 text-pg-rose font-bold uppercase text-xs tracking-widest mb-3">
              <Sparkles size={16} /> Insight
            </div>
            <p className="text-pg-gray-900 leading-relaxed font-medium">
              {result.advice}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] text-white font-bold rounded-xl px-8 py-4 transition-colors hover:bg-[#1ebd5a]"
          >
            <Share2 size={20} className="mr-2" /> Share on WhatsApp
          </a>
          <Button variant="ghost" onClick={handleStart} className="w-full sm:w-auto py-4">
            <RefreshCw size={18} className="mr-2" /> Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
