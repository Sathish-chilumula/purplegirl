const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─────────────────────────────────────────────────────────
// 3 rotating content formats so no two articles look alike
// ─────────────────────────────────────────────────────────
const FORMATS = [
  // FORMAT A — Classic How-To (numbered steps, conversational)
  `FORMAT: Classic How-To
Write as if explaining to a friend who just called you for help. 
Start with a relatable 2-3 sentence opening that names the exact situation she is in. DO NOT start with "Imagine you're...". Just state the situation naturally.
Then give 5 to 7 clear, numbered steps. Each step MUST be at least 120 words — give real context, 
explain WHY it works, include a specific Indian example (city, product, food, situation).
Each step can have an optional "tip" (max 1 per article, not every step) or a "warning" (max 1 per article).
Do NOT add a tip or warning to every single step — it makes the article look formulaic.
End with 5 FAQ answers that read like real Google searches Indian women type.`,

  // FORMAT B — Story-First (personal narrative, then advice)
  `FORMAT: Story-First
Open with a short 3-4 sentence story — a real scenario an Indian woman might recognize. DO NOT use the word "Imagine". Start the story directly (e.g., "Meera had been trying to talk to her husband about this for months..."). 
Then transition naturally into practical advice broken into 5 to 6 clear steps.
Each step MUST be at least 130 words with specific Indian context.
Include personal-feel language — "You might find..." "A lot of women in India..." "If your situation is..."
Use 1 optional tip somewhere in the MIDDLE of the article, not at every step.
End with 5 FAQs written like real questions women search on Google.`,

  // FORMAT C — Listicle-Hybrid (bold insight, numbered reasons with depth)
  `FORMAT: Listicle-Hybrid
Open with a direct, confident statement that surprises the reader or challenges a common myth.
Then explain 5 to 7 key points or reasons, each with a clear bold heading and 120+ word explanation.
Use conversational transitions between points ("Here's something most people miss..." "The tricky part is...")
Include at least 2 India-specific statistics or cultural references (in-laws, joint family, festivals, government schemes).
Do NOT use "Tip:" or "Warning:" labels — instead, weave practical advice naturally into the body text.
End with 4 to 5 FAQs in the format real Indian women would search on Google.`
];

function getSystemPrompt(formatIndex) {
  return `You are a content writer for PurpleGirl.in — India's lifestyle and community advice site for women.
Write in natural, conversational English — like one person talking to another.
NOT like AI content. NOT like a corporate blog.
CRITICAL: You are NOT a doctor. Do not give clinical medical advice. Provide community experiences and lifestyle advice. DO NOT start articles with "Imagine...".

Target reader: Indian woman, age 18–42, reading on her phone.
Voice: Direct, warm, practical. Like a knowledgeable friend.
DO NOT use "didi". DO NOT use: "In conclusion", "In summary", "It is important to note".
Write in flowing paragraphs. Vary sentence length naturally.
Use contractions: "you'll", "it's", "here's", "don't".

${FORMATS[formatIndex % FORMATS.length]}

━━━ KEYWORD SEO RULES ━━━
- Primary keyword from the title MUST appear in: intro paragraph 1, at least 2 step headlines or bodies, and FAQs
- Use natural variations of the keyword (e.g. "PCOS in Indian women", "PCOS symptoms", "polycystic ovary")
- LSI keywords: include 3-4 related terms naturally woven into the content
- Reading level: Class 8 — short sentences, no unexplained jargon

━━━ META DESCRIPTION ━━━
Use one of these 4 formulas (rotate):
A) "Feeling [emotion]? Here's exactly what to do when [problem]. [Specific promise]. For Indian women."
B) "[Keyword] can be managed at home. [X] simple steps — Indian-specific remedies. No judgment."  
C) "If [common Indian situation], you're not alone. Our honest guide helps you [outcome] without [fear]. 100% private."
D) "Before you [common action], read this. [Topic] is more common than you think. Here's what actually works."
Max 155 characters. Do NOT start with the site name or article title.

━━━ INTERNAL LINKS ━━━
In step bodies, naturally link to related PurpleGirl content using this format:
[anchor text](/how-to/related-slug)
Rules:
- Include 2-3 internal links total (NOT on every step, spread naturally)
- Anchor text MUST be the target keyword, never "click here" or "this article"
- Only link to plausibly related topics (e.g. a PCOS article links to [thyroid symptoms](/how-to/thyroid-symptoms-in-women-india) or [irregular periods](/how-to/irregular-periods-home-remedies-india))
- Include 1 link to a quiz or tool where relevant: [check your symptoms](/quiz/pcos-quiz) or [use the period calculator](/tools/period-calculator)

━━━ WORD COUNT (NON-NEGOTIABLE) ━━━
- Total: 1200+ words (intro + all steps + FAQs)
- Each step body: 120+ words
- Intro: 120-180 words
- Each FAQ answer: 70-120 words — no one-liners

━━━ INDIA-SPECIFIC REQUIREMENT ━━━
Every article MUST mention at least one: Indian city, Indian brand, Indian food, Indian law/scheme, or Indian family/cultural situation. Real and specific, not generic.

━━━ OUTPUT FORMAT ━━━
Return ONLY a valid JSON object. No markdown fences. No text outside JSON.

{
    "meta_description": "140-155 chars following one of the 4 formulas above",
    "intro": "120-180 word opening. Primary keyword in first 100 words. MUST NOT start with 'Imagine you'. Just state the facts or the problem immediately.",
    "expert_tip": "One genuinely useful sentence — specific and actionable, not generic",
    "content_json": {
      "things_needed": ["3-5 items — emotional or physical, India-specific"],
      "steps": [
        {
          "step_number": 1,
          "headline": "Specific action-oriented heading with keyword if natural",
          "body": "120+ words. Full explanation. WHY it works. India-specific example. Include internal link naturally if relevant using [anchor](/how-to/slug) format. Flowing prose. Must sound like practical experience, not medical advice.",
          "tip": null,
          "warning": null
        }
      ],
      "faqs": [
        {
          "q": "Exact Google search query an Indian woman would type (People Also Ask style)",
          "a": "70-120 word direct, honest answer. Primary keyword variation in answer."
        }
      ]
    }
  }

REMINDER: tip/warning should be null for most steps. Max 1 tip and 1 warning per article.`;
}

