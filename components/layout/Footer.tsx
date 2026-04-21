import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-purple-100 py-12 pb-24 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="font-playfair font-bold text-2xl text-purple-primary tracking-tight">PurpleGirl</Link>
          <p className="mt-4 text-text-secondary max-w-sm">
            Ask anything you can&apos;t ask anyone. An anonymous, judgment-free space for Indian women and girls to find answers.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-text-primary mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><Link href="/privacy" className="text-text-secondary hover:text-purple-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/disclaimer" className="text-text-secondary hover:text-purple-primary transition-colors">Disclaimer</Link></li>
            <li><Link href="/contact" className="text-text-secondary hover:text-purple-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-text-primary mb-4">Categories</h3>
          <ul className="space-y-3">
            <li><Link href="/category/beauty-skincare" className="text-text-secondary hover:text-purple-primary transition-colors">Beauty & Skincare</Link></li>
            <li><Link href="/category/relationships" className="text-text-secondary hover:text-purple-primary transition-colors">Relationships</Link></li>
            <li><Link href="/category/career-money" className="text-text-secondary hover:text-purple-primary transition-colors">Career & Money</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-purple-50 text-center text-text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} PurpleGirl.in - All rights reserved.</p>
      </div>
    </footer>
  );
}
