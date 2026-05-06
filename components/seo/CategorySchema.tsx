import React from 'react';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

interface CategorySchemaProps {
  name: string;
  description: string;
  slug: string;
}

export const CategorySchema = ({ name, description, slug }: CategorySchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${name} Guides for Indian Women | ${SITE_NAME}`,
    "description": description,
    "url": `${SITE_URL}/category/${slug}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
