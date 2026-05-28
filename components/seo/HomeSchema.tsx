import React from 'react';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const HomeSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "name": SITE_NAME,
        "url": SITE_URL,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/icons/pwa-512.png`
        },
        "sameAs": [
          "https://www.instagram.com/purplegirl.in/",
          "https://www.facebook.com/thepurplegirls",
          "https://x.com/purplegirl_in",
          "https://whatsapp.com/channel/0029VbCdecs2f3ESzKq8bY3N"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
