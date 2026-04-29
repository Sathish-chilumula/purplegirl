'use client';

import React, { useState, Suspense } from 'react';
import { Shield, Sparkles, Send, RefreshCcw } from 'lucide-react';

interface AnswerResult {
  question: string;
  answer: string;
  category: string;
}

function AskContent() {
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get answer');
      }

      const data = await res.json();
      setResult({
        question: questionText.trim(),
        answer: data.answer,
        category: data.category,
      });
    } catch (err: any) {
      console.error(err);
      setError("I'm sorry, girl. I couldn't process that right now. Please try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuestionText('');
    setResult(null);
    setError(null);
  };

  const categoryLabel = result?.category?.replace(/-/g, ' ') || '';

  return (
    <div className="min-h-screen relative py-20 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-3xl mx-auto">
        {result ? (
          /* ── ANSWER VIEW ── */
          <div className="animate-fade-in space-y-8">
            {/* Question recap */}
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2">Your question</p>
              <p className="font-bold text-lg text-slate-800 leading-relaxed">{result.question}</p>
              {categoryLabel && (
                <span className="inline-block mt-3 bg-pg-rose-light text-pg-rose text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {categoryLabel}
                </span>
              )}
            </div>

            {/* Answer */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-1 shadow-xl shadow-purple-200">
              <div className="bg-white rounded-[14px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">PurpleGirl</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Your Elder Sister</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-[1.9] text-[16px] whitespace-pre-wrap">{result.answer}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors font-bold text-xs uppercase tracking-widest group"
              >
                <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Ask Another Question
              </button>
            </div>

            <div className="text-center text-xs text-slate-400 font-medium">
              🔒 Your question was anonymous. No name, no account, no judgment.
            </div>
          </div>
        ) : (
          /* ── QUESTION FORM ── */
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl">
                <Sparkles size={32} />
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-4">
              Ask Anything<span className="text-purple-600">.</span>
            </h1>
            <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              No topic is too taboo. Get honest, kind answers from your digital elder sister — instantly and anonymously.
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(76,29,149,0.12)] border border-purple-50 p-6 md:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-40" />

              <div className="relative z-10">
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Tell me what's on your mind, girl... 'How do I deal with my toxic mother-in-law?' or 'I missed my period, what should I do?'"
                  className="w-full min-h-[180px] bg-transparent border-none outline-none font-medium text-lg md:text-xl text-slate-800 placeholder:text-slate-300 resize-none px-2"
                  disabled={isSubmitting}
                />

                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Shield size={14} className="text-purple-400" />
                    Anonymous · Encrypted · Safe
                  </div>

                  {isSubmitting ? (
                    <div className="flex items-center gap-3 text-purple-600 font-bold text-sm italic">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      Thinking for you…
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!questionText.trim()}
                      className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-purple-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Ask Question <Send size={18} />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 font-bold text-sm">
                {error}
              </div>
            )}

            {/* Suggested questions */}
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Girls often ask…</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'How do I deal with a controlling husband?',
                  'PCOS diet tips for Indian women?',
                  'How to save money as a housewife?',
                  'Signs of a toxic relationship?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestionText(q)}
                    className="text-xs px-4 py-2 bg-white text-slate-600 rounded-full border border-purple-100 hover:border-purple-400 hover:text-purple-600 transition-all font-medium shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100" />
            <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading…</div>
          </div>
        </div>
      }
    >
      <AskContent />
    </Suspense>
  );
}
