// app/[lang]/category/[slug]/opengraph-image.tsx
// Dynamically generates OG images for category pages.

import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';
export const alt = 'PurpleGirl Category';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function CategoryOGImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;

  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('name, description, icon_emoji')
    .eq('slug', slug)
    .single();

  const name = category?.name || 'PurpleGirl';
  const desc = category?.description || 'Honest advice for Indian women.';
  const emoji = category?.icon_emoji || '💜';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #1C0533 0%, #3B0764 50%, #581C87 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top brand */}
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', fontWeight: 700 }}>
          💜 PurpleGirl
        </div>

        {/* Middle: emoji + category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '96px', lineHeight: 1 }}>{emoji}</div>
          <div style={{
            color: 'white',
            fontSize: '64px',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-2px',
          }}>
            {name}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '24px',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}>
            {desc.substring(0, 100)}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
          Guides & Advice • purplegirl.in
        </div>
      </div>
    ),
    { ...size }
  );
}
