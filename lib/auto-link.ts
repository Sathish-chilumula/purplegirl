/**
 * auto-link.ts
 * 
 * Scans a plain-text string and wraps the FIRST occurrence of known wiki terms
 * with an HTML anchor tag pointing to /wiki/[slug].
 * 
 * Used in article step body rendering to add contextual internal links.
 * Returns safe HTML string — render with dangerouslySetInnerHTML.
 */

export interface WikiTerm {
  slug: string;
  terms: string[]; // All surface forms to match (case-insensitive first match)
}

// Master list of internal terms and their target category hub links
export const WIKI_TERMS: WikiTerm[] = [
  { slug: '../category/relationships-marriage', terms: ['relationship', 'communication'] },
  { slug: '../category/skin-beauty', terms: ['skincare', 'skin routine'] },
  { slug: '../category/career-workplace', terms: ['career', 'workplace'] },
  { slug: '../category/self-growth-confidence', terms: ['confidence', 'mindfulness'] },
];

/**
 * Auto-links the first occurrence of each known wiki term in a text string.
 * Returns an HTML string safe to render via dangerouslySetInnerHTML.
 */
export function autoLink(text: string, lang: string = 'en'): string {
  if (!text) return '';

  const localePrefix = lang === 'en' ? '' : `/${lang}`;
  let result = text;
  const linked = new Set<string>(); // Track which slugs have already been linked

  for (const wikiTerm of WIKI_TERMS) {
    if (linked.has(wikiTerm.slug)) continue;

    for (const term of wikiTerm.terms) {
      // Escape the term for use in a regex
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<![\\w/])${escaped}(?![\\w])`, 'i');

      if (regex.test(result)) {
        result = result.replace(
          regex,
          (match) =>
            `<a href="${localePrefix}/wiki/${wikiTerm.slug}" class="wiki-link text-pg-plum underline decoration-dotted hover:no-underline font-medium" title="Learn what ${match} means">${match}</a>`
        );
        linked.add(wikiTerm.slug);
        break; // Move to next wiki term once matched
      }
    }
  }

  // Also parse markdown-style links outputted by AI: [anchor text](/how-to/slug)
  // Convert them into HTML anchors
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  result = result.replace(markdownLinkRegex, (match, anchorText, url) => {
    // If the AI didn't prefix the locale to the URL and it's an internal link, add it
    let finalUrl = url;
    if (lang !== 'en' && url.startsWith('/') && !url.startsWith(`/${lang}/`)) {
      finalUrl = `/${lang}${url}`;
    }
    return `<a href="${finalUrl}" class="text-pg-rose hover:underline font-medium">${anchorText}</a>`;
  });

  return result;
}
