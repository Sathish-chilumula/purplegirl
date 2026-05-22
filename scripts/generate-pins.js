const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { chromium } = require('playwright');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generatePin(article, format = 'landscape') {
  const isLandscape = true;
  const width = 1200;
  const height = 630;

  console.log(`Generating Premium Playwright Card (landscape) for: ${article.title}`);

  // Deterministic title hash so different articles have unique visual flows and colors
  const titleHash = (article.slug || article.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Premium Catalog of Vibrant Colors for Truly Dynamic Multi-Color Gradients
  const vibrantColors = [
    '#db2777', // Pink
    '#f43f5e', // Rose
    '#7c3aed', // Violet
    '#4f46e5', // Indigo
    '#2563eb', // Blue
    '#0891b2', // Cyan
    '#0d9488', // Teal
    '#059669', // Emerald
    '#d97706', // Amber
    '#ea580c', // Orange
    '#dc2626', // Red
    '#c026d3', // Fuchsia
  ];

  const baseLen = vibrantColors.length;
  const primaryColor = vibrantColors[titleHash % baseLen];
  const secondaryColor = vibrantColors[(titleHash + 1) % baseLen];
  const tertiaryColor = vibrantColors[(titleHash + 2) % baseLen];

  // Load fonts as Base64 to bypass any local cross-origin restrictions in Playwright
  const fontSerifPath = path.resolve(__dirname, 'fonts/NotoSerif-Bold.ttf');
  const fontSansPath = path.resolve(__dirname, 'fonts/NotoSans-Bold.ttf');
  const fontSerifTeluguPath = path.resolve(__dirname, 'fonts/NotoSerifTelugu-Bold.ttf');

  const fontSerifBase64 = fs.readFileSync(fontSerifPath).toString('base64');
  const fontSansBase64 = fs.readFileSync(fontSansPath).toString('base64');
  const fontSerifTeluguBase64 = fs.readFileSync(fontSerifTeluguPath).toString('base64');
  
  // HTML Template leveraging full CSS3 capabilities (Glassmorphism, Shadows, Native Typography)
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @font-face {
        font-family: 'NotoSerifTelugu';
        src: url('data:font/truetype;charset=utf-8;base64,${fontSerifTeluguBase64}') format('truetype');
        font-weight: 700;
      }
      @font-face {
        font-family: 'NotoSans';
        src: url('data:font/truetype;charset=utf-8;base64,${fontSansBase64}') format('truetype');
        font-weight: 700;
      }
      @font-face {
        font-family: 'NotoSerif';
        src: url('data:font/truetype;charset=utf-8;base64,${fontSerifBase64}') format('truetype');
        font-weight: 700;
      }
      
      body {
        margin: 0;
        width: ${width}px;
        height: ${height}px;
        background: #f8fafc;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
      }
      
      /* Pure CSS Glowing Orbs for extra premium background depth */
      .orb-1 {
        position: absolute;
        top: -150px;
        left: -150px;
        width: 800px;
        height: 800px;
        background: ${primaryColor};
        border-radius: 50%;
        filter: blur(160px);
        opacity: 0.6;
        z-index: 1;
      }
      .orb-2 {
        position: absolute;
        bottom: -200px;
        right: -200px;
        width: 900px;
        height: 900px;
        background: ${secondaryColor};
        border-radius: 50%;
        filter: blur(180px);
        opacity: 0.55;
        z-index: 1;
      }
      .orb-3 {
        position: absolute;
        top: 200px;
        left: 400px;
        width: 600px;
        height: 600px;
        background: ${tertiaryColor};
        border-radius: 50%;
        filter: blur(200px);
        opacity: 0.4;
        z-index: 1;
      }
      
      /* Glassmorphism Card */
      .card {
        width: 90%;
        max-width: 950px;
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(35px);
        -webkit-backdrop-filter: blur(35px);
        border: 1.5px solid rgba(255, 255, 255, 0.8);
        border-radius: 40px;
        padding: 60px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,1);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        z-index: 10;
        position: relative;
      }
      
      .badge {
        display: inline-block;
        padding: 12px 35px;
        background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
        border-radius: 50px;
        color: white;
        font-family: 'NotoSans', sans-serif;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 35px;
        box-shadow: 0 10px 20px ${primaryColor}66;
      }
      
      h1 {
        font-family: ${article.language === 'te' ? "'NotoSerifTelugu', 'NotoSerif'" : "'NotoSerif'"}, serif;
        font-size: ${article.language === 'te' ? '46px' : '55px'};
        color: #111827;
        line-height: 1.35;
        margin: 0;
        margin-bottom: 45px;
        text-wrap: balance;
      }
      
      .cta {
        display: inline-block;
        padding: 16px 45px;
        background: #111827;
        color: white;
        border-radius: 50px;
        font-family: 'NotoSans', sans-serif;
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 10px;
        border: 2px solid rgba(255,255,255,0.1);
        box-shadow: 0 15px 30px rgba(0,0,0,0.25);
      }
      
      .footer {
        position: absolute;
        bottom: 30px;
        font-family: 'NotoSans', sans-serif;
        font-size: 24px;
        font-weight: 700;
        color: rgba(17, 24, 39, 0.6);
        letter-spacing: 2.5px;
        z-index: 10;
      }
    </style>
  </head>
  <body>
    <div class="orb-1"></div>
    <div class="orb-2"></div>
    <div class="orb-3"></div>
    
    <div class="card">
      <div class="badge">${article.category.replace(/-/g, ' ')}</div>
      <h1>${article.title}</h1>
      <div class="cta">Read Guide →</div>
    </div>
    
    <div class="footer">purplegirl.in</div>
  </body>
  </html>
  `;

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1, // Standard 1200x630 dimension output
    });

    await page.setContent(html, { waitUntil: 'networkidle' });
    // Guarantee fonts have correctly shaped all text before taking a screenshot
    await page.waitForTimeout(500);
    
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    await browser.close();

    const fileName = `fb_cards/${article.language || 'en'}/${article.slug}_fb_pw.png`;

    const { error: uploadError } = await supabase.storage
      .from('social_assets')
      .upload(fileName, screenshotBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('social_assets')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Playwright generation error:', error);
    if (browser) await browser.close();
    return null;
  }
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, language')
    .is('pin_image_url', null)
    .is('fb_image_url', null)
    .in('language', ['en', 'te'])
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('No articles need social card generation.');
    return;
  }

  for (const article of articles) {
    const publicUrl = await generatePin(article, 'landscape');
    if (publicUrl) {
      await supabase
        .from('articles')
        .update({ fb_image_url: publicUrl, pin_image_url: publicUrl })
        .eq('id', article.id);
      console.log(`✅ Saved Playwright landscape card: ${publicUrl}`);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { generatePin };
