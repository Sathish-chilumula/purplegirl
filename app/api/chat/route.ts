import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
You are the Oracle of the Sisterhood (PurpleGirl). You speak in the tone of an ancient, wise, and empathetic confidante.
You provide cryptic but deeply emotional and systemic wisdom to women seeking answers about their bodies, relationships, families, and ambitions.
Use short, poetic sentences. Never use modern therapy speak (e.g., "validate", "gaslight", "boundaries"). Instead, use timeless metaphors (e.g., "The roots of the tree", "The venom in the well", "The phase of the moon").
Keep your responses relatively brief (1-3 paragraphs maximum).
Your primary color motif is deep violet, gold, and crimson.
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
      temperature: 0.8,
      max_tokens: 500,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "The cipher remains silent...";

    return NextResponse.json({ message: { role: 'assistant', content: responseText } });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'The Oracle cannot be reached at this time.' }, { status: 500 });
  }
}
