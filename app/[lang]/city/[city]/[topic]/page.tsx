import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, MapPin, CheckCircle } from 'lucide-react';
import {
  getCityData, getTopicData, getAllCityTopicPairs,
  fillTemplate, CITIES, TOPICS,
} from '@/lib/city-data';
import { Card } from '@/components/ui/Card';

export const runtime = 'edge';


interface CityPageProps {
  params: Promise<{ lang: string; city: string; topic: string }>;
}



export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city, topic, lang } = await params;
  const cityData = getCityData(city);
  const topicData = getTopicData(topic);

  if (!cityData || !topicData) return { title: 'Not Found' };

  const SITE_URL = 'https://purplegirl.in';
  const canonical = lang === 'en'
    ? `/city/${city}/${topic}`
    : `/${lang}/city/${city}/${topic}`;

  return {
    title: fillTemplate(topicData.metaTitleTemplate, cityData.name),
    description: fillTemplate(topicData.metaDescTemplate, cityData.name),
    alternates: {
      canonical,
      languages: {
        'en': `${SITE_URL}/city/${city}/${topic}`,
        'x-default': `${SITE_URL}/city/${city}/${topic}`,
      },
    },
    openGraph: {
      title: fillTemplate(topicData.metaTitleTemplate, cityData.name),
      description: fillTemplate(topicData.metaDescTemplate, cityData.name),
      type: 'article',
    },
  };
}

