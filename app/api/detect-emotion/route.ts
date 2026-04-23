import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const systemPrompt = `You are an empathetic AI companion for Indian women.
Analyze the emotional subtext of the user's question and determine how they are feeling.
Return ONLY a raw JSON object with no markdown formatting.

Format required:
{
  "primary_emotion": "Scared" | "Embarrassed" | "Angry" | "Hopeful" | "Confused" | "Sad" | "Frustrated" | "Neutral",
  "intensity": 1-10,
  "opening_acknowledgment": "A short, extremely empathetic 1-sentence opening that validates their specific feeling before answering."
}`;

    let result: any = null;

    // 1. Try Gemini
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const response = await model.generateContent(`${systemPrompt}\n\nQuestion: ${question}`);
      const text = response.response.text();
      result = JSON.parse(text);
    } catch (geminiError) {
      console.error('Gemini emotion detection failed, trying Groq:', geminiError);
      
      // 2. Fallback to Groq
      if (GROQ_API_KEY) {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: question }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          result = JSON.parse(data.choices[0].message.content);
        }
      }
    }

    if (!result) {
      return NextResponse.json({
        primary_emotion: 'Neutral',
        intensity: 1,
        opening_acknowledgment: 'I hear you, and I am here for you.',
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Emotion detection failed:', error);
    return NextResponse.json({
      primary_emotion: 'Neutral',
      intensity: 1,
      opening_acknowledgment: 'I hear you, and I am here for you.',
    });
  }
}
