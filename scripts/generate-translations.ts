#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_KEY = process.env.GROQ_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const BATCH_SIZE = 5;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

const LANG_CONFIG: Record<string, { name: string; systemPrompt: string }> = {
  hi: {
    name: 'Hindi',
    systemPrompt: `You are a cultural translator for young Indian women. Translate to warm, conversational Hindi (Hinglish OK for modern feel). Use "tum" for warmth. Preserve the empathetic "elder sister" tone. Do NOT translate literally — adapt culturally.`,
  },
  te: {
    name: 'Telugu',
    systemPrompt: `You are a cultural translator for young Indian women. Translate to warm, conversational Telugu. Preserve the empathetic "elder sister" tone. Do NOT translate literally — adapt culturally.`,
  },
};

async function translateOne(questionId: string, questionTitle: string, answer: any, lang: string) {
  const config = LANG_CONFIG[lang];
  
  const contentToTranslate = {
    question_title: questionTitle,
    chat_log: answer.chat_log || [],
    summary: answer.summary || '',
    bullet_points: answer.bullet_points || [],
  };

  const prompt = `${config.systemPrompt}\n\nTranslate this JSON from English to ${config.name}. Return ONLY valid JSON with same structure:\n\n${JSON.stringify(contentToTranslate, null, 2)}`;

  let translated: any = null;

  // 1. Try Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: { responseMimeType: "application/json" }
      });
      const res = await model.generateContent(prompt);
      translated = JSON.parse(res.response.text());
    } catch (err) {
      console.error(`Gemini translation failed for ${lang}:`, err);
    }
  }

  // 2. Fallback to Groq
  if (!translated && GROQ_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        translated = JSON.parse(data.choices[0].message.content);
      }
    } catch (err) {
      console.error(`Groq translation failed for ${lang}:`, err);
    }
  }

  if (!translated) throw new Error("Translation failed on all AI systems");
  return translated;
}

async function run() {
  const args = process.argv.slice(2);
  const langArg = args.find(a => a.startsWith('--lang='))?.split('=')[1] || 'all';
  const limitArg = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '100');
  
  const langs = langArg === 'all' ? ['hi', 'te'] : [langArg];
  
  console.log(`\n🌏 PurpleGirl Translation Machine`);
  console.log(`Languages: ${langs.join(', ')} | Limit: ${limitArg}\n`);

  for (const lang of langs) {
    const filterCol = `chat_log_${lang}`;
    
    const { data: questionsData, error } = await supabase
      .from('questions')
      .select(`id, title, answers(id, chat_log, summary, bullet_points, ${filterCol})`)
      .in('status', ['approved', 'featured'])
      .limit(limitArg);

    const questions = questionsData as any[] | null;
    if (error || !questions) continue;

    const untranslated = questions.filter(q => {
      const ans = (q.answers as any)?.[0];
      return ans && (!ans[filterCol] || (ans[filterCol] as any[]).length === 0);
    });

    console.log(`📊 ${lang.toUpperCase()}: ${untranslated.length} questions need translation`);

    for (let i = 0; i < untranslated.length; i += BATCH_SIZE) {
      const batch = untranslated.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(batch.map(async (q) => {
        const answer = (q.answers as any)?.[0];
        if (!answer?.chat_log) return;

        try {
          const translated = await translateOne(q.id, q.title, answer, lang);
          await supabase.from('answers').update({
            [`chat_log_${lang}`]: translated.chat_log,
            [`summary_${lang}`]: translated.summary,
            [`bullet_points_${lang}`]: translated.bullet_points,
          }).eq('id', answer.id);
          await supabase.from('questions').update({ [`title_${lang}`]: translated.question_title }).eq('id', q.id);
          console.log(`  ✅ [${lang}] ${q.title.slice(0, 50)}...`);
        } catch (err: any) {
          console.error(`  ❌ [${lang}] ${q.title.slice(0, 40)}... → ${err.message}`);
        }
      }));
      if (i + BATCH_SIZE < untranslated.length) await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log(`🎉 Done!\n`);
}

run().catch(console.error);
