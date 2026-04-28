'use client';

import React from 'react';

export function PageBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base parchment texture */}
      <div 
        className="absolute inset-0 opacity-[0.85] mix-blend-multiply" 
        style={{
          backgroundImage: 'url(/images/bg-parchment.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Subtle PurpleGirl identity glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,79,212,0.07)_0%,transparent_60%)] mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(90,48,160,0.08)_0%,transparent_50%)] mix-blend-multiply" />

      {/* Dark vignette for depth and contrast */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(15,10,5,0.4)]" />
    </div>
  );
}
