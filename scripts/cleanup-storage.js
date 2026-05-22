require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupStorage() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const cutoffDate = oneMonthAgo.toISOString();

  console.log(`Looking for generated cards on articles published before ${cutoffDate}`);

  // Fetch articles older than 1 month that still have storage URLs
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, fb_image_url, pin_image_url')
    .lt('published_at', cutoffDate)
    .or('fb_image_url.not.is.null,pin_image_url.not.is.null');

  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('No old articles found that require image cleanup.');
    return;
  }

  console.log(`Found ${articles.length} articles to clean up.`);

  let deletedCount = 0;

  for (const article of articles) {
    const urls = [];
    if (article.fb_image_url) urls.push(article.fb_image_url);
    if (article.pin_image_url && article.pin_image_url !== article.fb_image_url) {
      urls.push(article.pin_image_url);
    }

    for (const url of urls) {
      // Extract file path from Supabase public URL
      // Example: https://[project].supabase.co/storage/v1/object/public/social_assets/fb_cards/en/slug.png
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/social_assets/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          // Delete file from the social_assets bucket
          const { error: removeError } = await supabase.storage
            .from('social_assets')
            .remove([filePath]);
          
          if (removeError) {
            console.error(`Failed to delete ${filePath}:`, removeError);
          } else {
            console.log(`✅ Deleted old storage file: ${filePath}`);
            deletedCount++;
          }
        }
      } catch (e) {
        console.error(`Invalid URL or parse error for ${url}:`, e.message);
      }
    }

    // Nullify the URLs in the database so website metadata gracefully skips instead of 404ing
    const { error: updateError } = await supabase
      .from('articles')
      .update({ fb_image_url: null, pin_image_url: null })
      .eq('id', article.id);
      
    if (updateError) {
        console.error(`Failed to nullify URLs for article ${article.id}:`, updateError);
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedCount} storage files.`);
}

if (require.main === module) {
  cleanupStorage();
}

module.exports = { cleanupStorage };
