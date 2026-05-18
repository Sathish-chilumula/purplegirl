// rewrite-thin-articles.js
// Rewrites existing English articles that are too short or low quality.
// Priority order: shortest articles first (<=2 min read), then <=3 min.
// Uses the same 3-format rotating system as generate-articles.js v2.
// Updates the existing DB record — does NOT create a new entry.
// Run: node scripts/rewrite-thin-articles.js [--dry-run] [--min-mins=2]

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Same 3 formats as generate-articles.js ───────────────────────────────
const FORMATS = [
  `FORMAT: Classic How-To
Write as if explaining to a friend who just called you for help.
Start with a relatable 2-3 sentence opening that names the exact situation she is in.
Give 5 to 7 clear, numbered steps. Each step MUST be at least 130 words.
Include real context — explain WHY it works, use a specific Indian example (city, product, food).
At most ONE tip and ONE warning across the whole article. Not on every step.
End with 5 FAQs that match real Google searches Indian women type.`,

  `FORMAT: Story-First
Open with a short 3-4 sentence story — a real scenario an Indian woman would recognize.
Then transition naturally into 5 to 6 practical steps, each 130+ words.
Use personal-feel language — "You might find..." "A lot of women in India..."
Include 1 optional tip somewhere in the MIDDLE of the article only.
End with 5 real-search-style FAQs.`,

  `FORMAT: Listicle-Hybrid
Open with a direct, confident statement that surprises or challenges a common myth.
Then explain 5 to 7 key points, each with a bold heading and 130+ word explanation.
Include 2 India-specific cultural references (joint family, festivals, government schemes, etc.).
Do NOT use "Tip:" or "Warning:" labels — weave advice naturally into body text.
End with 4 to 5 FAQs in the format real women would search.`
];

