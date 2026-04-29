/**
 * generate-quizzes.js
 * Generates highly shareable personality quizzes for PurpleGirl.in using Groq/Gemini.
 * 
 * Run locally: node scripts/generate-quizzes.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const QUIZ_SYSTEM_PROMPT = `
You are a quiz writer for PurpleGirl.in — India's #1 guide platform for women.
You write fun, emotionally resonant personality quizzes that Indian women 
actually want to share with their friends on WhatsApp and Instagram Stories.

YOUR QUIZ STYLE — study these WikiHow quiz titles as tone reference:
"Am I a Princess, Angel, Supermodel, or Baddie?"
"Who Is My Soulmate Quiz"
"What Type of Person Am I Quiz"
"Guess My Body Count"
These work because they're self-reflective, a little edgy, relatable, and shareable.

For PurpleGirl, same energy but India-specific and women-first:
- Questions must feel like something a best friend would ask, not a doctor
- Results must be flattering or validating — women share results they're proud of
- Use Indian cultural references naturally (chai, saree, WhatsApp aunties, joint family, etc.)
- NEVER make results feel like a diagnosis or judgment
- Every result title must be something a woman would screenshot and send to her bestie

Return ONLY valid JSON (no markdown, no backticks):
{
  "slug": "url-friendly-slug",
  "title": "Quiz title — should make her want to click immediately",
  "description": "One sentence — what she'll discover about herself",
  "thumbnail_emoji": "one emoji that represents this quiz",
  "questions_json": {
    "questions": [
      {
        "id": 1,
        "text": "Relatable scenario or self-reflective question",
        "options": [
          { "label": "Short, witty, honest option", "value": "A" },
          { "label": "Short, witty, honest option", "value": "B" },
          { "label": "Short, witty, honest option", "value": "C" },
          { "label": "Short, witty, honest option", "value": "D" }
        ]
      }
    ]
  },
  "result_types_json": {
    "scoring": "most_frequent",
    "results": [
      {
        "type": "A",
        "title": "The [Empowering Title] — e.g. The Quiet Storm, The Golden Didi, The Firecracker",
        "emoji": "one emoji",
        "description": "3-4 sentences. Warm, specific, validating. Make her feel seen and special.",
        "strengths": "2-3 word list of her superpowers",
        "famous_like": "An Indian actress, character, or icon she's like — e.g. Deepika in Piku",
        "share_text": "Shareable WhatsApp caption e.g. I got The Quiet Storm on PurpleGirl 👀 What are you?"
      }
    ]
  }
}

Rules:
- 8 questions exactly, 4 options each
- 4 result types (A, B, C, D) — all positive/empowering, no "bad" result
- Questions must escalate: start light (chai order, weekend plans) → get deeper (how you handle conflict, what you sacrifice)
- famous_like must be an Indian reference — Bollywood, cricket WAGs, mythology, TV characters
- share_text must end with a question to drive more quiz takers
`;

async function callGroq(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.85,
    }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.statusText}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: QUIZ_SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.statusText}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callAI(prompt) {
  try {
    if (GROQ_API_KEY) return await callGroq(prompt);
    throw new Error('No Groq key');
  } catch (e) {
    console.warn('Groq failed, trying Gemini:', e.message);
    return await callGemini(prompt);
  }
}

async function generateQuiz(topicTitle, category) {
  console.log(`Generating quiz: "${topicTitle}"...`);
  const prompt = `Write a viral quiz titled: "${topicTitle}". Category: ${category}. Remember to output ONLY valid JSON.`;
  
  try {
    const raw = await callAI(prompt);
    const cleaned = raw.replace(/```json\n?|```/gm, '').trim();
    const quizData = JSON.parse(cleaned);

    const { error } = await supabase
      .from('quizzes')
      .upsert({
        slug: quizData.slug,
        title: quizData.title,
        description: quizData.description,
        thumbnail_emoji: quizData.thumbnail_emoji,
        questions_json: quizData.questions_json,
        result_types_json: quizData.result_types_json,
        is_published: true,
        category: category,
      }, { onConflict: 'slug' });

    if (error) throw error;
    console.log(`✅ Saved quiz: ${quizData.slug}`);
    return quizData.slug;
  } catch (err) {
    console.error(`❌ Failed to generate quiz for "${topicTitle}":`, err.message);
    return null;
  }
}

async function main() {
  console.log('🌸 PurpleGirl Weekly Quiz Generator Started');
  
  const bankPath = path.join(__dirname, 'quiz-titles-bank.json');
  let bank = [];
  try {
    bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  } catch (e) {
    console.error("Could not read quiz-titles-bank.json");
    process.exit(1);
  }

  // Get up to 3 random topics
  const topicsToProcess = [];
  while (topicsToProcess.length < 3 && bank.length > 0) {
    const randIdx = Math.floor(Math.random() * bank.length);
    topicsToProcess.push(bank.splice(randIdx, 1)[0]);
  }

  if (topicsToProcess.length === 0) {
    console.log("No topics left in the bank!");
    process.exit(0);
  }

  console.log(`Selected ${topicsToProcess.length} topics to generate.`);

  for (const topic of topicsToProcess) {
    await generateQuiz(topic.title, topic.category);
    // Be nice to APIs
    await new Promise(r => setTimeout(r, 2000));
  }

  // Save the updated bank (with used topics removed)
  fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
  console.log(`\n🎉 Quiz generation complete. Remaining topics in bank: ${bank.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
