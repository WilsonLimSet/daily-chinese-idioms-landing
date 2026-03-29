import { getAllComparisons } from '@/src/lib/comparisons';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import AdUnit from '@/app/components/AdUnit';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Chinese Idioms — What\'s the Difference? | Chinese Idioms',
  description: 'Confused by similar Chinese idioms? Compare pairs of chengyu side-by-side to understand the subtle differences in meaning, usage, and origin.',
  keywords: 'chinese idiom comparison, chengyu difference, similar chinese idioms, compare chengyu, chinese idiom vs',
};

export default function ComparePage() {
  const comparisons = getAllComparisons();

  const synonyms = comparisons.filter(c => c.similarity === 'synonym');
  const nuances = comparisons.filter(c => c.similarity === 'nuance');
  const opposites = comparisons.filter(c => c.similarity === 'opposite');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Compare Idioms</span>
        </nav>

        <div className="text-center mb-10">
          <Scale className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Compare Chinese Idioms
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Many Chinese idioms (成语) have similar meanings but different nuances.
            Explore {comparisons.length} side-by-side comparisons to understand when to use each.
          </p>
        </div>

        <AdUnit type="display" />

        {/* Similar Meaning */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Similar Meaning</h2>
          <p className="text-sm text-gray-500 mb-4">Idioms that mean nearly the same thing but with different emphasis</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synonyms.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold">{c.idiom1.characters}</span>
                  <span className="text-gray-400 text-sm">vs</span>
                  <span className="text-xl font-bold">{c.idiom2.characters}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{c.reason}</p>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit type="in-article" />

        {/* Subtle Differences */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Subtle Differences</h2>
          <p className="text-sm text-gray-500 mb-4">Idioms that are related but target different aspects</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nuances.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold">{c.idiom1.characters}</span>
                  <span className="text-gray-400 text-sm">vs</span>
                  <span className="text-xl font-bold">{c.idiom2.characters}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{c.reason}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Contrasting */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Contrasting Pairs</h2>
          <p className="text-sm text-gray-500 mb-4">Idioms that represent opposite approaches or perspectives</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opposites.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-rose-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold">{c.idiom1.characters}</span>
                  <span className="text-gray-400 text-sm">vs</span>
                  <span className="text-xl font-bold">{c.idiom2.characters}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{c.reason}</p>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit type="multiplex" />
      </div>
    </div>
  );
}
