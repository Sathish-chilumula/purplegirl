const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function markOptimized() {
  console.log('Fetching articles with reading_time_mins >= 4...');
  
  // First, find how many we are going to update
  const { data: articles, error: fetchError } = await supabase
    .from('articles')
    .select('id')
    .gte('reading_time_mins', 4)
    .eq('language', 'en');
    
  if (fetchError) {
    console.error('Error fetching articles:', fetchError.message);
    return;
  }
  
  console.log(`Found ${articles.length} already-optimized articles. Updating...`);

  // Update them all
  const { error: updateError } = await supabase
    .from('articles')
    .update({ is_seo_optimized: true })
    .gte('reading_time_mins', 4)
    .eq('language', 'en');

  if (updateError) {
    console.error('❌ Error updating articles. Did you forget to add the column in Supabase?');
    console.error('Details:', updateError.message);
  } else {
    console.log(`✅ Successfully marked ${articles.length} articles as SEO optimized!`);
  }
}

markOptimized();
