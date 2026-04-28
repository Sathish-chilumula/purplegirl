'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Share2, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface AnswerCardProps {
  question: any;
  answer: any;
}

export function AnswerCard({ question, answer }: AnswerCardProps) {
  const getWhatsAppLink = () => {
    const quote = question.title || '';
    const url = `https://purplegirl.in/q/${question.slug}`;
    const text = `Finally got an honest answer:\n\n"${quote}"\n\n${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const chatLog: string[] = answer && Array.isArray(answer.chat_log)
    ? answer.chat_log.map((p: any) => (typeof p === 'string' ? p : p?.text || ''))
    : [];

  const bulletPoints: string[] = answer?.bullet_points || [];

  return (
    <article style={{ width: '100%', maxWidth: '860px', margin: '3rem auto' }} className="animate-fade-in">

      {/* ── Question Header ─────────────────────────────── */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.75rem',
          padding: '2.5rem',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-soft)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              background: 'var(--purple-mist)', color: 'var(--purple-mid)',
              border: '1px solid var(--purple-light)',
              padding: '0.3rem 0.875rem', borderRadius: '9999px',
              fontSize: '0.65rem', fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: 'var(--font-accent)',
            }}
          >
            💬 Anonymous Question
          </span>
          {question.created_at && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {new Date(question.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--ink)',
            lineHeight: 1.2,
            marginBottom: question.description ? '1rem' : 0,
          }}
        >
          {question.title}
        </h1>

        {question.description && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              borderLeft: '3px solid var(--purple-light)',
              paddingLeft: '1rem',
              marginTop: '1rem',
            }}
          >
            "{question.description}"
          </p>
        )}
      </div>

      {/* ── Answer Body ─────────────────────────────────── */}
      <div
        style={{
          background: 'white',
          borderRadius: '1.75rem',
          padding: '2.5rem',
          border: '1px solid var(--border-soft)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.25rem',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Sender avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--grad-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: 'var(--shadow-pink)',
              flexShrink: 0,
            }}
          >
            💜
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-accent)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--ink)' }}>
              PurpleGirl
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple-mid)', marginTop: '2px' }}>
              Your Elder Sister
            </div>
          </div>
        </div>

        {/* Answer paragraphs */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {chatLog.length > 0 ? (
            chatLog.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: 'var(--text-primary)',
                  marginBottom: i < chatLog.length - 1 ? '1.25rem' : 0,
                }}
              >
                {para}
              </p>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Thinking of the best way to help you…
            </p>
          )}
        </div>

        {/* Bullet points */}
        {bulletPoints.length > 0 && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'var(--surface-warm)',
              borderRadius: '1rem',
              border: '1px solid var(--border-soft)',
            }}
          >
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: 'var(--font-accent)', fontWeight: 800,
                fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--purple-mid)', marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} /> Practical Steps
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {bulletPoints.map((point, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--purple-mid)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        {answer?.disclaimer && (
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '1rem 1.25rem',
              background: '#fff7ed',
              borderRadius: '0.875rem',
              border: '1px solid #fed7aa',
            }}
          >
            <ShieldCheck size={18} style={{ color: '#ea580c', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: '#9a3412', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              {answer.disclaimer}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer Actions ───────────────────────────────── */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', padding: '0 0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={18} style={{ color: 'var(--pink-hot)', fill: 'var(--pink-hot)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
            {question.metoo_count || 0} girls relate to this
          </span>
        </div>

        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '0.75rem 1.75rem', fontSize: '0.85rem' }}
        >
          <Share2 size={16} /> Share with a Sister
        </a>
      </div>
    </article>
  );
}
