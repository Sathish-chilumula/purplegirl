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

async function generatePin(article, format = 'portrait') {
  const isLandscape = format === 'landscape';
  const realWidth = isLandscape ? 1200 : 1000;
  const realHeight = isLandscape ? 630 : 1500;

  console.log(`Generating Premium Dynamic Card (${format}) for: ${article.title}`);

  // 🎨 Premium Category-Specific Gradient Palettes Setup (Primary, Secondary, Ambient Tint)
  const categoryPalettes = {
    'relationships-marriage': { primary: '#db2777', secondary: '#f43f5e', tint: 'rgba(219, 39, 119, 0.03)' }, // Pink to Rose
    'womens-health': { primary: '#059669', secondary: '#10b981', tint: 'rgba(5, 150, 105, 0.03)' }, // Emerald to Green
    'mental-health-emotions': { primary: '#0891b2', secondary: '#06b6d4', tint: 'rgba(8, 145, 178, 0.03)' }, // Cyan to Sky
    'skin-beauty': { primary: '#d97706', secondary: '#f59e0b', tint: 'rgba(217, 119, 6, 0.03)' }, // Amber to Yellow
    'family-parenting': { primary: '#7c3aed', secondary: '#a855f7', tint: 'rgba(124, 58, 237, 0.03)' }, // Violet to Purple
    'self-growth': { primary: '#4f46e5', secondary: '#6366f1', tint: 'rgba(79, 70, 229, 0.03)' }, // Indigo to Violet
    'self-growth-confidence': { primary: '#4f46e5', secondary: '#6366f1', tint: 'rgba(79, 70, 229, 0.03)' },
    'career-workplace': { primary: '#2563eb', secondary: '#3b82f6', tint: 'rgba(37, 99, 235, 0.03)' }, // Blue to Light Blue
    'baby-care-motherhood': { primary: '#ec4899', secondary: '#f472b6', tint: 'rgba(236, 72, 153, 0.03)' }, // Pink to Soft Pink
    'food-indian-cooking': { primary: '#ea580c', secondary: '#f97316', tint: 'rgba(234, 88, 12, 0.03)' }, // Orange to Light Orange
    'sex-intimacy': { primary: '#dc2626', secondary: '#ef4444', tint: 'rgba(220, 38, 38, 0.03)' }, // Red to Light Red
    'finance-money': { primary: '#0d9488', secondary: '#14b8a6', tint: 'rgba(13, 148, 136, 0.03)' }, // Teal to Mint
    'weight-fitness': { primary: '#16a34a', secondary: '#22c55e', tint: 'rgba(22, 163, 74, 0.03)' }, // Green to Light Green
    'pregnancy-fertility': { primary: '#f43f5e', secondary: '#fda4af', tint: 'rgba(244, 63, 94, 0.03)' }, // Rose to soft rose
    'legal-rights': { primary: '#4b5563', secondary: '#6b7280', tint: 'rgba(75, 85, 99, 0.03)' }, // Gray
    'hair-care': { primary: '#b45309', secondary: '#d97706', tint: 'rgba(180, 83, 9, 0.03)' }, // Amber-700 to Amber-600
    'fashion-style': { primary: '#be185d', secondary: '#db2777', tint: 'rgba(190, 24, 93, 0.03)' }, // Pink-700 to Pink-600
    'home-household': { primary: '#854d0e', secondary: '#a16207', tint: 'rgba(133, 77, 14, 0.03)' }, // Yellow-800 to Yellow-700
    'festivals-traditions': { primary: '#c026d3', secondary: '#d946ef', tint: 'rgba(192, 38, 211, 0.03)' }, // Fuchsia to Magenta
  };

  const palette = categoryPalettes[article.category] || { primary: '#8b5cf6', secondary: '#ec4899', tint: 'rgba(139, 92, 246, 0.03)' };
  const primaryColor = palette.primary;
  const secondaryColor = palette.secondary;
  const tintColor = palette.tint;

  // 🎲 Deterministic design choice based on title hash so different articles have unique visual flows
  const titleHash = (article.slug || article.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const designPreset = titleHash % 4; // 4 distinct layouts now!

  // 🌌 Deterministic dynamic decorative elements for premium visual variety
  const bubble1X = isLandscape ? ((titleHash % 500) - 200) : ((titleHash % 400) - 150);
  const bubble1Y = isLandscape ? (((titleHash >> 2) % 250) - 100) : (((titleHash >> 2) % 500) - 150);
  const bubble1Size = isLandscape ? (((titleHash >> 4) % 200) + 300) : (((titleHash >> 4) % 300) + 450);

  const bubble2X = realWidth - (isLandscape ? (((titleHash >> 6) % 500) + 200) : (((titleHash >> 6) % 400) + 350));
  const bubble2Y = realHeight - (isLandscape ? (((titleHash >> 8) % 250) + 200) : (((titleHash >> 8) % 500) + 350));
  const bubble2Size = isLandscape ? (((titleHash >> 10) % 200) + 300) : (((titleHash >> 10) % 300) + 450);

  // Soft dual-tone glowing background blends
  const bubbleColor1 = `${primaryColor}26`; // 15% opacity primary
  const bubbleColor2 = `${secondaryColor}22`; // 13% opacity secondary

  // Dynamic values inside layouts based on hash
  const dynamicBorderRadius = (titleHash % 2 === 0) ? '32px' : '20px';
  const dynamicCardShadow = (titleHash % 2 === 0) 
    ? '0 25px 50px -12px rgba(0,0,0,0.08)' 
    : '0 20px 40px -8px rgba(0,0,0,0.06)';
  const dynamicStripeWidth = isLandscape 
    ? ((titleHash % 2 === 0) ? '18px' : '12px')
    : ((titleHash % 2 === 0) ? '28px' : '20px');
  const dynamicPillRadius = (titleHash % 2 === 0) ? '100px' : '12px';
  const dynamicUnderlineWidth1 = isLandscape
    ? ((titleHash % 2 === 0) ? '120px' : '100px')
    : ((titleHash % 2 === 0) ? '180px' : '140px');
  const dynamicUnderlineWidth2 = isLandscape
    ? ((titleHash % 2 === 0) ? '60px' : '50px')
    : ((titleHash % 2 === 0) ? '90px' : '70px');

  // Format-specific sizing & spacing rules
  const categoryFontSize = isLandscape ? '18px' : '28px';
  const categoryLetterSpacing = isLandscape ? '3px' : '4px';
  const categoryMarginBottom = isLandscape ? '12px' : '30px';

  const titleFontSizeEn = isLandscape ? '44px' : '82px';
  const titleFontSizeTe = isLandscape ? '34px' : '62px';
  const titleFontSize = article.language === 'te' ? titleFontSizeTe : titleFontSizeEn;
  const titleLineHeight = article.language === 'te' ? '1.3' : '1.1';
  const titleMarginBottom = isLandscape ? '18px' : '40px';

  const btnPadding = isLandscape ? '12px 36px' : '20px 50px';
  const btnFontSize = isLandscape ? '20px' : '32px';

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
                background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
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
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
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
                background: `linear-gradient(to right, ${primaryColor}1A, ${secondaryColor}1A)`,
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
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
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
                      backgroundColor: `${secondaryColor}80`,
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
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
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
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
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
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
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
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                marginBottom: isLandscape ? '20px' : '40px',
                borderRadius: '2px',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
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
    const titleHash = (article.slug || article.title).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const chosenFormat = (titleHash % 2 === 0) ? 'landscape' : 'portrait';
    
    console.log(`Selected format ${chosenFormat} for: ${article.title}`);
    const publicUrl = await generatePin(article, chosenFormat);
    if (publicUrl) {
      if (chosenFormat === 'landscape') {
        await supabase
          .from('articles')
          .update({ fb_image_url: publicUrl, pin_image_url: null })
          .eq('id', article.id);
        console.log(`✅ Saved landscape card to fb_image_url: ${publicUrl}`);
      } else {
        await supabase
          .from('articles')
          .update({ pin_image_url: publicUrl, fb_image_url: null })
          .eq('id', article.id);
        console.log(`✅ Saved portrait pin to pin_image_url: ${publicUrl}`);
      }
    }
  }
}
if (require.main === module) {
  main();
}

module.exports = { generatePin };