function getSystemPrompt(formatIndex) {
  return `You are a content writer for PurpleGirl.in — India's how-to guide site for women.
Write in natural, conversational English — like one person talking to another.
NOT like AI content. NOT like a corporate blog.

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
  "intro": "120-180 word opening. Primary keyword in first 100 words. No bullet points.",
  "expert_tip": "One genuinely useful sentence — specific and actionable, not generic",
  "content_json": {
    "things_needed": ["3-5 items — emotional or physical, India-specific"],
    "steps": [
      {
        "step_number": 1,
        "headline": "Specific action-oriented heading with keyword if natural",
        "body": "120+ words. Full explanation. WHY it works. India-specific example. Include internal link naturally if relevant using [anchor](/how-to/slug) format. Flowing prose.",
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

function countWords(parsed) {
  const text = [
    parsed.intro || '',
    parsed.expert_tip || '',
    ...(parsed.content_json?.steps || []).map(function(s) {
      return (s.headline || '') + ' ' + (s.body || '') + ' ' + (s.tip || '') + ' ' + (s.warning || '');
    }),
    ...(parsed.content_json?.faqs || []).map(function(f) {
      return (f.q || '') + ' ' + (f.a || '');
    }),
  ].join(' ');
  return text.trim().split(/\s+/).length;
}

async function callGroq(systemPrompt, userMessage) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      temperature: 0.75,
      max_tokens: 4096,
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(function() { return {}; });
    throw new Error('Groq ' + res.status + ': ' + (err.error && err.error.message || res.statusText));
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(systemPrompt, userMessage) {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (var i = 0; i < models.length; i++) {
    var model = models[i];
    console.log('  Trying Gemini:', model);
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + process.env.GEMINI_API_KEY,
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
      return data.candidates[0].content.parts[0].text;
    }
    if (res.status === 429) throw new Error('Gemini quota exhausted');
  }
  throw new Error('All Gemini models failed');
}

async function callOpenAI(systemPrompt, userMessage) {
  if (!process.env.OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY');
  console.log('  Trying OpenAI GPT-4o-mini...');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      temperature: 0.75,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(function() { return {}; });
    throw new Error('OpenAI ' + res.status + ': ' + (err.error && err.error.message || res.statusText));
  }
  const data = await res.json();
  console.log('  ✅ OpenAI success');
  return data.choices[0].message.content;
}

async function callAI(systemPrompt, userMessage) {
  try { return { text: await callGroq(systemPrompt, userMessage), source: 'groq' }; }
  catch(e) { console.warn('Groq failed:', e.message); }

  if (process.env.GEMINI_API_KEY) {
    try { return { text: await callGemini(systemPrompt, userMessage), source: 'gemini' }; }
    catch(e) { console.warn('Gemini failed:', e.message); }
  }

  if (process.env.OPENAI_API_KEY) {
    try { return { text: await callOpenAI(systemPrompt, userMessage), source: 'openai' }; }
    catch(e) { console.warn('OpenAI failed:', e.message); }
  }
  return null;
}

async function rewriteThinArticles() {
  console.log('--- PurpleGirl Article Rewriter Started ---');
  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) console.log('DRY RUN: No DB updates will be made.');

  // Parse --min-mins arg (default 3 = rewrite articles <=3 min read)
  const minMinsArg = process.argv.find(function(a) { return a.startsWith('--min-mins='); });
  const maxMins = minMinsArg ? parseInt(minMinsArg.split('=')[1]) : 3;
  const BATCH = 10; // Rewrite 10 per run (quality focus)

  console.log('Targeting English articles with reading_time_mins <=', maxMins);

  // --- Show Overall Status ---
  const { count: pendingCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .eq('language', 'en')
    .lte('reading_time_mins', maxMins);
    
  const { count: completedCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .eq('language', 'en')
    .gt('reading_time_mins', maxMins);

  console.log('\n📊 STATUS REPORT:');
  console.log(`✅ Completed (1200+ words): ${completedCount || 0} articles`);
  console.log(`⏳ Pending (Short/Thin):    ${pendingCount || 0} articles\n`);

  // Fetch thin articles, oldest first (they're the most outdated)
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, title, category')
    .eq('is_published', true)
    .eq('language', 'en')
    .lte('reading_time_mins', maxMins)
    .order('reading_time_mins', { ascending: true })
    .order('published_at', { ascending: true })
    .limit(BATCH);

  if (error) { console.error('Fetch error:', error); return; }
  if (!articles || articles.length === 0) {
    console.log('No thin articles found. All articles are above', maxMins, 'min read. Done!');
    return;
  }
  console.log('Found', articles.length, 'thin articles to rewrite.');

  let formatIndex = 0;
  let rewritten = 0;
  let failed = 0;

  for (const article of articles) {
    console.log('\n[' + (formatIndex + 1) + '/' + articles.length + '] Rewriting [Format ' + ((formatIndex % 3) + 1) + '/3]: "' + article.title + '"');

    const systemPrompt = getSystemPrompt(formatIndex);
    formatIndex++;

    const userMessage = 'Rewrite this article completely with fresh, detailed content:\n\nTitle: "' + article.title + '"\nCategory: ' + (article.category || 'womens-health') + '\n\nThis MUST be 1200+ words total. Make it feel genuinely helpful and human-written.';

    const result = await callAI(systemPrompt, userMessage);
    if (!result) {
      console.error('  ❌ All APIs failed. Skipping.');
      failed++;
      continue;
    }

    let parsed;
    try {
      const cleaned = result.text.replace(/^```json\n?|```$/gm, '').trim();
      parsed = JSON.parse(cleaned);
    } catch(e) {
      console.error('  ❌ JSON parse failed. Skipping.');
      failed++;
      continue;
    }

    const wordCount = countWords(parsed);
    const readingTimeMins = Math.max(3, Math.ceil(wordCount / 200));
    console.log('  Word count:', wordCount, '| via', result.source, '| ~' + readingTimeMins + ' min read');

    if (wordCount < 700) {
      console.error('  ❌ Still too short (' + wordCount + ' words). Skipping update.');
      failed++;
      continue;
    }

    if (isDryRun) {
      console.log('  [DRY RUN] Would update: ' + article.slug + ' (' + wordCount + ' words)');
      rewritten++;
    } else {
      const { error: updateErr } = await supabase
        .from('articles')
        .update({
          meta_description: parsed.meta_description,
          intro: parsed.intro,
          expert_tip: parsed.expert_tip,
          content_json: parsed.content_json,
          reading_time_mins: readingTimeMins,
          published_at: new Date().toISOString(), // Refresh date — signals to Google it's updated
        })
        .eq('id', article.id);

      if (updateErr) {
        console.error('  ❌ DB update error:', updateErr.message);
        failed++;
      } else {
        console.log('  ✅ Updated:', article.slug);
        rewritten++;
      }
    }

    // Delay
    const delay = result.source === 'groq' ? 2500 : 5000;
    await new Promise(function(r) { setTimeout(r, delay); });
  }

  console.log('\n=== Rewrite Complete ===');
  console.log('Rewritten:', rewritten, '| Failed:', failed);
  console.log('Run again to rewrite the next batch.');
}

rewriteThinArticles();
