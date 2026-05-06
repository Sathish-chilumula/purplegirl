'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2 } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface FeedbackWidgetProps {
  articleId: string;
  dict: any;
}

export function FeedbackWidget({ articleId, dict }: FeedbackWidgetProps) {
  const [status, setStatus] = useState<'idle' | 'helpful' | 'not-helpful' | 'submitted'>('idle');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInitialFeedback = async (isHelpful: boolean) => {
    setStatus(isHelpful ? 'helpful' : 'not-helpful');
    
    // Immediately log the simple vote via API or client-side supabase if available
    // For simplicity in this demo, we'll assume a supabase instance is available or use a server action
    // But since this is 'use client', we should use the client-side supabase
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    const supabase = createClientComponentClient();

    await supabase.from('article_feedback').insert([{
      article_id: articleId,
      is_helpful: isHelpful
    }]);

    if (isHelpful) {
      setStatus('submitted');
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    const supabase = createClientComponentClient();

    await supabase.from('article_feedback').insert([{
      article_id: articleId,
      is_helpful: false,
      missing_info: feedback
    }]);

    setStatus('submitted');
    setIsSubmitting(false);
  };

  if (status === 'submitted') {
    return (
      <div className="bg-pg-rose-light/30 border border-pg-rose/20 rounded-2xl p-6 text-center max-w-2xl mx-auto my-12">
        <CheckCircle2 className="mx-auto text-green-500 mb-3" size={32} />
        <h3 className="font-display font-bold text-pg-gray-900 text-xl mb-1">
          {dict.article_feedback_thanks.split('!')[0]}!
        </h3>
        <p className="text-pg-gray-600 text-sm">{dict.article_feedback_thanks}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-pg-gray-200 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto my-12 shadow-sm text-center">
      {status === 'idle' && (
        <>
          <h3 className="font-display font-bold text-pg-gray-900 text-xl mb-6">
            {dict.article_was_helpful}
          </h3>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleInitialFeedback(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-pg-gray-200 hover:border-green-500 hover:bg-green-50 hover:text-green-600 font-bold text-pg-gray-700 transition-colors"
            >
              <ThumbsUp size={18} /> {dict.article_yes}
            </button>
            <button
              onClick={() => handleInitialFeedback(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-pg-gray-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-pg-gray-700 transition-colors"
            >
              <ThumbsDown size={18} /> {dict.article_no}
            </button>
          </div>
        </>
      )}

      {status === 'not-helpful' && (
        <form onSubmit={handleTextSubmit} className="text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-display font-bold text-pg-gray-900 text-lg mb-2">
            {lang === 'hi' ? 'हमें यह सुनकर दुख हुआ।' : lang === 'te' ? 'మేము క్షమించమని అడుగుతున్నాము.' : "We're sorry to hear that."}
          </h3>
          <p className="text-pg-gray-500 text-sm mb-4">{dict.article_missing_info}</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="..."
            className="w-full px-4 py-3 rounded-xl border border-pg-gray-200 focus:border-pg-rose outline-none text-pg-gray-900 resize-none mb-3"
            rows={3}
            required
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStatus('submitted')}
              className="text-pg-gray-500 text-sm font-bold px-4 hover:text-pg-gray-900"
            >
              {dict.article_skip}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="bg-pg-rose hover:bg-pg-rose-dark disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              {isSubmitting ? '...' : dict.article_send_feedback} <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
