// app/[lang]/how-to/[slug]/opengraph-image.tsx
// Dynamically generates a WhatsApp/social-ready OG image for every article.
// Uses Next.js built-in ImageResponse (no external deps needed).

import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';
export const alt = 'PurpleGirl Article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function ArticleOGImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug, lang } = await params;

  // Fetch the article from Supabase
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('title, meta_description, intro, category')
    .eq('slug', slug)
    .single();

  const title = article?.title || 'PurpleGirl — Advice for Indian Women';
  const desc = article?.meta_description || article?.intro || 'Honest advice for women who can\'t ask anyone else.';
  const category = (article?.category || 'advice').replace(/-/g, ' ').toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #581C87 0%, #7C3AED 50%, #9333EA 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          left: '60%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        
        {/* Top: Logo + category pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 900,
            letterSpacing: '-1px',
          }}>
            💜 PurpleGirl
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '100px',
            padding: '8px 20px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '2px',
          }}>
            {category}
          </div>
        </div>

        {/* Middle: Article title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          <div style={{
            color: 'white',
            fontSize: title.length > 60 ? '44px' : '52px',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}>
            {title}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '22px',
            lineHeight: 1.5,
            maxWidth: '800px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
          }}>
            {desc.substring(0, 120)}...
          </div>
        </div>

        {/* Bottom: Tagline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '18px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#F9A8D4',
          }} />
          100% Anonymous • No Judgment • purplegirl.in
        </div>
      </div>
    ),
    { ...size }
  );
}
