// scripts/oracle-pipeline.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs/promises');
const Groq = require('groq-sdk');
const crypto = require('crypto');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// We need an exact category ID mapping in a real setup.
// For now, we will fallback to the first category if we don't know the ID.
async function getFallbackCategoryId() {
  const { data } = await supabase.from('categories').select('id').limit(1).single();
  return data?.id;
}

const SYSTEM_PROMPT = `You are the Oracle of the Sisterhood, an empathetic, wise, and highly articulate persona.
You provide advice to young women regarding deeply personal questions about life, body, relationships, and career.
Format your output as a JSON object with the following fields:
- summary: A short, poetic summary (2 sentences).
- chat_log: An array of strings, where each string is a paragraph of your response. Use HTML formatting like <em> and <strong> for emphasis.
- bullet_points: An array of 3-4 actionable pieces of advice.
- faqs: An array of objects with 'q' and 'a' representing related questions.
- disclaimer: A short disclaimer if medical/legal advice is touched upon (or null).`;

async function processSeed(seed, fallbackCatId) {
  console.log(`Processing: "${seed.title}"`);
  
  try {
    // 1. Ask Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `The Question: ${seed.title}\nContext: ${seed.description}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const answerData = JSON.parse(completion.choices[0].message.content);

    // 2. Insert Question
    const slug = seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50) + '-' + Math.floor(Math.random()*1000);
    const qId = crypto.randomUUID();

    const { error: qErr } = await supabase.from('questions').insert({
      id: qId,
      title: seed.title,
      description: seed.description,
      slug: slug,
      category_id: fallbackCatId,
      status: 'approved',
      view_count: Math.floor(Math.random() * 100),
      metoo_count: Math.floor(Math.random() * 20)
    });

    if (qErr) throw new Error(`Question Insert Error: ${qErr.message}`);

    // 3. Insert Answer
    const { error: aErr } = await supabase.from('answers').insert({
      question_id: qId,
      summary: answerData.summary,
      chat_log: answerData.chat_log,
      bullet_points: answerData.bullet_points,
      faqs: answerData.faqs,
      disclaimer: answerData.disclaimer || 'For educational purposes only. Not professional advice.'
    });

    if (aErr) throw new Error(`Answer Insert Error: ${aErr.message}`);

    console.log(`✅ Successfully processed and inserted: ${slug}`);
  } catch (error) {
    console.error(`❌ Failed to process seed:`, error);
  }
}

async function run() {
  console.log('Starting Oracle Pipeline...');
  const catId = await getFallbackCategoryId();
  
  if (!catId) {
    console.error('No categories found in database. Cannot run pipeline.');
    process.exit(1);
  }

  const seedsData = await fs.readFile('./data/question-seeds.json', 'utf-8');
  const seeds = JSON.parse(seedsData);

  for (const seed of seeds) {
    await processSeed(seed, catId);
    // Add a delay to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Pipeline complete.');
}

run();
