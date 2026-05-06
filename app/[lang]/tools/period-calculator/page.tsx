import { getDictionary } from '@/lib/dictionary';
import { PeriodCalculatorClient } from './PeriodCalculatorClient';
import type { Metadata } from 'next';

const SITE_URL = 'https://purplegirl.in';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    en: 'Period & Ovulation Calculator | PurpleGirl',
    hi: 'पीरियड और ओव्यूलेशन कैलकुलेटर | PurpleGirl',
    te: 'పీరియడ్ & ఓవ్యులేషన్ కాల్కులేటర్ | PurpleGirl',
  };
  const descs: Record<string, string> = {
    en: 'Track your cycle, predict your next period, and find your most fertile days. 100% private, no login needed.',
    hi: 'अपना मासिक चक्र ट्रैक करें, अगला पीरियड जानें, और उपजाऊ दिन खोजें। 100% निजी।',
    te: 'మీ సైకిల్‌ని ట్రాక్ చేయండి, తదుపరి పీరియడ్ తెలుసుకోండి. 100% ప్రైవేట్.',
  };
  return {
    title: titles[lang] || titles.en,
    description: descs[lang] || descs.en,
    alternates: {
      canonical: lang === 'en' ? '/tools/period-calculator' : `/${lang}/tools/period-calculator`,
      languages: {
        en: `${SITE_URL}/tools/period-calculator`,
        hi: `${SITE_URL}/hi/tools/period-calculator`,
        te: `${SITE_URL}/te/tools/period-calculator`,
      },
    },
  };
}

export default async function PeriodCalculatorPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <PeriodCalculatorClient dict={dict} lang={lang} />;
}
