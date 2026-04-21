import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-purple-50 py-20 pb-32 md:pb-20 mt-auto relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-[100px] opacity-50 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-[100px] opacity-50 translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="font-playfair font-black text-3xl tracking-tighter group">
              <span className="gradient-text-animate">Purple</span>
              <span className="text-[#1F1235]">Girl</span>
            </Link>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              The safe house where every girl finds her voice. Anonymous, judgment-free, and always here for you when you can&apos;t ask anyone else.
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
            <ul className="space-y-4">
              <li><Link href="/category/beauty-skincare" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Glow & Care</Link></li>
              <li><Link href="/category/relationships" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Heart & Soul</Link></li>
              <li><Link href="/category/career-money" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Ambition & Growth</Link></li>
              <li><Link href="/category/mental-wellness" className="text-gray-500 hover:text-purple-600 transition-colors font-medium">Mind Matters</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-purple-50 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} PurpleGirl.in • Made with 💜 for every girl.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-purple-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Pinterest</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Threads</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
