import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'PurpleGirl Quiz';
    const result = searchParams.get('result') || 'Result Title';
    const emoji = searchParams.get('emoji') || '✨';
    const description = searchParams.get('desc') || 'I just took this quiz on PurpleGirl! Find out your result too.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FDF2F8', // pg-rose-light / bg-pg-cream
            backgroundImage: 'radial-gradient(circle at 25% 25%, #FCE4F3 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FCE4F3 0%, transparent 50%)',
            padding: '40px 60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: 40, left: 40, fontSize: 40, opacity: 0.2 }}>{emoji}</div>
          <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: 40, opacity: 0.2 }}>{emoji}</div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '32px',
              padding: '40px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '2px solid #FBCFE8',
              width: '100%',
              maxWidth: '900px',
            }}
          >
            <div style={{ fontSize: 80, marginBottom: 20 }}>{emoji}</div>
            
            <div style={{ 
              fontSize: 14, 
              fontWeight: 800, 
              color: '#9CA3AF', 
              textTransform: 'uppercase', 
              letterSpacing: '2px',
              marginBottom: 10 
            }}>
              YOUR RESULT
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#E91E8C', // pg-rose
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              {result}
            </div>

            <div
              style={{
                fontSize: 24,
                color: '#4B5563',
                textAlign: 'center',
                marginBottom: 40,
                lineHeight: 1.5,
                maxHeight: '120px',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px',
              marginTop: 'auto'
            }}>
              <div style={{ 
                backgroundColor: '#E91E8C', 
                color: 'white', 
                padding: '10px 24px', 
                borderRadius: '12px',
                fontSize: 18,
                fontWeight: 700
              }}>
                purplegirl.in
              </div>
              <div style={{ fontSize: 18, color: '#6B21A8', fontWeight: 600 }}>
                {title}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
