'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type SlangTerm = {
  slug: string;
  characters: string;
  pinyin: string;
  meaning: string;
  category: string;
  era: string;
};

const ERA_BUCKETS = [
  { label: '2024', match: (era: string) => era === '2024' },
  { label: '2022–23', match: (era: string) => era === '2022' || era === '2023' },
  { label: '2020–21', match: (era: string) => era === '2020' || era === '2021' || era === '2020s' },
  { label: 'Pre-2020', match: (era: string) => {
    const num = parseInt(era);
    if (!num) return era === '2010s' || era === '2000s';
    return num < 2020;
  }},
];

export default function SlangEraFilter({
  terms,
  categories,
  langPrefix = '',
}: {
  terms: SlangTerm[];
  eras: string[];
  categories: string[];
  langPrefix?: string;
}) {
  const [selectedBucket, setSelectedBucket] = useState<number | null>(null);

  const filtered = selectedBucket !== null
    ? terms.filter(t => ERA_BUCKETS[selectedBucket].match(t.era))
    : terms;

  const groupedByCategory = categories
    .map(cat => ({
      category: cat,
      terms: filtered.filter(t => t.category === cat),
    }))
    .filter(g => g.terms.length > 0);

  return (
    <>
      {/* Era filter */}
      <div className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-400 mr-1">Filter by era</span>
            <button
              onClick={() => setSelectedBucket(null)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-75 ${
                selectedBucket === null
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-700'
              }`}
            >
              All {terms.length}
            </button>
            {ERA_BUCKETS.map((bucket, i) => {
              const count = terms.filter(t => bucket.match(t.era)).length;
              if (count === 0) return null;
              return (
                <button
                  key={bucket.label}
                  onClick={() => setSelectedBucket(selectedBucket === i ? null : i)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-75 ${
                    selectedBucket === i
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  {bucket.label} <span className={selectedBucket === i ? 'text-neutral-400' : 'text-neutral-300'}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {groupedByCategory.map(({ category, terms: catTerms }) => (
          <section key={category} id={category.toLowerCase().replace(/[&\s]+/g, '-')}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-neutral-900">{category}</h2>
              <span className="text-xs text-neutral-400">{catTerms.length}</span>
            </div>

            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
              {catTerms.map(term => (
                <Link
                  key={term.slug}
                  href={`${langPrefix}/slang/${term.slug}`}
                  className="group flex items-center gap-6 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75"
                >
                  <div className="shrink-0 w-28 sm:w-36">
                    <p className="text-lg font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors duration-75 truncate">
                      {term.characters}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{term.pinyin}</p>
                  </div>
                  <p className="flex-1 text-sm text-neutral-500 leading-relaxed line-clamp-1 min-w-0">
                    {term.meaning}
                  </p>
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <span className="text-xs text-neutral-300">{term.era}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors duration-75" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
