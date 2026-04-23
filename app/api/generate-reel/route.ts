import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { questionTitle, categoryName, bulletPoints, chatLog } = await req.json();

    if (!questionTitle) {
      return NextResponse.json({ error: 'Question Title is required' }, { status: 400 });
    }

    const tipsContext = bulletPoints && bulletPoints.length > 0 
      ? bulletPoints.join('\n') 
      : chatLog && chatLog.length > 0 
        ? chatLog.join('\n') 
        : 'General advice';

    const prompt = `
You are an expert Instagram Reel and TikTok scriptwriter.
Turn this question and answer into a highly engaging, 30-45 second viral short-form video script for women.

Question: "${questionTitle}"
Category: "${categoryName}"
Advice/Tips:
${tipsContext}

Return ONLY valid JSON (no markdown, no extra text):
{
  "hook": "A 3-second attention-grabbing hook to start the video.",
  "viral_hook_reason": "Why this hook will stop people from scrolling.",
  "scenes": [
    {
      "duration": "Duration in seconds (e.g., 5s)",
      "what_to_show": "Visual directions (e.g., You looking concerned, then text pops up)",
      "text_overlay": "On-screen text",
      "voiceover": "What you say out loud",
      "transition": "Any specific cut or sound effect (e.g., Whoosh sound)"
    }
  ],
  "cta": "Call to action for the end of the video (e.g., Read the full answer at purplegirl.in)",
  "trending_audio_suggestions": "Type of audio to use (e.g., Lofi hip hop beat, Trending aesthetic audio)",
  "hashtags": "#purplegirl #advice #womenshealth (provide 5-7 relevant hashtags)"
}
`;

    // Generate reel script with Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      throw new Error(`Groq API failed: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.choices[0]?.message?.content;
    
    if (!responseText) throw new Error('No response from AI');
    
    const scriptData = JSON.parse(responseText);

    return NextResponse.json({ success: true, script: scriptData });

  } catch (error: any) {
    console.error('AI Reel Generation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