function isTooSimilar(newTitle, existingTitle) {
  const a = newTitle.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  const b = existingTitle.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  const common = a.filter(word => b.includes(word) && word.length > 3);
  return common.length / Math.max(a.length, b.length) > 0.8;
}

function countWords(parsedContent) {
  const text = [
    parsedContent.intro || '',
    parsedContent.expert_tip || '',
    ...(parsedContent.content_json?.steps || []).map(s => (s.headline || '') + ' ' + (s.body || '') + ' ' + (s.tip || '') + ' ' + (s.warning || '')),
    ...(parsedContent.content_json?.faqs || []).map(f => (f.q || '') + ' ' + (f.a || '')),
  ].join(' ');
  return text.trim().split(/\s+/).length;
}

// ─────────────────────────────────────────────────────────
// AI call chain: Groq → Gemini → OpenAI
// ─────────────────────────────────────────────────────────
async function callGroq(systemPrompt, userMessage) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      temperature: 0.75,
      max_tokens: 4096,
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq ${res.status}: ${err?.error?.message || res.statusText}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(systemPrompt, userMessage) {
  const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of GEMINI_MODELS) {
    console.log(`  Trying Gemini model: ${model}`);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.75, maxOutputTokens: 4096 }
        })
      }
    );
    if (res.ok) {
      const data = await res.json();
      console.log(`  ✅ Gemini ${model} success`);
      return data.candidates[0].content.parts[0].text;
    }
    const err = await res.json().catch(() => ({}));
    console.warn(`  ❌ Gemini ${model} failed (${res.status}): ${(err?.error?.message || '').substring(0, 80)}`);
    if (res.status === 429) throw new Error('Gemini quota exhausted');
  }
  throw new Error('All Gemini models failed');
}

