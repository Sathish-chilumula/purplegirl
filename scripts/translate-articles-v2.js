// translate-articles-v2.js
// Translates English articles into all 6 Indian languages.
// Key difference from v1: NOT a word-for-word translation.
// Each language version is CULTURALLY ADAPTED:
//   - Uses search terms people actually type in that language/region
//   - Adapts examples to be region-specific (Bengal, Gujarat, Tamil Nadu etc.)
//   - Slug based on real search behavior in that language
//   - Natural conversational tone of that region's women

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TARGET_LANGUAGES = [
  {
    code: 'hi',
    name: 'Hindi',
    region: 'North India',
    script: 'Devanagari script (e.g., नमस्ते)',
    searchStyle: 'Conversational Hindi with English words, but EVERYTHING MUST BE WRITTEN IN DEVANAGARI SCRIPT.',
    exampleSearch: '"PCOS के लक्षण", "हस्बैंड से बात कैसे करें", "प्रेगनेंसी में क्या खाएं"',
    tone: 'Warm, conversational. Use everyday words written in Devanagari, not formal Sanskrit-heavy Hindi.',
    slug_style: 'Romanized Hinglish slug (ENGLISH LETTERS ONLY) e.g. pcos-symptoms-hindi'
  },
  {
    code: 'te',
    name: 'Telugu',
    region: 'Andhra Pradesh and Telangana',
    script: 'Telugu script (e.g., నమస్కారం)',
    searchStyle: 'Conversational Telugu mixed with English words, but EVERYTHING MUST BE WRITTEN IN TELUGU SCRIPT.',
    exampleSearch: '"PCOS లక్షణాలు", "భర్తతో ఎలా మాట్లాడాలి", "ప్రెగ్నెన్సీ లో ఏం తినాలి"',
    tone: 'Friendly, conversational. Use everyday Telugu expressions written in Telugu script.',
    slug_style: 'Romanized Telugu slug (ENGLISH LETTERS ONLY) e.g. pcos-symptoms-telugu'
  },
  {
    code: 'bn',
    name: 'Bengali',
    region: 'West Bengal',
    script: 'Bengali script (e.g., নমস্কার)',
    searchStyle: 'Conversational Bengali mixed with English words, but EVERYTHING MUST BE WRITTEN IN BENGALI SCRIPT.',
    exampleSearch: '"PCOS এর লক্ষণ", "স্বামীর সাথে কীভাবে কথা বলব", "প্রেগন্যান্সিতে কী খাবেন"',
    tone: 'Warm, modern Kolkata-style Bengali. Use common expressions written in Bengali script.',
    slug_style: 'Romanized Bengali slug (ENGLISH LETTERS ONLY) e.g. pcos-er-lakkhan-bangla'
  },
  {
    code: 'mr',
    name: 'Marathi',
    region: 'Maharashtra',
    script: 'Devanagari script (e.g., नमस्कार)',
    searchStyle: 'Conversational Marathi mixed with English words, but EVERYTHING MUST BE WRITTEN IN DEVANAGARI SCRIPT.',
    exampleSearch: '"PCOS ची लक्षणे", "नवऱ्याशी कसं बोलायचं", "प्रेग्नेंसी मध्ये काय खायचं"',
    tone: 'Casual, warm Marathi. Use everyday expressions written in Devanagari script.',
    slug_style: 'Romanized Marathi slug (ENGLISH LETTERS ONLY) e.g. pcos-che-lakshan-marathi'
  },
  {
    code: 'ta',
    name: 'Tamil',
    region: 'Tamil Nadu',
    script: 'Tamil script (e.g., வணக்கம்)',
    searchStyle: 'Conversational Tamil mixed with English words, but EVERYTHING MUST BE WRITTEN IN TAMIL SCRIPT.',
    exampleSearch: '"PCOS அறிகுறிகள்", "கணவரிடம் எப்படி பேசுவது", "கர்ப்ப காலத்தில் என்ன சாப்பிட வேண்டும்"',
    tone: 'Warm, conversational Chennai-style Tamil. Written entirely in Tamil script.',
    slug_style: 'Romanized Tamil slug (ENGLISH LETTERS ONLY) e.g. pcos-arikurigal-tamil'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    region: 'Gujarat',
    script: 'Gujarati script (e.g., નમસ્તે)',
    searchStyle: 'Conversational Gujarati mixed with English words, but EVERYTHING MUST BE WRITTEN IN GUJARATI SCRIPT.',
    exampleSearch: '"PCOS ના લક્ષણો", "પતિ સાથે કેવી રીતે વાત કરવી", "પ્રેગ્નેન્સી માં શું ખાવું"',
    tone: 'Warm, practical Gujarati. Written entirely in Gujarati script.',
    slug_style: 'Romanized Gujarati slug (ENGLISH LETTERS ONLY) e.g. pcos-na-lakshan-gujarati'
  }
];

