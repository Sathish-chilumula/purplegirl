import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Use RPC to atomically increment the metoo_count if possible, or do a read then update.
    // Assuming there's no atomic increment RPC we will just execute a raw query or read-modify-write via supabaseAdmin.
    // But since the requirement states: Use supabaseAdmin to run: UPDATE questions SET metoo_count = metoo_count + 1 WHERE id = questionId
    // Supabase JS doesn't support raw queries directly via the client without an RPC, so we will use the `rpc` function if it exists,
    // otherwise we will read the current count and increment it.
    
    // For an exact match with the requirement "UPDATE questions SET metoo_count = metoo_count + 1 WHERE id = questionId":
    // The standard way in Supabase client is to read then update, or use a Postgres function.
    // We'll read, increment and update.

    const { data: question, error: fetchError } = await supabaseAdmin
      .from('questions')
      .select('metoo_count')
      .eq('id', questionId)
      .single();

    if (fetchError || !question) {
      console.error('Error fetching question:', fetchError);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const newCount = (question.metoo_count || 0) + 1;

    const { error: updateError } = await supabaseAdmin
      .from('questions')
      .update({ metoo_count: newCount })
      .eq('id', questionId);

    if (updateError) {
      console.error('Error updating me too count:', updateError);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true, newCount });

  } catch (error: any) {
    console.error('MeToo Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
