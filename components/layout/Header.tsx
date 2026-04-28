'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-6 md:px-9 h-[60px] flex items-center justify-between bg-pg-parch-50/90 backdrop-blur-md border-b border-pg-crimson-600/10">
      {/* Top ornamental line (part of the header) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pg-crimson-600 to-transparent opacity-70" />

      <Link href="/" className="flex items-center gap-3 font-cinzel text-lg font-black tracking-[0.25em] text-pg-ink-900 uppercase">
        <div className="w-2.5 h-2.5 rounded-full bg-pg-crimson-600 seal-pulse" />
        PURPLEGIRL
      </Link>
      
      <nav className="hidden md:flex gap-8 font-cinzel text-[10px] tracking-[0.25em] text-pg-ink-600 font-semibold items-center">
        <Link href="#whisper" className="hover:text-pg-crimson-600 underline-draw pb-1">WHISPER</Link>
        <Link href="#volumes" className="hover:text-pg-crimson-600 underline-draw pb-1">VOLUMES</Link>
        <Link href="#cipher" className="hover:text-pg-crimson-600 underline-draw pb-1">THE CIPHER</Link>
        <Link href="#sisterhood" className="hover:text-pg-crimson-600 underline-draw pb-1">SISTERHOOD</Link>
        <div className="ml-4 font-cinzel text-[9px] tracking-widest text-pg-crimson-600 border border-pg-crimson-600/30 bg-pg-crimson-600/5 px-3 py-1.5 rounded-[1px]">
          ARCHIVE
        </div>
      </nav>
    </header>
  );
}
