'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  slug: string;
  hasHindi?: boolean;
  hasTelugu?: boolean;
}

export default function LanguageSwitcher({ slug, hasHindi, hasTelugu }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const langs = [
    { code: 'en', label: 'English', href: `/q/${slug}`, flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', href: `/q/${slug}/hindi`, flag: '🇮🇳', available: hasHindi },
    { code: 'te', label: 'తెలుగు', href: `/q/${slug}/telugu`, flag: '🟠', available: hasTelugu },
  ];

  const currentLang = pathname.endsWith('/hindi') ? 'hi' : pathname.endsWith('/telugu') ? 'te' : 'en';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mr-1">Read in:</span>
      {langs.map((lang) => {
        const isActive = currentLang === lang.code;
        const isDisabled = lang.code !== 'en' && !lang.available;

        if (isDisabled) return null;

        return (
          <Link
            key={lang.code}
            href={lang.href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isActive
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
