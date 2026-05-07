'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

// ── Normalized internal types ──────────────────────────────────────────────────
interface NormalizedOption {
  text: string;
  score: number;
}

interface NormalizedQuestion {
  id: number;
  question: string;
  options: NormalizedOption[];
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
    slug?: string;
    title: string;
    description: string;
    category: string;
    thumbnail_emoji?: string;
    questions_json: any;
    result_types_json: any;
  };
}

// Handles both schemas:
//   Schema A: [ { question, options: [{ text, score }] } ]
//   Schema B: { questions: [ { text, options: [{ label, value }] } ] }
function normalizeQuestions(raw: any): NormalizedQuestion[] {
  const list: any[] = Array.isArray(raw) ? raw : (raw?.questions || raw?.items || []);
  return list.map((q: any, idx: number) => ({
    id: q.id ?? idx + 1,
    question: q.question || q.text || q.title || `Question ${idx + 1}`,
    options: (q.options || q.choices || []).map((o: any, oi: number) => ({
      text: o.text || o.label || o.option || `Option ${oi + 1}`,
      score: typeof o.score === 'number' ? o.score : oi + 1,
    })),
  }));
}

function normalizeResults(raw: any): QuizResult[] {
  return Array.isArray(raw) ? raw : (raw?.results || raw?.result_types || []);
}

// ── Component ─────────────────────────────────────────────────────────────────
export const QuizEngine = ({ quiz }: QuizEngineProps) => {
  const params = useParams();
  const lang = params?.lang || 'en';
  
  const [state, setState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Track selected OPTION INDEX (not score) to avoid falsy-zero comparison bugs
  const [selectedIndices, setSelectedIndices] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const questions = normalizeQuestions(quiz.questions_json);
  const resultTypes = normalizeResults(quiz.result_types_json);
  const totalQuestions = questions.length;

  useEffect(() => {
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
    setSelectedIndices({});
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnimating || selectedIndices[currentQuestionIndex] !== undefined) return;

    setIsAnimating(true);
    const newIndices = { ...selectedIndices, [currentQuestionIndex]: optionIndex };
    setSelectedIndices(newIndices);

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnimating(false);
      } else {
        const totalScore = questions.reduce((sum, q, qi) => {
          const selIdx = newIndices[qi];
          return selIdx !== undefined ? sum + (q.options[selIdx]?.score || 0) : sum;
        }, 0);

        const matched =
          resultTypes.find(r => totalScore >= r.minScore && totalScore <= r.maxScore) ||
          resultTypes[resultTypes.length - 1];

        setResult(matched || null);
        setState('result');
        setTimeout(triggerConfetti, 400);
        setIsAnimating(false);
      }
    }, 600);
  };

  // ── INTRO ────────────────────────────────────────────────────────────────────
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
        <h1 className="font-display text-3xl md:text-5xl font-bold text-pg-gray-900 mb-6 leading-tight">
          {quiz.title}
        </h1>
        <p className="text-lg text-pg-gray-700 mb-10">{quiz.description}</p>
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

  // ── PLAYING ──────────────────────────────────────────────────────────────────
  if (state === 'playing') {
    const currentQ = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    const selectedIndex = selectedIndices[currentQuestionIndex];
    const hasSelection = selectedIndex !== undefined;

    if (!currentQ || !currentQ.options || currentQ.options.length === 0) {
      return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            This question could not load. Please try another quiz. 💜
          </p>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '40px' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '20px', padding: '0 4px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', fontWeight: '700', color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
          }}>
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', backgroundColor: '#E91E8C', borderRadius: '99px' }}
              initial={{ width: `${Math.max(0, ((currentQuestionIndex - 1) / totalQuestions) * 100)}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #F3F4F6',
            }}
          >
            <p style={{
              fontSize: 'clamp(16px, 4vw, 22px)',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '24px',
              textAlign: 'center',
              lineHeight: '1.45',
            }}>
              {currentQ.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt, i) => {
                const isSelected = hasSelection && selectedIndex === i;
                const isDimmed = hasSelection && !isSelected;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(i)}
                    disabled={hasSelection}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #E91E8C' : '2px solid #E5E7EB',
                      backgroundColor: isSelected ? '#FCE4F3' : '#FFFFFF',
                      color: isSelected ? '#9D1060' : '#1F2937',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      cursor: hasSelection ? 'default' : 'pointer',
                      opacity: isDimmed ? 0.35 : 1,
                      transition: 'border-color 0.15s, background-color 0.15s',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (state === 'result' && result) {
    const shareUrl = quiz.slug
      ? `https://purplegirl.in/quiz/${quiz.slug}?resultTitle=${encodeURIComponent(result.title)}&resultEmoji=${encodeURIComponent(result.emoji || '✨')}&resultDesc=${encodeURIComponent(result.description.substring(0, 100))}`
      : 'https://purplegirl.in/quizzes';
      
    const waText = encodeURIComponent(
      `💜 I just took "${quiz.title}" on PurpleGirl!\n\nMy result: "${result.title}" ${result.emoji || '✨'}\n\n→ Take it too: ${shareUrl}`
    );

    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="bg-white rounded-[24px] p-8 md:p-12 shadow-xl shadow-pg-rose/10 border-2 border-pg-rose/20 text-center relative overflow-hidden mb-6"
        >
          <div className="absolute -top-10 -left-10 text-8xl opacity-10 blur-sm">{result.emoji || '✨'}</div>
          <div className="absolute -bottom-10 -right-10 text-8xl opacity-10 blur-sm">{result.emoji || '🌟'}</div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-6xl mb-6"
            >
              {result.emoji || '✨'}
            </motion.div>

            <div className="text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-4">Your Result</div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl md:text-5xl font-extrabold text-pg-rose mb-6 leading-tight"
            >
              {result.title}
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-pg-gray-700 leading-[1.8] mb-10 max-w-xl mx-auto"
            >
              {result.description}
            </motion.p>

            {/* Share + Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              {/* WhatsApp Share — primary CTA */}
              <a
                href={`https://wa.me/?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-xl px-8 py-4 transition-all hover:scale-105 shadow-md text-base gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Share on WhatsApp
              </a>
              <button
                onClick={handleStart}
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-pg-gray-200 text-pg-gray-600 font-bold rounded-xl px-8 py-4 hover:bg-pg-gray-50 transition-colors gap-2"
              >
                <RefreshCw size={18} /> Retake Quiz
              </button>
            </motion.div>

            {/* Take another quiz */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="/quizzes"
                className="inline-flex items-center gap-1 text-pg-plum font-bold text-sm underline hover:no-underline"
              >
                Take another quiz <ChevronRight size={14} />
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Related category guides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-pg-cream rounded-2xl p-6 border border-pg-gray-100 text-center"
        >
          <p className="font-display font-bold text-pg-gray-900 mb-2 text-lg">
            Want to learn more?
          </p>
          <p className="text-pg-gray-500 text-sm mb-4">
            Read guides related to <span className="font-bold text-pg-rose capitalize">{quiz.category.replace(/-/g, ' ')}</span>
          </p>
          <Link
            href={`/${lang}/category/${quiz.category}`}
            className="inline-flex items-center gap-2 bg-pg-rose text-white font-bold px-6 py-3 rounded-xl hover:bg-pg-rose-dark transition-colors text-sm"
          >
            View {quiz.category.replace(/-/g, ' ')} Guides <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return null;
};
