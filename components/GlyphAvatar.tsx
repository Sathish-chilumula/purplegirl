'use client';

import React from 'react';
import { useGlyphScramble } from '@/lib/hooks/useGlyphScramble';

interface GlyphAvatarProps {
  userId?: string;
  className?: string;
}

// Simple djb2 hash to get a deterministic number from a string
function hashString(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

const GLYPHS = ["ꞩ","ꝏ","ꞛ","Ꞙ","Ꟈ","ꞵ","ꝝ","ᛟ","ᚠ","ᚦ","ᚨ"];

export function GlyphAvatar({ userId = 'anonymous', className = '' }: GlyphAvatarProps) {
  const hash = hashString(userId);
  const targetGlyph = GLYPHS[hash % GLYPHS.length];
  
  // Scramble effect on mount
  const displayGlyph = useGlyphScramble(targetGlyph, true, 800, 60);

  return (
    <div className={`w-10 h-10 rounded-full border border-pg-crimson-600/30 bg-pg-parch-100 flex items-center justify-center shadow-sm shrink-0 ${className}`}>
      <span className="font-unifraktur text-xl text-pg-crimson-600 opacity-90 leading-none pt-1">
        {displayGlyph}
      </span>
    </div>
  );
}
