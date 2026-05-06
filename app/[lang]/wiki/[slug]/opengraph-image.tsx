import { ImageResponse } from 'next/og';
import { getWikiTerm } from '@/lib/wiki-terms';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function WikiOGImage({ params }: Props) {
  const { slug } = await params;
  const term = getWikiTerm(slug);

  const title = term?.title ?? 'PurpleGirl Wiki';
  const category = term?.category ?? 'Guides for Indian Women';
  const emoji = term?.emoji ?? '📖';
  const shortDef = term?.shortDef ?? 'Honest advice for Indian women.';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #FFF1F2 0%, #F3E8FF 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background accent circle */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(233, 30, 140, 0.07)',
          }}
        />

        {/* Wiki badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F3E8FF',
            color: '#6B21A8',
            padding: '8px 16px',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 32,
            width: 'fit-content',
          }}
        >
          📖 PurpleGirl Wiki · {category}
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 72, marginBottom: 20 }}>{emoji}</div>

        {/* Title */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: '#1a1a2e',
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Short def */}
        <div
          style={{
            fontSize: 22,
            color: '#4b5563',
            lineHeight: 1.5,
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          {shortDef.length > 120 ? shortDef.substring(0, 120) + '…' : shortDef}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 60,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#E91E8C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              💜
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#E91E8C' }}>
              PurpleGirl.in
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#9ca3af',
              fontStyle: 'italic',
            }}
          >
            Honest advice for Indian women
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
