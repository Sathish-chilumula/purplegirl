import { Metadata } from 'next';

const SITE_URL = 'https://purplegirl.in';

const titles: Record<string, string> = {
  en: 'Ask Anonymously — Get Private Advice | PurpleGirl',
  hi: 'गुमनाम रूप से पूछें — निजी सलाह पाएं | PurpleGirl',
  te: 'అనామకంగా అడగండి — వ్యక్తిగత సలహా పొందండి | PurpleGirl',
};

const descs: Record<string, string> = {
  en: 'Ask any question completely anonymously and get honest advice on relationships, health, and life. No login required, no tracking.',
  hi: 'कोई भी सवाल पूरी तरह गुमनाम रूप से पूछें और रिश्तों, स्वास्थ्य और जीवन पर ईमानदार सलाह पाएं।',
  te: 'ఏ ప్రశ్నను అయినా పూర్తిగా అనామకంగా అడగండి మరియు సంబంధాలు, ఆరోగ్యం మరియు జీవితంపై నిజాయితీగా సలహా పొందండి.',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const canonical = lang === 'en' ? '/ask' : `/${lang}/ask`;

  return {
    title: titles[lang] || titles.en,
    description: descs[lang] || descs.en,
    alternates: {
      canonical,
      languages: {
        'en': `${SITE_URL}/ask`,
        'hi': `${SITE_URL}/hi/ask`,
        'te': `${SITE_URL}/te/ask`,
        'x-default': `${SITE_URL}/ask`,
      },
    },
  };
}

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
