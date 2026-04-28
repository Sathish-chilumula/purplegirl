'use client';

import React from 'react';

export function PageBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ background: 'var(--surface)' }}>
      {/* Main gradient glow from top */}
      <div
        className="orb"
        style={{
          width: '70vw', height: '60vh',
          top: '-20vh', left: '15%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)',
          animationDuration: '12s',
        }}
      />
      {/* Pink accent bottom right */}
      <div
        className="orb"
        style={{
          width: '50vw', height: '50vh',
          bottom: '-10vh', right: '-10vw',
          background: 'radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 70%)',
          animationDuration: '10s',
          animationDelay: '-3s',
        }}
      />
      {/* Soft purple left middle */}
      <div
        className="orb"
        style={{
          width: '35vw', height: '35vh',
          top: '40vh', left: '-5vw',
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.06) 0%, transparent 70%)',
          animationDuration: '14s',
          animationDelay: '-6s',
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
