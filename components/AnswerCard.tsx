'use client';

import React from 'react';
import { Heart, Share2, ShieldCheck, MessageCircle } from 'lucide-react';

interface AnswerCardProps {
  question: any;
  answer: any;
}

export function AnswerCard({ question, answer }: AnswerCardProps) {
  const getWhatsAppLink = () => {
    const quote = question.title || 'An honest answer.';
    const url = `https://purplegirl.in/q/${question.slug}`;
    const text = `Finally got an honest answer to this:\n\n"${quote}"\n\nRead the full answer: ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <article className="w-full max-w-4xl mx-auto animate-fade-in my-12">
      {/* 1. Header: The Question */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-50 text-purple-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <MessageCircle size={14} /> Anonymous Question
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            {new Date(question.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        
        <h1 className="font-syne text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
          {question.title}
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl leading-relaxed italic">
          "{question.description}"
        </p>
      </div>

      {/* 2. The Answer: Elder Sister Style */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100 relative overflow-hidden">
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <span className="font-syne font-bold text-xl">P</span>
            </div>
            <div>
              <div className="font-syne font-bold text-slate-900 leading-none">PurpleGirl</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mt-1">Your Elder Sister</div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:text-lg prose-p:leading-relaxed prose-strong:text-purple-700 prose-em:text-pink-600">
            {answer && Array.isArray(answer.chat_log) ? (
              answer.chat_log.map((paragraph: string | any, i: number) => (
                <p key={i} className="mb-6 last:mb-0">
                  {typeof paragraph === 'string' ? paragraph : (paragraph.text || '')}
                </p>
              ))
            ) : (
              <p className="text-slate-400 italic">Thinking of the best way to say this...</p>
            )}
          </div>

          {/* Actionable Guidance if present */}
          {answer && answer.bullet_points && (
            <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-syne font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-600" /> Practical Guidance
              </h3>
              <ul className="space-y-4">
                {answer.bullet_points.map((point: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {i + 1}
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          {answer && answer.disclaimer && (
            <div className="mt-12 flex gap-4 p-6 bg-red-50/50 rounded-xl border border-red-100 text-sm text-red-700">
              <ShieldCheck size={20} className="shrink-0" />
              <p className="italic">{answer.disclaimer}</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Social & Metadata */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-400 hover:text-pink-600 transition-colors group">
            <Heart size={20} className="group-hover:fill-pink-600" />
            <span className="text-xs font-bold uppercase tracking-widest">{question.metoo_count || 0} girls relate</span>
          </button>
        </div>
        
        <div className="flex gap-4">
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-premium py-3 px-8 text-sm flex items-center gap-2"
          >
            <Share2 size={18} /> Share With A Sister
          </a>
        </div>
      </div>
    </article>
  );
}
