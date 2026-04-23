'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingAskButton() {
  const pathname = usePathname();

  // Do not show on the /ask page
  if (pathname === '/ask') {
    return null;
  }

  return (
    <Link 
      href="/ask"
      className="fixed bottom-28 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xl shadow-purple-500/40 rounded-full px-5 py-4 hover:scale-105 hover:shadow-2xl transition-all animate-heartbeat"
    >
      <span className="text-xl">💜</span>
      <span className="font-bold text-sm hidden md:inline">Ask Sister</span>
    </Link>
  );
}
