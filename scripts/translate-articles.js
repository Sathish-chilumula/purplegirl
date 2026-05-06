// translate-articles.js
// Translates recent English articles into Hindi and Telugu.
// Updated for the new [lang] routing architecture:
// - Uses the `language` column instead of slug suffix
// - Creates native, readable slugs (romanized)
// - Runs daily via GitHub Actions

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TARGET_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' }
];

const TRANSLATION_PROMPT = `You are a professional translator and content writer for an Indian women's lifestyle platform.
Your task is to translate the provided JSON content into {TARGET_LANGUAGE}.
Maintain the warm, empathetic, and highly relatable "older sister" tone. Use everyday, natural conversational {TARGET_LANGUAGE}.

CRITICAL RULES:
1. Translate all string values EXCEPT keys. Keep JSON structure exactly the same.
2. Also provide a "native_slug" field: a romanized {TARGET_LANGUAGE} slug (lowercase, hyphens, no spaces) that represents how an Indian woman would search for this topic in {TARGET_LANGUAGE}. Max 80 chars.
3. Return ONLY raw JSON. No markdown backticks, no explanations.
4. Keep the original formatting and emojis intact.`;

async function callAI(systemPrompt, userMessage) {
  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });
    if (!groqRes.ok) throw new Error(`Groq failed: ${groqRes.status}`);
    const data = await groqRes.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.log("Groq failed, falling back to Gemini...", error.message);
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
      })
    });
    if (!geminiRes.ok) throw new Error(`Gemini fallback failed: ${geminiRes.status}`);
    const data = await geminiRes.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }
}

function generateNativeSlug(englishSlug, langCode) {
  // Fallback: append the lang code to English slug
  // The AI will provide a better native_slug, but this is the safety fallback
  return `${englishSlug.substring(0, 70)}-${langCode}`;
}

async function translateArticles() {
  console.log('--- PurpleGirl Translation Job Started (v2 - locale routing) ---');
  
  // Fetch recent English articles that haven't been translated yet
  const { data: englishArticles, error: fetchErr } = await supabase
    .from('articles')
    .select('id, slug, title, meta_description, intro, expert_tip, content_json, category, subcategory, reading_time_mins')
    .eq('language', 'en')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5); // Translate 5 per run to stay within free API limits

  if (fetchErr) {
    console.error('Error fetching articles:', fetchErr);
    return;
  }

  if (!englishArticles || englishArticles.length === 0) {
    console.log('No English articles found to translate.');
    return;
  }

  console.log(`Found ${englishArticles.length} recent articles. Checking for missing translations...`);

  for (const article of englishArticles) {
    for (const lang of TARGET_LANGUAGES) {
      // Check if a translation already exists for this source article's slug base
      // We check by looking for any article with the same english slug BUT in the target language
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('language', lang.code)
        .or(`slug.eq.${article.slug}-${lang.code},slug.like.${article.slug.substring(0, 50)}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`[SKIP] ${lang.name} translation already exists for: ${article.slug}`);
        continue;
      }

      console.log(`\nTranslating "${article.title}" → ${lang.name}`);

      const payload = {
        title: article.title,
        meta_description: article.meta_description,
        intro: article.intro,
        expert_tip: article.expert_tip,
        content_json: article.content_json
      };

      try {
        const prompt = TRANSLATION_PROMPT.replace(/\{TARGET_LANGUAGE\}/g, lang.name);
        const translated = await callAI(prompt, JSON.stringify(payload));

        // Use the AI-provided native slug, or fall back to English slug + lang code
        const nativeSlug = (translated.native_slug || generateNativeSlug(article.slug, lang.code))
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .substring(0, 100);

        // Calculate reading time for translated content
        const contentText = JSON.stringify(translated.content_json) + ' ' + (translated.intro || '');
        const wordCount = contentText.split(/\s+/).length;
        const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

        const { error: insertErr } = await supabase.from('articles').insert([{
          slug: nativeSlug,
          title: translated.title,
          category: article.category,
          subcategory: article.subcategory,
          meta_description: translated.meta_description,
          intro: translated.intro,
          expert_tip: translated.expert_tip,
          content_json: translated.content_json,
          reading_time_mins: readingTimeMins,
          is_published: true,
          language: lang.code,
          published_at: new Date().toISOString()
        }]);

        if (insertErr) {
          console.error(`❌ DB Insert Error for ${nativeSlug}:`, insertErr.message);
        } else {
          console.log(`✅ Published ${lang.name} translation: ${nativeSlug}`);
        }
      } catch (err) {
        console.error(`❌ Translation API Error for ${article.slug} → ${lang.name}:`, err.message);
      }

      // Delay to avoid rate limits
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log('--- Translation Job Complete ---');
}

translateArticles();
