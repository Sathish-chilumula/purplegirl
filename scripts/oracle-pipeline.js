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

async function getFallbackCategoryId() {
  const { data } = await supabase.from('categories').select('id').limit(1).single();
  return data?.id;
}

const SYSTEM_PROMPT = `
You are "PurpleGirl"—a smart, calm, and trustworthy "elder sister" figure.
Your purpose is to provide clear, honest, and judgment-free answers to questions girls feel uncomfortable asking elsewhere.

TONE: Warm, calm, respectful, honest but not harsh. Caring and intelligent.

STRUCTURE:
1. Reassurance: Normalize the question.
2. Clear explanation: Why/What.
3. Practical guidance: Actionable steps.
4. Gentle closing: Supportive.

Format your output as a JSON object with the following fields:
- summary: A short, poetic, and reassuring summary (2 sentences).
- chat_log: An array of strings (paragraphs). Follow the 4-step structure above.
- bullet_points: 3-4 actionable pieces of practical guidance.
- faqs: Related questions (q and a).
- disclaimer: A gentle medical/professional disclaimer (e.g., "Talk to a doctor if this continues").
`;

async function processSeed(seed, fallbackCatId) {
  console.log(`Processing: "${seed.title}"`);
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `The Question: ${seed.title}\nContext: ${seed.description}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const answerData = JSON.parse(completion.choices[0].message.content);

    const slug = seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50) + '-' + Math.floor(Math.random()*1000);
    const qId = crypto.randomUUID();

    const { error: qErr } = await supabase.from('questions').insert({
      id: qId,
      title: seed.title,
      description: seed.description,
      slug: slug,
      category_id: seed.category_id || fallbackCatId,
      status: 'approved',
      view_count: Math.floor(Math.random() * 100),
      metoo_count: Math.floor(Math.random() * 20)
    });

    if (qErr) throw new Error(`Question Insert Error: ${qErr.message}`);

    const { error: aErr } = await supabase.from('answers').insert({
      question_id: qId,
      summary: answerData.summary,
      chat_log: answerData.chat_log,
      bullet_points: answerData.bullet_points,
      faqs: answerData.faqs,
      disclaimer: answerData.disclaimer || 'I am your sister, not a doctor. Please talk to a professional for serious concerns.'
    });

    if (aErr) throw new Error(`Answer Insert Error: ${aErr.message}`);

    console.log(`✅ Successfully processed: ${slug}`);
  } catch (error) {
    console.error(`❌ Failed to process seed:`, error);
  }
}

async function run() {
  console.log('Starting PurpleGirl Content Pipeline...');
  const catId = await getFallbackCategoryId();
  
  if (!catId) {
    console.error('No categories found. Cannot run pipeline.');
    process.exit(1);
  }

  const seedsData = await fs.readFile('./data/question-seeds.json', 'utf-8');
  const seeds = JSON.parse(seedsData);

  for (const seed of seeds) {
    await processSeed(seed, catId);
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
