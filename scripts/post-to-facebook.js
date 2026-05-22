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

function getHashtags(category, language) {
  const hashtagsMap = {
    'relationships-marriage': {
      en: ['#Relationships', '#Marriage', '#Love', '#CoupleGoals', '#MarriageAdvice', '#PurpleGirl'],
      te: ['#సంబంధాలు', '#పెళ్లి', '#ప్రేమ', '#భార్యాభర్తలు', '#దాంపత్యజీవితం', '#Relationships', '#Marriage', '#PurpleGirl']
    },
    'womens-health': {
      en: ['#WomensHealth', '#SelfCare', '#Wellbeing', '#HealthyLiving', '#Wellness', '#PurpleGirl'],
      te: ['#మహిళలఆరోగ్యం', '#ఆరోగ్యచిట్కాలు', '#ఆరోగ్యం', '#స్వీయరక్షణ', '#WomensHealth', '#PurpleGirl']
    },
    'mental-health-emotions': {
      en: ['#MentalHealth', '#SelfLove', '#Mindfulness', '#EmotionalWellbeing', '#SelfGrowth', '#PurpleGirl'],
      te: ['#మానసికఆరోగ్యం', '#ఆత్మవిశ్వాసం', '#ధ్యానం', '#మనశ్శాంతి', '#MentalHealth', '#PurpleGirl']
    },
    'skin-beauty': {
      en: ['#SkinCare', '#BeautyTips', '#GlowingSkin', '#SelfCare', '#SkincareRoutine', '#PurpleGirl'],
      te: ['#చర్మారక్షణ', '#అందంచర్యలు', '#సౌందర్యచిట్కాలు', '#గ్లోయింగ్స్కిన్', '#SkinCare', '#PurpleGirl']
    },
    'family-parenting': {
      en: ['#Parenting', '#FamilyFirst', '#ParentingTips', '#Motherhood', '#FamilyTime', '#PurpleGirl'],
      te: ['#పేరెంటింగ్', '#కుటుంబం', '#పిల్లలపెంపకం', '#తల్లిదండ్రులు', '#Parenting', '#PurpleGirl']
    },
    'self-growth': {
      en: ['#SelfGrowth', '#PersonalDevelopment', '#Motivation', '#SelfImprovement', '#Inspiration', '#PurpleGirl'],
      te: ['#వ్యక్తిత్వవికాసం', '#ప్రేరణ', '#లక్ష్యాలు', '#ఆత్మవిశ్వాసం', '#SelfGrowth', '#PurpleGirl']
    },
    'self-growth-confidence': {
      en: ['#SelfGrowth', '#PersonalDevelopment', '#Motivation', '#SelfImprovement', '#Inspiration', '#PurpleGirl'],
      te: ['#వ్యక్తిత్వవికాసం', '#ప్రేరణ', '#లక్ష్యాలు', '#ఆత్మవిశ్వాసం', '#SelfGrowth', '#PurpleGirl']
    },
    'career-workplace': {
      en: ['#CareerGrowth', '#WorkLife', '#ProfessionalDevelopment', '#SuccessTips', '#PurpleGirl'],
      te: ['#కెరీర్', '#ఉద్యోగం', '#విజయం', '#ఉద్యోగఅవకాశాలు', '#CareerGrowth', '#PurpleGirl']
    },
    'baby-care-motherhood': {
      en: ['#BabyCare', '#Motherhood', '#ParentingTips', '#InfantHealth', '#NewBorn', '#NewMom', '#PurpleGirl'],
      te: ['#పిల్లలసంరక్షణ', '#తల్లిదండ్రులు', '#శిశుఆరోగ్యం', '#శిశుసంరక్షణ', '#BabyCare', '#Motherhood', '#PurpleGirl']
    },
    'food-indian-cooking': {
      en: ['#IndianCooking', '#HealthyRecipes', '#IndianFood', '#HealthyEating', '#Nutrition', '#CookingTips', '#PurpleGirl'],
      te: ['#వంటలు', '#ఆరోగ్యకరమైనఆహారం', '#భారతీయవంటలు', '#న్యూట్రిషన్', '#CookingTips', '#PurpleGirl']
    },
    'sex-intimacy': {
      en: ['#Intimacy', '#RelationshipAdvice', '#CouplesWellness', '#HealthySexLife', '#LoveLife', '#PurpleGirl'],
      te: ['#దాంపత్యం', '#శృంగారం', '#సంబంధాలు', '#Intimacy', '#HealthySexLife', '#PurpleGirl']
    },
    'finance-money': {
      en: ['#FinancialFreedom', '#MoneySavingTips', '#Budgeting', '#WomensFinance', '#SmartInvesting', '#PurpleGirl'],
      te: ['#ఆర్థికభద్రత', '#పొదుపుచిట్కాలు', '#బడ్జెట్', '#డబ్బుపొదుపు', '#WomensFinance', '#PurpleGirl']
    },
    'weight-fitness': {
      en: ['#WeightLoss', '#FitnessJourney', '#HealthyLiving', '#WomenFitness', '#WorkoutAtHome', '#PurpleGirl'],
      te: ['#బరువుతగ్గడం', '#ఫిట్‌నెస్', '#వ్యాయామం', '#ఆరోగ్యజీవితం', '#WeightLoss', '#Fitness', '#PurpleGirl']
    },
    'pregnancy-fertility': {
      en: ['#PregnancyTips', '#FertilityJourney', '#MaternityHealth', '#BabyPlanning', '#PrenatalCare', '#PurpleGirl'],
      te: ['#గర్భధారణ', '#ఫెర్టిలిటీ', '#గర్భిణీచిట్కాలు', '#సంతానోత్పత్తి', '#PregnancyTips', '#PurpleGirl']
    },
    'legal-rights': {
      en: ['#WomensRights', '#LegalAwareness', '#KnowYourRights', '#GenderEquality', '#LegalAdvice', '#PurpleGirl'],
      te: ['#మహిళలహక్కులు', '#చట్టపరమైనఅవగాహన', '#న్యాయసలహాలు', '#KnowYourRights', '#PurpleGirl']
    },
    'hair-care': {
      en: ['#HairCareRoutine', '#HealthyHair', '#HairFallSolutions', '#HairGrowthTips', '#HairStyle', '#PurpleGirl'],
      te: ['#జుట్టుసంరక్షణ', '#హెయిర్ఫాల్', '#నిగనిగలాడేజుట్టు', '#HairCare', '#PurpleGirl']
    },
    'fashion-style': {
      en: ['#FashionStyle', '#SareeLove', '#OOTD', '#WomensFashion', '#EthnicWear', '#IndianFashion', '#PurpleGirl'],
      te: ['#ఫ్యాషన్', '#సౌందర్యం', '#భారతీయఫ్యాషన్', '#FashionStyle', '#EthnicWear', '#PurpleGirl']
    },
    'home-household': {
      en: ['#HomeDecor', '#HouseholdTips', '#HomeOrganization', '#KitchenHacks', '#CleanHome', '#PurpleGirl'],
      te: ['#ఇంటిచిట్కాలు', '#ఆర్గనైజేషన్', '#గృహనిర్వహణ', '#CleanHome', '#HouseholdTips', '#PurpleGirl']
    },
    'festivals-traditions': {
      en: ['#IndianFestivals', '#Traditions', '#FestiveSeason', '#Culture', '#FestiveVibes', '#PurpleGirl'],
      te: ['#పండుగలు', '#సంస్కృతి', '#సంప్రదాయాలు', '#భారతీయపండుగలు', '#IndianFestivals', '#PurpleGirl']
    }
  };

  const catData = hashtagsMap[category] || {
    en: ['#SelfCare', '#Wellbeing', '#PurpleGirl'],
    te: ['#స్వీయరక్షణ', '#ఆరోగ్యం', '#SelfCare', '#PurpleGirl']
  };

  const tags = catData[language] || catData['en'];
  return tags.join(' ');
}

