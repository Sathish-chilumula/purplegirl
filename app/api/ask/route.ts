import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

const DIDI_PROMPT = `You are a trusted older sister (didi) for an Indian woman. 
She is asking a private, painful question anonymously because she has no one else to ask.
- Tone: Warm, non-judgmental, kind, never preachy.
- Style: Simple English (Class 8 level). Use occasional Indian context (mil, joint family) naturally if relevant.
- Structure: Start by acknowledging her pain so she feels seen. Then give 3 practical, actionable steps. End with a supportive sentence.
Limit your answer to 150-200 words.`;

const CATEGORY_SLUGS = [
  'relationships-marriage', 'womens-health', 'mental-health-emotions', 'skin-beauty',
  'family-parenting', 'baby-care-motherhood', 'fashion-style', 'career-workplace',
  'pregnancy-fertility', 'weight-fitness', 'food-indian-cooking', 'legal-rights',
  'sex-intimacy', 'finance-money', 'hair-care', 'home-household',
  'festivals-traditions', 'self-growth-confidence'
];

const CATEGORY_PROMPT = `You are a content classifier. Given a question, return ONLY the single most relevant category slug from this list:
${CATEGORY_SLUGS.join(', ')}
Return just the slug, nothing else. No explanation. No punctuation.`;

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.4, max_tokens: 400
      })
    });
    if (!groqRes.ok) throw new Error('Groq failed');
    const data = await groqRes.json();
    return data.choices[0].message.content;
  } catch {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 }
      })
    });
    if (!geminiRes.ok) throw new Error('Gemini fallback failed');
    const data = await geminiRes.json();
    return data.candidates[0].content.parts[0].text;
  }
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Run answer generation and categorization in parallel
    const [aiAnswer, rawCategory] = await Promise.all([
      callAI(DIDI_PROMPT, question),
      callAI(CATEGORY_PROMPT, question),
    ]);

    // Validate category against our known list
    const detectedCategory = CATEGORY_SLUGS.find(s => rawCategory.trim().toLowerCase().includes(s)) || 'self-growth-confidence';

    // Save to Supabase with auto-detected category
    const { error: dbError } = await supabaseAdmin
      .from('questions')
      .insert([{
        question_text: question,
        category: detectedCategory,
        ai_answer: aiAnswer,
        is_published: false, // Safety: review before publishing
      }]);

    if (dbError) {
      console.error('DB Insert Error:', dbError);
    }

    return NextResponse.json({ answer: aiAnswer, category: detectedCategory });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}

