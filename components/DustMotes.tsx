'use client';

import React, { useEffect, useState } from 'react';

export function DustMotes() {
  const [motes, setMotes] = useState<Array<{ id: number; top: string; left: string; delay: string; duration: string; size: string }>>([]);

  useEffect(() => {
    // Generate static motes on mount to avoid hydration mismatch
    const newMotes = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 20}s`,
      size: `${1 + Math.random() * 3}px`,
    }));
    setMotes(newMotes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-40">
      <style>{`
        @keyframes floatMote {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
      `}</style>
      {motes.map((mote) => (
        <div
          key={mote.id}
          className="absolute rounded-full bg-pg-gold-500"
          style={{
            top: mote.top,
            left: mote.left,
            width: mote.size,
            height: mote.size,
            animation: `floatMote ${mote.duration} ease-in-out infinite`,
            animationDelay: mote.delay,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}
