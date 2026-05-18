const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTranslations() {
  console.log('Fetching most recent translated articles...\n');
  
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, language, title, published_at')
    .neq('language', 'en')
    .order('published_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Error fetching articles:', error.message);
    return;
  }
  
  if (data.length === 0) {
    console.log('No translated articles found in the database yet.');
  } else {
    data.forEach(article => {
      console.log(`[${article.language.toUpperCase()}] ${article.title}`);
      console.log(`URL Path: /${article.language}/how-to/${article.slug}`);
      console.log(`Published: ${article.published_at}\n`);
    });
  }
}

checkTranslations();
