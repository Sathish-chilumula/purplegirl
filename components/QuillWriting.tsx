'use client';

import React from 'react';

export function QuillWriting({ text = 'Consulting the archive...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 text-pg-ink-600 italic">
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Animated feather quill SVG */}
        <svg 
          width="20" height="20" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="1.5" 
          className="absolute text-pg-crimson-600 origin-bottom-left"
          style={{ animation: 'quillDip 1.5s ease-in-out infinite' }}
        >
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      <span className="font-im-fell text-lg">{text}</span>
      <span className="flex gap-1 items-end h-full pb-1">
        <span className="w-1 h-1 rounded-full bg-pg-crimson-600" style={{ animation: 'inkDot 1.4s infinite 0s' }} />
        <span className="w-1 h-1 rounded-full bg-pg-crimson-600" style={{ animation: 'inkDot 1.4s infinite 0.2s' }} />
        <span className="w-1 h-1 rounded-full bg-pg-crimson-600" style={{ animation: 'inkDot 1.4s infinite 0.4s' }} />
      </span>
    </div>
  );
}
