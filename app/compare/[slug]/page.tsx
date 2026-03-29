import { getAllComparisons, getComparison, getRelatedComparisons, type IdiomComparison } from '@/src/lib/comparisons';
import { pinyinToSlug, removeToneMarks } from '@/src/lib/utils/pinyin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const comparisons = getAllComparisons();
  return comparisons.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    return { title: 'Comparison Not Found' };
  }

  const { idiom1, idiom2 } = comparison;
  const title = `${idiom1.characters} vs ${idiom2.characters}: What's the Difference? — Chinese Idiom Comparison`;
  const description = `${idiom1.characters} (${removeToneMarks(idiom1.pinyin)}) means "${idiom1.metaphoric_meaning}" while ${idiom2.characters} (${removeToneMarks(idiom2.pinyin)}) means "${idiom2.metaphoric_meaning}." Learn the key difference and when to use each.`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';
  const canonicalUrl = `${siteUrl}/compare/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${idiom1.characters} vs ${idiom2.characters}`,
      `${removeToneMarks(idiom1.pinyin)} vs ${removeToneMarks(idiom2.pinyin)}`,
      `${idiom1.characters} meaning`, `${idiom2.characters} meaning`,
      `${idiom1.characters} difference ${idiom2.characters}`,
      'chinese idiom comparison', 'chengyu comparison',
      'chinese idioms similar meaning', 'learn chinese idioms',
      idiom1.theme, idiom2.theme,
    ].join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Chinese Idioms',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function SimilarityBadge({ similarity }: { similarity: string }) {
  const config = {
    synonym: { label: 'Similar Meaning', color: 'bg-blue-100 text-blue-800' },
    nuance: { label: 'Subtle Difference', color: 'bg-amber-100 text-amber-800' },
    opposite: { label: 'Contrasting', color: 'bg-rose-100 text-rose-800' },
  }[similarity] || { label: similarity, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function IdiomCard({ idiom }: { idiom: IdiomComparison['idiom1'] }) {
  const slug = pinyinToSlug(idiom.pinyin);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
      <Link href={`/blog/${slug}`} className="group">
        <h2 className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-1">
          {idiom.characters}
        </h2>
        <p className="text-gray-500 text-sm mb-3">{idiom.pinyin}</p>
      </Link>
      <p className="text-lg font-medium text-gray-800 mb-2">&ldquo;{idiom.metaphoric_meaning}&rdquo;</p>
      <p className="text-gray-600 text-sm mb-4">Literally: {idiom.meaning}</p>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">{idiom.description.slice(0, 300)}{idiom.description.length > 300 ? '...' : ''}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm"><span className="font-medium text-gray-700">Example:</span> <span className="text-gray-600">{idiom.example}</span></p>
        <p className="text-sm"><span className="font-medium text-gray-700">Chinese:</span> <span className="text-gray-600">{idiom.chineseExample}</span></p>
      </div>
      <div className="mt-4">
        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{idiom.theme}</span>
      </div>
    </div>
  );
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    notFound();
  }

  const { idiom1, idiom2, similarity, reason } = comparison;
  const relatedComparisons = getRelatedComparisons(idiom1.id, slug)
    .concat(getRelatedComparisons(idiom2.id, slug))
    .filter((c, i, arr) => arr.findIndex(x => x.slug === c.slug) === i)
    .slice(0, 6);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';

  // FAQ structured data for "People also ask" — all content is from our own idiom database (trusted)
  const faqItems = [
    {
      question: `What is the difference between ${idiom1.characters} and ${idiom2.characters}?`,
      answer: reason,
    },
    {
      question: `What does ${idiom1.characters} (${removeToneMarks(idiom1.pinyin)}) mean?`,
      answer: `${idiom1.characters} literally means "${idiom1.meaning}" and is used to describe "${idiom1.metaphoric_meaning}." ${idiom1.description.slice(0, 200)}`,
    },
    {
      question: `What does ${idiom2.characters} (${removeToneMarks(idiom2.pinyin)}) mean?`,
      answer: `${idiom2.characters} literally means "${idiom2.meaning}" and is used to describe "${idiom2.metaphoric_meaning}." ${idiom2.description.slice(0, 200)}`,
    },
    {
      question: `When should I use ${idiom1.characters} vs ${idiom2.characters}?`,
      answer: `Use ${idiom1.characters} when you want to emphasize "${idiom1.metaphoric_meaning}." Use ${idiom2.characters} when you want to emphasize "${idiom2.metaphoric_meaning}." ${reason}`,
    },
  ];

  // Structured data is built from our own trusted idiom database content
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${idiom1.characters} vs ${idiom2.characters}: What's the Difference?`,
      "description": reason,
      "author": { "@type": "Organization", "name": "Chinese Idioms", "url": siteUrl },
      "publisher": { "@type": "Organization", "name": "Chinese Idioms" },
      "datePublished": "2025-01-15",
      "inLanguage": "en",
      "about": [
        { "@type": "DefinedTerm", "name": idiom1.characters, "description": idiom1.metaphoric_meaning },
        { "@type": "DefinedTerm", "name": idiom2.characters, "description": idiom2.metaphoric_meaning },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": "Compare Idioms", "item": `${siteUrl}/compare` },
        { "@type": "ListItem", "position": 3, "name": `${idiom1.characters} vs ${idiom2.characters}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-red-600">Compare Idioms</Link>
          <span>/</span>
          <span className="text-gray-900">{idiom1.characters} vs {idiom2.characters}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <SimilarityBadge similarity={similarity} />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">
            {idiom1.characters} vs {idiom2.characters}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            What&apos;s the difference between these two Chinese idioms?
          </p>
        </div>

        {/* Key Difference Box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Scale className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Key Difference</h2>
              <p className="text-gray-700 leading-relaxed">{reason}</p>
            </div>
          </div>
        </div>

        {/* Side by Side Cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <IdiomCard idiom={idiom1} />
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-full p-3">
              <span className="text-gray-500 font-bold text-sm">VS</span>
            </div>
          </div>
          <IdiomCard idiom={idiom2} />
        </div>

        <AdUnit type="in-article" />

        {/* Quick Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspect</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{idiom1.characters}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{idiom2.characters}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">Pinyin</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom1.pinyin}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom2.pinyin}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">Literal Meaning</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom1.meaning}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom2.meaning}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">Used For</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom1.metaphoric_meaning}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom2.metaphoric_meaning}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">Theme</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom1.theme}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom2.theme}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">Example</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom1.example}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{idiom2.example}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-800">{item.question}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-4 pt-3 pb-1 text-gray-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <AdUnit type="display" />

        {/* Related Comparisons */}
        {relatedComparisons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedComparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-red-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold">{c.idiom1.characters}</span>
                    <span className="text-gray-400 text-sm">vs</span>
                    <span className="text-lg font-bold">{c.idiom2.characters}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{c.reason}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Learn More Links */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href={`/blog/${pinyinToSlug(idiom1.pinyin)}`}
            className="flex-1 bg-white rounded-lg border border-gray-200 p-4 hover:border-red-300 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">{idiom1.characters}</span>
            <span className="text-sm text-gray-500">Learn more about this idiom →</span>
          </Link>
          <Link
            href={`/blog/${pinyinToSlug(idiom2.pinyin)}`}
            className="flex-1 bg-white rounded-lg border border-gray-200 p-4 hover:border-red-300 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">{idiom2.characters}</span>
            <span className="text-sm text-gray-500">Learn more about this idiom →</span>
          </Link>
        </div>

        <AdUnit type="multiplex" />
      </div>
    </div>
  );
}
