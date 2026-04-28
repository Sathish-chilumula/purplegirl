"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Search, EyeOff } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'The Codex', href: '/', icon: Home },
    { name: 'The Vault', href: '/search', icon: Search },
    { name: 'The Oracle', href: '#ask', icon: PlusCircle, highlight: true },
    { name: 'Whisper', href: '/whisper', icon: EyeOff },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[rgba(10,6,20,0.98)] backdrop-blur-2xl border-t border-[rgba(201,168,76,0.12)] flex items-center justify-around z-[100] md:hidden pb-safe px-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.name}
            href={item.href} 
            className={`flex flex-col items-center justify-center transition-all relative ${
              isActive ? 'text-[var(--crimson-hi)]' : 'text-[var(--parch-dim)]'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all ${
              item.highlight ? 'bg-gradient-to-br from-[var(--crimson)] to-[var(--crimson-hi)] text-[var(--parch)] shadow-lg shadow-[rgba(140,26,26,0.3)] scale-110 -translate-y-2' : ''
            }`}>
              <Icon className={`${item.highlight ? 'w-6 h-6' : 'w-5 h-5'}`} />
            </div>
            {!item.highlight && (
              <span className={`text-[10px] font-bold mt-1 tracking-[1px] font-cinzel ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.name.toUpperCase()}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
