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

// Emoji mapping based on categories to add visual context
const categoryEmojis = {
  'beauty': '✨',
  'fitness': '🧘‍♀️',
  'mental-health': '🧠',
  'pregnancy': '🤰',
  'relationship': '❤️',
  'how-to': '💡'
};

async function generatePin(article, format = 'landscape') {
  const isLandscape = true;
  const width = 1200;
  const height = 630;

  console.log(`Generating Premium Playwright Card (landscape) for: ${article.title}`);

  const titleHash = (article.slug || article.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 12 completely different vibrant colors. The script picks 3 based on the title, ensuring huge variety.
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

  // Dynamic Pattern Selection: 3 entirely different layouts based on the title hash
  const layoutPattern = titleHash % 3;

  // Load fonts and logo as Base64 to bypass any local cross-origin restrictions in Playwright
  const fontSerifPath = path.resolve(__dirname, 'fonts/NotoSerif-Bold.ttf');
  const fontSansPath = path.resolve(__dirname, 'fonts/NotoSans-Bold.ttf');
  const fontSerifTeluguPath = path.resolve(__dirname, 'fonts/NotoSerifTelugu-Bold.ttf');
  const logoPath = path.resolve(__dirname, '../public/logo.png');

  const fontSerifBase64 = fs.readFileSync(fontSerifPath).toString('base64');
  const fontSansBase64 = fs.readFileSync(fontSansPath).toString('base64');
  const fontSerifTeluguBase64 = fs.readFileSync(fontSerifTeluguPath).toString('base64');
  
  let logoBase64 = '';
  if (fs.existsSync(logoPath)) {
    logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
  }

  // Determine Emoji
  const lowerCategory = (article.category || '').toLowerCase();
  let emoji = '✨';
  for (const [key, value] of Object.entries(categoryEmojis)) {
    if (lowerCategory.includes(key)) {
      emoji = value;
      break;
    }
  }

  // Generate dynamic orb CSS based on pattern
  let orbsHtml = '';
  if (layoutPattern === 0) {
    orbsHtml = `
      <div class="orb" style="top: -150px; left: -150px; width: 800px; height: 800px; background: ${primaryColor}; filter: blur(160px);"></div>
      <div class="orb" style="bottom: -200px; right: -200px; width: 900px; height: 900px; background: ${secondaryColor}; filter: blur(180px);"></div>
      <div class="orb" style="top: 200px; left: 400px; width: 600px; height: 600px; background: ${tertiaryColor}; filter: blur(200px);"></div>
    `;
  } else if (layoutPattern === 1) {
    orbsHtml = `
      <div class="orb" style="top: 100px; right: 100px; width: 700px; height: 700px; background: ${primaryColor}; filter: blur(140px);"></div>
      <div class="orb" style="bottom: 0px; left: 0px; width: 1000px; height: 400px; background: ${secondaryColor}; filter: blur(150px);"></div>
    `;
  } else {
    orbsHtml = `
      <div class="orb" style="top: 50%; left: 50%; transform: translate(-50%, -50%); width: 1100px; height: 1100px; background: radial-gradient(circle, ${primaryColor}, ${tertiaryColor}, transparent); filter: blur(180px);"></div>
    `;
  }
  
  // HTML Template leveraging full CSS3 capabilities
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @font-face { font-family: 'NotoSerifTelugu'; src: url('data:font/truetype;charset=utf-8;base64,${fontSerifTeluguBase64}') format('truetype'); font-weight: 700; }
      @font-face { font-family: 'NotoSans'; src: url('data:font/truetype;charset=utf-8;base64,${fontSansBase64}') format('truetype'); font-weight: 700; }
      @font-face { font-family: 'NotoSerif'; src: url('data:font/truetype;charset=utf-8;base64,${fontSerifBase64}') format('truetype'); font-weight: 700; }
      
      body {
        margin: 0; width: ${width}px; height: ${height}px;
        background: #f8fafc;
        display: flex; justify-content: center; align-items: center;
        position: relative; overflow: hidden;
      }
      
      .noise-overlay {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        opacity: 0.15; z-index: 2; pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }
      
      .orb { position: absolute; border-radius: 50%; opacity: 0.6; z-index: 1; }
      
      .bg-emoji {
        position: absolute; right: -50px; bottom: -50px;
        font-size: 500px; opacity: 0.15; z-index: 2;
        transform: rotate(-15deg);
        filter: drop-shadow(0 0 30px rgba(255,255,255,0.5));
      }
      
      .card {
        width: 90%; max-width: 950px;
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(35px); -webkit-backdrop-filter: blur(35px);
        border: 1.5px solid rgba(255, 255, 255, 0.8);
        border-radius: 40px; padding: 60px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,1);
        display: flex; flex-direction: column; align-items: center; text-align: center;
        z-index: 10; position: relative;
      }
      
      .logo-img { height: 45px; margin-bottom: 25px; object-fit: contain; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.1)); }
      
      .badge {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 12px 35px;
        background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
        border-radius: 50px; color: white;
        font-family: 'NotoSans', sans-serif; font-size: 20px; font-weight: 700;
        letter-spacing: 3px; text-transform: uppercase; margin-bottom: 35px;
        box-shadow: 0 10px 20px ${primaryColor}66;
      }
      
      h1 {
        font-family: ${article.language === 'te' ? "'NotoSerifTelugu', 'NotoSerif'" : "'NotoSerif'"}, serif;
        font-size: ${article.language === 'te' ? '46px' : '55px'};
        color: #111827; line-height: 1.35; margin: 0; margin-bottom: 45px; text-wrap: balance;
      }
      
      .cta {
        display: inline-block; padding: 16px 45px; background: #111827; color: white;
        border-radius: 50px; font-family: 'NotoSans', sans-serif; font-size: 22px; font-weight: 700;
        border: 2px solid rgba(255,255,255,0.1); box-shadow: 0 15px 30px rgba(0,0,0,0.25);
      }
      
    </style>
  </head>
  <body>
    ${orbsHtml}
    <div class="noise-overlay"></div>
    <div class="bg-emoji">${emoji}</div>
    
    <div class="card">
      ${logoBase64 ? '<img src="' + logoBase64 + '" class="logo-img" />' : ''}
      <div class="badge"><span>${emoji}</span> ${article.category.replace(/-/g, ' ')}</div>
      <h1>${article.title}</h1>
      <div class="cta">Read Guide →</div>
    </div>
  </body>
  </html>
  `;

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });

    await page.setContent(html, { waitUntil: 'networkidle' });
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

    if (uploadError) return null;

    const { data: { publicUrl } } = supabase.storage.from('social_assets').getPublicUrl(fileName);
    return publicUrl;
  } catch (error) {
    if (browser) await browser.close();
    return null;
  }
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, language')
    .in('language', ['en', 'te'])
    .order('published_at', { ascending: false })
    .limit(3); // Temporarily test on the 3 most recent articles

  if (!articles || articles.length === 0) return;

  for (const article of articles) {
    const publicUrl = await generatePin(article, 'landscape');
    if (publicUrl) {
      await supabase.from('articles').update({ fb_image_url: publicUrl, pin_image_url: publicUrl }).eq('id', article.id);
      console.log(`✅ Saved Playwright landscape card: ${publicUrl}`);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { generatePin };
