'use client';

import React from 'react';

export function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden flex items-center justify-center opacity-[0.055]">
      <svg
        width="800"
        height="800"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-5xl object-contain mix-blend-multiply"
      >
        <style>{`
          .ring-slow { transform-origin: center; animation: cipherRotate 60s linear infinite; }
          .ring-fast { transform-origin: center; animation: cipherRotateReverse 40s linear infinite; }
          .botanical-float { animation: botanicalFloat 12s ease-in-out infinite; transform-origin: center; }
          .botanical-float-delayed { animation: botanicalFloat 15s ease-in-out infinite -5s; transform-origin: center; }
        `}</style>
        
        {/* Voynich astronomical rings */}
        {[320, 260, 200, 140, 80].map((r, i) => (
          <circle
            key={`ring-${i}`}
            cx="400"
            cy="400"
            r={r}
            className={i % 2 === 0 ? "ring-slow" : "ring-fast"}
            stroke={i % 3 === 0 ? "var(--pg-crimson-600)" : "var(--pg-gold-500)"}
            strokeWidth={i === 0 ? "0.8" : "0.4"}
            strokeDasharray={i === 2 ? "4 4" : "0"}
          />
        ))}

        {/* Voynich radial spokes */}
        {Array.from({ length: 36 }, (_, i) => i * 10).map((a) => (
          <line
            key={`spoke-${a}`}
            x1="400"
            y1="400"
            x2={400 + 320 * Math.cos((a * Math.PI) / 180)}
            y2={400 + 320 * Math.sin((a * Math.PI) / 180)}
            stroke="var(--pg-gold-500)"
            strokeWidth="0.2"
            opacity="0.3"
          />
        ))}

        {/* Codex Gigas: Gothic arch frame */}
        <path
          d="M 250 800 L 250 200 Q 400 50 550 200 L 550 800"
          stroke="var(--pg-crimson-600)"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />

        {/* Botanical elements (Voynich inspired) */}
        <g className="botanical-float" opacity="0.4">
          <path d="M 300 300 Q 320 250 350 280 T 400 250" stroke="var(--pg-violet-500)" strokeWidth="0.8" fill="none" />
          <circle cx="350" cy="280" r="3" fill="var(--pg-rose-500)" />
          <circle cx="400" cy="250" r="4" fill="var(--pg-rose-400)" />
        </g>

        <g className="botanical-float-delayed" opacity="0.3">
          <path d="M 500 500 Q 480 450 450 480 T 400 450" stroke="var(--pg-violet-600)" strokeWidth="0.6" fill="none" />
          <circle cx="450" cy="480" r="2" fill="var(--pg-gold-500)" />
          <circle cx="400" cy="450" r="3" fill="var(--pg-crimson-500)" />
        </g>

        {/* Central illuminated core */}
        <circle cx="400" cy="400" r="10" stroke="var(--pg-gold-500)" strokeWidth="1" />
        <circle cx="400" cy="400" r="4" fill="var(--pg-gold-glow)" />
      </svg>
      
      {/* Edge vignette darkening */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_40%,rgba(217,207,184,0.15)_75%,rgba(217,207,184,0.35)_100%)] pointer-events-none" />
    </div>
  );
}
