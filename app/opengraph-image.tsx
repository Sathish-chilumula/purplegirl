// app/opengraph-image.tsx
// Default OG image for the homepage and any page that doesn't have a custom one.

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'PurpleGirl — Advice for Indian Women';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function HomeOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(145deg, #FFF1F2 0%, #FCE7F3 40%, #F3E8FF 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '-60px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(88, 28, 135, 0.08)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(225, 164, 155, 0.15)',
        }} />

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 80px',
        }}>
          {/* Brand */}
          <div style={{
            background: '#581C87',
            borderRadius: '100px',
            padding: '12px 28px',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '1px',
          }}>
            💜 PurpleGirl
          </div>

          {/* Headline */}
          <div style={{
            color: '#1F2937',
            fontSize: '64px',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            maxWidth: '900px',
          }}>
            Honest Advice for Indian Women.
          </div>

          {/* Subtext */}
          <div style={{
            color: '#6B7280',
            fontSize: '26px',
            lineHeight: 1.5,
            maxWidth: '700px',
          }}>
            How-To guides on relationships, health, career & more.
            100% anonymous. No login required.
          </div>

          {/* Pill row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {['Relationships', 'Health', 'Career', 'Family', 'Skin'].map((tag) => (
              <div key={tag} style={{
                background: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '100px',
                padding: '8px 20px',
                color: '#374151',
                fontSize: '18px',
                fontWeight: 600,
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
