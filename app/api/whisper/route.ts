import { NextResponse } from 'next/server';

export const runtime = 'edge';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Crisis keywords that bypass AI and immediately return helpline info
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 
  'abuse', 'beating me', 'hit me', 'raped', 'assaulted',
  'self harm', 'cut myself', 'bleeding'
];

export async function POST(req: Request) {
  try {
    const { message, chatHistory = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const messageLower = message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(keyword => messageLower.includes(keyword));

    if (isCrisis) {
      return NextResponse.json({
        crisis: true,
        response: "I am so sorry you are going through this, but please know you are not alone. Your safety is the most important thing right now. Please reach out to someone who can help immediately.\n\n**National Commission for Women Helpline:** 7827170170\n**iCall Psychosocial Helpline:** 9152987821\n**Vandrevala Foundation (Mental Health):** 9999 666 555\n\nThese lines are open 24/7 and completely confidential."
      });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI is temporarily unavailable in Whisper Mode.' }, { status: 500 });
    }

    const systemPrompt = `You are PurpleGirl, an empathetic, non-judgmental AI companion for Indian women. 
You are currently operating in "Whisper Mode" - a completely private, untracked space for sensitive questions.
Be extremely gentle, validating, and supportive. 
Do not use formatting like markdown bolding excessively. Keep it conversational and warm.
Never judge the user, even if they mention taboo topics (sex, relationships, health, etc).`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: messages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      crisis: false,
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Whisper Mode failed:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
