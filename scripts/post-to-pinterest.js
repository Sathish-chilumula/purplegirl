require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pinterestToken = process.env.PINTEREST_ACCESS_TOKEN;
const boardId = process.env.PINTEREST_BOARD_ID;

if (!supabaseUrl || !supabaseServiceKey || !pinterestToken || !boardId) {
  console.error('Missing required environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function postPinToPinterest(article) {
  console.log(`Posting Pin to Pinterest for: ${article.title}`);

  const SITE_URL = 'https://purplegirl.in';
  const langPrefix = article.language === 'en' ? '' : `/${article.language}`;
  const articleUrl = `${SITE_URL}${langPrefix}/how-to/${article.slug}`;

  try {
    const response = await axios.post('https://api.pinterest.com/v5/pins', {
      title: article.title,
      description: article.meta_description || article.title,
      link: articleUrl,
      media_source: {
        source_type: "image_url",
        url: article.pin_image_url
      },
      board_id: boardId
    }, {
      headers: {
        Authorization: `Bearer ${pinterestToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Successfully pinned! Pinterest ID: ${response.data.id}`);
    return response.data.id;

  } catch (error) {
    console.error(`Error pinning ${article.slug}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

async function main() {
  // Fetch articles that have a pin image but haven't been posted yet
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, language, pin_image_url, meta_description')
    .not('pin_image_url', 'is', null)
    .is('pinterest_id', null)
    .limit(5); // Small batch for testing

  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }

  console.log(`Found ${articles.length} pins ready to post.`);

  for (const article of articles) {
    const pinterestId = await postPinToPinterest(article);
    if (pinterestId) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ pinterest_id: pinterestId })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error updating article ${article.slug} with Pinterest ID:`, updateError);
      }
    }
    
    // Add a small delay between posts to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

main();
