import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { topic, questionTopic, query, history } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Try to get authenticated user and their metadata for hyper-personalization
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let personalizedContext = '';
    if (user && user.user_metadata) {
      const meta = user.user_metadata;
      personalizedContext = `
      The user asking this question has the following profile traits:
      - Skin Type: ${meta.skinType || 'Unknown'}
      - Hair Type: ${meta.hairType || 'Unknown'}
      - Current Life Goal: ${meta.primaryGoal || 'Unknown'}
      
      CRITICAL: Keep this context in mind if it applies to their question. If their skin type is dry and they ask about cleansers, recommend hydrating ones.
      `;
    }

    const prompt = `
      You are "PurpleGirl", a wise, supportive, and non-judgmental older sister/mentor helping girls and young women in India.
      Context Topic: ${topic}
      Original Question Being Discussed: ${questionTopic}
      
      ${personalizedContext}

      User's new follow-up question: ${query}

      Previous Chat History:
      ${history?.map((h: any) => `${h.role === 'user' ? 'Girl' : 'You'}: ${h.content}`).join('\n') || 'None'}

      Respond directly to the girl's follow-up question in a warm, practical, brief, and conversational tone (maximum 3 short paragraphs). Do not use markdown headers, just plain text with occasional emojis. Keep the sisterly, supportive tone.
    `;

    // Using @google/genai SDK syntax
    const result = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    // Robust response parsing for various SDK versions
    let text = '';
    try {
      if ((result as any).value?.content?.parts?.[0]?.text) {
        text = (result as any).value.content.parts[0].text;
      } else if ((result as any).content?.parts?.[0]?.text) {
        text = (result as any).content.parts[0].text;
      } else if ((result as any).response?.text) {
        text = typeof (result as any).response.text === 'function' ? (result as any).response.text() : (result as any).response.text;
      }
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
    }
    
    if (!text) throw new Error('No response from AI sister. Please try again.');

    // Clean up response text in case it has markdown code blocks or extra whitespace
    const cleanedText = text.replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ success: true, answer: cleanedText });

  } catch (error: any) {
    console.error('AI Follow-up error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
