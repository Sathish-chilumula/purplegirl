import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const groqKey = process.env.GROQ_API_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function generateForQuestion(q: { id: string; title: string; description: string; category_name: string }) {
  const prompt = `
    You are "PurpleGirl", an extremely empathetic AI life assistant — an elder sister persona for young women in India.
    The user sent you a personal message. Reply like you are texting her back on WhatsApp.
    
    Topic: ${q.category_name}
    User's Message: "${q.title}"
    Context: ${q.description || 'None provided'}

    Reply in chat bubbles. Follow this order:
    1. Emotional reassurance bubble
    2. Practical 3-step advice bubble  
    3. A soft follow-up question bubble

    For Fashion/Beauty/Skincare topics, include product_keywords.

    RETURN ONLY valid JSON (nothing else):
    {
      "chat_bubbles": ["bubble 1 text", "bubble 2 text", "bubble 3 text"],
      "product_keywords": []
    }
  `;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) { console.error('Groq error:', await res.text()); return; }

  const result = await res.json();
  const raw = result.choices?.[0]?.message?.content;
  if (!raw) { console.error('Empty response'); return; }

  const data = JSON.parse(raw);

  const products = (data.product_keywords || []).map((kw: string) => ({
    title: `Top Rated ${kw}`,
    link: `https://amazon.in/s?k=${encodeURIComponent(kw)}`,
    price: 'View on Amazon',
    image: `https://picsum.photos/seed/${encodeURIComponent(kw)}/200/200`
  }));

  const { error } = await supabaseAdmin.from('answers').insert({
    question_id: q.id,
    chat_log: data.chat_bubbles,
    products: products.length > 0 ? products : null,
    ai_model: 'llama-3.3-70b-versatile'
  });

  if (error) console.error('DB insert error:', error.message);
  else console.log(`✅ Answer saved for: "${q.title.slice(0, 50)}..."`);
}

async function run() {
  // Fetch all answered question IDs first
  const { data: answeredRows } = await supabaseAdmin.from('answers').select('question_id');
  const answeredIds = answeredRows?.map(r => r.question_id) || [];

  // Fetch all approved questions without an answer
  let query = supabaseAdmin
    .from('questions')
    .select('id, title, description, categories(name)')
    .eq('status', 'approved');

  if (answeredIds.length > 0) {
    query = query.not('id', 'in', `(${answeredIds.map(id => `"${id}"`).join(',')})`);
  }

  const { data: questions, error } = await query;

  if (error || !questions?.length) {
    console.log('No questions need answers.', error?.message);
    return;
  }

  console.log(`\n🌸 Found ${questions.length} questions without answers. Generating...\n`);

  for (const q of questions) {
    await generateForQuestion({
      id: q.id,
      title: q.title,
      description: q.description || '',
      category_name: (q.categories as any)?.name || 'General',
    });
    await new Promise(r => setTimeout(r, 800));
  }

  console.log('\n✨ All done!');
}

run().catch(console.error);
