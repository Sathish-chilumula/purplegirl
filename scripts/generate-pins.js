const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load Fonts
const fontSerifPath = path.join(__dirname, 'fonts', 'NotoSerif-Bold.ttf');
const fontSansPath = path.join(__dirname, 'fonts', 'NotoSans-Bold.ttf');
const fontSerifData = fs.readFileSync(fontSerifPath);
const fontSansData = fs.readFileSync(fontSansPath);

const fontSerifTeluguPath = path.join(__dirname, 'fonts', 'NotoSerifTelugu-Bold.ttf');
const fontSansTeluguPath = path.join(__dirname, 'fonts', 'NotoSansTelugu-Bold.ttf');
const fontSerifTeluguData = fs.readFileSync(fontSerifTeluguPath);
const fontSansTeluguData = fs.readFileSync(fontSansTeluguPath);

// Load Background Image and convert to Base64
const bgPath = path.join(__dirname, 'images', 'background.png');
const bgData = fs.readFileSync(bgPath);
const bgBase64 = `data:image/jpeg;base64,${bgData.toString('base64')}`;

async function generatePin(article) {
  console.log(`Generating Premium Pin for: ${article.title}`);

  const markup = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '1000px',
        height: '1500px',
        backgroundColor: '#f5f3ff',
        padding: '60px',
        alignItems: 'center',
        justifyContent: 'center',
      },
      children: [
        // Background Image
        {
          type: 'img',
          props: {
            src: bgBase64,
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1000px',
              height: '1500px',
            },
          },
        },
        // Decorative Border
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '40px',
              left: '40px',
              right: '40px',
              bottom: '40px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
            },
          },
        },
        // Main Content Card
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '60px',
              borderRadius: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              width: '800px',
              textAlign: 'center',
              alignItems: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    color: '#8b5cf6',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    fontFamily: 'NotoSans',
                    letterSpacing: '4px',
                    marginBottom: '30px',
                    textTransform: 'uppercase',
                  },
                  children: article.category.replace('-', ' '),
                },
              },
              {
                type: 'h1',
                props: {
                  style: {
                    fontSize: article.language === 'te' ? '64px' : '84px',
                    fontFamily: article.language === 'te' ? 'NotoSerifTelugu' : 'NotoSerif',
                    lineHeight: article.language === 'te' ? '1.2' : '1.1',
                    color: '#111827',
                    marginBottom: '40px',
                  },
                  children: article.title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: '120px',
                    height: '4px',
                    backgroundColor: '#8b5cf6',
                    marginBottom: '40px',
                  },
                },
              },
              // CTA Button
              {
                type: 'div',
                props: {
                  style: {
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    padding: '20px 50px',
                    borderRadius: '50px',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    fontFamily: 'NotoSans',
                  },
                  children: 'READ ARTICLE',
                },
              },
            ],
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '36px',
                    fontFamily: 'NotoSans',
                    color: '#4b5563',
                    fontWeight: 'bold',
                  },
                  children: 'purplegirl.in',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1000,
    height: 1500,
    fonts: [
      {
        name: 'NotoSerif',
        data: fontSerifData,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'NotoSans',
        data: fontSansData,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'NotoSerifTelugu',
        data: fontSerifTeluguData,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'NotoSansTelugu',
        data: fontSansTeluguData,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1000 },
  });
  const pngBuffer = resvg.render().asPng();

  const fileName = `pins/${article.language || 'en'}/${article.slug}_v2.png`;
  const { error: uploadError } = await supabase.storage
    .from('social_assets')
    .upload(fileName, pngBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) return null;

  const { data: { publicUrl } } = supabase.storage
    .from('social_assets')
    .getPublicUrl(fileName);

  return publicUrl;
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, language')
    .is('pin_image_url', null) // Only process articles that don't have a pin yet
    .in('language', ['en', 'te']) // Only generate for English and Telugu
    .order('published_at', { ascending: false })
    .limit(50); // Process 50 per run

  for (const article of articles) {
    const publicUrl = await generatePin(article);
    if (publicUrl) {
      await supabase
        .from('articles')
        .update({ pin_image_url: publicUrl })
        .eq('id', article.id);
      console.log(`Advanced Pin: ${publicUrl}`);
    }
  }
}
if (require.main === module) {
  main();
}

module.exports = { generatePin };
