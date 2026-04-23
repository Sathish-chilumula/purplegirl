import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Gemini expects the base64 string without the data:image/png;base64, prefix
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = `
You are a highly empathetic, expert dermatologist and "virtual elder sister" for Indian women.
Analyze this photo of a skin concern (e.g., dark spots, acne, pigmentation).

Return ONLY valid JSON:
{
  "condition_appears_to_be": "Brief description of what it looks like (e.g., Post-inflammatory hyperpigmentation)",
  "causes": ["Cause 1", "Cause 2"],
  "home_remedies": ["Remedy 1", "Remedy 2"],
  "product_recommendations": ["Specific ingredient/product type 1 (budget-friendly in India)", "Product type 2"],
  "sister_advice": "A warm, empathetic paragraph validating their concern and offering encouragement.",
  "doctor_flag": "Boolean true if it looks severe enough to require a real doctor, false otherwise"
}

IMPORTANT: Always use language like "appears to be" or "looks like". Never provide a definitive medical diagnosis.
`;

    // 1. Try Gemini Vision (Primary)
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);

      const responseText = result.response.text();
      if (!responseText) throw new Error('No response from Gemini Vision');
      
      const analysisData = JSON.parse(responseText);
      return NextResponse.json({ success: true, analysis: analysisData });

    } catch (geminiError: any) {
      console.error('Gemini Vision failed:', geminiError);
      
      // Fallback or specific error handling
      throw new Error(`AI Analysis failed: ${geminiError.message}`);
    }

  } catch (error: any) {
    console.error('Skin Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