function buildPrompt(lang) {
  return 'You are a professional content writer and cultural adaptation expert for PurpleGirl.in, an Indian women\'s advice platform.\n\n' +
    'Your task: Adapt English article content for ' + lang.name + '-speaking women in ' + lang.region + '.\n\n' +
    'THIS IS NOT A TRANSLATION. This is a CULTURAL ADAPTATION:\n' +
    '- Adapt examples to be specific to ' + lang.region + '\n' +
    '- Use search terms real women in this region actually type on Google\n' +
    '- Search style: ' + lang.searchStyle + '\n' +
    '- Example searches: ' + lang.exampleSearch + '\n' +
    '- Tone: ' + lang.tone + '\n\n' +
    'CRITICAL RULES FOR NATIVE SCRIPT:\n' +
    '1. ALL normal text MUST be written in the native ' + lang.script + ' (e.g. Hindi should be in Devanagari, Telugu in Telugu Lipi, etc.). Do NOT write the main sentence in English letters.\n' +
    '2. HOWEVER: ALL Medical terms (PCOS, Thyroid, IVF), technical terms, and Brand names MUST be written in ENGLISH LETTERS (A-Z). DO NOT transliterate them into ' + lang.script + '.\n' +
    '3. For example, write "PCOS के लक्षण" instead of "पीसीओएस के लक्षण". This makes it easier to read.\n' +
    '4. Adapt food/city/cultural references to ' + lang.region + ' specifically.\n' +
    '5. Each step body: 120+ words minimum.\n' +
    '6. Total adapted content: 1000+ words.\n' +
    '7. tip and warning should be null for most steps — only use when genuinely needed.\n\n' +
    'SLUG RULE: ' + lang.slug_style + '. Max 80 chars, lowercase, hyphens only.\n\n' +
    'OUTPUT: Return ONLY a valid JSON object. No markdown. No explanation outside JSON.\n\n' +
    '{\n' +
    '  "native_slug": "' + lang.slug_style.split(' e.g. ')[1] + '",\n' +
    '  "title": "Adapted title in ' + lang.name + ' (can keep English keywords)",\n' +
    '  "meta_description": "140-155 char description. Can be ' + lang.name + '+English mix.",\n' +
    '  "intro": "120-180 word opening in ' + lang.name + ' style. No bullet points.",\n' +
    '  "expert_tip": "One useful insight",\n' +
    '  "content_json": {\n' +
    '    "things_needed": ["3-5 items in ' + lang.name + '"],\n' +
    '    "steps": [\n' +
    '      {\n' +
    '        "step_number": 1,\n' +
    '        "headline": "Step heading in ' + lang.name + '",\n' +
    '        "body": "120+ word explanation in ' + lang.name + ' style. Include ' + lang.region + ' specific example.",\n' +
    '        "tip": null,\n' +
    '        "warning": null\n' +
    '      }\n' +
    '    ],\n' +
    '    "faqs": [\n' +
    '      { "q": "Question as women in ' + lang.region + ' would search it", "a": "70-120 word answer." }\n' +
    '    ]\n' +
    '  }\n' +
    '}';
}

async function callGroq(systemPrompt, userMessage) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      temperature: 0.6,
      max_tokens: 4096,
    })
  });
  if (!res.ok) throw new Error('Groq ' + res.status);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(systemPrompt, userMessage) {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 4096 }
        })
      }
    );
    if (res.ok) {
      const data = await res.json();
      console.log('  ✅ Gemini', model);
      return data.candidates[0].content.parts[0].text;
    }
    if (res.status === 429) throw new Error('Gemini quota exhausted');
  }
  throw new Error('All Gemini models failed');
}

