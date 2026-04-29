import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

const DIDI_PROMPT = `You are a trusted older sister (didi) for an Indian woman. 
She is asking a private, painful question anonymously because she has no one else to ask.
- Tone: Warm, non-judgmental, kind, never preachy.
- Style: Simple English (Class 8 level). Use occasional Indian context (mil, joint family) naturally if relevant.
- Structure: Start by acknowledging her pain so she feels seen. Then give 3 practical, actionable steps. End with a supportive sentence.
Limit your answer to 150-200 words.`;

export async function POST(req: Request) {
  try {
    const { question, category } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Attempt Groq API first
    let aiAnswer = '';
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: DIDI_PROMPT },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!groqResponse.ok) throw new Error('Groq failed');
      const data = await groqResponse.json();
      aiAnswer = data.choices[0].message.content;
    } catch (e) {
      console.warn('Groq failed, falling back to Gemini Flash 2.5 Lite', e);
      
      // Fallback to Gemini API
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: DIDI_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: question }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
        })
      });

      if (!geminiResponse.ok) throw new Error('Gemini fallback failed');
      const data = await geminiResponse.json();
      aiAnswer = data.candidates[0].content.parts[0].text;
    }

    // Save to Supabase (is_published defaults to false for safety review)
    const { error: dbError } = await supabaseAdmin
      .from('questions')
      .insert([
        {
          question_text: question,
          category: category || 'general',
          ai_answer: aiAnswer
        }
      ]);

    if (dbError) {
      console.error('DB Insert Error:', dbError);
      // We still return the answer to the user even if DB fails
    }

    return NextResponse.json({ answer: aiAnswer });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
