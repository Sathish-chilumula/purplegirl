import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

// Initialize the Gemini API with the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { topic, questionTopic, query, history } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Initialize the model (using the verified free 2.5 flash lite model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

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

    // Generate content using the new SDK syntax
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error('No response from AI sister. Please try again.');

    // Clean up response text in case it has markdown code blocks or extra whitespace
    const cleanedText = text.replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ success: true, answer: cleanedText });

  } catch (error: any) {
    console.error('AI Follow-up error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
