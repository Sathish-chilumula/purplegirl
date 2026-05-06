'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function FeedbackWidget({ slug }: { slug: string }) {
  const [status, setStatus] = useState<'idle' | 'helpful' | 'not-helpful' | 'submitted'>('idle');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClientComponentClient();

  const handleInitialFeedback = async (isHelpful: boolean) => {
    setStatus(isHelpful ? 'helpful' : 'not-helpful');
    
    // Immediately log the simple vote
    await supabase.from('article_feedback').insert([{
      article_slug: slug,
      is_helpful: isHelpful
    }]);

    // If helpful, we can just show success. 
    // If not helpful, we ask for more info.
    if (isHelpful) {
      setStatus('submitted');
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // We update the most recent feedback from this user, or just insert a new row with the text
    await supabase.from('article_feedback').insert([{
      article_slug: slug,
      is_helpful: false,
      feedback_text: feedback
    }]);

    setStatus('submitted');
    setIsSubmitting(false);
  };

  if (status === 'submitted') {
    return (
      <div className="bg-pg-rose-light/30 border border-pg-rose/20 rounded-2xl p-6 text-center max-w-2xl mx-auto my-12">
        <CheckCircle2 className="mx-auto text-pg-success mb-3" size={32} />
        <h3 className="font-display font-bold text-pg-gray-900 text-xl mb-1">Thank you!</h3>
        <p className="text-pg-gray-600 text-sm">Your feedback helps us make PurpleGirl better for all Indian women.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-pg-gray-200 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto my-12 shadow-sm text-center">
      {status === 'idle' && (
        <>
          <h3 className="font-display font-bold text-pg-gray-900 text-xl mb-6">Was this guide helpful?</h3>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleInitialFeedback(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-pg-gray-200 hover:border-pg-success hover:bg-pg-success/10 hover:text-pg-success font-bold text-pg-gray-700 transition-colors"
            >
              <ThumbsUp size={18} /> Yes
            </button>
            <button
              onClick={() => handleInitialFeedback(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-pg-gray-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-pg-gray-700 transition-colors"
            >
              <ThumbsDown size={18} /> No
            </button>
          </div>
        </>
      )}

      {status === 'not-helpful' && (
        <form onSubmit={handleTextSubmit} className="text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-display font-bold text-pg-gray-900 text-lg mb-2">We're sorry to hear that.</h3>
          <p className="text-pg-gray-500 text-sm mb-4">What was missing from this guide?</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you were looking for..."
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
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="bg-pg-rose hover:bg-pg-rose-dark disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'} <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
