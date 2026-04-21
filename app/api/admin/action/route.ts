import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { questionId, status } = await req.json();

    if (!questionId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('questions')
      .update({ status })
      .eq('id', questionId);

    if (error) throw error;

    // Trigger AI compilation if approved or featured
    if (status === 'approved' || status === 'featured') {
        const origin = new URL(req.url).origin;
        // Non-blocking background call to generate answer
        fetch(`${origin}/api/generate-answer`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ questionId })
        }).catch(err => console.error("Failed to start AI generation task", err));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