async function callOpenAI(systemPrompt, userMessage) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  console.log('  Trying OpenAI GPT-4o-mini...');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      temperature: 0.75,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI ${res.status}: ${err?.error?.message || res.statusText}`);
  }
  const data = await res.json();
  console.log('  ✅ OpenAI GPT-4o-mini success');
  return data.choices[0].message.content;
}

async function callAI(systemPrompt, userMessage) {
  // Tier 1: Groq (fast, free)
  try {
    return { text: await callGroq(systemPrompt, userMessage), source: 'groq' };
  } catch (e) {
    console.warn(`Groq failed: ${e.message}`);
  }

  // Tier 2: Gemini (free with limits)
  if (process.env.GEMINI_API_KEY) {
    try {
      return { text: await callGemini(systemPrompt, userMessage), source: 'gemini' };
    } catch (e) {
      console.warn(`Gemini failed: ${e.message}`);
    }
  }

  // Tier 3: OpenAI GPT-4o-mini (paid, most reliable for long content)
  if (process.env.OPENAI_API_KEY) {
    try {
      return { text: await callOpenAI(systemPrompt, userMessage), source: 'openai' };
    } catch (e) {
      console.warn(`OpenAI failed: ${e.message}`);
    }
  }

  return null; // All APIs failed
}

async function generateArticle() {
  console.log('--- PurpleGirl Article Generator v2 Started ---');
  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) console.log('DRY RUN MODE ENABLED: No data will be saved.');

  // 1. Read titles bank
  const bankPath = path.join(__dirname, 'titles-bank.json');
  const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

  if (bank.length === 0) {
    console.log('Title bank is empty. Exiting.');
    return;
  }

  const BATCH_SIZE = 15; // Reduced for quality — better to generate 15 good 1200-word articles than 25 thin ones
  const articlesToProcess = bank.splice(0, BATCH_SIZE);
  console.log(`Picked ${articlesToProcess.length} titles for this run.`);

  // PRE-LOAD: fetch all existing titles to prevent duplicates
  const { data: allExisting } = await supabase.from('articles').select('title, slug');
  const existingTitles = allExisting ? allExisting.map(a => a.title) : [];

  let formatIndex = 0; // Rotate format across articles in the batch

  for (const articleDef of articlesToProcess) {
    console.log(`\nGenerating article [Format ${(formatIndex % 3) + 1}/3]: "${articleDef.title}"`);

    // Deduplication checks
    if (existingTitles.some(t => isTooSimilar(articleDef.title, t))) {
      console.log(`SKIPPED DUPLICATE (title similarity): ${articleDef.title}`);
      continue;
    }
    const { data: existingSlugs } = await supabase.from('articles').select('slug').ilike('slug', `%${articleDef.slug?.substring(0,40) || ''}%`);
    if (existingSlugs && existingSlugs.length > 0) {
      console.log(`SKIPPED DUPLICATE (slug match): ${articleDef.slug}`);
      continue;
    }

    // Select rotating format
    const systemPrompt = getSystemPrompt(formatIndex);
    formatIndex++;

    const userMessage = `Write the complete guide for this topic: "${articleDef.title}"
Category: ${articleDef.category || 'women-health'}
This article MUST be at least 1200 words total. Do not cut it short.`;

    const result = await callAI(systemPrompt, userMessage);

    if (!result) {
      console.error(`All AI APIs failed for: ${articleDef.title}. Skipping.`);
      continue;
    }

    // Parse and validate
    let parsedContent;
    try {
      const cleaned = result.text.replace(/^```json\n?|```$/gm, '').trim();
      parsedContent = JSON.parse(cleaned);
    } catch (e) {
      console.error(`JSON parse failed for ${articleDef.title}. Skipping.`);
      continue;
    }

    // ── WORD COUNT GATE ──────────────────────────────
    const wordCount = countWords(parsedContent);
    console.log(`  Word count: ${wordCount} (via ${result.source})`);
    if (wordCount < 700) {
      console.error(`  ❌ REJECTED — too short (${wordCount} words, need 700+). Skipping.`);
      continue;
    }
    if (wordCount < 900) {
      console.warn(`  ⚠️  Short article (${wordCount} words). Publishing anyway but monitor quality.`);
    }
    // ────────────────────────────────────────────────

    // Build slug
    const cleanSlug = articleDef.slug && !articleDef.slug.endsWith('-')
      ? articleDef.slug
      : articleDef.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .substring(0, 100)
          .replace(/-$/, '');

    // Calculate reading time
    const readingTimeMins = Math.max(3, Math.ceil(wordCount / 200));

    if (isDryRun) {
      console.log(`[DRY RUN] Would insert: ${cleanSlug} | ${wordCount} words | ${readingTimeMins} min read`);
    } else {
      const { error } = await supabase.from('articles').insert([{
        slug: cleanSlug,
        title: articleDef.title,
        category: articleDef.category,
        meta_description: parsedContent.meta_description,
        intro: parsedContent.intro,
        expert_tip: parsedContent.expert_tip,
        content_json: parsedContent.content_json,
        reading_time_mins: readingTimeMins,
        is_published: true,
        language: 'en',
        published_at: new Date().toISOString()
      }]);

      if (error) {
        console.error(`DB Insert Error for ${cleanSlug}:`, error);
      } else {
        console.log(`✅ Published: ${cleanSlug} | ${wordCount} words | via ${result.source}`);
      }
    }

    // Delay: Groq = 2s gap, others = 5s
    if (!isDryRun) {
      const delay = result.source === 'groq' ? 2000 : 5000;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  // Save updated bank
  if (!isDryRun) {
    fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
    console.log(`\nBank updated. ${bank.length} titles remaining.`);

    if (process.env.CLOUDFLARE_DEPLOY_HOOK_URL) {
      console.log('Triggering Cloudflare Deploy Hook...');
      await fetch(process.env.CLOUDFLARE_DEPLOY_HOOK_URL, { method: 'POST' });
    }
  }

  console.log('--- Generator Complete ---');
}

generateArticle();
