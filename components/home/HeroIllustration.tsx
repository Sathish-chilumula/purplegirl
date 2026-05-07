'use client';

import React from 'react';

// Fast CSS-animated SVG — no network request, renders instantly
export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto hero-float">
      <svg
        viewBox="0 0 420 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        {/* Background blob */}
        <ellipse cx="210" cy="200" rx="190" ry="170" fill="#FDF2F8" opacity="0.8" />

        {/* Floating card 1 — top left */}
        <g className="hero-card-1">
          <rect x="20" y="60" width="130" height="56" rx="14" fill="white" filter="url(#shadow)" />
          <circle cx="44" cy="88" r="14" fill="#F43F5E" opacity="0.15" />
          <text x="44" y="93" textAnchor="middle" fontSize="14">💕</text>
          <rect x="66" y="78" width="70" height="8" rx="4" fill="#E11D48" opacity="0.3" />
          <rect x="66" y="92" width="50" height="6" rx="3" fill="#6B7280" opacity="0.2" />
        </g>

        {/* Floating card 2 — top right */}
        <g className="hero-card-2">
          <rect x="268" y="30" width="130" height="56" rx="14" fill="white" filter="url(#shadow)" />
          <circle cx="292" cy="58" r="14" fill="#7C3AED" opacity="0.15" />
          <text x="292" y="63" textAnchor="middle" fontSize="14">🛡️</text>
          <rect x="314" y="48" width="70" height="8" rx="4" fill="#7C3AED" opacity="0.3" />
          <rect x="314" y="62" width="50" height="6" rx="3" fill="#6B7280" opacity="0.2" />
        </g>

        {/* Floating card 3 — bottom left */}
        <g className="hero-card-3">
          <rect x="10" y="280" width="130" height="56" rx="14" fill="white" filter="url(#shadow)" />
          <circle cx="34" cy="308" r="14" fill="#10B981" opacity="0.15" />
          <text x="34" y="313" textAnchor="middle" fontSize="14">✅</text>
          <rect x="56" y="298" width="70" height="8" rx="4" fill="#10B981" opacity="0.3" />
          <rect x="56" y="312" width="50" height="6" rx="3" fill="#6B7280" opacity="0.2" />
        </g>

        {/* Main woman illustration */}
        {/* Body/dress */}
        <ellipse cx="210" cy="310" rx="80" ry="50" fill="#7C3AED" opacity="0.12" />
        <rect x="170" y="220" width="80" height="100" rx="20" fill="#7C3AED" />
        <rect x="158" y="240" width="30" height="70" rx="15" fill="#7C3AED" />
        <rect x="232" y="240" width="30" height="70" rx="15" fill="#7C3AED" />

        {/* Dupatta/scarf */}
        <path d="M165 230 Q190 210 210 220 Q230 210 255 230" stroke="#F43F5E" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Phone in hand */}
        <rect x="237" y="268" width="28" height="48" rx="6" fill="#1C1917" />
        <rect x="240" y="272" width="22" height="36" rx="4" fill="#60A5FA" opacity="0.8" />
        <rect x="248" y="274" width="6" height="2" rx="1" fill="white" opacity="0.6" />

        {/* Neck */}
        <rect x="200" y="190" width="20" height="32" rx="10" fill="#FBBF24" opacity="0.8" />

        {/* Head */}
        <circle cx="210" cy="168" r="48" fill="#FBBF24" opacity="0.85" />

        {/* Hair */}
        <ellipse cx="210" cy="135" rx="44" ry="24" fill="#1C1917" />
        <path d="M166 155 Q158 185 162 215" stroke="#1C1917" strokeWidth="18" strokeLinecap="round" />
        <path d="M254 155 Q262 185 258 215" stroke="#1C1917" strokeWidth="18" strokeLinecap="round" />
        <path d="M175 140 Q190 120 210 118 Q230 120 245 140" fill="#1C1917" />

        {/* Face features */}
        <ellipse cx="197" cy="168" rx="6" ry="7" fill="white" />
        <ellipse cx="223" cy="168" rx="6" ry="7" fill="white" />
        <circle cx="199" cy="169" r="4" fill="#1C1917" />
        <circle cx="225" cy="169" r="4" fill="#1C1917" />
        <circle cx="200" cy="168" r="1.5" fill="white" />
        <circle cx="226" cy="168" r="1.5" fill="white" />

        {/* Smile */}
        <path d="M200 181 Q210 190 220 181" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Bindi */}
        <circle cx="210" cy="155" r="3" fill="#E11D48" />

        {/* Floating sparkles */}
        <text x="80" y="180" fontSize="18" className="sparkle-1">✨</text>
        <text x="330" y="220" fontSize="16" className="sparkle-2">⭐</text>
        <text x="50" y="240" fontSize="14" className="sparkle-3">💫</text>
        <text x="350" y="290" fontSize="20" className="sparkle-4">✨</text>

        {/* Trust badge */}
        <rect x="140" y="340" width="140" height="32" rx="16" fill="#7C3AED" />
        <text x="210" y="361" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">100% Anonymous 🔒</text>

        {/* Filters / defs */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#7C3AED" floodOpacity="0.12" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .hero-float {
          animation: heroFloat 6s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .hero-card-1 {
          animation: cardFloat1 4s ease-in-out infinite;
          transform-origin: center;
        }
        .hero-card-2 {
          animation: cardFloat2 5s ease-in-out infinite;
          transform-origin: center;
        }
        .hero-card-3 {
          animation: cardFloat3 4.5s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes cardFloat1 {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(0deg); }
        }
        @keyframes cardFloat2 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(0deg); }
        }
        @keyframes cardFloat3 {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        .sparkle-1 { animation: sparkle 3s ease-in-out infinite; }
        .sparkle-2 { animation: sparkle 4s ease-in-out infinite 1s; }
        .sparkle-3 { animation: sparkle 3.5s ease-in-out infinite 0.5s; }
        .sparkle-4 { animation: sparkle 5s ease-in-out infinite 1.5s; }
        @keyframes sparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(20deg); }
        }
      `}</style>
    </div>
  );
}
