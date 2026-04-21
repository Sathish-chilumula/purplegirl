import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // 1. Fetch question from DB
    const { data: question, error: fetchError } = await supabaseAdmin
      .from('questions')
      .select('*, categories(name)')
      .eq('id', questionId)
      .single();

    if (fetchError || !question) {
      console.error('Error fetching question:', fetchError);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const prompt = `
      You are "PurpleGirl", a wise, supportive, and non-judgmental older sister/mentor helping girls and young women in India with their most pressing questions.
      Your tone is empathetic, practical, and sisterly. Use simple English that a teenage girl or young adult can understand.
      
      Topic: ${question.categories?.name || 'General'}
      Question: ${question.title}
      Details: ${question.description || ''}

      Please provide a response in the following JSON format:
      {
        "summary": "A concise 1-2 sentence quick answer.",
        "detailed": "A deeper explanation of the 'why' and 'how'. 2-3 paragraphs. Emphasize that she isn't alone.",
        "bullet_points": ["Step-by-step practical tip 1", "Practical tip 2", "Practical tip 3"],
        "faqs": [
          {"q": "A related follow-up question?", "a": "A brief helpful answer."},
          {"q": "Another common related question?", "a": "A brief helpful answer."}
        ],
        "products": [
          {
            "title": "Name of a helpful generic product (e.g., 'Salicylic Acid Cleanser')",
            "link": "https://amazon.in/s?k=salicylic+acid+cleanser",
            "price": "Under ₹500",
            "image": "https://picsum.photos/seed/skincare/200/200"
          }
        ],
        "disclaimer": "A kind reassurance that this is advice and she should consult a pro/adult for serious issues."
      }
      
      Return ONLY the JSON.
    `;

    // 2. Generate answer with Gemini
    const result = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const responseText = result.text;
    if (!responseText) throw new Error('No response from AI');
    
    const answerData = JSON.parse(responseText);

    // 3. Save answer to DB
    const { data: savedAnswer, error: saveError } = await supabaseAdmin
      .from('answers')
      .insert({
        question_id: question.id,
        summary: answerData.summary,
        detailed: answerData.detailed,
        bullet_points: answerData.bullet_points,
        faqs: answerData.faqs,
        products: answerData.products || null,
        disclaimer: answerData.disclaimer,
        ai_model: 'gemini-3-flash-preview'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving answer:', saveError);
      return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
    }

    // 4. Update question status to approved
    await supabaseAdmin
      .from('questions')
      .update({ status: 'approved' })
      .eq('id', question.id);

    return NextResponse.json({ success: true, answerId: savedAnswer.id });

  } catch (error: any) {
    console.error('AI Generation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
