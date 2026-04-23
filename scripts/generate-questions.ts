import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import slugify from 'slugify';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const groqKey = process.env.GROQ_API_KEY || '';
const geminiKey = process.env.GEMINI_API_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

async function generateTrendingQuestions() {
  console.log("Brainstorming new questions with AI...");

  const niches = [
    { name: 'Fashion & Style',       slug: 'fashion-style' },
    { name: 'Relationships & Love',  slug: 'relationships-love' },
    { name: 'Pregnancy & Baby Care', slug: 'pregnancy-baby-care' },
    { name: 'Career & Money',        slug: 'career-money' },
    { name: 'Beauty & Skincare',     slug: 'beauty-skincare' },
    { name: 'Mental Wellness',       slug: 'mental-wellness' },
    { name: 'Health Basics',         slug: 'health-basics' },
    { name: 'Haircare',              slug: 'haircare' },
    { name: 'Self-Care & Glow Up',   slug: 'self-care-glow-up' },
    { name: 'Food & Nutrition',      slug: 'food-nutrition' },
  ];

  const targetNiche = niches[Math.floor(Math.random() * niches.length)];
  console.log(`Targeting niche: ${targetNiche.name}`);

  const prompt = `
    You are a trend-spotter for "PurpleGirl", an anonymous Q&A platform for Indian women and girls.
    Your task is to generate 15 highly relatable, human-like questions that women are likely searching for right now.
    
    Category: ${targetNiche.name}
    Tone: Personal, curious, vulnerable, or practical. 
    Context: Imagine a girl asking her elder sister for advice.
    
    Requirements:
    1. The questions should be specific.
    2. Include a short 'description' for each question.
    3. Ensure they are culturally relevant to India.
    
    Return ONLY a JSON array in this format:
    [
      {
        "title": "Question text here?",
        "description": "Optional context...",
        "category_slug": "${targetNiche.slug}"
      }
    ]
  `;

  let newQuestions = [];

  // 1. Try Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      newQuestions = JSON.parse(result.response.text());
    } catch (err) {
      console.error("Gemini brainstorming failed:", err);
    }
  }

  // 2. Fallback to Groq
  if (newQuestions.length === 0 && groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const result = await response.json();
      newQuestions = JSON.parse(result.choices[0]?.message?.content || '[]');
    } catch (err) {
      console.error("Groq brainstorming failed:", err);
    }
  }

  if (newQuestions.length === 0) {
    console.error("All AI systems failed to brainstorm.");
    return;
  }

  console.log(`Generated ${newQuestions.length} new questions.`);

  for (const q of newQuestions) {
    const slug = slugify(q.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', q.category_slug).single();
    
    const { error } = await supabase.from('questions').insert({
      title: q.title,
      description: q.description || null,
      slug: slug,
      category_id: cat?.id || null,
      status: 'pending',
      is_seeded: true
    });

    if (error) console.error(`Error saving ${q.title}:`, error.message);
    else console.log(`Saved: ${q.title}`);
  }
}

generateTrendingQuestions();
