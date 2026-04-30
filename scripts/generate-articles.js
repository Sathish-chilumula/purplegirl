const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SYSTEM_PROMPT = `You are a senior content writer for PurpleGirl.in, acting as a trusted older sister (didi) for Indian women.
Your job is to write a highly empathetic, actionable, and SEO-optimized guide based on the provided title.
Target Audience: Indian women, reading on their phones, often secretly.
Tone: Warm, non-judgmental, practical. Use simple English (Class 8 level).

CRITICAL INSTRUCTIONS:
1. The Intro MUST start by acknowledging their exact pain/fear (The "Mirror Moment"). Let them know they aren't alone.
2. Provide exactly 3 to 5 practical, numbered steps.
3. Include an "expert_tip" (a short, powerful quote of advice).
4. Provide a list of "things_needed" (can be mental things like 'patience' or physical things).
5. Provide 2-3 "faqs" that women actually Google about this topic.

You MUST return the output ONLY as a valid JSON object with the following schema:
{
  "meta_description": "A 150-char SEO description",
  "intro": "The mirror moment intro paragraph...",
  "expert_tip": "One powerful sentence of advice.",
  "content_json": {
    "things_needed": ["Item 1", "Item 2"],
    "steps": [
      {
        "step_number": 1,
        "headline": "Step headline",
        "body": "Detailed paragraph.",
        "tip": "Optional quick tip",
        "warning": "Optional warning"
      }
    ],
    "faqs": [
      { "q": "Question?", "a": "Answer paragraph." }
    ]
  }
}
Do not include markdown blocks like \`\`\`json. Return strictly the raw JSON.`;

function isTooSimilar(newTitle, existingTitle) {
  const a = newTitle.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
  const b = existingTitle.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
  const common = a.filter(word => b.includes(word) && word.length > 3)
  return common.length / Math.max(a.length, b.length) > 0.8
}

