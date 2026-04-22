import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not found. Defaulting to Neutral.');
      return NextResponse.json({
        primary_emotion: 'Neutral',
        intensity: 1,
        opening_acknowledgment: 'I hear you.',
      });
    }

    const systemPrompt = `You are an empathetic AI companion for Indian women.
Your task is to analyze the emotional subtext of a user's question and determine how they are feeling.
Return ONLY a raw JSON object with no markdown formatting.

Format required:
{
  "primary_emotion": "Scared" | "Embarrassed" | "Angry" | "Hopeful" | "Confused" | "Sad" | "Frustrated" | "Neutral",
  "intensity": 1-10,
  "opening_acknowledgment": "A short, extremely empathetic 1-sentence opening that validates their specific feeling before answering."
}

Example opening: "I can sense this is weighing heavily on you right now, and it's completely okay to feel overwhelmed."`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Emotion detection failed:', error);
    // Fallback so the UI doesn't break
    return NextResponse.json({
      primary_emotion: 'Neutral',
      intensity: 1,
      opening_acknowledgment: 'I hear you, and I am here for you.',
    });
  }
}
