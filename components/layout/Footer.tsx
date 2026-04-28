import Link from 'next/link';

const categories = [
  { href: '/category/beauty-skincare',    label: 'Beauty & Skincare' },
  { href: '/category/fashion-style',      label: 'Fashion & Style' },
  { href: '/category/haircare',           label: 'Haircare' },
  { href: '/category/relationships-love', label: 'Relationships & Love' },
  { href: '/category/mental-wellness',    label: 'Mental Wellness' },
  { href: '/category/health-basics',      label: 'Health Basics' },
];

const support = [
  { href: '/ask',     label: 'Ask a Question' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms of Use' },
  { href: '/about',   label: 'About PurpleGirl' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--ink)',
        color: 'rgba(255,255,255,0.55)',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'var(--grad-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'white',
                }}
              >
                P
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: '1.3rem', color: 'white', letterSpacing: '-0.03em',
                }}
              >
                PurpleGirl<span style={{ color: 'var(--purple-soft)' }}>.</span>
              </span>
            </Link>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.75, maxWidth: '26rem', marginBottom: '1.5rem' }}>
              India's anonymous elder sister platform. A safe, judgment-free space where girls ask what they can't ask anywhere else — and get real, kind answers.
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Anonymous', 'Encrypted', 'No Judgment'].map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '0.35rem 0.875rem', borderRadius: '9999px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <div
              style={{
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--purple-soft)', marginBottom: '1.25rem',
              }}
            >
              Topics
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {categories.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <div
              style={{
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--purple-soft)', marginBottom: '1.25rem',
              }}
            >
              Help & Legal
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {support.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '2rem' }} />

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem',
            justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} PurpleGirl.in — All Rights Reserved.
          </p>
          <p style={{ fontSize: '0.8rem', margin: 0 }}>
            Made with{' '}
            <span style={{ color: 'var(--pink-hot)' }}>♥</span>
            {' '}for sisters everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
