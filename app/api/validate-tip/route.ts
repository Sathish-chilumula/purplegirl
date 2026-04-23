import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { answerId, tipIndex, vote, tipText } = await req.json();

    if (!answerId || tipIndex === undefined || !vote || !tipText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (vote !== 'yes' && vote !== 'no') {
      return NextResponse.json({ error: 'Invalid vote' }, { status: 400 });
    }

    // Fetch the current answer
    const { data: answer, error: fetchError } = await supabaseAdmin
      .from('answers')
      .select('helpful_yes, helpful_no, helpful_tips')
      .eq('id', answerId)
      .single();

    if (fetchError || !answer) {
      console.error('Error fetching answer:', fetchError);
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    let helpfulTips = answer.helpful_tips || [];
    
    // Ensure the array has enough elements
    while (helpfulTips.length <= tipIndex) {
      helpfulTips.push({ tip: '', yes: 0, no: 0 });
    }

    // Update the specific tip
    helpfulTips[tipIndex] = {
      tip: tipText,
      yes: (helpfulTips[tipIndex].yes || 0) + (vote === 'yes' ? 1 : 0),
      no: (helpfulTips[tipIndex].no || 0) + (vote === 'no' ? 1 : 0),
    };

    // Calculate totals
    const totalYes = answer.helpful_yes + (vote === 'yes' ? 1 : 0);
    const totalNo = answer.helpful_no + (vote === 'no' ? 1 : 0);

    // Update the answer in the database
    const { error: updateError } = await supabaseAdmin
      .from('answers')
      .update({
        helpful_yes: totalYes,
        helpful_no: totalNo,
        helpful_tips: helpfulTips
      })
      .eq('id', answerId);

    if (updateError) {
      console.error('Error updating answer:', updateError);
      throw updateError;
    }

    return NextResponse.json({ success: true, updatedTips: helpfulTips });
  } catch (error: any) {
    console.error('Validate tip error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