async function triggerFacebookScrape(articleUrl) {
  console.log(`Triggering programmatic Facebook crawler scrape for: ${articleUrl}`);
  try {
    const scrapeUrl = `https://graph.facebook.com/v20.0/`;
    await axios.post(scrapeUrl, null, {
      params: {
        id: articleUrl,
        scrape: true,
        access_token: facebookAccessToken
      }
    });
    console.log(`✅ Scraper trigger successful! Facebook has updated the OG cache.`);
  } catch (error) {
    console.error(`⚠️ Programmatic scraper warning (non-fatal):`, error.response ? error.response.data : error.message);
  }
}

async function postArticleToFacebook(article) {
  const SITE_URL = 'https://purplegirl.in';
  const langPrefix = article.language === 'en' ? '' : `/${article.language}`;
  const articleUrl = `${SITE_URL}${langPrefix}/how-to/${article.slug}`;

  // Formulate a beautiful message
  const emoji = article.category === 'relationships-marriage' ? '💕' : 
                article.category === 'womens-health' ? '🌸' : 
                article.category === 'mental-health-emotions' ? '🧘' : 
                article.category === 'skin-beauty' ? '✨' : '💜';
                
  // Generate category and language specific hashtags
  const hashtags = getHashtags(article.category, article.language);

  // Clean description WITHOUT raw URLs (Facebook clickable card handles redirects)
  const captionText = `${emoji} ${article.title}\n\n${article.meta_description || 'Read the full guide on PurpleGirl!'}\n\n${hashtags}`;

  // Check if we already have an image generated for this article (either landscape or portrait)
  const hasImage = article.fb_image_url || article.pin_image_url;
  
  if (!hasImage) {
    const titleHash = (article.slug || article.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const chosenFormat = (titleHash % 2 === 0) ? 'landscape' : 'portrait';
    console.log(`Generating a single rich card (format: ${chosenFormat}) on-the-fly for: ${article.title}`);
    
    try {
      const publicUrl = await generatePin(article, chosenFormat);
      if (publicUrl) {
        if (chosenFormat === 'landscape') {
          article.fb_image_url = publicUrl;
          article.pin_image_url = null;
          // Persist in Supabase, making sure pin_image_url is explicitly null
          await supabase
            .from('articles')
            .update({ fb_image_url: publicUrl, pin_image_url: null })
            .eq('id', article.id);
          console.log(`✅ Successfully generated & persisted Facebook landscape card: ${publicUrl}`);
        } else {
          article.pin_image_url = publicUrl;
          article.fb_image_url = null;
          // Persist in Supabase, making sure fb_image_url is explicitly null
          await supabase
            .from('articles')
            .update({ pin_image_url: publicUrl, fb_image_url: null })
            .eq('id', article.id);
          console.log(`✅ Successfully generated & persisted Pinterest portrait pin: ${publicUrl}`);
        }
      }
    } catch (genError) {
      console.error(`Error generating card dynamically for ${article.slug}:`, genError);
    }
  } else {
    const existingFormat = article.fb_image_url ? 'landscape' : 'portrait';
    console.log(`Using existing ${existingFormat} card: ${article.fb_image_url || article.pin_image_url}`);
  }

  // Programmatically trigger Facebook Scrape first so the preview card fetches our fb_image_url!
  await triggerFacebookScrape(articleUrl);

  try {
    console.log(`Posting Link Post to Facebook for: ${article.title}`);
    const response = await axios.post(`https://graph.facebook.com/v20.0/${facebookPageId}/feed`, {
      message: captionText,
      link: articleUrl,
    }, {
      headers: {
        'Authorization': `Bearer ${facebookAccessToken}`,
        'Content-Type': 'application/json'
      }
    });

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
    .select('id, title, slug, category, language, meta_description, pin_image_url, fb_image_url')
    .eq('is_published', true)
    .in('language', ['en', 'te'])
    .is('facebook_id', null)
    .limit(1); // Process exactly 1 article per run to test E2E and prevent rate limiting

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
