import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('subscribers')
      .insert([{ email, source: 'homepage_newsletter' }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'You are already subscribed! 💜' }, { status: 200 });
      }
      console.error('Subscription error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Welcome to the sisterhood! We have added you to our weekly digest. 💜' });

  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
