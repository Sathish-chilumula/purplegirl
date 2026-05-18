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
    region: 'North India (Delhi, UP, MP, Rajasthan, Bihar, Jharkhand)',
    searchStyle: 'Hinglish — mix of Hindi and English words as typed on Indian phones. Women search in Hinglish, not pure Hindi.',
    exampleSearch: '"pcos symptoms kya hota hai", "husband se baat kaise kare", "pregnancy mein kya khaye"',
    tone: 'Warm, conversational Hinglish — like a close friend speaking. Use everyday words, not formal Sanskrit-heavy Hindi.',
    slug_style: 'Romanized Hinglish slug e.g. pcos-symptoms-kya-hote-hain or thyroid-ke-lakshan-hindi'
  },
  {
    code: 'te',
    name: 'Telugu',
    region: 'Andhra Pradesh and Telangana (Hyderabad, Vijayawada, Tirupati)',
    searchStyle: 'Tanglish — Telugu mixed with English. Modern Telugu women type in Roman script with English words mixed in.',
    exampleSearch: '"pcos symptoms in telugu", "husband tho ela matladadam", "pregnancy lo em tinavali"',
    tone: 'Friendly, conversational Tanglish — not formal Granthika Telugu. Use everyday Hyderabadi/Andhra expressions.',
    slug_style: 'Romanized Telugu/Tanglish slug e.g. pcos-symptoms-telugu-lo or thyroid-lakshyalu-telugu'
  },
  {
    code: 'bn',
    name: 'Bengali',
    region: 'West Bengal and Bangladesh (Kolkata, Dhaka)',
    searchStyle: 'Banglish — Bengali mixed with English, especially for health and tech terms.',
    exampleSearch: '"pcos er lakkhon", "sami r sathe kothay bolar upay", "pregnancy te ki khete hoy"',
    tone: 'Warm, modern Kolkata-style Bengali — not overly formal. Use common Banglish expressions women use daily.',
    slug_style: 'Romanized Bengali slug e.g. pcos-er-lakkhan-bangla or thyroid-er-somossa-bangla'
  },
  {
    code: 'mr',
    name: 'Marathi',
    region: 'Maharashtra (Mumbai, Pune, Nashik, Nagpur)',
    searchStyle: 'Modern Marathi mixed with English — Mumbai/Pune style. Women search in casual Marathi, not literary Marathi.',
    exampleSearch: '"pcos che lakshane", "navarasheshi kasa bolayche", "pregnancy madhe kay khayche"',
    tone: 'Casual, warm Marathi — Mumbai/Pune style. Use everyday expressions, not classical Marathi. Mix English words naturally.',
    slug_style: 'Romanized Marathi slug e.g. pcos-che-lakshan-marathi or thyroid-chi-lakshane-marathi'
  },
  {
    code: 'ta',
    name: 'Tamil',
    region: 'Tamil Nadu and Sri Lanka Tamils (Chennai, Coimbatore, Madurai)',
    searchStyle: 'Tanglish Tamil — Tamil words written in English letters, mixed with English terms for health/tech.',
    exampleSearch: '"pcos symptoms tamil", "kaanavali arikurigal", "pregnancy la enna saapidanum"',
    tone: 'Warm, conversational Chennai/Coimbatore Tamil — not Sangam literature style. Natural modern Tamil women speak.',
    slug_style: 'Romanized Tamil slug e.g. pcos-arikurigal-tamil or thyroid-anru-tamil'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    region: 'Gujarat (Ahmedabad, Surat, Vadodara, Rajkot)',
    searchStyle: 'Modern Gujarati mixed with Hindi and English. Gujarat women search in casual Gujarati-Hinglish.',
    exampleSearch: '"pcos na lakshan", "pati sathe vaat kevi rite karvi", "pregnancy ma shu khavu"',
    tone: 'Warm, practical Gujarati — Ahmedabad/Surat style. Use everyday Gujarati, not archaic forms. Mix common English words.',
    slug_style: 'Romanized Gujarati slug e.g. pcos-na-lakshan-gujarati or thyroid-na-lakshan-gujarati'
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
    'CRITICAL RULES:\n' +
    '1. Write how women in ' + lang.region + ' actually talk — not like a translation\n' +
    '2. Keep medical/legal terms in English (PCOS, thyroid, IVF, FIR, etc.) — women search these in English\n' +
    '3. Keep brand names in English (Amazon, Flipkart, Menstrupedia, etc.)\n' +
    '4. Adapt food/city/cultural references to ' + lang.region + ' specifically\n' +
    '5. Each step body: 120+ words minimum\n' +
    '6. Total adapted content: 1000+ words\n' +
    '7. tip and warning should be null for most steps — only use when genuinely needed\n\n' +
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
    .gte('reading_time_mins', 4); // Eligible for translation

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

  // Fetch recent English articles, best quality first (longest reading time = most content)
  const ARTICLES_PER_RUN = 5; // 5 articles × 6 langs = 30 AI calls per run
  const { data: englishArticles, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, subcategory, meta_description, intro, expert_tip, content_json, reading_time_mins')
    .eq('language', 'en')
    .eq('is_published', true)
    .gte('reading_time_mins', 4) // Only translate quality articles (4+ min = ~800+ words)
    .order('reading_time_mins', { ascending: false })
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
