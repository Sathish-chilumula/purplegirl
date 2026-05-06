import React from 'react';

export const ArticleSchemas = ({ article }: { article: any }) => {
  if (!article || !article.content_json) return null;

  const publishedDate = article.published_at || article.generated_at || article.created_at;
  const baseUrl = 'https://purplegirl.in';

  // 1. HowTo Schema — gives Google step-by-step rich snippets in SERP
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": article.title,
    "description": article.meta_description || article.intro,
    "totalTime": `PT${article.reading_time_mins || 5}M`,
    "tool": (article.content_json.things_needed || []).map((item: string) => ({
      "@type": "HowToTool",
      "name": item
    })),
    "step": (article.content_json.steps || []).map((step: any, i: number) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.headline,
      "text": step.body,
      ...(step.tip ? { "tip": { "@type": "HowToTip", "text": step.tip } } : {})
    }))
  };

  // 2. Article Schema — E-E-A-T signals for Google's Helpful Content
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.meta_description || article.intro,
    "url": `${baseUrl}/how-to/${article.slug}`,
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "author": {
      "@type": "Organization",
      "name": "PurpleGirl Editorial Team",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "PurpleGirl",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/how-to/${article.slug}`
    },
    "articleSection": article.category?.replace(/-/g, ' '),
    "inLanguage": article.language === 'hi' ? 'hi-IN' : 'en-IN',
    "about": {
      "@type": "Thing",
      "name": article.category?.replace(/-/g, ' ')
    }
  };

  // 3. FAQPage Schema — gives Google accordion rich results
  const hasFaqs = article.content_json.faqs && article.content_json.faqs.length > 0;
  const faqSchema = hasFaqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.content_json.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  // 4. BreadcrumbList Schema — sitelinks in SERP
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category?.replace(/-/g, ' '),
        "item": `${baseUrl}/category/${article.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${baseUrl}/how-to/${article.slug}`
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {hasFaqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
