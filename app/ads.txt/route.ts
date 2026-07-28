import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const adsTxtContent = `google.com, pub-3809505002238691, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
