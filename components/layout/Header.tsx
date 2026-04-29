'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#categories', label: 'Categories' },
  { href: '/#quizzes', label: 'Quizzes' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-pg-gray-100">
      <div className="max-w-content mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-pg-rose flex items-center justify-center shadow-lg shadow-pg-rose/20 text-white font-display font-black text-xl italic">
            P
          </div>
          <span className="font-display font-black text-2xl text-pg-gray-900 tracking-tight">
            PurpleGirl<span className="text-pg-rose">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                pathname === href 
                  ? 'bg-pg-rose-light text-pg-rose' 
                  : 'text-pg-gray-500 hover:text-pg-rose hover:bg-pg-gray-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="hidden sm:flex p-2 text-pg-gray-400 hover:text-pg-rose transition-colors">
            <Search size={20} />
          </button>
          <Link href="/ask" className="hidden md:block">
            <Button variant="primary" className="py-2 px-6 text-sm shadow-sm">
              Ask Anonymously
            </Button>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-pg-gray-900"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-pg-gray-100 p-6 flex flex-col gap-2 shadow-xl fade-in">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                pathname === href 
                  ? 'bg-pg-rose-light text-pg-rose' 
                  : 'text-pg-gray-700 active:bg-pg-gray-100'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-pg-gray-100">
            <Link href="/ask" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" className="w-full py-4 text-lg">
                Ask Anonymously
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
