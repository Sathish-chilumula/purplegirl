import Link from 'next/link';
import { Search, Plus, EyeOff } from 'lucide-react';
import LiveSearch from '../search/LiveSearch';
import AuthButton from '../auth/AuthButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] glass border-b border-purple-100/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0 group transition-transform active:scale-95">
          <span className="font-playfair font-black text-2xl tracking-tighter transition-colors">
            <span className="gradient-text-animate">Purple</span>
            <span className="text-[#1F1235]">Girl</span>
          </span>
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        </Link>
        
        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-xl">
          <LiveSearch variant="header" placeholder="Find answers in the vault..." />
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/search" className="p-2.5 text-gray-400 hover:text-purple-600 transition-all md:hidden rounded-xl bg-purple-50/50 border border-purple-100/50">
            <Search className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/whisper" 
            className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-medium text-sm mr-4"
          >
            <EyeOff className="w-4 h-4" />
            <span>Whisper</span>
          </Link>

          <div className="hidden sm:block">
            <AuthButton />
          </div>

          <Link 
            href="/ask" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 hidden xs:block" />
            <span>Ask Sister</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
