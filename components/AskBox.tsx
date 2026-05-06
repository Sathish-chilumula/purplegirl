'use client';

import React, { useState, useRef } from 'react';
import { useCategoryDetect } from '@/lib/hooks/useCategoryDetect';
import { QuillWriting } from './QuillWriting';
import { useRouter } from 'next/navigation';

export function AskBox() {
  const [question, setQuestion] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const detectedFolio = useCategoryDetect(question);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setIsSubmitting(true);
    
    // Auto-expand minimal question length if needed or just submit
    // Navigation to the dedicated loading/ask chamber:
    router.push(`/ask?q=${encodeURIComponent(question)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="relative w-full">
        {/* The Frame / Border trace container */}
        <div className={`absolute -inset-[3px] rounded bg-gradient-to-br from-pg-crimson-600 via-pg-gold-500 to-pg-crimson-600 transition-opacity duration-500 ${isFocused ? 'opacity-30' : 'opacity-0'}`} />
        
        {/* Outer container */}
        <div 
          className={`relative bg-pg-parch-50 border transition-colors duration-300 rounded shadow-md overflow-hidden ${isFocused ? 'border-pg-crimson-600/50' : 'border-pg-parch-300'}`}
        >
          {/* SVG Animated Border (Trace) */}
          {isFocused && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
              <rect 
                x="0" y="0" width="100%" height="100%" 
                fill="none" 
                stroke="var(--pg-crimson-600)" 
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{ animation: 'traceRect 1.5s var(--ease-out) forwards' }}
              />
            </svg>
          )}

          <div className="p-5 md:p-6 flex items-start gap-4">
            <span className="font-im-fell text-3xl text-pg-crimson-600 opacity-70 leading-none pt-1">¶</span>
            
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask the question that has no other home..."
              className="flex-1 min-h-[80px] bg-transparent border-none outline-none font-im-fell text-xl md:text-2xl text-pg-ink-900 placeholder:text-pg-ink-400 placeholder:italic resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="px-5 md:px-6 pb-4 flex justify-between items-center bg-pg-parch-100/50 border-t border-pg-parch-200 pt-3">
            <div className="text-[11px] font-cinzel text-pg-ink-500 tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pg-crimson-500/70" />
              ANONYMOUS. NO TRACE.
            </div>
            
            {isSubmitting ? (
              <QuillWriting text="Transcribing..." />
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!question.trim()}
                className="bg-pg-crimson-600 hover:bg-pg-crimson-500 text-white font-cinzel text-[11px] tracking-[0.2em] px-6 py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-crimson"
              >
                ASK THE ORACLE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Chips Container */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center h-[30px] transition-all duration-300">
        {detectedFolio && (
          <div className="px-4 py-1 border border-pg-gold-500/50 bg-pg-gold-100/30 text-pg-gold-700 font-cinzel text-[9px] tracking-widest uppercase rounded shadow-sm flex items-center gap-2 parchment-unfurl">
            <span className="text-pg-crimson-600">✦</span>
            Detected: {detectedFolio.replace(/-/g, ' ')}
          </div>
        )}
      </div>
    </div>
  );
}