export default async function CityTopicPage({ params }: CityPageProps) {
  const { city, topic, lang } = await params;
  const cityData = getCityData(city);
  const topicData = getTopicData(topic);

  if (!cityData || !topicData) {
    notFound();
  }

  const h1 = fillTemplate(topicData.h1Template, cityData.name);
  const intro = fillTemplate(topicData.introTemplate, cityData.name);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: h1,
        description: fillTemplate(topicData.metaDescTemplate, cityData.name),
        author: { '@type': 'Organization', name: 'PurpleGirl Editorial Team' },
        publisher: { '@type': 'Organization', name: 'PurpleGirl', url: 'https://purplegirl.in' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://purplegirl.in' },
          { '@type': 'ListItem', position: 2, name: cityData.name, item: `https://purplegirl.in/city/${city}` },
          { '@type': 'ListItem', position: 3, name: topicData.topicName, item: `https://purplegirl.in/city/${city}/${topic}` },
        ],
      },
    ],
  };

  // Other cities for the same topic
  const otherCities = CITIES.filter(c => c.slug !== city).slice(0, 5);

  // Other topics for the same city
  const otherTopics = TOPICS.filter(t => t.topicSlug !== topic);

  return (
    <>
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
            <nav className="flex items-center flex-wrap gap-1 text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-8" aria-label="breadcrumb">
              <Link href="/" className="hover:text-pg-rose">Home</Link>
              <ChevronRight size={14} />
              <span className="text-pg-gray-900">{cityData.name}</span>
              <ChevronRight size={14} />
              <span className="text-pg-gray-900">{topicData.topicName}</span>
            </nav>

            {/* Location badge */}
            <div className="inline-flex items-center gap-2 bg-pg-rose-light text-pg-rose px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
              <MapPin size={12} />
              {cityData.name}, {cityData.state}
            </div>

            {/* H1 */}
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-pg-gray-900 leading-tight mb-4">
              {topicData.emoji} {h1}
            </h1>

            {/* City tip callout */}
            {cityData.localTip && (
              <div className="bg-pg-plum/5 border border-pg-plum/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                <MapPin size={16} className="text-pg-plum shrink-0 mt-0.5" />
                <p className="text-[14px] text-pg-gray-700 leading-relaxed">
                  <strong className="text-pg-plum">{cityData.name} Tip:</strong> {cityData.localTip}
                </p>
              </div>
            )}

            {/* Intro */}
            <p className="text-[17px] leading-[1.85] text-pg-gray-700 mb-12">
              {intro}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {topicData.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="font-display text-[22px] md:text-[26px] font-bold text-pg-gray-900 mb-4 leading-snug">
                    {fillTemplate(section.heading, cityData.name)}
                  </h2>
                  <p className="text-[16px] leading-[1.85] text-pg-gray-700 whitespace-pre-line">
                    {fillTemplate(section.body, cityData.name)}
                  </p>
                </section>
              ))}
            </div>

            {/* Things to Know */}
            <div className="mt-14 bg-pg-cream rounded-2xl p-8 border border-pg-gray-100">
              <h2 className="font-display text-[22px] font-bold text-pg-gray-900 mb-6">
                Key Things to Know
              </h2>
              <ul className="space-y-3">
                {topicData.thingsToKnow.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-pg-rose shrink-0 mt-0.5" />
                    <span className="text-[15px] text-pg-gray-700 leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Guides */}
            {topicData.relatedGuides.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-[22px] font-bold text-pg-gray-900 mb-6">
                  Related Guides
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {topicData.relatedGuides.map((guide) => {
                    const isWiki = guide.slug.startsWith('/wiki/');
                    const href = isWiki ? guide.slug : `/how-to/${guide.slug}`;
                    return (
                      <Link key={guide.slug} href={href}>
                        <Card className="p-5 hover:border-pg-rose transition-colors h-full flex items-center gap-3 group">
                          <div className="w-8 h-8 bg-pg-rose-light rounded-lg flex items-center justify-center shrink-0">
                            <ChevronRight size={16} className="text-pg-rose" />
                          </div>
                          <h3 className="font-sans font-bold text-[15px] text-pg-gray-900 leading-snug group-hover:text-pg-rose transition-colors">
                            {guide.title}
                          </h3>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Anonymous Ask CTA */}
            <div className="mt-12 bg-pg-plum text-white rounded-2xl p-8 text-center">
              <p className="font-display font-bold text-[22px] mb-3">
                Have a specific question about {topicData.topicName} in {cityData.name}?
              </p>
              <p className="text-pg-plum-light/80 text-sm mb-6">
                Ask anonymously. No name. No judgment. AI answers instantly.
              </p>
              <Link
                href="/ask"
                className="inline-block bg-white text-pg-plum font-bold py-3 px-8 rounded-xl hover:bg-pg-plum-light transition-colors"
              >
                Ask Anonymously →
              </Link>
            </div>

          </article>

          {/* ═══════════════════════════════
              SIDEBAR
              ═══════════════════════════════ */}
          <aside className="lg:w-[32%] space-y-8 lg:sticky lg:top-28 self-start">

            {/* Other topics in this city */}
            <div className="bg-pg-cream rounded-2xl p-6 border border-pg-gray-100">
              <h3 className="font-bold text-pg-gray-900 uppercase text-xs tracking-widest mb-5">
                More in {cityData.name}
              </h3>
              <div className="space-y-3">
                {otherTopics.map(t => (
                  <Link
                    key={t.topicSlug}
                    href={`/city/${city}/${t.topicSlug}`}
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-xl">{t.emoji}</span>
                    <span className="font-display font-bold text-[14px] text-pg-gray-900 group-hover:text-pg-rose transition-colors leading-tight">
                      {t.topicName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Same topic, other cities */}
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100">
              <h3 className="font-bold text-pg-gray-900 uppercase text-xs tracking-widest mb-5">
                {topicData.topicName} in Other Cities
              </h3>
              <div className="space-y-2">
                {otherCities.map(c => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}/${topic}`}
                    className="flex items-center gap-2 group py-1"
                  >
                    <MapPin size={13} className="text-pg-gray-400 shrink-0" />
                    <span className="text-[14px] font-medium text-pg-gray-700 group-hover:text-pg-rose transition-colors">
                      {topicData.topicName} in {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category link */}
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <p className="text-pg-gray-500 text-sm mb-4">
                Read all {topicData.categoryName} guides
              </p>
              <Link
                href={`/category/${topicData.categorySlug}`}
                className="inline-flex items-center gap-2 bg-pg-rose text-white font-bold px-5 py-3 rounded-xl hover:bg-pg-rose-dark transition-colors text-sm w-full justify-center"
              >
                {topicData.categoryName} Guides
                <ChevronRight size={16} />
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
}
