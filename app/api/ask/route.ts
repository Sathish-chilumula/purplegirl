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

// Topics considered sensitive — hold for review instead of auto-publishing
const SENSITIVE_KEYWORDS = ['suicide', 'kill', 'die', 'abuse', 'rape', 'assault', 'violence'];

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

/**
 * Generates a URL-safe slug from a question string.
 * Truncates to 80 chars and appends a short random suffix for uniqueness.
 */
function generateSlug(text: string, uniqueSuffix: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '');
  return `${base}-${uniqueSuffix}`;
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || question.trim().length < 5) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const questionText = question.trim();

    // Run answer generation and categorization in parallel
    const [aiAnswer, rawCategory] = await Promise.all([
      callAI(DIDI_PROMPT, questionText),
      callAI(CATEGORY_PROMPT, questionText),
    ]);

    // Validate category
    const detectedCategory = CATEGORY_SLUGS.find(s => rawCategory.trim().toLowerCase().includes(s)) || 'self-growth-confidence';

    // Check if sensitive — hold for manual review
    const isSensitive = SENSITIVE_KEYWORDS.some(kw => questionText.toLowerCase().includes(kw));
    const shouldPublish = !isSensitive;

    // Generate a unique short suffix from timestamp
    const shortSuffix = Date.now().toString(36).slice(-5);
    const slug = generateSlug(questionText, shortSuffix);

    // Save to Supabase — this is the KEY change: every question gets a permanent URL
    const { data: savedQuestion, error: dbError } = await supabaseAdmin
      .from('questions')
      .insert([{
        question_text: questionText,
        category: detectedCategory,
        ai_answer: aiAnswer,
        slug: slug,
        is_published: shouldPublish,
      }])
      .select('id, slug')
      .single();

    if (dbError) {
      console.error('DB Insert Error:', dbError);
      // Still return the answer even if save fails
      return NextResponse.json({ 
        answer: aiAnswer, 
        category: detectedCategory,
        permalink: null 
      });
    }

    return NextResponse.json({ 
      answer: aiAnswer, 
      category: detectedCategory,
      // Permanent URL for this Q&A — users can bookmark/share
      permalink: savedQuestion?.slug ? `/q/${savedQuestion.slug}` : null,
      questionId: savedQuestion?.id,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
