'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { LANGUAGE_CONFIG } from '@/src/lib/constants';

export default function LanguageSelector({ currentLang = 'en', dropdownPosition = 'up', forceHome = false }: { currentLang?: string; dropdownPosition?: 'up' | 'down'; forceHome?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentConfig = LANGUAGE_CONFIG[currentLang as keyof typeof LANGUAGE_CONFIG] || LANGUAGE_CONFIG.en;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // When forceHome is set the current page has no localized equivalent (e.g. /dramas),
    // so switching language routes to that language's home page instead of 404ing.
    if (forceHome) {
      router.push(langCode === 'en' ? '/' : `/${langCode}`);
      setIsOpen(false);
      return;
    }

    // Get the base path after removing the language prefix
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

    // Build new path
    const newPath = langCode === 'en'
      ? pathWithoutLang === '/' ? '/' : pathWithoutLang
      : `/${langCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span>{currentConfig.nativeName}</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-80 overflow-y-auto z-50 ${dropdownPosition === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'}`}>
          {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                code === currentLang ? 'bg-gray-50 text-red-600 font-medium' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{config.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{config.nativeName}</div>
                <div className="text-xs text-gray-500">{config.englishName}</div>
              </div>
              {code === currentLang && (
                <span className="text-red-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
