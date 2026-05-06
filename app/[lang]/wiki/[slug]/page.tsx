import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { getWikiTerm, getAllWikiSlugs } from '@/lib/wiki-terms';
import { Card } from '@/components/ui/Card';

export const runtime = 'edge';

interface WikiPageProps {
  params: Promise<{ lang: string; slug: string }>;
}



export async function generateMetadata({ params }: WikiPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const term = getWikiTerm(slug);
  if (!term) return { title: 'Not Found' };

  const SITE_URL = 'https://purplegirl.in';
  const canonical = lang === 'en' ? `/wiki/${slug}` : `/${lang}/wiki/${slug}`;

  return {
    title: term.metaTitle,
    description: term.metaDescription,
    alternates: {
      canonical,
      languages: {
        'en': `${SITE_URL}/wiki/${slug}`,
        'hi': `${SITE_URL}/hi/wiki/${slug}`,
        'te': `${SITE_URL}/te/wiki/${slug}`,
        'x-default': `${SITE_URL}/wiki/${slug}`,
      },
    },
    openGraph: {
      title: term.metaTitle,
      description: term.metaDescription,
      type: 'article',
      url: `${SITE_URL}${canonical}`,
    },
  };
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { lang, slug } = await params;
  const term = getWikiTerm(slug);

  if (!term) {
    notFound();
  }

  // JSON-LD: DefinedTerm + FAQPage (for key facts as a structured list)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        name: term.title,
        description: term.shortDef,
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: 'PurpleGirl Wiki — Glossary for Indian Women',
          url: 'https://purplegirl.in/wiki',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://purplegirl.in' },
          { '@type': 'ListItem', position: 2, name: term.category, item: `https://purplegirl.in/category/${term.categorySlug}` },
          { '@type': 'ListItem', position: 3, name: term.title, item: `https://purplegirl.in/wiki/${slug}` },
        ],
      },
      {
        '@type': 'Article',
        headline: term.title,
        description: term.metaDescription,
        author: { '@type': 'Organization', name: 'PurpleGirl Editorial Team' },
        publisher: { '@type': 'Organization', name: 'PurpleGirl', url: 'https://purplegirl.in' },
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white min-h-screen">
        <div className="max-w-[1100px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

          {/* ═══════════════════════════════
              MAIN CONTENT
              ═══════════════════════════════ */}
          <article className="lg:w-[68%]">

            {/* Breadcrumb */}
            <nav className="flex items-center text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-8 flex-wrap gap-1" aria-label="breadcrumb">
              <Link href="/" className="hover:text-pg-rose">Home</Link>
              <ChevronRight size={14} />
              <Link href={`/category/${term.categorySlug}`} className="hover:text-pg-rose capitalize">
                {term.category}
              </Link>
              <ChevronRight size={14} />
              <span className="text-pg-gray-900">Wiki</span>
              <ChevronRight size={14} />
              <span className="text-pg-gray-900 truncate max-w-[160px]">{term.title}</span>
            </nav>

            {/* Wiki badge */}
            <div className="inline-flex items-center gap-2 bg-pg-plum-light text-pg-plum px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
              <BookOpen size={12} />
              PurpleGirl Wiki
            </div>

            {/* H1 */}
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-pg-gray-900 leading-tight mb-4">
              {term.emoji} {term.title}
            </h1>

            {/* Short definition — answer box */}
            <div className="bg-pg-rose-light border-l-4 border-pg-rose p-5 rounded-r-2xl mb-10">
              <p className="font-display font-bold text-[17px] text-pg-gray-900 leading-relaxed">
                {term.shortDef}
              </p>
            </div>

            {/* Intro */}
            <p className="text-[17px] leading-[1.85] text-pg-gray-700 mb-12">
              {term.intro}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {term.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="font-display text-[22px] md:text-[26px] font-bold text-pg-gray-900 mb-4 leading-snug">
                    {section.heading}
                  </h2>
                  <p className="text-[16px] leading-[1.85] text-pg-gray-700 whitespace-pre-line">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Key Facts */}
            <div className="mt-14 bg-pg-cream rounded-2xl p-8 border border-pg-gray-100">
              <h2 className="font-display text-[22px] font-bold text-pg-gray-900 mb-6">
                Key Facts at a Glance
              </h2>
              <ul className="space-y-3">
                {term.keyFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-pg-rose shrink-0 mt-0.5" />
                    <span className="text-[15px] text-pg-gray-700 leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="my-14 border-t border-pg-gray-100" />

            {/* Related Guides */}
            {term.relatedGuides.length > 0 && (
              <div>
                <h2 className="font-display text-[22px] font-bold text-pg-gray-900 mb-6">
                  Related How-To Guides
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {term.relatedGuides.map((guide) => (
                    <Link key={guide.slug} href={`/how-to/${guide.slug}`}>
                      <Card className="p-5 hover:border-pg-rose transition-colors h-full flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-pg-rose-light rounded-lg flex items-center justify-center shrink-0">
                          <ChevronRight size={16} className="text-pg-rose" />
                        </div>
                        <h3 className="font-sans font-bold text-[15px] text-pg-gray-900 leading-snug group-hover:text-pg-rose transition-colors">
                          {guide.title}
                        </h3>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* ═══════════════════════════════
              SIDEBAR
              ═══════════════════════════════ */}
          <aside className="lg:w-[32%] space-y-8 lg:sticky lg:top-28 self-start">

            {/* Related Wiki Terms */}
            {term.relatedWiki.length > 0 && (
              <div className="bg-pg-cream rounded-2xl p-6 border border-pg-gray-100">
                <h3 className="font-bold text-pg-gray-900 uppercase text-xs tracking-widest mb-5">
                  Related Definitions
                </h3>
                <div className="space-y-3">
                  {term.relatedWiki.map((wikiSlug) => {
                    const related = getWikiTerm(wikiSlug);
                    if (!related) return null;
                    return (
                      <Link
                        key={wikiSlug}
                        href={`/wiki/${wikiSlug}`}
                        className="flex items-center gap-2 group"
                      >
                        <span className="text-xl">{related.emoji}</span>
                        <span className="font-display font-bold text-[14px] text-pg-gray-900 group-hover:text-pg-rose transition-colors leading-tight">
                          {related.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Links */}
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100">
              <h3 className="font-bold text-pg-gray-900 uppercase text-xs tracking-widest mb-5">
                More in {term.category}
              </h3>
              <Link
                href={`/category/${term.categorySlug}`}
                className="inline-flex items-center gap-2 bg-pg-rose text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-pg-rose-dark transition-colors w-full justify-center"
              >
                View All {term.category} Guides
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Anonymous Ask CTA */}
            <div className="bg-pg-plum text-white rounded-2xl p-6 text-center">
              <p className="font-display font-bold text-[18px] mb-3 leading-tight">
                Have a question you can't ask anyone?
              </p>
              <p className="text-pg-plum-light/80 text-sm mb-5">
                Ask anonymously. No name, no judgment.
              </p>
              <Link
                href="/ask"
                className="inline-block bg-white text-pg-plum font-bold py-3 px-6 rounded-xl hover:bg-pg-plum-light transition-colors text-sm w-full"
              >
                Ask Anonymously →
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
}
