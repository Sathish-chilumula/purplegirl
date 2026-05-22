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

async function generatePin(article, format = 'landscape') {
  // We strictly enforce landscape format (1200x630) to prevent cropping on Facebook
  const isLandscape = true;
  const realWidth = 1200;
  const realHeight = 630;

  console.log(`Generating Premium Dynamic Card (landscape) for: ${article.title}`);

  // 🎲 Deterministic title hash so different articles have unique visual flows and colors
  const titleHash = (article.slug || article.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 🎨 Premium Catalog of Vibrant Colors for Truly Dynamic Multi-Color Gradients
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

  // Dynamic 3-Color Gradient Engine based on titleHash for rich multi-color variety
  const baseLen = vibrantColors.length;
  const c1Index = titleHash % baseLen;
  const primaryColor = vibrantColors[c1Index];

  const c2Offset = 1 + (titleHash % (baseLen - 1));
  const secondaryColor = vibrantColors[(c1Index + c2Offset) % baseLen];

  const c3Offset = 1 + ((titleHash >> 2) % (baseLen - 2));
  const remainingColors = vibrantColors.filter(c => c !== primaryColor && c !== secondaryColor);
  const tertiaryColor = remainingColors[c3Offset % remainingColors.length];

  const tintColor = `${primaryColor}05`; // Ultra-soft ambient primary overlay

  const designPreset = titleHash % 4; // 4 distinct layouts now!

  // 🌌 Deterministic dynamic decorative elements for premium visual variety
  const bubble1X = ((titleHash % 500) - 200);
  const bubble1Y = (((titleHash >> 2) % 250) - 100);
  const bubble1Size = (((titleHash >> 4) % 200) + 300);

  const bubble2X = realWidth - (((titleHash >> 6) % 500) + 200);
  const bubble2Y = realHeight - (((titleHash >> 8) % 250) + 200);
  const bubble2Size = (((titleHash >> 10) % 200) + 300);

  // Third bubble for extra depth in our multi-color atmosphere
  const bubble3X = (((titleHash >> 12) % 400) + 400);
  const bubble3Y = (((titleHash >> 14) % 200) + 200);
  const bubble3Size = (((titleHash >> 16) % 150) + 250);

  // Soft dual-tone glowing background blends
  const bubbleColor1 = `${primaryColor}33`; // 20% opacity primary
  const bubbleColor2 = `${secondaryColor}26`; // 15% opacity secondary
  const bubbleColor3 = `${tertiaryColor}1E`; // 12% opacity tertiary

  // Dynamic values inside layouts based on hash
  const dynamicBorderRadius = (titleHash % 2 === 0) ? '32px' : '20px';
  const dynamicCardShadow = (titleHash % 2 === 0) 
    ? '0 25px 50px -12px rgba(0,0,0,0.08)' 
    : '0 20px 40px -8px rgba(0,0,0,0.06)';
  const dynamicStripeWidth = ((titleHash % 2 === 0) ? '18px' : '12px');
  const dynamicPillRadius = (titleHash % 2 === 0) ? '100px' : '12px';
  const dynamicUnderlineWidth1 = ((titleHash % 2 === 0) ? '120px' : '100px');
  const dynamicUnderlineWidth2 = ((titleHash % 2 === 0) ? '60px' : '50px');

  // Format-specific sizing & spacing rules
  const categoryFontSize = '18px';
  const categoryLetterSpacing = '3px';
  const categoryMarginBottom = '12px';

  const titleFontSizeEn = '44px';
  const titleFontSizeTe = '34px';
  const titleFontSize = article.language === 'te' ? titleFontSizeTe : titleFontSizeEn;
  const titleLineHeight = article.language === 'te' ? '1.3' : '1.1';
  const titleMarginBottom = '18px';

  const btnPadding = '12px 36px';
  const btnFontSize = '20px';

  let mainCardMarkup;

  if (designPreset === 1) {
    // 🏷️ PRESET 1: "Minimalist Stripe Elegance" (Left Aligned, Modern Left Accent Bar)
    mainCardMarkup = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          borderRadius: dynamicBorderRadius,
          boxShadow: dynamicCardShadow,
          width: isLandscape ? '940px' : '820px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
        children: [
          // Left Stripe (Multi-Color Gradient)
          {
            type: 'div',
            props: {
              style: {
                width: dynamicStripeWidth,
                background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
              },
            },
          },
          // Main Body
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                padding: isLandscape ? '35px 40px 35px 35px' : '60px 50px 60px 40px',
                flex: 1,
                textAlign: 'left',
                alignItems: 'flex-start',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: primaryColor,
                      fontSize: categoryFontSize,
                      fontWeight: 'bold',
                      fontFamily: 'NotoSans',
                      letterSpacing: categoryLetterSpacing,
                      marginBottom: categoryMarginBottom,
                      textTransform: 'uppercase',
                    },
                    children: article.category.replace(/-/g, ' '),
                  },
                },
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: titleFontSize,
                      fontFamily: article.language === 'te' ? 'NotoSerifTelugu' : 'NotoSerif',
                      lineHeight: titleLineHeight,
                      color: '#111827',
                      marginBottom: titleMarginBottom,
                    },
                    children: article.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                      color: 'white',
                      padding: btnPadding,
                      borderRadius: '12px',
                      fontSize: btnFontSize,
                      fontWeight: 'bold',
                      fontFamily: 'NotoSans',
                      boxShadow: `0 4px 12px ${primaryColor}33`,
                    },
                    children: 'READ ARTICLE',
                  },
                },
              ],
            },
          },
        ],
      },
    };
  } else if (designPreset === 2) {
    // 🏷️ PRESET 2: "Sleek Capsule Layout" (Top Floating Capsule Badge & Double Underline)
    mainCardMarkup = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          padding: isLandscape ? '35px 40px' : '60px',
          borderRadius: dynamicBorderRadius,
          boxShadow: dynamicCardShadow,
          width: isLandscape ? '920px' : '800px',
          textAlign: 'center',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
        children: [
          // Capsule Badge (Gradient Tint)
          {
            type: 'div',
            props: {
              style: {
                background: `linear-gradient(to right, ${primaryColor}1A, ${secondaryColor}1A, ${tertiaryColor}1A)`,
                border: `1.5px solid ${primaryColor}40`,
                color: primaryColor,
                padding: isLandscape ? '8px 24px' : '12px 32px',
                borderRadius: dynamicPillRadius,
                fontSize: isLandscape ? '18px' : '26px',
                fontWeight: 'bold',
                fontFamily: 'NotoSans',
                letterSpacing: '2px',
                marginBottom: isLandscape ? '16px' : '35px',
                textTransform: 'uppercase',
              },
              children: article.category.replace(/-/g, ' '),
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: titleFontSize,
                fontFamily: article.language === 'te' ? 'NotoSerifTelugu' : 'NotoSerif',
                lineHeight: titleLineHeight,
                color: '#111827',
                marginBottom: isLandscape ? '18px' : '40px',
              },
              children: article.title,
            },
          },
          // Double Underline (Vibrant Gradient Top)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: isLandscape ? '18px' : '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: dynamicUnderlineWidth1,
                      height: isLandscape ? '3px' : '5px',
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                      marginBottom: isLandscape ? '4px' : '6px',
                      borderRadius: '2px',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      width: dynamicUnderlineWidth2,
                      height: isLandscape ? '1px' : '2px',
                      backgroundColor: `${tertiaryColor}80`,
                      borderRadius: '1px',
                    },
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                color: 'white',
                padding: btnPadding,
                borderRadius: '50px',
                fontSize: btnFontSize,
                fontWeight: 'bold',
                fontFamily: 'NotoSans',
                boxShadow: `0 6px 20px ${primaryColor}40`,
              },
              children: 'READ ARTICLE',
            },
          },
        ],
      },
    };
  } else if (designPreset === 3) {
    // 🏷️ PRESET 3: "Editorial Showcase" (Elegant Quote Icon & Top Accent Border)
    mainCardMarkup = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: isLandscape ? '35px 40px' : '60px',
          borderRadius: dynamicBorderRadius,
          boxShadow: dynamicCardShadow,
          width: isLandscape ? '940px' : '820px',
          textAlign: 'center',
          alignItems: 'center',
          borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
          borderRight: '1px solid rgba(255, 255, 255, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Absolute Positioned Top Accent Bar (Gradient Border look)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: isLandscape ? '6px' : '10px',
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
              },
            },
          },
          // Elegant decorative giant quote mark
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: isLandscape ? '-25px' : '-40px',
                left: isLandscape ? '30px' : '40px',
                fontSize: isLandscape ? '140px' : '240px',
                fontFamily: 'NotoSerif',
                color: primaryColor,
                opacity: 0.12,
                lineHeight: 1,
              },
              children: '“',
            },
          },
          // Category Label
          {
            type: 'div',
            props: {
              style: {
                fontSize: isLandscape ? '16px' : '24px',
                fontWeight: 'bold',
                fontFamily: 'NotoSans',
                color: '#6b7280',
                letterSpacing: isLandscape ? '3px' : '5px',
                marginBottom: isLandscape ? '12px' : '20px',
                textTransform: 'uppercase',
                marginTop: isLandscape ? '10px' : '25px',
              },
              children: article.category.replace(/-/g, ' '),
            },
          },
          // Headline
          {
            type: 'h1',
            props: {
              style: {
                fontSize: titleFontSize,
                fontFamily: article.language === 'te' ? 'NotoSerifTelugu' : 'NotoSerif',
                lineHeight: titleLineHeight,
                color: '#1f2937',
                marginBottom: isLandscape ? '16px' : '35px',
                marginTop: '5px',
              },
              children: article.title,
            },
          },
          // Diamond / Circle Divider
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginBottom: isLandscape ? '16px' : '35px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: isLandscape ? '50px' : '80px',
                      height: '1px',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      width: isLandscape ? '8px' : '12px',
                      height: isLandscape ? '8px' : '12px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                      marginLeft: '8px',
                      marginRight: '8px',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      width: isLandscape ? '50px' : '80px',
                      height: '1px',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    },
                  },
                },
              ],
            },
          },
          // Bottom CTA
          {
            type: 'div',
            props: {
              style: {
                color: primaryColor,
                fontSize: isLandscape ? '18px' : '28px',
                fontWeight: 'bold',
                fontFamily: 'NotoSans',
                letterSpacing: isLandscape ? '2px' : '3px',
              },
              children: '✦ READ ON PURPLEGIRL ✦',
            },
          },
        ],
      },
    };
  } else {
    // 🏷️ PRESET 0: "The Frosted Classic" (Classic Frosted Box with Full Border Frame)
    mainCardMarkup = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.90)',
          padding: isLandscape ? '35px 40px' : '60px',
          borderRadius: dynamicBorderRadius,
          boxShadow: dynamicCardShadow,
          width: isLandscape ? '920px' : '800px',
          textAlign: 'center',
          alignItems: 'center',
          border: `3px solid ${primaryColor}`,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                color: primaryColor,
                fontSize: categoryFontSize,
                fontWeight: 'bold',
                fontFamily: 'NotoSans',
                letterSpacing: categoryLetterSpacing,
                marginBottom: categoryMarginBottom,
                textTransform: 'uppercase',
              },
              children: article.category.replace(/-/g, ' '),
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: titleFontSize,
                fontFamily: article.language === 'te' ? 'NotoSerifTelugu' : 'NotoSerif',
                lineHeight: titleLineHeight,
                color: '#111827',
                marginBottom: titleMarginBottom,
              },
              children: article.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                width: isLandscape ? '80px' : '120px',
                height: '3px',
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                marginBottom: isLandscape ? '20px' : '40px',
                borderRadius: '2px',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor})`,
                color: 'white',
                padding: btnPadding,
                borderRadius: '50px',
                fontSize: btnFontSize,
                fontWeight: 'bold',
                fontFamily: 'NotoSans',
                boxShadow: `0 6px 20px ${primaryColor}40`,
              },
              children: 'READ ARTICLE',
            },
          },
        ],
      },
    };
  }

  const markup = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: `${realWidth}px`,
        height: `${realHeight}px`,
        backgroundColor: '#f5f3ff',
        padding: isLandscape ? '30px' : '60px',
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
              width: `${realWidth}px`,
              height: `${realHeight}px`,
            },
          },
        },
        // Color Tint Overlay for Dynamic Atmosphere
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${realWidth}px`,
              height: `${realHeight}px`,
              backgroundColor: tintColor,
            },
          },
        },
        // 🌌 Dynamic Glowing Atmosphere Bubble 1
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: `${bubble1Y}px`,
              left: `${bubble1X}px`,
              width: `${bubble1Size}px`,
              height: `${bubble1Size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${bubbleColor1} 0%, rgba(255,255,255,0) 70%)`,
            },
          },
        },
        // 🌌 Dynamic Glowing Atmosphere Bubble 2
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: `${bubble2Y}px`,
              left: `${bubble2X}px`,
              width: `${bubble2Size}px`,
              height: `${bubble2Size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${bubbleColor2} 0%, rgba(255,255,255,0) 70%)`,
            },
          },
        },
        // 🌌 Dynamic Glowing Atmosphere Bubble 3
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: `${bubble3Y}px`,
              left: `${bubble3X}px`,
              width: `${bubble3Size}px`,
              height: `${bubble3Size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${bubbleColor3} 0%, rgba(255,255,255,0) 70%)`,
            },
          },
        },
        // Decorative Border
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: isLandscape ? '20px' : '40px',
              left: isLandscape ? '20px' : '40px',
              right: isLandscape ? '20px' : '40px',
              bottom: isLandscape ? '20px' : '40px',
              border: `${isLandscape ? '1.5px' : '2px'} solid ${primaryColor}40`,
              borderRadius: '20px',
            },
          },
        },
        // Main Content Card (Preset markup chosen dynamically above)
        mainCardMarkup,
        // Footer
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: isLandscape ? '35px' : '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: isLandscape ? '22px' : '36px',
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
    width: realWidth,
    height: realHeight,
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
    fitTo: { mode: 'width', value: realWidth },
  });
  const pngBuffer = resvg.render().asPng();

  const fileName = isLandscape 
    ? `fb_cards/${article.language || 'en'}/${article.slug}_fb.png`
    : `pins/${article.language || 'en'}/${article.slug}_v2.png`;

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
    .is('pin_image_url', null)
    .is('fb_image_url', null)
    .in('language', ['en', 'te']) // Only English and Telugu
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching articles for pin/card generation:', error);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('No articles need social card generation.');
    return;
  }

  console.log(`Found ${articles.length} articles that need social cards.`);

  for (const article of articles) {
    const publicUrl = await generatePin(article, 'landscape');
    if (publicUrl) {
      await supabase
        .from('articles')
        .update({ fb_image_url: publicUrl, pin_image_url: publicUrl })
        .eq('id', article.id);
      console.log(`✅ Saved landscape card to both fb_image_url and pin_image_url: ${publicUrl}`);
    }
  }
}
if (require.main === module) {
  main();
}

module.exports = { generatePin };