async function generateArticle() {
  console.log('--- PurpleGirl Article Generator Started ---');
  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) {
    console.log('DRY RUN MODE ENABLED: No data will be inserted into Supabase.');
  }
  
  // 1. Read titles bank
  const bankPath = path.join(__dirname, 'titles-bank.json');
  const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  
  if (bank.length === 0) {
    console.log('Title bank is empty. Exiting.');
    return;
  }

  // 2. Pick up to 15 titles from the bank
  // NOTE: Gemini free tier = 20 req/day. Groq free tier ~14,400 req/day.
  // Keeping batch at 15 ensures we stay within Gemini quota if Groq falls back.
  const BATCH_SIZE = 15;
  const articlesToProcess = bank.splice(0, BATCH_SIZE);
  console.log(`Picked ${articlesToProcess.length} titles for this run.`);

  // PRE-LOAD: fetch all existing titles to prevent semantic duplicates
  const { data: allExisting } = await supabase.from('articles').select('title, slug');
  const existingTitles = allExisting ? allExisting.map(a => a.title) : [];

  for (const articleDef of articlesToProcess) {
    console.log(`\nGenerating article: "${articleDef.title}"`);

    // DEDUPLICATION 1: Check title similarity against all existing
    const isDuplicateTitle = existingTitles.some(extTitle => isTooSimilar(articleDef.title, extTitle));
    if (isDuplicateTitle) {
      console.log(`SKIPPED DUPLICATE (Title similarity): ${articleDef.title}`);
      continue;
    }

    // DEDUPLICATION 2: Check for exact slug match
    const { data: existingSlugs } = await supabase
      .from('articles')
      .select('slug, title')
      .ilike('slug', `%${articleDef.slug}%`);
    
    if (existingSlugs && existingSlugs.length > 0) {
      console.log(`SKIPPED DUPLICATE (Slug match): ${articleDef.slug}`);
      continue;
    }

    // 3. Call Groq API (Primary) with Gemini fallback
    let resultJsonStr = null;
    let usedFallback = false;
    
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Write the guide for the title: "${articleDef.title}"` }
          ],
          temperature: 0.7,
        })
      });

      if (!groqRes.ok) {
        const errBody = await groqRes.json().catch(() => ({}));
        const errMsg = errBody?.error?.message || groqRes.statusText || `HTTP ${groqRes.status}`;
        throw new Error(`Groq ${groqRes.status}: ${errMsg}`);
      }
      const data = await groqRes.json();
      resultJsonStr = data.choices[0].message.content;
      
    } catch (e) {
      console.warn(`Groq failed. Attempting Gemini fallback... (${e.message})`);
      usedFallback = true;

      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set. Cannot fall back. Skipping.');
        continue;
      }

      const geminiBody = JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Write the guide for the title: "${articleDef.title}"` }] }],
        generationConfig: { temperature: 0.7 }
      });

      // Cascade: try gemini-3.1-flash-lite-preview first, then gemini-2.5-flash-lite on 503
      const GEMINI_MODELS = ['gemini-3.1-flash-lite-preview', 'gemini-2.5-flash-lite'];
      let geminiSuccess = false;

      for (const model of GEMINI_MODELS) {
        console.log(`  Trying Gemini model: ${model}`);
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: geminiBody }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          resultJsonStr = data.candidates[0].content.parts[0].text;
          geminiSuccess = true;
          console.log(`  ✅ Gemini success with ${model}`);
          break;
        }

        const geminiErr = await geminiRes.json().catch(() => ({}));
        const geminiMsg = geminiErr?.error?.message || `HTTP ${geminiRes.status}`;
        console.warn(`  ❌ ${model} failed (${geminiRes.status}): ${geminiMsg.substring(0, 100)}`);

        if (geminiRes.status === 429) {
          console.error('Gemini daily quota exhausted. Stopping batch early.');
          break; // exit the for-loop; outer loop will see geminiSuccess=false
        }
        // 503 = overloaded preview model, fall through to next model in cascade
      }

      if (!geminiSuccess) {
        console.error('All Gemini models failed. Skipping this article.');
        continue;
      }
    }

    // 4. Parse and Validate
    let parsedContent;
    try {
      resultJsonStr = resultJsonStr.replace(/^```json\n?|```$/gm, '').trim();
      parsedContent = JSON.parse(resultJsonStr);
    } catch (e) {
      console.error('Failed to parse AI output as JSON. Skipping.', resultJsonStr);
      continue;
    }

    // 5. Insert into Supabase (Skip if dry-run)
    if (isDryRun) {
      console.log(`[DRY RUN] Would insert article: ${articleDef.slug}`);
      console.log(JSON.stringify(parsedContent, null, 2));
    } else {
      const { error } = await supabase.from('articles').insert([{
        slug: articleDef.slug,
        title: articleDef.title,
        category: articleDef.category,
        meta_description: parsedContent.meta_description,
        intro: parsedContent.intro,
        expert_tip: parsedContent.expert_tip,
        content_json: parsedContent.content_json,
        reading_time_mins: 5,
        is_published: true, // Auto-publish for now
        published_at: new Date().toISOString()
      }]);

      if (error) {
        console.error(`Supabase Insert Error for ${articleDef.slug}:`, error);
      } else {
        console.log(`✅ Successfully published: ${articleDef.slug}`);
      }
    }

    // Delay between API calls to avoid rate limits
    // Use longer delay when using Gemini (free tier: 20 req/day, 2 req/min)
    if (!isDryRun) {
      const delay = usedFallback ? 35000 : 2000; // 35s for Gemini (2 rpm limit), 2s for Groq
      if (usedFallback) console.log(`Using Gemini fallback — waiting ${delay/1000}s to respect rate limits...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  // 6. Update titles-bank file (saving state)
  if (!isDryRun) {
    fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
    
    if (process.env.CLOUDFLARE_DEPLOY_HOOK_URL) {
      console.log('Triggering Cloudflare Deploy Hook...');
      await fetch(process.env.CLOUDFLARE_DEPLOY_HOOK_URL, { method: 'POST' });
    }
  }
}

generateArticle();

/*
-- Find and review duplicate articles in Supabase:
-- SELECT title, slug, COUNT(*) 
-- FROM articles 
-- GROUP BY title, slug 
-- HAVING COUNT(*) > 1
-- ORDER BY COUNT(*) DESC;

-- Delete older duplicates keeping highest view_count:
-- DELETE FROM articles a USING articles b
-- WHERE a.title = b.title 
-- AND a.view_count < b.view_count 
-- AND a.id != b.id;
*/