async function callOpenAI(systemPrompt, userMessage) {
  if (!process.env.OPENAI_API_KEY) throw new Error('No OPENAI_API_KEY');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      temperature: 0.6,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })
  });
  if (!res.ok) throw new Error('OpenAI ' + res.status);
  const data = await res.json();
  console.log('  ✅ OpenAI GPT-4o-mini');
  return data.choices[0].message.content;
}

async function callAI(systemPrompt, userMessage) {
  try { return { text: await callGroq(systemPrompt, userMessage), source: 'groq' }; }
  catch(e) { console.warn('  Groq failed:', e.message); }
  if (process.env.GEMINI_API_KEY) {
    try { return { text: await callGemini(systemPrompt, userMessage), source: 'gemini' }; }
    catch(e) { console.warn('  Gemini failed:', e.message); }
  }
  if (process.env.OPENAI_API_KEY) {
    try { return { text: await callOpenAI(systemPrompt, userMessage), source: 'openai' }; }
    catch(e) { console.warn('  OpenAI failed:', e.message); }
  }
  return null;
}

// Check which translations already exist for a given English article slug
async function getMissingLangs(englishSlug, targetLangs) {
  // Check by 'source:englishSlug' in the tags array (new robust method)
  const { data: existingTags } = await supabase
    .from('articles')
    .select('language')
    .contains('tags', ['source:' + englishSlug])
    .eq('is_published', true)
    .neq('language', 'en');

  // Fallback to legacy slug pattern check just in case
  const { data: existingOld } = await supabase
    .from('articles')
    .select('language')
    .or(
      'slug.like.' + englishSlug.substring(0, 40) + '%,' +
      'slug.eq.' + englishSlug + '-hi,' +
      'slug.eq.' + englishSlug + '-te,' +
      'slug.eq.' + englishSlug + '-bn,' +
      'slug.eq.' + englishSlug + '-mr,' +
      'slug.eq.' + englishSlug + '-ta,' +
      'slug.eq.' + englishSlug + '-gu'
    )
    .eq('is_published', true)
    .neq('language', 'en');

  const combined = [...(existingTags || []), ...(existingOld || [])];
  const done = new Set(combined.map(function(a) { return a.language; }));
  
  return targetLangs.filter(function(l) { return !done.has(l.code); });
}

