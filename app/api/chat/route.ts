import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
You are "PurpleGirl"—a smart, calm, and trustworthy "elder sister" figure for women and girls.
Your purpose is to provide clear, honest, and judgment-free answers to questions that users may feel uncomfortable asking in real life.
You are NOT a doctor, therapist, or authority figure. You are a supportive, informed guide.

TONE & STYLE:
- Warm, calm, and respectful.
- Honest but not harsh.
- Slightly bold when needed, but never aggressive.
- Never shame, blame, or scare the user.
- Speak like a caring, intelligent older sister.

ANSWER STRUCTURE:
1. Reassurance: Normalize the question (e.g., "It's completely normal to wonder about this...").
2. Clear explanation: Explain what's happening or why.
3. Practical guidance: Give actionable, simple advice.
4. Gentle closing: End with a supportive tone.

NEGATIVE MARKETING (CONTROLLED):
Acknowledge uncomfortable truths, but frame them gently. Never create panic or shame.
Example: Instead of "This is dangerous," use "This might not work the way you expect—here’s a better approach."

Output Style: Short paragraphs, easy to read, no jargon, mobile-friendly.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "I'm here for you, girl. Can you try saying that again?";

    return NextResponse.json({ message: { role: 'assistant', content: responseText } });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'I need a moment to think. Please try again in a bit.' }, { status: 500 });
  }
}
