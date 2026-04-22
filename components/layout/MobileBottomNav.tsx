"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Search, User, EyeOff } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Discover', href: '/search', icon: Search },
    { name: 'Ask Now', href: '/ask', icon: PlusCircle, highlight: true },
    { name: 'Whisper', href: '/whisper', icon: EyeOff },
    { name: 'My Profile', href: '/journey', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 glass border-t border-purple-100/50 flex items-center justify-around z-[100] md:hidden pb-safe px-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.name}
            href={item.href} 
            className={`flex flex-col items-center justify-center transition-all relative ${
              isActive ? 'text-purple-600' : 'text-gray-400'
            } ${item.highlight ? 'scale-110 -translate-y-1' : ''}`}
          >
            <div className={`p-2 rounded-2xl transition-all ${
              isActive ? 'bg-purple-100/50' : ''
            } ${item.highlight ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200' : ''}`}>
              <Icon className={`${item.highlight ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            {!item.highlight && (
              <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.name}
              </span>
            )}
            {isActive && !item.highlight && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-600" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
