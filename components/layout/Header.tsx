'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Plus, EyeOff, X } from 'lucide-react';
import LiveSearch from '../search/LiveSearch';
import AuthButton from '../auth/AuthButton';

export default function Header() {
  const pathname = usePathname();
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    if (pathname === '/') {
      const dismissed = localStorage.getItem('purplegirl_announcement_dismissed');
      if (!dismissed) {
        setShowAnnouncement(true);
      }
    } else {
      setShowAnnouncement(false);
    }
  }, [pathname]);

  const dismissAnnouncement = () => {
    localStorage.setItem('purplegirl_announcement_dismissed', 'true');
    setShowAnnouncement(false);
  };

  return (
    <>
      {showAnnouncement && (
        <div className="aurora-bg py-2 px-4 flex items-center justify-center relative border-b border-purple-200">
          <p className="text-sm font-bold text-[#1F1235] text-center pr-8">
            💜 Ask anything — completely anonymous. No login needed.
          </p>
          <button 
            onClick={dismissAnnouncement}
            className="absolute right-4 text-purple-600 hover:text-purple-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Added subtle gradient border class via global css or tailwind border tricks */}
      <header className="sticky top-0 z-[100] glass backdrop-blur-xl border-b border-transparent [border-image:linear-gradient(to_right,transparent,rgba(124,58,237,0.2),rgba(236,72,153,0.2),transparent)_1]">
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
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 whitespace-nowrap animate-pulse [animation-duration:3s]"
            >
              <Plus className="w-4 h-4 hidden xs:block" />
              <span>Ask Sister</span>
              <span className="absolute -top-1 -right-1 text-base animate-sparkle" style={{ animationDuration: '4s' }}>✨</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
