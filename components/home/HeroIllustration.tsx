import React from 'react';

export function HeroIllustration() {
  return (
    <svg 
      viewBox="0 0 420 380" 
      width="100%" 
      height="auto" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="max-h-[220px] md:max-h-none"
    >
      <rect width="420" height="380" rx="32" fill="#FDF2F8" />
      <circle cx="210" cy="190" r="120" fill="#FBCFE8" opacity="0.5" />
      <path d="M150 250 Q 210 100 270 250" stroke="#E91E8C" strokeWidth="8" strokeLinecap="round" />
      <circle cx="210" cy="150" r="40" fill="#E91E8C" />
      <rect x="180" y="250" width="60" height="130" rx="12" fill="#E91E8C" />
      {/* Decorative stars */}
      <path d="M80 120 l 10 30 l 30 10 l -30 10 l -10 30 l -10 -30 l -30 -10 l 30 -10 Z" fill="#F472B6" />
      <path d="M340 100 l 8 24 l 24 8 l -24 8 l -8 24 l -8 -24 l -24 -8 l 24 -8 Z" fill="#F472B6" opacity="0.7" />
    </svg>
  );
}
