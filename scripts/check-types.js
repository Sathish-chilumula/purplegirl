require('dotenv').config({path: '.env.local'});
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('articles').select('tags, related_article_slugs').limit(1).then(r => {
  console.log(r.data[0]);
  console.log('tags type:', Array.isArray(r.data[0].tags) ? 'array' : typeof r.data[0].tags);
});
