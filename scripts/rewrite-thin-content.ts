import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

if (!supabaseUrl || !supabaseKey || !groqApiKey) {
  console.error("Missing required environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const groq = new Groq({ apiKey: groqApiKey });

// Word count utility
function getWordCount(article: any): number {
  let text = article.intro || '';
  if (article.content_json?.steps) {
    for (const step of article.content_json.steps) {
      text += ' ' + (step.headline || '') + ' ' + (step.body || '') + ' ' + (step.tip || '') + ' ' + (step.warning || '');
    }
  }
  if (article.expert_tip) {
    text += ' ' + article.expert_tip;
  }
  if (article.content_json?.faqs) {
    for (const faq of article.content_json.faqs) {
      text += ' ' + (faq.q || '') + ' ' + (faq.a || '');
    }
  }
  return text.trim().split(/\s+/).length;
}

const MIN_WORD_COUNT = 800;

async function processArticles() {
  console.log(`\n🔍 Scanning for articles with < ${MIN_WORD_COUNT} words...`);

  // Fetch all published articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, category, intro, content_json, expert_tip')
    .eq('is_published', true);

  if (error) {
    console.error("Error fetching articles:", error);
    return;
  }

  const thinArticles = articles.filter(a => getWordCount(a) < MIN_WORD_COUNT);
  
  console.log(`Found ${thinArticles.length} thin articles out of ${articles.length} total.`);
  
  if (thinArticles.length === 0) {
    console.log("✅ All articles are sufficiently detailed!");
    return;
  }

  console.log("\n🚀 Starting rewrite process (processing first 5 as a test run)...");
  
  // Test run: Only process the first 5 to avoid burning API limits accidentally
  const articlesToProcess = thinArticles.slice(0, 5);

  for (const article of articlesToProcess) {
    console.log(`\n⏳ Processing: "${article.title}" (Current words: ${getWordCount(article)})`);
    
    try {
      const prompt = `
You are an expert Indian woman's health/lifestyle writer with 10+ years of experience.
Rewrite the following article content to be deeply informative, empathetic, culturally nuanced for India, and authoritative (at least 800+ words total).
Do NOT sound like an AI. Include real-life scenarios, actionable deep advice, and expert nuance.

Title: ${article.title}
Category: ${article.category}
Current Intro: ${article.intro}
Current JSON Content: ${JSON.stringify(article.content_json)}

Output ONLY valid JSON matching this exact structure:
{
  "intro": "A deeply empathetic, relatable 2-3 paragraph intro...",
  "expert_tip": "A highly specific, non-obvious piece of advice from a professional...",
  "content_json": {
    "things_needed": ["Item 1", "Item 2"],
    "steps": [
      {
        "step_number": 1,
        "headline": "Clear Actionable Headline",
        "body": "Detailed 2-3 paragraph explanation with real-world Indian context...",
        "tip": "Optional expert tip",
        "warning": "Optional safety warning"
      }
    ],
    "faqs": [
      { "q": "Common question?", "a": "Detailed answer." }
    ]
  }
}
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) throw new Error("Empty response from AI");

      const rewritten = JSON.parse(responseContent);

      // Calculate new word count
      const newWordCount = getWordCount(rewritten);
      
      // Update in Supabase
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          intro: rewritten.intro,
          content_json: rewritten.content_json,
          expert_tip: rewritten.expert_tip,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id);

      if (updateError) throw updateError;

      console.log(`✅ Success: "${article.title}" updated! New word count: ~${newWordCount}`);

    } catch (err) {
      console.error(`❌ Failed to rewrite article ID ${article.id}:`, err);
    }
  }
  
  console.log("\n🎉 Test run complete. To process all articles, remove the \`.slice(0, 5)\` in the script.");
}

processArticles();
