import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const prompt = `
You are a highly empathetic, expert dermatologist and "virtual elder sister" for Indian women.
Analyze this photo of a skin concern (e.g., dark spots, acne, pigmentation).

Return ONLY valid JSON (no markdown, no extra text):
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

    // Make sure we pass the correct format for image URLs in the messages array
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq Vision API Error:', errorText);
      throw new Error(`Groq Vision API failed: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.choices[0]?.message?.content;
    
    if (!responseText) throw new Error('No response from AI');
    
    const analysisData = JSON.parse(responseText);

    return NextResponse.json({ success: true, analysis: analysisData });

  } catch (error: any) {
    console.error('Skin Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
