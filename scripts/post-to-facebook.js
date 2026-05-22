require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { generatePin } = require('./generate-pins');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const facebookAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const facebookPageId = process.env.FACEBOOK_PAGE_ID;

if (!supabaseUrl || !supabaseServiceKey || !facebookAccessToken || !facebookPageId) {
  console.error('Missing required environment variables in .env.local');
  console.error('Please make sure you have set:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('- FACEBOOK_PAGE_ACCESS_TOKEN');
  console.error('- FACEBOOK_PAGE_ID');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function postArticleToFacebook(article) {
  const SITE_URL = 'https://purplegirl.in';
  const langPrefix = article.language === 'en' ? '' : `/${article.language}`;
  const articleUrl = `${SITE_URL}${langPrefix}/how-to/${article.slug}`;

  // Formulate a beautiful message
  const emoji = article.category === 'relationships-marriage' ? '💕' : 
                article.category === 'womens-health' ? '🌸' : 
                article.category === 'mental-health-emotions' ? '🧘' : 
                article.category === 'skin-beauty' ? '✨' : '💜';
                
  const captionText = `${emoji} ${article.title}\n\n${article.meta_description || 'Read the full guide on PurpleGirl!'}\n\n👉 Read the full guide here: ${articleUrl}`;

  // Ensure we have a generated image before posting!
  if (!article.pin_image_url) {
    console.log(`Generating pin image on-the-fly for: ${article.title}`);
    try {
      const publicUrl = await generatePin(article);
      if (publicUrl) {
        article.pin_image_url = publicUrl;
        // Persist it in Supabase so we have it saved!
        await supabase
          .from('articles')
          .update({ pin_image_url: publicUrl })
          .eq('id', article.id);
        console.log(`✅ Dynamically generated & persisted pin: ${publicUrl}`);
      }
    } catch (genError) {
      console.error(`Error generating pin dynamically for ${article.slug}:`, genError);
    }
  }

  try {
    let response;
    
    // If we have a generated image, post it as a high-engagement Photo Post!
    if (article.pin_image_url) {
      console.log(`Posting Photo Post to Facebook for: ${article.title}`);
      response = await axios.post(`https://graph.facebook.com/v20.0/${facebookPageId}/photos`, {
        url: article.pin_image_url,
        caption: captionText,
        published: true
      }, {
        headers: {
          'Authorization': `Bearer ${facebookAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Fallback: If no image is generated yet, post it as a standard Link Post
      console.log(`Posting Link Post to Facebook for: ${article.title}`);
      response = await axios.post(`https://graph.facebook.com/v20.0/${facebookPageId}/feed`, {
        message: `${emoji} ${article.title}\n\n${article.meta_description || 'Read the full guide on PurpleGirl!'}\n\n👉 Read more here:`,
        link: articleUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${facebookAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log(`✅ Successfully posted! Facebook ID: ${response.data.id}`);
    return response.data.id;

  } catch (error) {
    console.error(`❌ Error posting ${article.slug} to Facebook:`, error.response ? error.response.data : error.message);
    return null;
  }
}

async function main() {
  // Fetch articles that are published but haven't been posted to Facebook yet (English and Telugu only)
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, language, meta_description, pin_image_url')
    .eq('is_published', true)
    .in('language', ['en', 'te'])
    .is('facebook_id', null)
    .limit(5); // Publish up to 5 articles per run to keep pages natural and avoid spam flags

  if (error) {
    console.error('Error fetching articles from Supabase:', error);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('No new articles found to post to Facebook.');
    return;
  }

  console.log(`Found ${articles.length} article(s) ready to post to Facebook.`);

  for (const article of articles) {
    const facebookPostId = await postArticleToFacebook(article);
    if (facebookPostId) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ facebook_id: facebookPostId })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error updating article ${article.slug} with Facebook ID:`, updateError);
      }
    }
    
    // Add a delay between posts to avoid Facebook spam detection
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main();
