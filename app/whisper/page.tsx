import React from 'react';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import CrisisBanner from '@/components/whisper/CrisisBanner';
import WhisperChat from '@/components/whisper/WhisperChat';

export const metadata: Metadata = {
  title: `Whisper Mode | ${SITE_NAME}`,
  description: 'A private, zero-log space for sensitive questions.',
  robots: 'noindex, nofollow', // Critical for Whisper mode
};

export default function WhisperPage() {
  return (
    <div className="min-h-screen bg-[#110A14] flex flex-col">
      <CrisisBanner />
      
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-200 leading-none">Whisper Mode</h1>
            <p className="text-xs text-purple-400/70 mt-1">End-to-End Ephemeral</p>
          </div>
        </div>
        <a href="/" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5">
          Exit Space
        </a>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        {/* Subtle dark ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <WhisperChat />
      </main>
    </div>
  );
}
