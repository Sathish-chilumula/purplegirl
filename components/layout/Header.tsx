'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/category/beauty-skincare',   label: 'Beauty' },
  { href: '/category/fashion-style',     label: 'Fashion' },
  { href: '/category/relationships-love',label: 'Love' },
  { href: '/category/mental-wellness',   label: 'Wellness' },
  { href: '/ask',                        label: 'Ask' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'var(--grad-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
              fontSize: '1.25rem', fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'white',
              transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(10deg) scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
          >
            P
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
            }}
          >
            PurpleGirl<span style={{ color: 'var(--purple-mid)' }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
          {navLinks.filter(l => l.label !== 'Ask').map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: pathname === href ? 'var(--purple-mid)' : 'var(--text-secondary)',
                background: pathname === href ? 'var(--purple-mist)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { if (pathname !== href) (e.currentTarget as HTMLElement).style.color = 'var(--purple-mid)'; }}
              onMouseLeave={(e) => { if (pathname !== href) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button
            style={{ padding: '0.5rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
            className="hidden sm:flex"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--purple-mid)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Search size={20} />
          </button>
          <Link
            href="/ask"
            className="hidden md:inline-flex btn-primary"
            style={{ padding: '0.625rem 1.5rem', fontSize: '0.85rem' }}
          >
            Ask Anything
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{ padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            padding: '1rem 1.5rem 2rem',
            borderTop: '1px solid var(--border-soft)',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
          className="md:hidden"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: pathname === href ? 'var(--purple-mid)' : 'var(--text-primary)',
                background: pathname === href ? 'var(--purple-mist)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