async function translateArticles() {
  console.log('--- PurpleGirl 6-Language Cultural Adaptation Job ---');
  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) console.log('DRY RUN: No DB inserts.');

  // Which languages to process (can filter with --lang=hi,te)
  const langArg = process.argv.find(function(a) { return a.startsWith('--lang='); });
  const selectedCodes = langArg ? langArg.split('=')[1].split(',') : null;
  const langs = selectedCodes
    ? TARGET_LANGUAGES.filter(function(l) { return selectedCodes.includes(l.code); })
    : TARGET_LANGUAGES;

  console.log('Target languages:', langs.map(function(l) { return l.code; }).join(', '));

  // --- Show Overall Status ---
  const { count: englishCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .eq('language', 'en')
    .eq('is_seo_optimized', true); // ONLY translate fully SEO optimized articles

  const { count: translatedCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .neq('language', 'en');

  const totalPossible = (englishCount || 0) * langs.length;
  const pendingCount = Math.max(0, totalPossible - (translatedCount || 0));

  console.log('\n📊 STATUS REPORT:');
  console.log(`✅ Eligible English (4+ mins): ${englishCount || 0} articles`);
  console.log(`✅ Completed Translations:     ${translatedCount || 0} pages`);
  console.log(`⏳ Pending Translations:       ~${pendingCount} pages\n`);

  // Fetch recent English articles that are officially SEO Optimized
  const ARTICLES_PER_RUN = 50; // 50 articles × 6 langs = 300 AI calls per run (approx 25 mins)
  const { data: englishArticles, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, subcategory, meta_description, intro, expert_tip, content_json, reading_time_mins')
    .eq('language', 'en')
    .eq('is_published', true)
    .eq('is_seo_optimized', true) // Only translate SEO Optimized articles
    .order('published_at', { ascending: false })
    .limit(ARTICLES_PER_RUN);

  if (error) { console.error('Fetch error:', error); return; }
  if (!englishArticles || englishArticles.length === 0) {
    console.log('No English articles found to translate.');
    return;
  }
  console.log('Found', englishArticles.length, 'quality English articles to process.');

  let success = 0, skipped = 0, failed = 0;

  for (const article of englishArticles) {
    console.log('\n📄 Article: "' + article.title.substring(0, 60) + '"');

    // Find which languages are missing translations for this article
    const missing = await getMissingLangs(article.slug, langs);
    if (missing.length === 0) {
      console.log('  ✓ All languages already translated. Skipping.');
      skipped++;
      continue;
    }
    console.log('  Missing languages:', missing.map(function(l) { return l.code; }).join(', '));

    for (const lang of missing) {
      console.log('\n  🌐 Adapting for', lang.name, '(' + lang.code + ')...');

      const systemPrompt = buildPrompt(lang);
      const userMessage = 'Culturally adapt this article for ' + lang.name + '-speaking women in ' + lang.region + '.\n\n' +
        'Original English article:\n' +
        'Title: "' + article.title + '"\n' +
        'Intro: ' + (article.intro || '').substring(0, 300) + '\n' +
        'Category: ' + (article.category || '') + '\n' +
        'Steps summary: ' + JSON.stringify((article.content_json && article.content_json.steps || []).map(function(s) {
          return { headline: s.headline, body: (s.body || '').substring(0, 100) };
        })) + '\n' +
        'FAQs: ' + JSON.stringify((article.content_json && article.content_json.faqs || []).slice(0, 3)) + '\n\n' +
        'Remember: Adapt for how ' + lang.region + ' women actually search and talk. Not a literal translation.';

      const result = await callAI(systemPrompt, userMessage);
      if (!result) {
        console.error('  ❌ All APIs failed for', lang.code);
        failed++;
        continue;
      }

      let adapted;
      try {
        const cleaned = result.text.replace(/^```json\n?|```$/gm, '').trim();
        adapted = JSON.parse(cleaned);
      } catch(e) {
        console.error('  ❌ JSON parse failed for', lang.code);
        failed++;
        continue;
      }

      // Build slug: use AI-provided native slug, fallback to english-slug + lang code
      let nativeSlug = (adapted.native_slug || (article.slug.substring(0, 60) + '-' + lang.code))
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100)
        .replace(/-$/, '');

      // Ensure uniqueness — append lang code if not already present
      if (!nativeSlug.endsWith('-' + lang.code) && !nativeSlug.includes(lang.code)) {
        nativeSlug = nativeSlug.substring(0, 90) + '-' + lang.code;
      }

      // Check slug is unique
      const { data: slugCheck } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', nativeSlug)
        .limit(1);

      if (slugCheck && slugCheck.length > 0) {
        nativeSlug = nativeSlug.substring(0, 85) + '-' + Date.now().toString().slice(-4);
      }

      const contentText = JSON.stringify(adapted.content_json || {}) + ' ' + (adapted.intro || '');
      const wordCount = contentText.split(/\s+/).length;
      const readingTimeMins = Math.max(3, Math.ceil(wordCount / 200));
      console.log('  Word count: ~' + wordCount + ' | via', result.source, '| slug:', nativeSlug);

      if (isDryRun) {
        console.log('  [DRY RUN] Would insert:', nativeSlug, '(' + lang.code + ')');
        success++;
        continue;
      }

      const { error: insertErr } = await supabase.from('articles').insert([{
        slug: nativeSlug,
        title: adapted.title || article.title,
        category: article.category,
        subcategory: article.subcategory,
        meta_description: adapted.meta_description,
        intro: adapted.intro,
        expert_tip: adapted.expert_tip,
        content_json: adapted.content_json,
        reading_time_mins: readingTimeMins,
        is_published: true,
        language: lang.code,
        tags: ['source:' + article.slug],
        published_at: new Date().toISOString()
      }]);

      if (insertErr) {
        console.error('  ❌ Insert error:', insertErr.message);
        failed++;
      } else {
        console.log('  ✅ Published', lang.name + ':', nativeSlug);
        success++;
      }

      // Rate limit delay: 3s between languages for same article
      await new Promise(function(r) { setTimeout(r, 3000); });
    }

    // 5s gap between articles
    await new Promise(function(r) { setTimeout(r, 5000); });
  }

  console.log('\n=== Translation Job Complete ===');
  console.log('Published:', success, '| Skipped:', skipped, '| Failed:', failed);
  console.log('Run again daily to translate more articles.');
}

translateArticles();
