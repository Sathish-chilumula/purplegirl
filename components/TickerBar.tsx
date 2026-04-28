'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

interface Question {
  slug: string;
  title: string;
}

export function TickerBar({ questions }: { questions: Question[] }) {
  if (!questions.length) return null;

  const doubled = [...questions, ...questions];

  return (
    <div className="ticker-wrap" style={{ marginBottom: '6rem' }}>
      <div className="ticker-move">
        {doubled.map((q, i) => (
          <Link
            key={i}
            href={`/q/${q.slug}`}
            className="flex items-center gap-3 px-10"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              borderRight: '1px solid var(--border)',
              transition: 'color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--purple-mid)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Heart size={12} style={{ color: 'var(--pink-hot)', fill: 'var(--pink-hot)', flexShrink: 0 }} />
            {q.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
