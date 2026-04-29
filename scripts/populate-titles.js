/**
 * populate-titles.js
 * Generates a fresh batch of trending article titles for Indian women
 * and appends them to titles-bank.json
 *
 * Run: node scripts/populate-titles.js
 * Or triggered daily by GitHub Actions
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ─── Category Definitions ────────────────────────────────────────────────────
const CATEGORIES = [
  { slug: 'relationships-marriage',   label: 'Relationships & Marriage' },
  { slug: 'womens-health',            label: "Women's Health" },
  { slug: 'mental-health-emotions',   label: 'Mental Health & Emotions' },
  { slug: 'skin-beauty',              label: 'Skin & Beauty' },
  { slug: 'family-parenting',         label: 'Family & Parenting' },
  { slug: 'career-workplace',         label: 'Career & Workplace' },
  { slug: 'pregnancy-fertility',      label: 'Pregnancy & Fertility' },
  { slug: 'weight-fitness',           label: 'Weight & Fitness' },
  { slug: 'hair-care',                label: 'Hair Care' },
  { slug: 'finance-money',            label: 'Finance & Money' },
  { slug: 'self-growth-confidence',   label: 'Self-Growth & Confidence' },
  { slug: 'legal-rights',             label: 'Legal Rights for Women' },
];

// Pick 4 random categories per run to keep variety
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function callGroq(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 600,
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
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 600 },
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

async function generateTitlesForCategory(cat) {
  const prompt = `You are a content strategist for PurpleGirl.in — a WikiHow-style website for Indian women.

Your task: Generate exactly 8 "How To" article titles for the category: "${cat.label}"

Requirements:
- Each title must start with "How to" or be a clear guide title (like "Signs That...", "What To Do When...", "X Ways to...")
- Focus on REAL questions Indian women search on Google — think family pressure, health taboos, workplace issues, relationship problems, money struggles, beauty tips
- Titles must be specific, actionable, and emotionally resonant
- Mix serious topics with practical day-to-day advice
- Think like WikiHow + She The People + Sheroes combined

Return ONLY a valid JSON array of objects with this exact format (no extra text):
[
  { "title": "How to Deal with a Controlling Mother-in-Law Without Ruining Your Marriage", "category": "${cat.slug}" },
  ...8 total items
]`;

  try {
    const raw = await callAI(prompt);
    const cleaned = raw.replace(/```json\n?|```/gm, '').trim();
    const items = JSON.parse(cleaned);
    // Validate shape
    return items
      .filter((item) => item.title && item.category)
      .map((item) => ({
        title: item.title.trim(),
        category: cat.slug,
        slug: slugify(item.title.trim()).substring(0, 60),
      }));
  } catch (err) {
    console.error(`Failed to generate titles for ${cat.label}:`, err.message);
    return [];
  }
}

async function main() {
  console.log('🌸 PurpleGirl Title Bank Populator Started');

  const bankPath = path.join(__dirname, 'titles-bank.json');
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  } catch {
    existing = [];
  }
  const existingSlugs = new Set(existing.map((e) => e.slug));

  // Pick 4 categories to generate titles for this run
  const selectedCats = pickRandom(CATEGORIES, 4);
  console.log(`Generating titles for: ${selectedCats.map((c) => c.label).join(', ')}`);

  const newTitles = [];
  for (const cat of selectedCats) {
    console.log(`\nGenerating for: ${cat.label}...`);
    const titles = await generateTitlesForCategory(cat);
    // Deduplicate against existing bank
    const fresh = titles.filter((t) => !existingSlugs.has(t.slug));
    console.log(`  → Got ${titles.length} titles, ${fresh.length} are new`);
    newTitles.push(...fresh);
    fresh.forEach((t) => existingSlugs.add(t.slug));
    // Small delay
    await new Promise((r) => setTimeout(r, 1500));
  }

  const updated = [...existing, ...newTitles];
  fs.writeFileSync(bankPath, JSON.stringify(updated, null, 2));
  console.log(`\n✅ Added ${newTitles.length} new titles. Bank now has ${updated.length} total.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
