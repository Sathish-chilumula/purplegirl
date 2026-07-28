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
const SAFE_CATEGORIES = new Set([
  'relationships-marriage',
  'self-growth-confidence',
  'career-workplace',
  'skin-beauty',
  'hair-care',
  'family-parenting',
  'home-household',
  'festivals-traditions',
]);

// Keywords in titles that indicate strict YMYL clinical or legal risk
const YMYL_RISK_KEYWORDS = [
  'cure', 'doctor', 'treatment', 'medication', 'pill', 'prescription',
  'divorce law', 'section 498a', 'court', 'advocate', 'lawyer', 'tax',
  'investment', 'disease', 'diagnosis', 'symptom checker'
];

async function auditAndPrune() {
  console.log('🔍 Starting Article Quality & YMYL Audit...');

  let allArticles: any[] = [];
  let page = 0;
  const PAGE_SIZE = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title, category, is_published, language')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching articles from Supabase:', error);
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

  const articles = allArticles;
  console.log(`Total articles found in database across all pages: ${articles.length}`);

  let safeCount = 0;
  let ymylPrunedCount = 0;
  let nonEnglishPrunedCount = 0;

  const toUnpublishIds: string[] = [];

  for (const article of articles) {
    const category = (article.category || '').toLowerCase();
    const title = (article.title || '').toLowerCase();
    const language = article.language || 'en';

    // 1. Unpublish non-English articles during AdSense review phase
    if (language !== 'en') {
      toUnpublishIds.push(article.id);
      nonEnglishPrunedCount++;
      continue;
    }

    // 2. Check if category is YMYL (medical/legal/finance)
    const isSafeCategory = SAFE_CATEGORIES.has(category);
    const hasRiskKeyword = YMYL_RISK_KEYWORDS.some(kw => title.includes(kw));

    if (!isSafeCategory || hasRiskKeyword) {
      toUnpublishIds.push(article.id);
      ymylPrunedCount++;
    } else {
      safeCount++;
    }
  }

  console.log('\n📊 Audit Summary:');
  console.log(`- Safe Non-YMYL English Articles (Kept Published): ${safeCount}`);
  console.log(`- Clinical YMYL / Legal / Risk Articles (To Unpublish): ${ymylPrunedCount}`);
  console.log(`- Non-English Articles (To Unpublish during review): ${nonEnglishPrunedCount}`);

  if (toUnpublishIds.length > 0) {
    console.log(`\n⏳ Updating ${toUnpublishIds.length} articles to is_published = false...`);
    
    // Batch update in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < toUnpublishIds.length; i += chunkSize) {
      const chunk = toUnpublishIds.slice(i, i + chunkSize);
      const { error: updateErr } = await supabase
        .from('articles')
        .update({ is_published: false })
        .in('id', chunk);

      if (updateErr) {
        console.error(`Error updating chunk ${i}:`, updateErr);
      }
    }
    console.log('✅ Successfully unpublished YMYL and non-English articles for clean AdSense review!');
  } else {
    console.log('✅ No articles needed unpublishing.');
  }
}

auditAndPrune().catch(err => {
  console.error('Fatal error during audit:', err);
});
