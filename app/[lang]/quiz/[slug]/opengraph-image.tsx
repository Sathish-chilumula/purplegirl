import { ImageResponse } from 'next/og';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

async function getQuiz(slug: string) {
  const { data } = await supabaseAdmin
    .from('quizzes')
    .select('title, description, category, thumbnail_emoji')
    .eq('slug', slug)
    .single();
  return data;
}

export default async function QuizOGImage({ params }: Props) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  const title = quiz?.title ?? 'Take a Quiz on PurpleGirl';
  const description = quiz?.description ?? 'Honest quizzes for Indian women.';
  const category = quiz?.category?.replace(/-/g, ' ') ?? 'PurpleGirl Quiz';
  const emoji = quiz?.thumbnail_emoji ?? '✨';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #6B21A8 0%, #4a0070 100%)',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(233,30,140,0.25)',
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 36,
            width: 'fit-content',
          }}
        >
          ✨ PurpleGirl Quiz · {category}
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 80, marginBottom: 24 }}>{emoji}</div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 880,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.5,
            maxWidth: 760,
            marginBottom: 40,
          }}
        >
          {description.length > 110 ? description.substring(0, 110) + '…' : description}
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#E91E8C',
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: 100,
            fontSize: 18,
            fontWeight: 800,
            width: 'fit-content',
          }}
        >
          Take this quiz →
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#E91E8C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            💜
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
            PurpleGirl.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
