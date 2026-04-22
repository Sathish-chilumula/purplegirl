import { SITE_URL, SITE_NAME } from '@/lib/constants';

// ─── Types ───────────────────────────────────────────────
interface QuestionData {
  title: string;
  slug: string;
  created_at?: string;
  view_count?: number;
  categories?: { name: string; slug: string } | null;
  answers?: {
    chat_log?: string[];
    bullet_points?: string[];
    faqs?: { q: string; a: string }[];
    summary?: string | null;
    detailed?: string | null;
  } | null;
}

interface CategoryData {
  name: string;
  slug: string;
  description?: string;
}

interface QuestionSummary {
  slug: string;
  title: string;
}

// ─── FAQPage Schema ──────────────────────────────────────
export function buildFAQSchema(question: QuestionData) {
  const answer = question.answers;
  if (!answer) return null;

  // Use summary if available, otherwise first chat_log entry
  const mainAnswerText =
    answer.summary ||
    answer.detailed ||
    (answer.chat_log && answer.chat_log.length > 0
      ? answer.chat_log.slice(0, 3).join(' ')
      : '');

  if (!mainAnswerText) return null;

  const mainQA = {
    '@type': 'Question',
    name: question.title,
    acceptedAnswer: {
      '@type': 'Answer',
      text: mainAnswerText,
    },
  };

  const faqItems = (answer.faqs || []).map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [mainQA, ...faqItems],
  };
}

// ─── Article Schema ──────────────────────────────────────
export function buildArticleSchema(question: QuestionData) {
  const answer = question.answers;
  const answerText =
    answer?.summary ||
    answer?.detailed ||
    (answer?.chat_log?.[0] ?? '');

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: question.title,
    description: `Real support and advice for: "${question.title}"`,
    url: `${SITE_URL}/q/${question.slug}`,
    datePublished: question.created_at || new Date().toISOString(),
    dateModified: question.created_at || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleBody: answerText,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/q/${question.slug}`,
    },
  };
}

// ─── BreadcrumbList Schema ───────────────────────────────
export function buildBreadcrumbSchema(
  question: QuestionData
) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];

  if (question.categories) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: question.categories.name,
      item: `${SITE_URL}/category/${question.categories.slug}`,
    });
  }

  items.push({
    '@type': 'ListItem',
    position: question.categories ? 3 : 2,
    name: question.title,
    item: `${SITE_URL}/q/${question.slug}`,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

// ─── ItemList Schema (for category pages) ────────────────
export function buildItemListSchema(
  category: CategoryData,
  questions: QuestionSummary[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} — Questions on ${SITE_NAME}`,
    description:
      category.description ||
      `Browse questions about ${category.name} on ${SITE_NAME}`,
    numberOfItems: questions.length,
    itemListElement: questions.slice(0, 50).map((q, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: q.title,
      url: `${SITE_URL}/q/${q.slug}`,
    })),
  };
}
