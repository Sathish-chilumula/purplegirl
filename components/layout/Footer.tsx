import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Top Section - Aurora Gradient Band */}
      <div className="aurora-bg py-16 px-4 relative z-10 border-t border-purple-100 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-playfair font-bold text-4xl text-[#1F1235] tracking-tight">
            Still have <span className="gradient-text-animate">questions?</span>
          </h2>
          <p className="text-gray-600 text-lg">Your sister is always here. Anonymous, always.</p>
          <div className="pt-4">
            <Link 
              href="/ask" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-purple-300 transition-all hover:scale-105"
            >
              Ask Anything <span className="text-xl">→</span>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 pt-4 flex-wrap">
            <span className="flex items-center gap-1.5"><span>🔒</span> Zero data stored</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5"><span>💜</span> Zero judgment</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5"><span>⚡</span> Zero login</span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Standard Footer Links */}
      <div className="bg-white py-16 pb-32 md:pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02] -ml-1">
                <span className="text-3xl filter drop-shadow-sm group-hover:drop-shadow-md transition-all">💜</span>
                <div className="flex flex-col -gap-1">
                  <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent font-serif leading-tight">
                    PurpleGirl
                  </span>
                  <span className="text-[10px] md:text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em] -mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    Answers for Women
                  </span>
                </div>
              </Link>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                The safe house where every girl finds her voice.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-purple-400">
                <span className="w-10 h-px bg-purple-100" />
                Empowering Indian Women
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-playfair font-bold text-[#1F1235] text-xl">Guidance</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Our Mission</Link></li>
                <li><Link href="/privacy" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Privacy First</Link></li>
                <li><Link href="/terms" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Service Terms</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Talk to Us</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-playfair font-bold text-[#1F1235] text-xl">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/category/beauty-skincare" className="pill-badge bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100 transition-colors">Glow & Care</Link>
                <Link href="/category/relationships" className="pill-badge bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 transition-colors">Heart & Soul</Link>
                <Link href="/category/career-money" className="pill-badge bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors">Ambition & Growth</Link>
                <Link href="/category/mental-wellness" className="pill-badge bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors">Mind Matters</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} PurpleGirl.in • Made with 💜 for every girl.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm">PT</a>
              <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">TH</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
