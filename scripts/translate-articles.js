const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Target languages for translation
const TARGET_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' }
];

const TRANSLATION_PROMPT = `You are a professional translator and content writer for an Indian women's lifestyle platform.
Your task is to translate the provided JSON content into {TARGET_LANGUAGE}.
Maintain the warm, empathetic, and highly relatable "older sister" tone. Use everyday, natural conversational {TARGET_LANGUAGE} (not overly formal bookish language).

CRITICAL RULES:
1. Translate all string values EXCEPT keys. Keep JSON structure exactly the same.
2. Return ONLY raw JSON. No markdown backticks, no explanations.
3. Keep the original formatting and emojis intact.`;

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
    if (!groqRes.ok) throw new Error('Groq failed');
    const data = await groqRes.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.log("Groq failed, falling back to Gemini...");
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
      })
    });
    if (!geminiRes.ok) throw new Error('Gemini fallback failed');
    const data = await geminiRes.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }
}

async function translateArticles() {
  console.log('--- PurpleGirl Translation Job Started ---');
  
  // Fetch up to 10 English articles
  const { data: englishArticles, error: fetchErr } = await supabase
    .from('articles')
    .select('*')
    .eq('language', 'en')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(10);

  if (fetchErr) {
    console.error('Error fetching articles:', fetchErr);
    return;
  }

  if (!englishArticles || englishArticles.length === 0) {
    console.log('No English articles found to translate.');
    return;
  }

  console.log(`Found ${englishArticles.length} articles to check for translation.`);

  for (const article of englishArticles) {
    for (const lang of TARGET_LANGUAGES) {
      const translatedSlug = `${article.slug}-${lang.code}`;

      // Check if translation already exists
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', translatedSlug)
        .single();

      if (existing) {
        console.log(`[SKIP] Translation already exists: ${translatedSlug}`);
        continue;
      }

      console.log(`\nTranslating to ${lang.name}: ${article.title}`);

      // Prepare payload
      const payload = {
        title: article.title,
        meta_description: article.meta_description,
        intro: article.intro,
        expert_tip: article.expert_tip,
        content_json: article.content_json
      };

      try {
        const prompt = TRANSLATION_PROMPT.replace(/\{TARGET_LANGUAGE\}/g, lang.name);
        const translatedContent = await callAI(prompt, JSON.stringify(payload));

        // Insert into Supabase
        const { error: insertErr } = await supabase.from('articles').insert([{
          slug: translatedSlug,
          title: translatedContent.title,
          category: article.category,
          subcategory: article.subcategory,
          meta_description: translatedContent.meta_description,
          intro: translatedContent.intro,
          expert_tip: translatedContent.expert_tip,
          content_json: translatedContent.content_json,
          reading_time_mins: article.reading_time_mins,
          is_published: true, // Auto-publish translated articles
          language: lang.code,
          published_at: new Date().toISOString()
        }]);

        if (insertErr) {
          console.error(`❌ DB Insert Error for ${translatedSlug}:`, insertErr);
        } else {
          console.log(`✅ Successfully published translation: ${translatedSlug}`);
        }
      } catch (err) {
        console.error(`❌ Translation API Error for ${translatedSlug}:`, err.message);
      }
    }
  }
  console.log('--- Translation Job Complete ---');
}

translateArticles();
