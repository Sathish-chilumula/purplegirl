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

  // 2. Pick up to 30 titles from the bank
  const BATCH_SIZE = 30;
  const articlesToProcess = bank.splice(0, BATCH_SIZE);
  console.log(`Picked ${articlesToProcess.length} titles for this run.`);

  for (const articleDef of articlesToProcess) {
    console.log(`\nGenerating article: "${articleDef.title}"`);

    // 3. Call Groq API (Primary)
    let resultJsonStr = null;
    
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

      if (!groqRes.ok) throw new Error(`Groq Error: ${groqRes.statusText}`);
      const data = await groqRes.json();
      resultJsonStr = data.choices[0].message.content;
      
    } catch (e) {
      console.warn('Groq failed. Attempting Gemini Flash 2.5 Lite fallback...', e.message);
      // Fallback logic
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: `Write the guide for the title: "${articleDef.title}"` }] }],
          generationConfig: { temperature: 0.7 }
        })
      });
      
      if (!geminiRes.ok) {
        console.error('Gemini fallback failed. Skipping this article.');
        continue;
      }
      const data = await geminiRes.json();
      resultJsonStr = data.candidates[0].content.parts[0].text;
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

    // Small delay between API calls to avoid rate limits
    if (!isDryRun) {
      await new Promise(r => setTimeout(r, 2000));
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
