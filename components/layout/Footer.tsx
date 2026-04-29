'use client';

import Link from 'next/link';
import { Heart, ShieldCheck } from 'lucide-react';

const support = [
  { href: '/ask', label: 'Ask a Question' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/about', label: 'About PurpleGirl' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-pg-plum text-pg-plum-light/60 py-16 px-6 border-t border-pg-plum-light/10">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-pg-rose flex items-center justify-center text-white font-display font-black italic">
                P
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                PurpleGirl<span className="text-pg-rose">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              India's anonymous elder sister platform. A safe, judgment-free space where 
              women ask what they can't ask anywhere else — and get real, kind answers.
            </p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs leading-relaxed">
              <strong className="text-white block mb-1">Disclaimer:</strong>
              The content on PurpleGirl.in is for informational and educational purposes only. 
              It does not substitute professional medical, legal, or psychological advice. 
              Always consult a qualified professional for your specific situation.
            </div>
          </div>

          {/* Legal / Support */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Help & Legal</h4>
            <ul className="space-y-4">
              {support.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-pg-rose transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs">
            © {new Date().getFullYear()} PurpleGirl.in — All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck size={14} className="text-pg-success" />
            100% Anonymous & Secure
          </div>
          <div className="flex items-center gap-1 text-xs">
            Made with <Heart size={14} className="text-pg-rose fill-pg-rose mx-1" /> for sisters everywhere.
          </div>
        </div>
      </div>
    </footer>
  );
}
