import React from 'react';

export const ArticleSchemas = ({ article }: { article: any }) => {
  if (!article || !article.content_json) return null;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": article.title,
    "description": article.meta_description || article.intro,
    "step": article.content_json.steps?.map((step: any) => ({
      "@type": "HowToStep",
      "name": step.headline,
      "text": step.body
    })) || []
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.content_json.faqs?.map((faq: any) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    })) || []
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://purplegirl.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category,
        "item": `https://purplegirl.in/category/${article.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://purplegirl.in/how-to/${article.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
