import React from 'react';

/* ── Background fusion SVG (Voynich circles + Codex arch) ──── */
export const BgArt = () => (
  <svg width="800" height="800" viewBox="0 0 800 800"
    fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-4xl opacity-20 mix-blend-multiply">
    <style>{`
      @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .ring-slow { transform-origin: center; animation: orbit 60s linear infinite; }
      .ring-fast { transform-origin: center; animation: orbit 40s linear infinite reverse; }
    `}</style>
    {/* Voynich astronomical rings */}
    {[320, 260, 200, 140, 80].map((r, i) => (
      <circle key={i} cx="400" cy="400" r={r}
        className={i % 2 === 0 ? "ring-slow" : "ring-fast"}
        stroke={i % 3 === 0 ? "var(--crimson)" : "var(--gold)"} 
        strokeWidth={i === 0 ? "0.8" : "0.4"} 
        strokeDasharray={i === 2 ? "4 4" : "0"} />
    ))}
    {/* Voynich radial spokes */}
    {Array.from({ length: 36 }, (_, i) => i * 10).map(a => (
      <line key={a} x1="400" y1="400"
        x2={400 + 320 * Math.cos(a * Math.PI / 180)}
        y2={400 + 320 * Math.sin(a * Math.PI / 180)}
        stroke="var(--gold)" strokeWidth="0.2" opacity="0.3" />
    ))}
    {/* Codex Gigas: Gothic arch at top */}
    <path d="M 300 800 L 300 250 Q 400 100 500 250 L 500 800"
      stroke="var(--crimson)" strokeWidth="1" fill="none" opacity="0.6" />
    {/* Voynich leaf medallions on ring */}
    {Array.from({ length: 12 }, (_, i) => i * 30).map((a, i) => {
      const x = 400 + 260 * Math.cos(a * Math.PI / 180);
      const y = 400 + 260 * Math.sin(a * Math.PI / 180);
      return <ellipse key={i} cx={x} cy={y} rx="20" ry="10"
        stroke="var(--gold)" strokeWidth="0.5" fill="none"
        transform={`rotate(${a}, ${x}, ${y})`} className="ring-slow" />;
    })}
    {/* Codex cross-pattern at center */}
    <line x1="320" y1="400" x2="480" y2="400" stroke="var(--crimson)" strokeWidth="0.8" />
    <line x1="400" y1="320" x2="400" y2="480" stroke="var(--crimson)" strokeWidth="0.8" />
    <circle cx="400" cy="400" r="10" stroke="var(--gold)" strokeWidth="1" />
    <circle cx="400" cy="400" r="4" fill="var(--gold-glow)" />
  </svg>
);


/* ── Alchemical Symbols (Voynich/Codex inspired) ─────────── */
export const ManuscriptSymbols = ({ active = false }: { active?: boolean }) => {
  if (!active) return null;
  
  const symbols = [
    <circle key="1" cx="12" cy="12" r="9" stroke="currentColor" fill="none" strokeWidth="1" />, // Void Circle
    <path key="2" d="M12 3 L21 19 L3 19 Z" stroke="currentColor" fill="none" strokeWidth="1" />, // Triangle
    <path key="3" d="M12 4 L12 20 M4 12 L20 12" stroke="currentColor" strokeWidth="1.5" />, // Cross
    <path key="4" d="M12 4 Q18 12 12 20 Q6 12 12 4" stroke="currentColor" fill="none" strokeWidth="1.5" />, // Leaf/Flame
    <path key="5" d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1" />, // X mark
    <circle key="6" cx="12" cy="12" r="3" fill="currentColor" />, // Dot
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 14 }).map((_, i) => (
        <div 
          key={i}
          className="symbol-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: '100%',
            animationDelay: `${Math.random() * 2.5}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
            color: Math.random() > 0.5 ? 'var(--gold)' : 'var(--crimson)'
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" className="opacity-60">
            {symbols[i % symbols.length]}
          </svg>
        </div>
      ))}
    </div>
  );
};

/* ── Glyph Avatar (Voynich-cipher style identity) ─────────── */
export const GlyphAvatar = ({ n = 0 }: { n?: number }) => {
  const glyphs = ["ꞩ","ꝏ","ꞛ","Ꞙ","Ꟈ","ꞵ","ꝝ","ᛟ","ᚠ","ᚦ","ᚨ"];
  return (
    <span style={{
      fontFamily:"var(--font-unifraktur)",
      fontSize:24, color:"var(--crimson)",
      opacity:.8, lineHeight:1
    }}>{glyphs[n % glyphs.length]}</span>
  );
};

/* ── Ornamental divider (Codex Gigas section mark) ────────── */
export const OrnDivider = () => (
  <div className="cod-divider">
    <div className="cod-line" />
    <div className="cod-center">✦ ✦ ✦</div>
    <div className="cod-line" />
  </div>
);
