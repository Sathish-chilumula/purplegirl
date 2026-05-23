require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { generatePin } = require('./generate-pins');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const threadsAccessToken = process.env.THREADS_ACCESS_TOKEN;
const threadsUserId = process.env.THREADS_USER_ID;

if (!supabaseUrl || !supabaseServiceKey || !threadsAccessToken || !threadsUserId) {
  console.error('Missing required environment variables in .env.local');
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

async function postArticleToThreads(article) {
  const SITE_URL = 'https://purplegirl.in';
  const langPrefix = article.language === 'en' ? '' : `/${article.language}`;
  const articleUrl = `${SITE_URL}${langPrefix}/how-to/${article.slug}`;

  // Formulate a beautiful message
  const emoji = article.category === 'relationships-marriage' ? '💕' : 
                article.category === 'womens-health' ? '🌸' : 
                article.category === 'mental-health-emotions' ? '🧘' : 
                article.category === 'skin-beauty' ? '✨' : '💜';
                
  const hashtags = getHashtags(article.category, article.language);

  const captionText = `${emoji} ${article.title}\n\n${article.meta_description || 'Read the full guide on PurpleGirl!'}\n\n${hashtags}`;
  
  // Threads posts links naturally inside the text, so we include it.
  const fullMessage = `${captionText}\n\nRead the full guide here:\n${articleUrl}`;

  // We reuse the landscape generated for Facebook if it exists. 
  // If not, we generate it on the fly!
  if (!article.fb_image_url) {
    console.log(`Generating a premium landscape card on-the-fly for Threads: ${article.title}`);
    try {
      const publicUrl = await generatePin(article, 'landscape');
      if (publicUrl) {
        article.fb_image_url = publicUrl;
        await supabase
          .from('articles')
          .update({ fb_image_url: publicUrl, pin_image_url: publicUrl })
          .eq('id', article.id);
      }
    } catch (genError) {
      console.error(`Error generating card dynamically for ${article.slug}:`, genError);
    }
  } else {
    console.log(`Reusing existing landscape card for Threads: ${article.fb_image_url}`);
  }

  if (!article.fb_image_url) {
    console.error(`Missing image URL for ${article.slug}, skipping Threads post.`);
    return null;
  }

  try {
    console.log(`Step 1: Uploading Photo to Threads Container for: ${article.title}`);
    
    // Step 1: Create a Threads Media Container
    const createContainerResponse = await axios.post(`https://graph.threads.net/v1.0/${threadsUserId}/threads`, null, {
      params: {
        access_token: threadsAccessToken,
        media_type: 'IMAGE',
        image_url: article.fb_image_url,
        text: fullMessage
      }
    });

    const creationId = createContainerResponse.data.id;
    if (!creationId) {
      throw new Error("Failed to get creation_id from Threads API");
    }

    console.log(`Step 2: Publishing Container ID ${creationId} to live feed...`);

    // Step 2: Publish the Container
    const publishResponse = await axios.post(`https://graph.threads.net/v1.0/${threadsUserId}/threads_publish`, null, {
      params: {
        access_token: threadsAccessToken,
        creation_id: creationId
      }
    });

    console.log(`✅ Successfully posted to Threads! Post ID: ${publishResponse.data.id}`);
    return publishResponse.data.id;

  } catch (error) {
    console.error(`❌ Error posting ${article.slug} to Threads:`, error.response ? JSON.stringify(error.response.data) : error.message);
    return null;
  }
}

async function main() {
  // Query 3 articles where threads_id is null
  const { data: teArticles, error: teError } = await supabase
    .from('articles')
    .select('id, title, slug, category, language, meta_description, fb_image_url, published_at')
    .eq('is_published', true)
    .eq('language', 'te')
    .is('threads_id', null)
    .order('published_at', { ascending: false })
    .limit(5);

  const { data: enArticles, error: enError } = await supabase
    .from('articles')
    .select('id, title, slug, category, language, meta_description, fb_image_url, published_at')
    .eq('is_published', true)
    .eq('language', 'en')
    .is('threads_id', null)
    .order('published_at', { ascending: false })
    .limit(5);

  const teList = teArticles || [];
  const enList = enArticles || [];

  console.log(`Found ${teList.length} Telugu articles and ${enList.length} English articles ready for Threads posting.`);

  const selectedArticles = [];
  
  // Standard mix: up to 3 Telugu, 2 English
  const teToTake = Math.min(teList.length, 3);
  for (let i = 0; i < teToTake; i++) {
    selectedArticles.push(teList[i]);
  }
  const enToTake = Math.min(enList.length, 2);
  for (let i = 0; i < enToTake; i++) {
    selectedArticles.push(enList[i]);
  }

  // Backfill if needed
  if (selectedArticles.length < 5 && teList.length > teToTake) {
    const leftoverTe = teList.slice(teToTake);
    const need = 5 - selectedArticles.length;
    const toTake = Math.min(leftoverTe.length, need);
    for (let i = 0; i < toTake; i++) {
      selectedArticles.push(leftoverTe[i]);
    }
  }
  if (selectedArticles.length < 5 && enList.length > enToTake) {
    const leftoverEn = enList.slice(enToTake);
    const need = 5 - selectedArticles.length;
    const toTake = Math.min(leftoverEn.length, need);
    for (let i = 0; i < toTake; i++) {
      selectedArticles.push(leftoverEn[i]);
    }
  }

  if (selectedArticles.length === 0) {
    console.log('No new articles found to post to Threads.');
    return;
  }

  console.log(`Selected ${selectedArticles.length} article(s) to post to Threads.`);

  for (const article of selectedArticles) {
    const threadsPostId = await postArticleToThreads(article);
    if (threadsPostId) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ threads_id: threadsPostId })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error updating article ${article.slug} with Threads ID:`, updateError);
      }
    }
    
    // Add a delay between posts to avoid API rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main();
