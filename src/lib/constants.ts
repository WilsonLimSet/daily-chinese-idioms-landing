/**
 * Shared constants for the Chinese Idioms application
 * This file contains language codes, locales, and configuration used throughout the app
 */

/**
 * Available languages with their English names
 */
export const LANGUAGES = {
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
  'tl': 'Tagalog',
  'ms': 'Malay',
  'ru': 'Russian',
} as const;

/**
 * Type-safe language code from LANGUAGES keys
 */
export type LanguageCode = keyof typeof LANGUAGES;

/**
 * Array of language codes for iteration
 */
export const LANGUAGE_CODES = Object.keys(LANGUAGES) as LanguageCode[];

/**
 * Locale mapping for date formatting (BCP 47 language tags)
 */
export const LOCALE_MAP = {
  'id': 'id-ID',
  'vi': 'vi-VN',
  'th': 'th-TH',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'es': 'es-ES',
  'pt': 'pt-BR',
  'hi': 'hi-IN',
  'ar': 'ar-SA',
  'fr': 'fr-FR',
  'tl': 'tl-PH',
  'ms': 'ms-MY',
  'ru': 'ru-RU',
  'en': 'en-US'
} as const;

/**
 * Full language configuration including flag, native name, and English name
 */
export const LANGUAGE_CONFIG = {
  'en': {
    code: 'en',
    flag: '🇺🇸',
    nativeName: 'English',
    englishName: 'English',
    locale: 'en-US',
    isDefault: true,
  },
  'es': {
    code: 'es',
    flag: '🇪🇸',
    nativeName: 'Español',
    englishName: 'Spanish',
    locale: 'es-ES',
  },
  'pt': {
    code: 'pt',
    flag: '🇧🇷',
    nativeName: 'Português',
    englishName: 'Portuguese',
    locale: 'pt-BR',
  },
  'id': {
    code: 'id',
    flag: '🇮🇩',
    nativeName: 'Indonesia',
    englishName: 'Indonesian',
    locale: 'id-ID',
  },
  'hi': {
    code: 'hi',
    flag: '🇮🇳',
    nativeName: 'हिंदी',
    englishName: 'Hindi',
    locale: 'hi-IN',
  },
  'ja': {
    code: 'ja',
    flag: '🇯🇵',
    nativeName: '日本語',
    englishName: 'Japanese',
    locale: 'ja-JP',
  },
  'ko': {
    code: 'ko',
    flag: '🇰🇷',
    nativeName: '한국어',
    englishName: 'Korean',
    locale: 'ko-KR',
  },
  'vi': {
    code: 'vi',
    flag: '🇻🇳',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    locale: 'vi-VN',
  },
  'th': {
    code: 'th',
    flag: '🇹🇭',
    nativeName: 'ไทย',
    englishName: 'Thai',
    locale: 'th-TH',
  },
  'ar': {
    code: 'ar',
    flag: '🇸🇦',
    nativeName: 'العربية',
    englishName: 'Arabic',
    locale: 'ar-SA',
  },
  'fr': {
    code: 'fr',
    flag: '🇫🇷',
    nativeName: 'Français',
    englishName: 'French',
    locale: 'fr-FR',
  },
  'tl': {
    code: 'tl',
    flag: '🇵🇭',
    nativeName: 'Tagalog',
    englishName: 'Tagalog',
    locale: 'tl-PH',
  },
  'ms': {
    code: 'ms',
    flag: '🇲🇾',
    nativeName: 'Bahasa Melayu',
    englishName: 'Malay',
    locale: 'ms-MY',
  },
  'ru': {
    code: 'ru',
    flag: '🇷🇺',
    nativeName: 'Русский',
    englishName: 'Russian',
    locale: 'ru-RU',
  },
} as const;

/**
 * Type for all language codes including English
 */
export type AllLanguageCode = keyof typeof LANGUAGE_CONFIG;

/**
 * Helper to check if a string is a valid language code
 */
export function isValidLanguageCode(code: string): code is LanguageCode {
  return code in LANGUAGES;
}

/**
 * Helper to check if a string is a valid language code including English
 */
export function isValidAllLanguageCode(code: string): code is AllLanguageCode {
  return code in LANGUAGE_CONFIG;
}

/**
 * Get locale for a language code
 */
export function getLocale(lang: AllLanguageCode): string {
  return LANGUAGE_CONFIG[lang]?.locale || 'en-US';
}
