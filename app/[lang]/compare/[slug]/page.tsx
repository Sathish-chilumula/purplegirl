import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, CheckCircle, XCircle, Minus } from 'lucide-react';
import { getComparePage, getAllCompareSlugs } from '@/lib/compare-data';
import { Card } from '@/components/ui/Card';

export const runtime = 'edge';


interface ComparePageProps {
  params: Promise<{ lang: string; slug: string }>;
}



export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const page = getComparePage(slug);
  if (!page) return { title: 'Not Found' };

  const SITE_URL = 'https://purplegirl.in';
  const canonical = lang === 'en' ? `/compare/${slug}` : `/${lang}/compare/${slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical,
      languages: {
        'en': `${SITE_URL}/compare/${slug}`,
        'x-default': `${SITE_URL}/compare/${slug}`,
      },
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'article',
    },
  };
}

const WINNER_CONFIG = {
  a: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Wins' },
  b: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Wins' },
  both: { icon: CheckCircle, color: 'text-pg-rose', bg: 'bg-pg-rose-light', label: 'Both' },
  depends: { icon: Minus, color: 'text-pg-gray-400', bg: 'bg-pg-gray-50', label: 'Depends' },
};

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug, lang } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  const SITE_URL = 'https://purplegirl.in';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: page.title,
        description: page.metaDescription,
        author: { '@type': 'Organization', name: 'PurpleGirl Editorial Team' },
        publisher: { '@type': 'Organization', name: 'PurpleGirl', url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare` },
          { '@type': 'ListItem', position: 3, name: page.title, item: `${SITE_URL}/compare/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white min-h-screen">
        <div className="max-w-[900px] mx-auto px-6 py-12">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-8" aria-label="breadcrumb">
            <Link href="/" className="hover:text-pg-rose">Home</Link>
            <ChevronRight size={14} />
            <Link href="/compare" className="hover:text-pg-rose">Compare</Link>
            <ChevronRight size={14} />
            <span className="text-pg-gray-700 truncate max-w-[200px]">{page.labelA} vs {page.labelB}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-pg-rose-light text-pg-rose px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              {page.emoji} {page.category}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-pg-gray-900 leading-tight mb-4">
              {page.title}
            </h1>
            <p className="text-[17px] text-pg-gray-600 leading-[1.8]">
              {page.intro}
            </p>
          </div>

          {/* Quick Verdict */}
          <div className="bg-pg-plum text-white rounded-2xl p-6 mb-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-pg-rose-light mb-2">
              Quick Verdict
            </p>
            <p className="text-[16px] leading-[1.75] font-medium">
              {page.quickVerdict}
            </p>
          </div>

          {/* VS Header */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
            <div className="bg-emerald-600 text-white rounded-xl px-4 py-3 text-center font-display font-bold text-[15px] md:text-[18px]">
              {page.labelA}
            </div>
            <div className="font-display font-black text-pg-gray-300 text-xl">VS</div>
            <div className="bg-blue-600 text-white rounded-xl px-4 py-3 text-center font-display font-bold text-[15px] md:text-[18px]">
              {page.labelB}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-14 rounded-2xl border border-pg-gray-100 shadow-sm">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-pg-cream border-b border-pg-gray-100">
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-pg-gray-500 w-[30%]">
                    Aspect
                  </th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-emerald-700 w-[32%]">
                    {page.labelA}
                  </th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-blue-700 w-[32%]">
                    {page.labelB}
                  </th>
                  <th className="text-left px-4 py-4 text-[11px] font-bold uppercase tracking-widest text-pg-gray-500 w-[6%]">
                    Edge
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.table.map((row, i) => {
                  const winConf = row.winner ? WINNER_CONFIG[row.winner] : null;
                  const WinIcon = winConf?.icon;
                  return (
                    <tr key={i} className={`border-b border-pg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-pg-cream/40'}`}>
                      <td className="px-5 py-4 font-bold text-[13px] text-pg-gray-900 align-top">
                        {row.aspect}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-pg-gray-700 leading-relaxed align-top">
                        {row.a}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-pg-gray-700 leading-relaxed align-top">
                        {row.b}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {winConf && WinIcon && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${winConf.bg} ${winConf.color}`}>
                            <WinIcon size={11} />
                            {winConf.label === 'Wins'
                              ? (row.winner === 'a' ? page.labelA.split(' ')[0] : page.labelB.split(' ')[0])
                              : winConf.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Choose A vs Choose B */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {/* Verdict A */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h2 className="font-display font-bold text-[17px] text-emerald-800 mb-4">
                {page.verdictA.label}
              </h2>
              <ul className="space-y-2.5">
                {page.verdictA.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[14px] text-emerald-900 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verdict B */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="font-display font-bold text-[17px] text-blue-800 mb-4">
                {page.verdictB.label}
              </h2>
              <ul className="space-y-2.5">
                {page.verdictB.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-[14px] text-blue-900 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Our Recommendation */}
          <div className="bg-pg-rose-light border-l-4 border-pg-rose rounded-r-2xl p-6 mb-14">
            <p className="text-[11px] font-bold uppercase tracking-widest text-pg-rose mb-2">
              Our Recommendation
            </p>
            <p className="text-[16px] text-pg-gray-900 leading-[1.8]">
              {page.recommendation}
            </p>
          </div>

          {/* Related Guides */}
          {page.relatedGuides.length > 0 && (
            <div className="mb-14">
              <h2 className="font-display text-[22px] font-bold text-pg-gray-900 mb-5">
                Related Guides
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {page.relatedGuides.map(guide => (
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
                {page.relatedWiki?.map(term => (
                  <Link key={term} href={`/wiki/${term}`}>
                    <Card className="p-5 hover:border-pg-plum transition-colors h-full flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-pg-plum/10 rounded-lg flex items-center justify-center shrink-0">
                        <ChevronRight size={16} className="text-pg-plum" />
                      </div>
                      <h3 className="font-sans font-bold text-[15px] text-pg-gray-900 leading-snug group-hover:text-pg-plum transition-colors capitalize">
                        What is {term.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}? →
                      </h3>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Anonymous Ask CTA */}
          <div className="bg-pg-plum text-white rounded-2xl p-8 text-center">
            <p className="font-display font-bold text-[20px] mb-3">
              Still not sure which is right for you?
            </p>
            <p className="text-pg-plum-light/80 text-sm mb-6">
              Ask anonymously — AI answers your specific situation.
            </p>
            <Link
              href="/ask"
              className="inline-block bg-white text-pg-plum font-bold py-3 px-8 rounded-xl hover:bg-pg-rose-light transition-colors"
            >
              Ask Anonymously →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
