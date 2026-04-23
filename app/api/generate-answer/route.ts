import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { questionId, customContext } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // 1. Fetch question from DB
    const { data: question, error: fetchError } = await supabaseAdmin
      .from('questions')
      .select('*, categories(name)')
      .eq('id', questionId)
      .single();

    if (fetchError || !question) {
      console.error('Error fetching question:', fetchError);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const prompt = `
You are "PurpleGirl" — a warm, empathetic, culturally-aware elder sister for Indian women.

Topic: ${question.categories?.name || 'General'}
Question: "${question.title}"
Context: ${question.description || 'None.'}
${customContext || ''}

Return ONLY valid JSON (no markdown, no extra text):
{
  "chat_bubbles": [
    "Bubble 1: Pure emotional validation — make her feel understood and completely safe (2-3 warm sentences)",
    "Bubble 2: Practical step-by-step guidance specific to Indian women (3-4 sentences)",
    "Bubble 3: Warm encouragement or follow-up question (1-2 sentences)"
  ],
  "summary": "2 clear sentences directly answering the question — written for Google featured snippets",
  "bullet_points": [
    "Specific actionable tip 1 — India-relevant",
    "Specific actionable tip 2 — India-relevant",
    "Specific actionable tip 3 — India-relevant",
    "Specific actionable tip 4 — India-relevant",
    "Specific actionable tip 5 — India-relevant"
  ],
  "faqs": [
    {"q": "Exact question Indian women Google about this topic", "a": "Direct 2-sentence answer"},
    {"q": "Second common follow-up question women search", "a": "Direct 2-sentence answer"},
    {"q": "Third related question women search", "a": "Direct 2-sentence answer"}
  ],
  "disclaimer": "ONLY for health/medical/legal topics: one sentence advising professional consultation. Return null for all other topics.",
  "product_keywords": ["specific product type 1", "specific product type 2"]
}
`;

    // 2. Generate answer with Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      throw new Error(`Groq API failed: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.choices[0]?.message?.content;
    
    if (!responseText) throw new Error('No response from AI');
    
    const answerData = JSON.parse(responseText);

    // Mock API for Cuelinks/Affiliate links based on keywords
    let affiliatedProducts = [];
    if (answerData.product_keywords && answerData.product_keywords.length > 0) {
      affiliatedProducts = answerData.product_keywords.map((kw: string) => ({
        title: `Top Rated ${kw.charAt(0).toUpperCase() + kw.slice(1)}`,
        link: `https://amazon.in/s?k=${encodeURIComponent(kw)}`,
        price: 'Featured',
        image: `https://picsum.photos/seed/${encodeURIComponent(kw)}/200/200`
      }));
    }

    // 3. Save answer to DB
    const { data: savedAnswer, error: saveError } = await supabaseAdmin
      .from('answers')
      .insert({
        question_id: question.id,
        chat_log: answerData.chat_bubbles || [],
        summary: answerData.summary || null,
        bullet_points: answerData.bullet_points || [],
        faqs: answerData.faqs || [],
        disclaimer: answerData.disclaimer || null,
        products: affiliatedProducts.length > 0 ? affiliatedProducts : null,
        ai_model: 'llama-3.3-70b-versatile',
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving answer:', saveError);
      return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
    }

    // 4. Update question status to approved
    await supabaseAdmin
      .from('questions')
      .update({ status: 'approved' })
      .eq('id', question.id);

    return NextResponse.json({ success: true, answerId: savedAnswer.id });

  } catch (error: any) {
    console.error('AI Generation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
