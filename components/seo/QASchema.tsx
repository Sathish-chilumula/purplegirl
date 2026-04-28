import React from 'react';
import Script from 'next/script';

interface QASchemaProps {
  question: {
    title: string;
    description?: string;
    created_at: string;
    upvote_count?: number;
  };
  answer?: {
    text: string;
    created_at: string;
    upvote_count?: number;
  };
  url: string;
}

export default function QASchema({ question, answer, url }: QASchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question.title,
      "text": question.description || question.title,
      "answerCount": answer ? 1 : 0,
      "upvoteCount": question.upvote_count || 0,
      "dateCreated": question.created_at,
      "author": {
        "@type": "Person",
        "name": "Anonymous"
      },
      ...(answer && {
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer.text,
          "dateCreated": answer.created_at,
          "upvoteCount": answer.upvote_count || 0,
          "url": url,
          "author": {
            "@type": "Organization",
            "name": "PurpleGirl Oracle",
            "url": "https://purplegirl.in"
          }
        }
      })
    }
  };

  return (
    <Script id="qa-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
}
