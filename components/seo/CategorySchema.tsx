import React from 'react';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

interface CategorySchemaProps {
  name: string;
  description: string;
  slug: string;
  lang: string;
}

export const CategorySchema = ({ name, description, slug, lang }: CategorySchemaProps) => {
  const localePrefix = lang === 'en' ? '' : `/${lang}`;
  const displayLang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN';

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${name} Guides for Indian Women | ${SITE_NAME}`,
    "description": description,
    "url": `${SITE_URL}${localePrefix}/category/${slug}`,
    "inLanguage": displayLang
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${SITE_URL}${localePrefix}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": name,
        "item": `${SITE_URL}${localePrefix}/category/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
