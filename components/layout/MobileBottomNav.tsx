import Link from 'next/link';
import { Home, PlusCircle, Share2 } from 'lucide-react';

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-purple-100 flex items-center justify-around z-50 md:hidden pb-safe">
      <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-purple-primary">
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Home</span>
      </Link>
      
      <Link href="/ask" className="flex flex-col items-center justify-center w-full h-full text-text-secondary hover:text-purple-primary">
        <PlusCircle className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Ask</span>
      </Link>
      
      <button className="flex flex-col items-center justify-center w-full h-full text-text-secondary hover:text-purple-primary">
        <Share2 className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Share</span>
      </button>
    </div>
  );
}
