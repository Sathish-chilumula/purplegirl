import Link from 'next/link';
import { Search } from 'lucide-react';
import LiveSearch from '../search/LiveSearch';
import AuthButton from '../auth/AuthButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF5FF]/80 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-playfair font-bold text-2xl text-purple-primary tracking-tight">PurpleGirl</span>
        </Link>
        
        {/* Desktop Search */}
        <LiveSearch variant="header" placeholder="Search the vault..." />
        
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link href="/search" className="p-2 text-text-secondary hover:text-purple-primary transition-colors md:hidden">
            <Search className="w-5 h-5" />
          </Link>
          
          <AuthButton />

          <Link 
            href="/ask" 
            className="hidden sm:inline-flex bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-4 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    </header>
  );
}
