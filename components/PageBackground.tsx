'use client';

import React from 'react';

export function PageBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
      {/* Dynamic Mesh Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/40 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-100/40 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/30 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4c1d95 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}
