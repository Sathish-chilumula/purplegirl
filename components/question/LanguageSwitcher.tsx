'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  slug: string;
  hasHindi?: boolean;
  hasTelugu?: boolean;
}

export default function LanguageSwitcher({ slug, hasHindi, hasTelugu }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const currentLang = pathname.endsWith('/hindi') ? 'hi' : pathname.endsWith('/telugu') ? 'te' : 'en';

  const langs = [
    {
      code: 'en',
      label: 'English',
      href: `/q/${slug}`,
      flag: '🇬🇧',
      available: true,
    },
    {
      code: 'hi',
      label: 'हिंदी',
      href: `/q/${slug}/hindi`,
      flag: '🇮🇳',
      available: hasHindi,
      translateLabel: 'हिंदी में पढ़ें →',
    },
    {
      code: 'te',
      label: 'తెలుగు',
      href: `/q/${slug}/telugu`,
      flag: '🟠',
      available: hasTelugu,
      translateLabel: 'తెలుగులో చదవండి →',
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Globe className="w-4 h-4 text-gray-400 shrink-0" />
      {langs.map((lang) => {
        const isActive = currentLang === lang.code;

        return (
          <Link
            key={lang.code}
            href={lang.href}
            title={lang.available ? undefined : 'Click to generate translation'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isActive
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                : lang.available
                  ? 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
                  : 'bg-gray-50 text-gray-400 border-dashed border-gray-200 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
            {!lang.available && lang.code !== 'en' && (
              <span className="text-[9px] opacity-60 ml-0.5">+ Translate</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
