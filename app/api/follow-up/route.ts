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

    // --- AI GENERATION WITH FALLBACK ---
    let cleanedText = '';
    
    try {
      // 1. Try Gemini (Primary)
      console.log('Attempting Gemini generation...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        cleanedText = text.replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();
        console.log('Gemini generation successful');
      }
    } catch (geminiError: any) {
      console.error('Gemini failed, attempting Groq fallback:', geminiError.message);
      
      // 2. Fallback to Groq
      if (process.env.GROQ_API_KEY) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
              max_tokens: 500
            })
          });

          if (groqResponse.ok) {
            const groqData = await groqResponse.json();
            const groqText = groqData.choices[0]?.message?.content;
            if (groqText) {
              cleanedText = groqText.replace(/```[a-z]*\n?/g, '').replace(/```/g, '').trim();
              console.log('Groq fallback successful');
            }
          } else {
            console.error('Groq fallback failed too:', await groqResponse.text());
          }
        } catch (groqError: any) {
          console.error('Critical failure: Both Gemini and Groq failed:', groqError.message);
        }
      }
    }

    if (!cleanedText) {
      throw new Error('Our AI sisters are currently resting. Please try again in a moment! 💜');
    }

    return NextResponse.json({ success: true, answer: cleanedText });

  } catch (error: any) {
    console.error('AI Follow-up error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
