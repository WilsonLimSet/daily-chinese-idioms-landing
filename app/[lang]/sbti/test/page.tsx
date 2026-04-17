import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
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
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';
  const quiz = getQuiz(lang);

  const languageAlternates: Record<string, string> = {
    'x-default': '/sbti/test',
    en: '/sbti/test',
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/test`;
  }

  return {
    title: quiz.ui.seoTestTitle,
    description: quiz.ui.seoTestDescription,
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/sbti/test`,
      languages: languageAlternates,
    },
    openGraph: {
      title: quiz.ui.seoTestTitle,
      description: quiz.ui.seoTestDescription,
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
          backHref={`/${lang}/sbti`}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          typePatterns={quiz.typePatterns}
          main={quiz.main}
          special={quiz.special}
          subtitle={quiz.meta.subtitle}
          disclaimer={quiz.meta.disclaimer}
          ui={quiz.ui}
        />
      </div>
    </>
  );
}
