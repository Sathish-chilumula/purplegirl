'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Detect context from URL
  const context = useMemo(() => {
    if (pathname.includes('/how-to/pcos') || pathname.includes('/wiki/pcos')) return 'PCOS';
    if (pathname.includes('/how-to/periods') || pathname.includes('/tools/period-calculator')) return 'Periods';
    if (pathname.includes('/how-to/relationships') || pathname.includes('/category/love-relationships')) return 'Relationships';
    if (pathname.includes('/category/finance-career')) return 'Money & Career';
    if (pathname.includes('/category/fashion-style')) return 'Fashion';
    return null;
  }, [pathname]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting = context 
      ? `Hey girl 💜 I noticed you're looking into ${context}. I'm here to help you figure it out. Do you have any specific questions?`
      : "Hey girl 💜 I'm PurpleGirl. I'm here to listen and help with the things you can't ask anyone else. What's on your mind?";
    
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [context]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMessage }],
          context: context 
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I lost connection for a moment. Can you say that again?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── FAB — Multicolour Spinning Heart ─────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open PurpleGirl Chat"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 60,
          width: '64px', height: '64px',
          borderRadius: '50%',
          background: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0)' : 'scale(1)',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
        className="heart-fab"
      >
        {/* Heart SVG (coloured with gradient fill) */}
        <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path
            fill="url(#heart-grad)"
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
          />
        </svg>
      </button>

      {/* ── Chat Window ────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 60,
          width: '380px', maxWidth: 'calc(100vw - 2rem)',
          height: '560px', maxHeight: 'calc(100vh - 6rem)',
          background: 'white',
          borderRadius: '2rem',
          boxShadow: '0 30px 80px rgba(59,7,100,0.25), 0 8px 20px rgba(0,0,0,0.1)',
          border: '1px solid var(--border-soft)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: 'bottom right',
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(40px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--grad-brand)',
            padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Avatar */}
            <div
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', backdropFilter: 'blur(8px)',
              }}
            >
              💜
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.05rem', color: 'white', lineHeight: 1.2,
                }}
              >
                PurpleGirl
              </div>
              <div
                style={{
                  fontSize: '0.6rem', fontWeight: 800,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Real Advice · Always Online
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1, overflowY: 'auto', padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            background: 'var(--surface-warm)',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '82%',
                  padding: '0.875rem 1.125rem',
                  borderRadius: msg.role === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                  background: msg.role === 'user' ? 'var(--grad-brand)' : 'white',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  fontWeight: msg.role === 'user' ? 500 : 400,
                  boxShadow: msg.role === 'user' ? '0 4px 12px rgba(124,58,237,0.25)' : 'var(--shadow-sm)',
                  border: msg.role === 'assistant' ? '1px solid var(--border-soft)' : 'none',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '0.875rem 1.25rem',
                  background: 'white',
                  borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                  border: '1px solid var(--border-soft)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}
              >
                {[0, 0.2, 0.4].map((d, i) => (
                  <div
                    key={i}
                    style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--purple-soft)',
                      animation: `bounce 1.2s ease-in-out ${d}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '1rem 1.25rem',
            background: 'white',
            borderTop: '1px solid var(--border-soft)',
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything, girl…"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              border: '1.5px solid var(--border)',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              background: 'var(--surface-soft)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--purple-mid)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: !input.trim() || isLoading ? 'var(--border)' : 'var(--grad-brand)',
              border: 'none', cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: !input.trim() || isLoading ? 'none' : '0 4px 16px rgba(124,58,237,0.35)',
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Bounce keyframe for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        .group-hover\\:max-h-16:hover .group { max-height: 4rem; }
        .group-hover\\:opacity-100:hover .group { opacity: 1; }
      `}</style>
    </>
  );
}
