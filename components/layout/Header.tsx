'use client';

import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-20 flex items-center justify-between px-6 md:px-12 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
          <span className="font-syne font-bold text-xl">P</span>
        </div>
        <span className="font-syne font-extrabold text-2xl tracking-tighter text-slate-900">
          PurpleGirl<span className="text-purple-600">.</span>
        </span>
      </Link>
      
      <nav className="hidden md:flex items-center gap-10">
        <Link href="/category/beauty-skincare" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">Beauty</Link>
        <Link href="/category/fashion-style" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">Fashion</Link>
        <Link href="/category/relationships-love" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">Love</Link>
        <Link href="/ask" className="btn-premium py-2 px-6 text-sm">Ask Anything</Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-purple-600 transition-colors hidden sm:block">
          <Search size={20} />
        </button>
        <button className="md:hidden p-2 text-slate-900">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
