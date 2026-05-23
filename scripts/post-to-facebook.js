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

  // For Facebook link posts, we strictly require a premium landscape card (1200x630) to prevent awkward cropping.
  if (!article.fb_image_url) {
    console.log(`Generating a premium landscape card on-the-fly for Facebook link preview: ${article.title}`);
    try {
      const publicUrl = await generatePin(article, 'landscape');
      if (publicUrl) {
        article.fb_image_url = publicUrl;
        // Persist the landscape card in Supabase to both fb_image_url and pin_image_url
        await supabase
          .from('articles')
          .update({ fb_image_url: publicUrl, pin_image_url: publicUrl })
          .eq('id', article.id);
        console.log(`✅ Successfully generated & persisted Facebook landscape card to both fields: ${publicUrl}`);
      }
    } catch (genError) {
      console.error(`Error generating card dynamically for ${article.slug}:`, genError);
    }
  } else {
    console.log(`Using existing landscape card: ${article.fb_image_url}`);
  }

  try {
    console.log(`Sending Photo Post data to Make.com Webhook for: ${article.title}`);
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/w84joit4qmhto0k2sx27lqoluq8y3cg6';
    
    const fullMessage = `${captionText}\n\nRead the full guide here:\n${articleUrl}`;

    const payload = {
      title: article.title,
      message: fullMessage,
      image_url: article.fb_image_url,
      article_url: articleUrl,
      language: article.language,
      category: article.category
    };

    const response = await axios.post(MAKE_WEBHOOK_URL, payload);

    // Make.com generally returns "Accepted" if successful. 
    // We will generate a unique timestamp-based ID to track it in our DB since Make handles the actual FB posting.
    console.log(`✅ Successfully sent to Make.com! Make Response: ${response.data}`);
    return `make_${Date.now()}`;

  } catch (error) {
    console.error(`❌ Error sending ${article.slug} to Make.com Webhook:`, error.message);
    return null;
  }
}

async function main() {
  // 1. Fetch unpublished/unposted Telugu articles (up to 3 in case of backfill)
  const { data: teArticles, error: teError } = await supabase
    .from('articles')
    .select('id, title, slug, category, language, meta_description, pin_image_url, fb_image_url, published_at')
    .eq('is_published', true)
    .eq('language', 'te')
    .is('facebook_id', null)
    .order('published_at', { ascending: false })
    .limit(3);

  if (teError) {
    console.error('Error fetching Telugu articles from Supabase:', teError);
    return;
  }

  // 2. Fetch unpublished/unposted English articles (up to 3 in case of backfill)
  const { data: enArticles, error: enError } = await supabase
    .from('articles')
    .select('id, title, slug, category, language, meta_description, pin_image_url, fb_image_url, published_at')
    .eq('is_published', true)
    .eq('language', 'en')
    .is('facebook_id', null)
    .order('published_at', { ascending: false })
    .limit(3);

  if (enError) {
    console.error('Error fetching English articles from Supabase:', enError);
    return;
  }

  const teList = teArticles || [];
  const enList = enArticles || [];

  console.log(`Found ${teList.length} Telugu articles and ${enList.length} English articles ready for Facebook posting.`);

  const selectedArticles = [];

  // Goal: Exactly 3 posts. Standard mix is 2 Telugu and 1 English.
  // We'll take up to 2 Telugu first, then up to 1 English.
  // Then we backfill if we didn't reach 3.

  // 1. Take up to 2 Telugu
  const teToTake = Math.min(teList.length, 2);
  for (let i = 0; i < teToTake; i++) {
    selectedArticles.push(teList[i]);
  }

  // 2. Take up to 1 English
  const enToTake = Math.min(enList.length, 1);
  for (let i = 0; i < enToTake; i++) {
    selectedArticles.push(enList[i]);
  }

  // 3. Backfill with Telugu if we still need more to reach 3, and we have leftover Telugu
  if (selectedArticles.length < 3 && teList.length > teToTake) {
    const leftoverTe = teList.slice(teToTake);
    const need = 3 - selectedArticles.length;
    const toTake = Math.min(leftoverTe.length, need);
    for (let i = 0; i < toTake; i++) {
      selectedArticles.push(leftoverTe[i]);
    }
  }

  // 4. Backfill with English if we still need more to reach 3, and we have leftover English
  if (selectedArticles.length < 3 && enList.length > enToTake) {
    const leftoverEn = enList.slice(enToTake);
    const need = 3 - selectedArticles.length;
    const toTake = Math.min(leftoverEn.length, need);
    for (let i = 0; i < toTake; i++) {
      selectedArticles.push(leftoverEn[i]);
    }
  }

  if (selectedArticles.length === 0) {
    console.log('No new articles found to post to Facebook.');
    return;
  }

  console.log(`Selected ${selectedArticles.length} article(s) to post to Facebook.`);
  for (const article of selectedArticles) {
    console.log(`- [${article.language.toUpperCase()}] ${article.title} (${article.slug})`);
  }

  for (const article of selectedArticles) {
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
