'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type ListicleItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  idiomCount: number;
};

export default function ListicleFilter({
  listicles,
  categories,
  langPrefix = '',
}: {
  listicles: ListicleItem[];
  categories: string[];
  langPrefix?: string;
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = listicles;
    if (selectedCategory) {
      result = result.filter(l => l.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [listicles, selectedCategory, query]);

  return (
    <>
      {/* Search + Category filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lists..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-75 ${
              selectedCategory === null
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            All ({listicles.length})
          </button>
          {categories.map(cat => {
            const count = listicles.filter(l => l.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-75 ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {(query || selectedCategory) && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} list{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listicle) => (
          <Link
            key={listicle.slug}
            href={`${langPrefix}/blog/lists/${listicle.slug}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100 hover:border-red-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                {listicle.category}
              </span>
              <span className="text-xs text-gray-500">
                {listicle.idiomCount} idioms
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
              {listicle.title}
            </h2>

            <p className="text-gray-600 text-sm line-clamp-3">
              {listicle.description}
            </p>

            <div className="mt-4 text-sm font-medium text-red-600 group-hover:text-red-700">
              Read list →
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No lists found matching your search.</p>
        </div>
      )}
    </>
  );
}
