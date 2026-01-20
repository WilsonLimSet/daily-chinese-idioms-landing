'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { BlogPost } from '@/src/lib/blog';
import { getTranslation } from '@/src/lib/translations';
import { LOCALE_MAP } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';

const POSTS_PER_PAGE = 24;

interface BlogClientProps {
  posts: BlogPost[];
  themes: string[];
  lang?: string;
}

export default function BlogClient({ posts, themes, lang = 'en' }: BlogClientProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts by theme and search
  const filteredPosts = posts.filter(post => {
    const matchesTheme = selectedTheme === 'all' || post.idiom.theme === selectedTheme;

    if (searchQuery === '') {
      return matchesTheme;
    }

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      post.idiom.characters.includes(searchQuery) ||
      post.idiom.pinyin.toLowerCase().includes(query) ||
      post.idiom.metaphoric_meaning.toLowerCase().includes(query) ||
      post.idiom.meaning.toLowerCase().includes(query) ||
      post.idiom.description.toLowerCase().includes(query) ||
      post.idiom.example.toLowerCase().includes(query) ||
      post.idiom.chineseExample.includes(searchQuery) ||
      post.idiom.theme.toLowerCase().includes(query);

    return matchesTheme && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTheme, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getTranslation(lang, 'blogTitle')}</h1>
              <p className="mt-2 text-gray-600">{getTranslation(lang, 'blogSubtitle')}</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              {getTranslation(lang, 'backToHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b sticky top-[104px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={getTranslation(lang, 'searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b sticky top-[168px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-gray-700 flex-shrink-0">
              <Filter className="w-4 h-4" />
              <span className="font-medium">{getTranslation(lang, 'filterByTheme')}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTheme('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTheme === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
{getTranslation(lang, 'all')} ({posts.length})
              </button>
              {themes.map(theme => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedTheme === theme
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {theme} ({posts.filter(p => p.idiom.theme === theme).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results info */}
        <div className="mb-6 text-gray-600">
{getTranslation(lang, 'showing')} {startIndex + 1}-{Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length)} {getTranslation(lang, 'of')} {filteredPosts.length} {getTranslation(lang, 'idioms')}
        </div>

        {paginatedPosts.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
{getTranslation(lang, 'noResults')}
          </div>
        ) : (
          <>
            {/* Optimized grid with 4 columns on desktop */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={lang === 'en' ? `/blog/${post.slug}` : `/${lang}/blog/${post.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {post.idiom.characters}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString(LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <h2 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {post.idiom.metaphoric_meaning}
                  </h2>
                  
                  <p className="text-gray-500 text-xs mb-2">{post.idiom.pinyin}</p>
                  
                  <div className="mt-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {post.idiom.theme}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-red-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-1">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} {lang === 'en' ? 'Daily Chinese Idioms' : getTranslation(lang, 'footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {lang === 'en' ? 'Built by Wilson' : getTranslation(lang, 'footerBuiltBy')}
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href={lang === 'en' ? '/blog' : `/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {lang === 'en' ? 'Blog' : getTranslation(lang, 'footerBlog')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href={lang === 'en' ? '/dictionary' : `/${lang}/dictionary`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dictionary
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href={lang === 'en' ? '/privacy' : `/${lang}/privacy`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {lang === 'en' ? 'Privacy Policy' : getTranslation(lang, 'footerPrivacy')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}