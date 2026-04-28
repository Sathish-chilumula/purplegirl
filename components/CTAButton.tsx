'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        background: 'white', color: 'var(--purple-mid)',
        padding: '1rem 2.5rem', borderRadius: '9999px',
        fontFamily: 'var(--font-accent)', fontWeight: 800, fontSize: '0.9rem',
        letterSpacing: '0.05em', textTransform: 'uppercase',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05) translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 50px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
      }}
    >
      {children}
    </Link>
  );
}
