#!/usr/bin/env node
/**
 * PurpleGirl Bulk Translation Script
 * 
 * Translates all approved questions that don't yet have Hindi/Telugu versions.
 * Run this weekly to keep up with new question generation.
 * 
 * Usage:
 *   npx ts-node scripts/generate-translations.ts --lang=hi
 *   npx ts-node scripts/generate-translations.ts --lang=te
 *   npx ts-node scripts/generate-translations.ts --lang=all
 *   npx ts-node scripts/generate-translations.ts --lang=all --limit=50
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_KEY = process.env.GROQ_API_KEY!;
const BATCH_SIZE = 5; // Process 5 at a time to avoid rate limits

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

  const prompt = `${config.systemPrompt}

Translate this JSON from English to ${config.name}. Return ONLY valid JSON with same structure:

${JSON.stringify(contentToTranslate, null, 2)}

Return:
{
  "question_title": "...",
  "chat_log": ["...", "..."],
  "summary": "...",
  "bullet_points": ["...", "..."]
}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const translated = JSON.parse(data.choices[0].message.content);
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
    
    // Fetch questions needing translation
    const { data: questionsData, error } = await supabase
      .from('questions')
      .select(`id, title, answers(id, chat_log, summary, bullet_points, ${filterCol})`)
      .in('status', ['approved', 'featured'])
      .limit(limitArg);

    const questions = questionsData as any[] | null;

    if (error || !questions) {
      console.error(`Failed to fetch questions: ${error?.message}`);
      continue;
    }

    // Filter to only untranslated
    const untranslated = questions.filter(q => {
      const ans = (q.answers as any)?.[0];
      return ans && (!ans[filterCol] || (ans[filterCol] as any[]).length === 0);
    });

    console.log(`📊 ${lang.toUpperCase()}: ${untranslated.length} questions need translation`);

    let successCount = 0;
    let errorCount = 0;

    // Process in batches
    for (let i = 0; i < untranslated.length; i += BATCH_SIZE) {
      const batch = untranslated.slice(i, i + BATCH_SIZE);
      
      await Promise.allSettled(batch.map(async (q) => {
        const answer = (q.answers as any)?.[0];
        if (!answer?.chat_log) return;

        try {
          const translated = await translateOne(q.id, q.title, answer, lang);
          
          // Save to answers table
          await supabase.from('answers').update({
            [`chat_log_${lang}`]: translated.chat_log,
            [`summary_${lang}`]: translated.summary,
            [`bullet_points_${lang}`]: translated.bullet_points,
          }).eq('id', answer.id);

          // Save translated title to questions
          await supabase.from('questions').update({
            [`title_${lang}`]: translated.question_title,
          }).eq('id', q.id);

          successCount++;
          console.log(`  ✅ [${lang}] ${q.title.slice(0, 50)}...`);
        } catch (err: any) {
          errorCount++;
          console.error(`  ❌ [${lang}] ${q.title.slice(0, 40)}... → ${err.message}`);
        }
      }));

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < untranslated.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    console.log(`\n✨ ${lang.toUpperCase()} Complete: ${successCount} translated, ${errorCount} errors\n`);
  }

  console.log(`🎉 Done! Re-deploy your site or wait for next Cloudflare build to see new language pages in sitemap.\n`);
}

run().catch(console.error);
