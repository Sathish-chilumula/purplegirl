import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();

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
      You are "PurpleGirl", an extremely smart, empathetic, and culturally-aware elder sister and personal AI life assistant for young women in India.
      The user is coming to you for personal advice, NOT for a blog article.
      
      Topic: ${question.categories?.name || 'General'}
      User's Message: "${question.title}"
      Context: ${question.description || 'None provided.'}

      Your task is to generate a conversational response exactly as if you are texting her back on a messaging app (like WhatsApp/iMessage).
      Your response should be broken down into individual "chat bubbles" so it feels like a real-time conversation.
      
      Follow this cadence:
      1. Bubble 1: Pure emotional reassurance. Make her feel completely understood, safe, and validated.
      2. Bubble 2: Practical, actionable, step-by-step guidance.
      3. Bubble 3 (Optional): Ask a warm follow-up question to keep the conversation going.

      If her message is related to Fashion, Beauty, or Lifestyle, you can suggest related item types in the 'product_keywords' field. Our backend will swap these with real affiliate links.

      Return ONLY this exact JSON schema:
      {
        "chat_bubbles": [
          "Oh honey, I am so sorry you're feeling this way right now. Take a deep breath, you are not alone in this.",
          "Here is what I think we should do next. First...",
          "How does that sound to you?"
        ],
        "product_keywords": ["cleanser", "moisturizer"] // array of strings (leave empty if not applicable)
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
        title: \`Top Rated \${kw.charAt(0).toUpperCase() + kw.slice(1)}\`,
        link: \`https://amazon.in/s?k=\${encodeURIComponent(kw)}\`,
        price: 'Featured',
        image: \`https://picsum.photos/seed/\${encodeURIComponent(kw)}/200/200\`
      }));
    }

    // 3. Save answer to DB
    const { data: savedAnswer, error: saveError } = await supabaseAdmin
      .from('answers')
      .insert({
        question_id: question.id,
        chat_log: answerData.chat_bubbles,
        products: affiliatedProducts.length > 0 ? affiliatedProducts : null,
        ai_model: 'llama3-70b-8192'
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
