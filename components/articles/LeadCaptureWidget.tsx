'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, X, ChevronRight } from 'lucide-react';

interface LeadCaptureProps {
  category?: string;
  articleTitle?: string;
}

const CATEGORY_MESSAGES: Record<string, string> = {
  'legal-rights': 'Get a free 15-minute legal consultation for women in India',
  'womens-health': 'Get weekly women\'s health tips straight to WhatsApp',
  'mental-health-emotions': 'Get anonymous mental health support resources weekly',
  'finance-money': 'Get expert financial planning tips for Indian women',
  'relationships-marriage': 'Get honest relationship advice — privately, in your inbox',
  'pregnancy-fertility': 'Get a weekly pregnancy + fertility guide for Indian women',
  'career-workplace': 'Get career growth strategies for Indian working women',
};

const DEFAULT_MESSAGE = 'Get PurpleGirl\'s weekly guide for Indian women';

export function LeadCaptureWidget({ category, articleTitle }: LeadCaptureProps) {
  const [dismissed, setDismissed] = useState(false);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (dismissed) return null;

  const message = category ? (CATEGORY_MESSAGES[category] || DEFAULT_MESSAGE) : DEFAULT_MESSAGE;

  const whatsappText = encodeURIComponent(
    `Hi! I just read "${articleTitle || 'a guide'}" on PurpleGirl.in and I'd love to receive weekly guides. Please add me.`
  );
  const whatsappUrl = `https://wa.me/919999999999?text=${whatsappText}`;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // In production: call an API to store the email/phone
    setSubmitted(true);
  };

  return (
    <div className="my-10 relative bg-gradient-to-br from-pg-plum to-[#3d1070] text-white rounded-2xl p-6 md:p-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      <div className="relative z-10">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">💜</div>
            <h3 className="font-display font-bold text-xl mb-2">You're in!</h3>
            <p className="text-white/70 text-sm">We'll send you the best guides for Indian women every week.</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-pg-rose-light mb-2">
              Free Weekly Updates
            </p>
            <h3 className="font-display font-bold text-[20px] md:text-[24px] mb-2 leading-tight">
              {message}
            </h3>
            <p className="text-white/60 text-sm mb-6">
              No spam. Unsubscribe anytime. 100% anonymous.
            </p>

            {/* Two CTAs: WhatsApp (primary) + Email (secondary) */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* WhatsApp — primary for Indian users */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-5 py-3.5 rounded-xl transition-all hover:scale-105 text-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Join on WhatsApp
              </a>

              {/* Email — secondary */}
              <form
                onSubmit={handleEmailSubmit}
                className="flex-1 flex gap-2"
              >
                <input
                  type="email"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-pg-plum font-bold px-4 py-3 rounded-xl hover:bg-pg-rose-light transition-colors shrink-0"
                >
                  <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
