import { getDictionary } from '@/lib/dictionary';
import { SymptomCheckerClient } from './SymptomCheckerClient';
import type { Metadata } from 'next';

export const runtime = 'edge';

const SITE_URL = 'https://purplegirl.in';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    en: 'Symptom Checker for Women | PurpleGirl',
    hi: 'महिलाओं के लिए लक्षण जांचकर्ता | PurpleGirl',
    te: 'మహిళలకు లక్షణ తనిఖీ | PurpleGirl',
  };
  const descs: Record<string, string> = {
    en: 'Check your symptoms and find out if they match PCOS, thyroid issues, or hormonal imbalance. 100% private.',
    hi: 'अपने लक्षण जांचें और जानें कि क्या वे PCOS, थायराइड, या हार्मोनल असंतुलन से मेल खाते हैं।',
    te: 'మీ లక్షణాలు తనిఖీ చేసి PCOS, థైరాయిడ్ లేదా హార్మోన్ అసమతుల్యతతో సరిపోతాయో తెలుసుకోండి.',
  };
  return {
    title: titles[lang] || titles.en,
    description: descs[lang] || descs.en,
    alternates: {
      canonical: lang === 'en' ? '/tools/symptom-checker' : `/${lang}/tools/symptom-checker`,
      languages: {
        en: `${SITE_URL}/tools/symptom-checker`,
        hi: `${SITE_URL}/hi/tools/symptom-checker`,
        te: `${SITE_URL}/te/tools/symptom-checker`,
      },
    },
  };
}

export default async function SymptomCheckerPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <SymptomCheckerClient dict={dict} lang={lang} />;
}
