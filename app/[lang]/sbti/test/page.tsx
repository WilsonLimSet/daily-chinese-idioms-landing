import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import { getQuiz } from '@/src/lib/sbti-quiz';
import QuizClient from '@/app/sbti/test/QuizClient';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) return { title: 'Not found' };
  const nativeName =
    LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName ||
    LANGUAGES[lang as keyof typeof LANGUAGES];
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  const languageAlternates: Record<string, string> = {
    'x-default': '/sbti/test',
    en: '/sbti/test',
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/test`;
  }

  return {
    title: `SBTI Test — Take the Free Personality Quiz (${nativeName})`,
    description: `Take the viral Chinese SBTI personality test in ${nativeName}. 30 questions, 27 possible types including the hidden DRUNK and HHHH fallback.`,
    keywords: [
      'sbti test',
      'sbti personality test',
      'sbti quiz',
      'take sbti test',
      `sbti ${nativeName}`,
      'silly behavioral type indicator',
      'chinese personality test',
    ].join(', '),
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/sbti/test`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `SBTI Test — 30 Questions, 27 Types`,
      description: 'The viral Chinese SBTI personality test. Instant result in your language.',
      url: `https://www.chineseidioms.com/${lang}/sbti/test`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
  };
}

export default async function LocalizedSbtiTestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) notFound();

  const quiz = getQuiz(lang);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: quiz.meta.title,
      about: { '@type': 'Thing', name: 'SBTI — Silly Behavioral Type Indicator' },
      educationalLevel: 'Entertainment',
      inLanguage: lang,
      url: `https://www.chineseidioms.com/${lang}/sbti/test`,
      hasPart: quiz.main.map(q => ({
        '@type': 'Question',
        name: q.text,
        suggestedAnswer: q.options.map((o, i) => ({
          '@type': 'Answer',
          text: o.label,
          position: i + 1,
        })),
      })),
      author: {
        '@type': 'Person',
        name: '@蛆肉儿串儿',
        sameAs: 'https://space.bilibili.com/417038183',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        url: 'https://www.chineseidioms.com',
      },
      creditText:
        'Fan implementation. Original SBTI test by Bilibili creator @蛆肉儿串儿 (April 2026).',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: `https://www.chineseidioms.com/${lang}/sbti` },
        { '@type': 'ListItem', position: 3, name: 'SBTI Test', item: `https://www.chineseidioms.com/${lang}/sbti/test` },
      ],
    },
  ];
  const ldJson = JSON.stringify(structuredData);

  return (
    <>
      <Script id={`ld-sbti-test-${lang}`} type="application/ld+json" strategy="afterInteractive">
        {ldJson}
      </Script>

      <div className="min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <QuizClient
          resultBasePath={`/${lang}/sbti/test/result`}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          typePatterns={quiz.typePatterns}
          main={quiz.main}
          special={quiz.special}
          t={{
            progressFormat: '{cur} / {total}',
            bonusLabel: 'Bonus',
            back: 'Back',
            next: 'Next',
            submit: 'See result',
            restart: 'Restart',
            computing: '…',
            readAndReact: 'Read & react',
            resumeFormat: 'Resume ({cur}/{total})',
            startOver: 'Start over',
            errorState: 'Something went wrong. Please restart.',
            intro: {
              title: quiz.meta.title,
              subtitle: quiz.meta.subtitle,
              attribution: 'Original by @蛆肉儿串儿 · Bilibili',
              disclaimer: quiz.meta.disclaimer,
              start: 'Start',
              questionCount: 'questions',
              duration: 'minutes',
              socialProof: 'Viral April 2026 · millions of takers globally',
            },
          }}
        />

      </div>
    </>
  );
}
