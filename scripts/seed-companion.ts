import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const SEED_QUESTIONS = [
  {
    title: "I feel so insecure about my skin because of terrible acne, I don't want to go to college.",
    description: "I've been breaking out so bad lately on my cheeks and nothing works. Everyone else has clear skin and I feel so ugly. I just cancel plans now.",
    category_slug: 'beauty-skincare',
  },
  {
    title: "I feel like I'm dragging out a toxic relationship because I'm scared to be alone.",
    description: "We fight constantly, he doesn't respect my boundaries, but the thought of being single at 26 terrifies me. How do I find the courage to leave?",
    category_slug: 'relationships-love',
  },
  {
    title: "What are some effortless but stylish outfit ideas for an office party?",
    description: "I have a corporate party coming up, dress code is smart casual. I want to look professional but still cute and fashionable, not boring.",
    category_slug: 'fashion-style',
  },
  {
    title: "I literally have zero motivation to workout or eat healthy. Help?",
    description: "I sit at my desk for 10 hours a day and then just want to eat junk food and watch Netflix. How do I start taking care of my body without it feeling overwhelming?",
    category_slug: 'health-basics',
  },
  {
    title: "How do I deal with a toxic and controlling mother-in-law without ruining my marriage?",
    description: "She criticizes everything I do, from how I cook to how I dress, and my husband always takes her side. I feel completely alone and exhausted.",
    category_slug: 'relationships-love',
  },
  {
    title: "My hair is falling out in clumps after having a baby, is this normal?",
    description: "It's been 3 months postpartum and every time I shower or brush my hair, so much comes out. I am terrified I am going to go bald.",
    category_slug: 'haircare',
  },
  {
    title: "I am 22 with absolutely no savings. Is my life already over financially?",
    description: "I see everyone posting about their investments and savings and I'm literally living paycheck to paycheck. I feel so far behind. Where do I even start?",
    category_slug: 'lifestyle',
  },
  {
    title: "I feel like a complete failure. I cried at work and everyone saw.",
    description: "I lost it during a stressful sprint review meeting and started crying. I felt so embarrassed and unprofessional. Now I can't stop thinking everyone thinks I am weak.",
    category_slug: 'mental-wellness',
  },
];

async function seed() {
  console.log('🌱 Seeding companion questions...');

  for (const q of SEED_QUESTIONS) {
    // get category id
    const { data: cat } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', q.category_slug)
      .single();

    if (!cat) continue;

    // insert question
    const { data: insertedQ } = await supabaseAdmin
       .from('questions')
       .insert({
          title: q.title,
          description: q.description,
          category_id: cat.id,
          status: 'pending',
          slug: q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) + '-' + Math.random().toString(36).substring(2, 7)
       })
       .select()
       .single();
    
    if (insertedQ) {
       console.log(`✅ Inserted question: ${q.title}`);
       
       // Trigger the conversational generation!
       const prompt = `
          You are "PurpleGirl", an extremely smart, empathetic, and culturally-aware elder sister and personal AI life assistant for young women in India.
          
          Topic: ${q.category_slug}
          User's Message: "${q.title}"
          Context: ${q.description}

          Your response should be broken down into individual "chat bubbles" so it feels like a real-time conversation.
          1. Bubble 1: Pure emotional reassurance.
          2. Bubble 2: Practical, actionable, step-by-step guidance.
          3. Bubble 3 (Optional): Ask a warm follow-up question.

          If her message is related to Fashion or Beauty, suggest 'product_keywords'.

          Return ONLY this exact JSON schema:
          {
            "chat_bubbles": [
              "Oh honey, I am so sorry you're feeling this...",
              "Here is what I think we should do next. First..."
            ],
            "product_keywords": ["cleanser"]
          }
       `;

       const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           model: 'llama-3.3-70b-versatile',
           response_format: { type: 'json_object' },
           messages: [{ role: 'user', content: prompt }]
         })
       });

       if (!groqRes.ok) {
         const err = await groqRes.text();
         console.error(`❌ Groq API error for "${q.title}":`, err);
         continue;
       }

       const result = await groqRes.json();
       const raw = result.choices?.[0]?.message?.content;
       if (!raw) { console.error('❌ Empty Groq response'); continue; }
       const answerData = JSON.parse(raw);

       let affiliatedProducts = [];
       if (answerData.product_keywords && answerData.product_keywords.length > 0) {
         affiliatedProducts = answerData.product_keywords.map((kw: any) => ({
           title: `Top Rated ${kw}`, link: `https://amazon.in/s?k=${kw}`, price: 'Featured', image: `https://picsum.photos/seed/${kw}/200/200`
         }));
       }

       await supabaseAdmin.from('answers').insert({
         question_id: insertedQ.id,
         chat_log: answerData.chat_bubbles,
         products: affiliatedProducts.length > 0 ? affiliatedProducts : null,
         ai_model: 'llama3-70b-8192'
       });
       console.log(`💬 Generated compassionate response for: ${q.title}`);
       
       await supabaseAdmin.from('questions').update({ status: 'approved' }).eq('id', insertedQ.id);

       await new Promise(r => setTimeout(r, 1000));
    }
  }
}

seed().catch(console.error);

