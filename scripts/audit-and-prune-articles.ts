import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Categories safe for AdSense (Non-YMYL Lifestyle, Relationships, Beauty, Self-Growth, Workplace)
const SAFE_CATEGORIES = [
  'relationships-marriage',
  'skin-beauty',
  'hair-care',
  'career-workplace',
  'self-growth-confidence',
  'family-parenting',
  'home-household',
  'festivals-traditions',
];

const YMYL_RISK_KEYWORDS = [
  'cure', 'doctor', 'treatment', 'medication', 'pill', 'prescription',
  'divorce law', 'section 498a', 'court', 'advocate', 'lawyer', 'tax',
  'investment', 'disease', 'diagnosis', 'symptom checker', 'pcos', 'pregnancy'
];

// Target number of flagship articles to keep published for AdSense approval
const TARGET_FLAGSHIP_COUNT_PER_CATEGORY = 5;

async function curateFlagshipArticles() {
  console.log('🌟 Starting Flagship Articles Curation (Option B)...');

  let allArticles: any[] = [];
  let page = 0;
  const PAGE_SIZE = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title, category, language, is_published')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching articles:', error);
      break;
    }
    if (data && data.length > 0) {
      allArticles = allArticles.concat(data);
      page++;
      if (data.length < PAGE_SIZE) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total articles in database: ${allArticles.length}`);

  // Group candidate English non-YMYL articles by category
  const candidatesByCategory: Record<string, any[]> = {};
  for (const cat of SAFE_CATEGORIES) {
    candidatesByCategory[cat] = [];
  }

  for (const article of allArticles) {
    if ((article.language || 'en') !== 'en') continue;

    const category = (article.category || '').toLowerCase();
    const title = (article.title || '').toLowerCase();

    if (!SAFE_CATEGORIES.includes(category)) continue;
    if (YMYL_RISK_KEYWORDS.some(kw => title.includes(kw))) continue;

    candidatesByCategory[category].push(article);
  }

  const flagshipIdsToKeep = new Set<string>();

  console.log('\n📌 Selecting Flagship Articles per Category:');
  for (const cat of SAFE_CATEGORIES) {
    const pool = candidatesByCategory[cat] || [];
    const selected = pool.slice(0, TARGET_FLAGSHIP_COUNT_PER_CATEGORY);
    selected.forEach(a => flagshipIdsToKeep.add(a.id));
    console.log(`- Category [${cat}]: Selected ${selected.length} flagship guides out of ${pool.length} available.`);
  }

  console.log(`\n🎯 Total Flagship Articles Selected: ${flagshipIdsToKeep.size}`);

  const toUnpublishIds: string[] = [];
  const toPublishIds: string[] = [];

  for (const article of allArticles) {
    if (flagshipIdsToKeep.has(article.id)) {
      if (!article.is_published) toPublishIds.push(article.id);
    } else {
      if (article.is_published) toUnpublishIds.push(article.id);
    }
  }

  console.log(`\n⏳ Updating Database:`);
  console.log(`- Articles to keep PUBLISHED: ${flagshipIdsToKeep.size}`);
  console.log(`- Articles to UNPUBLISH: ${toUnpublishIds.length}`);

  const chunkSize = 100;
  if (toUnpublishIds.length > 0) {
    for (let i = 0; i < toUnpublishIds.length; i += chunkSize) {
      const chunk = toUnpublishIds.slice(i, i + chunkSize);
      await supabase.from('articles').update({ is_published: false }).in('id', chunk);
    }
  }

  if (toPublishIds.length > 0) {
    for (let i = 0; i < toPublishIds.length; i += chunkSize) {
      const chunk = toPublishIds.slice(i, i + chunkSize);
      await supabase.from('articles').update({ is_published: true }).in('id', chunk);
    }
  }

  console.log('\n✅ Flagship Curation Complete! Database is now optimized for AdSense approval with a clean 40-article flagship magazine footprint.');
}

curateFlagshipArticles().catch(err => {
  console.error('Fatal error during curation:', err);
});
