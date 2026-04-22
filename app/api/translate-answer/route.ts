import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

const LANG_CONFIG: Record<string, { name: string; nativeName: string; systemPrompt: string }> = {
  hi: {
    name: 'Hindi',
    nativeName: 'हिंदी',
    systemPrompt: `You are a cultural translator specializing in Hindi for young Indian women. 
Translate the given English text into warm, natural, conversational Hindi (Hinglish is OK for modern feel). 
Preserve the empathetic "elder sister" tone. Use "tum" (not "aap") for warmth. 
Do NOT do literal word-for-word translation — adapt it culturally so it feels native.`,
  },
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    systemPrompt: `You are a cultural translator specializing in Telugu for young Indian women.
Translate the given English text into warm, natural, conversational Telugu.
Preserve the empathetic "elder sister" tone. Make it feel like a trusted friend speaking.
Do NOT do literal word-for-word translation — adapt it culturally so it feels native.`,
  },
};

export async function POST(req: Request) {
  try {
    const { questionId, lang } = await req.json();

    if (!questionId || !lang) {
      return NextResponse.json({ error: 'questionId and lang are required' }, { status: 400 });
    }

    const langConfig = LANG_CONFIG[lang];
    if (!langConfig) {
      return NextResponse.json({ error: 'Unsupported language. Use: hi, te' }, { status: 400 });
    }

    // 1. Fetch the English question and answer
    const { data: question, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('id, title, answers(chat_log, summary, bullet_points)')
      .eq('id', questionId)
      .single();

    if (qErr || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const answer = (question.answers as any)?.[0];
    if (!answer) {
      return NextResponse.json({ error: 'No answer to translate yet' }, { status: 404 });
    }

    // 2. Check if already translated
    const { data: existingAnswer } = await supabaseAdmin
      .from('answers')
      .select(`chat_log_${lang}`)
      .eq('question_id', questionId)
      .single();

    if (existingAnswer && (existingAnswer as any)[`chat_log_${lang}`]) {
      return NextResponse.json({ success: true, cached: true });
    }

    // 3. Build translation prompt
    const contentToTranslate = {
      question_title: question.title,
      chat_log: answer.chat_log || [],
      summary: answer.summary || '',
      bullet_points: answer.bullet_points || [],
    };

    const prompt = `${langConfig.systemPrompt}

Translate the following JSON content from English to ${langConfig.name}.
Return ONLY valid JSON with the same structure, no extra text:

${JSON.stringify(contentToTranslate, null, 2)}

Return this exact JSON structure with translated values:
{
  "question_title": "translated title here",
  "chat_log": ["translated bubble 1", "translated bubble 2", "..."],
  "summary": "translated summary",
  "bullet_points": ["translated tip 1", "translated tip 2", "..."]
}`;

    // 4. Call Groq for translation
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temp = more consistent translation
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq translation error:', errText);
      throw new Error(`Groq failed: ${groqRes.status}`);
    }

    const groqData = await groqRes.json();
    const translated = JSON.parse(groqData.choices[0].message.content);

    // 5. Save translations to DB
    const answerUpdate: Record<string, any> = {
      [`chat_log_${lang}`]: translated.chat_log,
      [`summary_${lang}`]: translated.summary,
      [`bullet_points_${lang}`]: translated.bullet_points,
    };

    const { error: updateErr } = await supabaseAdmin
      .from('answers')
      .update(answerUpdate)
      .eq('question_id', questionId);

    if (updateErr) {
      console.error('DB update error:', updateErr);
      throw new Error('Failed to save translation');
    }

    // 6. Save translated title to questions table
    const titleUpdate: Record<string, any> = {
      [`title_${lang}`]: translated.question_title,
    };

    await supabaseAdmin
      .from('questions')
      .update(titleUpdate)
      .eq('id', questionId);

    return NextResponse.json({ success: true, lang, translated });

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
