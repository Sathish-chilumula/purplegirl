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

// Master list of wiki terms and their slugs
export const WIKI_TERMS: WikiTerm[] = [
  { slug: 'pcos', terms: ['PCOS', 'polycystic ovary', 'polycystic ovarian'] },
  { slug: 'gaslighting', terms: ['gaslighting', 'gaslit', 'gaslighted'] },
  { slug: 'itr', terms: ['ITR', 'income tax return'] },
  { slug: 'ivf', terms: ['IVF', 'in vitro fertilisation', 'in vitro fertilization'] },
  { slug: 'section-498a', terms: ['Section 498A', '498A', 'section 498a'] },
  { slug: 'dowry-prohibition-act', terms: ['Dowry Prohibition Act', 'dowry law'] },
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

  return result;
}
