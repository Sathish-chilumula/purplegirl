import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 px-6 md:px-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold">P</div>
            <span className="font-syne font-extrabold text-2xl tracking-tighter text-white">
              PurpleGirl<span className="text-purple-500">.</span>
            </span>
          </Link>
          <p className="max-w-sm text-slate-500 leading-relaxed mb-8">
            Your anonymous digital confidante. A safe space for clear, kind, and judgment-free answers to the questions you can't ask anywhere else.
          </p>
          <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest">
            Made with <Heart size={14} className="fill-pink-500" /> for sisters everywhere.
          </div>
        </div>

        {/* Links: Categories */}
        <div>
          <h4 className="text-white font-syne font-bold mb-6 uppercase tracking-widest text-xs">Explore</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/category/beauty-skincare" className="hover:text-purple-400 transition-colors">Beauty & Skincare</Link></li>
            <li><Link href="/category/fashion-style" className="hover:text-purple-400 transition-colors">Fashion & Style</Link></li>
            <li><Link href="/category/relationships-love" className="hover:text-purple-400 transition-colors">Relationships</Link></li>
            <li><Link href="/category/mental-wellness" className="hover:text-purple-400 transition-colors">Wellness</Link></li>
          </ul>
        </div>

        {/* Links: Support */}
        <div>
          <h4 className="text-white font-syne font-bold mb-6 uppercase tracking-widest text-xs">Confidential</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/ask" className="hover:text-purple-400 transition-colors">Ask a Question</Link></li>
            <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Use</Link></li>
            <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Get in Touch</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
        <div>© {new Date().getFullYear()} PurpleGirl Insider. All Rights Reserved.</div>
        <div className="flex gap-8">
          <span>Encrypted</span>
          <span>Anonymous</span>
          <span>Safe</span>
        </div>
      </div>
    </footer>
  );
}
