import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import slugify from 'slugify';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const groqKey = process.env.GROQ_API_KEY || '';

if (!supabaseUrl || !supabaseKey || !groqKey) {
  console.error("Missing credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateTrendingQuestions() {
  console.log("Brainstorming new questions with AI...");

  const niches = [
    { name: 'Fashion & Styling', slug: 'fashion' },
    { name: 'Relationships', slug: 'relationships' },
    { name: 'Motherhood & Baby care', slug: 'motherhood-baby' },
    { name: 'Career & Money', slug: 'career-money' },
    { name: 'Beauty & Skincare', slug: 'beauty-skincare' },
    { name: 'Mental Wellness', slug: 'mental-wellness' }
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
    1. The questions should be specific (e.g., "How to style a white kurti for office" instead of "Fashion tips").
    2. Include a short 'description' for each question (like context she would provide).
    3. Ensure they are culturally relevant to India.
    
    Return ONLY a JSON array in this format:
    [
      {
        "title": "Question text here?",
        "description": "Optional context or details...",
        "category_slug": "${targetNiche.slug}"
      }
    ]
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    if (!content) throw new Error("No content from AI");

    const newQuestions = JSON.parse(content);
    if (!Array.isArray(newQuestions)) throw new Error("Invalid format from AI");

    console.log(`Generated ${newQuestions.length} new questions.`);

    for (const q of newQuestions) {
      const slug = slugify(q.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
      
      // Get category ID
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

  } catch (err) {
    console.error("Failed to generate questions:", err);
  }
}

generateTrendingQuestions();
