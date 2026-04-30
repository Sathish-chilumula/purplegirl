'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';

// Assuming canvas-confetti will be loaded via script tag or installed.
const triggerConfetti = () => {
  if (typeof window !== 'undefined' && (window as any).confetti) {
    (window as any).confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#E91E8C', '#FCE4F3', '#6B21A8', '#FFD700', '#FF6B6B']
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
  emoji?: string;
}

interface QuizEngineProps {
  quiz: {
    title: string;
    description: string;
    category: string;
    thumbnail_emoji?: string;
    questions_json: QuizQuestion[] | { questions: QuizQuestion[] };
    result_types_json: QuizResult[] | { results: QuizResult[] };
  };
}

export const QuizEngine = ({ quiz }: QuizEngineProps) => {
  const [state, setState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newScores = [...scores];
    newScores[currentQuestionIndex] = score;
    setScores(newScores);

    // Auto-advance logic
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnimating(false);
      } else {
        calculateResult(newScores);
      }
    }, 600); // 600ms delay to show the selected state animation
  };

  const calculateResult = (finalScores: number[]) => {
    const totalScore = finalScores.reduce((sum, s) => sum + (s || 0), 0);
    const matched = resultTypes.find(r => totalScore >= r.minScore && totalScore <= r.maxScore)
      || resultTypes[resultTypes.length - 1];
    setResult(matched);
    setState('result');
    setTimeout(triggerConfetti, 400);
  };

  // Intro State
  if (state === 'intro') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm border border-pg-gray-100"
      >
        <div className="text-6xl mb-6">{quiz.thumbnail_emoji || '✨'}</div>
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
        <Button onClick={handleStart} className="px-10 py-4 text-lg w-full sm:w-auto hover:scale-105 transition-transform">
          Start Quiz <ChevronRight size={20} className="ml-2" />
        </Button>
      </motion.div>
    );
  }

  // Playing State
  if (state === 'playing') {
    const currentQ = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    const selectedScore = scores[currentQuestionIndex];

    // Guard: if options are missing, show error
    if (!currentQ?.options || currentQ.options.length === 0) {
      return (
        <div className="max-w-2xl mx-auto text-center py-20">
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Oops! This question has no options. Please try another quiz.</p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto overflow-hidden pb-10">
        {/* Progress Bar */}
        <div className="mb-6 px-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
            <motion.div 
              style={{ height: '100%', backgroundColor: '#E91E8C' }}
              initial={{ width: `${((currentQuestionIndex - 1) / totalQuestions) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question Card with Slide Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #F5F5F5' }}
          >
            <h2 style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: '700', color: '#111827', marginBottom: '24px', textAlign: 'center', lineHeight: '1.4' }}>
              {currentQ.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedScore === opt.score;
                const hasSelection = selectedScore !== undefined;

                let bgColor = '#FFFFFF';
                let borderColor = '#E5E7EB';
                let textColor = '#374151';
                let opacity = '1';

                if (isSelected) {
                  bgColor = '#FCE4F3';
                  borderColor = '#E91E8C';
                  textColor = '#E91E8C';
                } else if (hasSelection) {
                  opacity = '0.45';
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswerSelect(opt.score)}
                    disabled={hasSelection}
                    whileHover={!hasSelection ? { scale: 1.02 } : {}}
                    whileTap={!hasSelection ? { scale: 0.98 } : {}}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px 20px',
                      borderRadius: '16px',
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      fontWeight: '600',
                      fontSize: '15px',
                      opacity,
                      cursor: hasSelection ? 'default' : 'pointer',
                      transition: 'all 0.25s ease',
                      lineHeight: '1.5',
                    }}
                  >
                    {opt.text}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Result State
  if (state === 'result' && result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="bg-white rounded-[24px] p-8 md:p-12 max-w-3xl mx-auto shadow-xl shadow-pg-rose/10 border-2 border-pg-rose/20 text-center relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-10 -left-10 text-8xl opacity-10 blur-sm">{result.emoji || '✨'}</div>
        <div className="absolute -bottom-10 -right-10 text-8xl opacity-10 blur-sm">{result.emoji || '🌟'}</div>

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-6xl mb-6"
          >
            {result.emoji || '✨'}
          </motion.div>
          
          <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-4">
            Your Result
          </div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-pg-rose mb-6 leading-tight"
          >
            {result.title}
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-pg-gray-700 leading-[1.8] mb-12 max-w-xl mx-auto"
          >
            {result.description}
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('I got "' + result.title + '" on PurpleGirl! Take the quiz here: https://purplegirl.in')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] text-white font-bold rounded-xl px-8 py-4 transition-transform hover:scale-105 shadow-md shadow-[#25D366]/20"
            >
              <Share2 size={20} className="mr-2" /> Share on WhatsApp
            </a>
            <button 
              onClick={handleStart} 
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-pg-gray-200 text-pg-gray-600 font-bold rounded-xl px-8 py-4 hover:bg-pg-gray-50 transition-colors"
            >
              <RefreshCw size={18} className="mr-2" /> Retake Quiz
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
};
