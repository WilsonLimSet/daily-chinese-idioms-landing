import { Metadata } from 'next';
import Script from 'next/script';
import { LANGUAGES } from '@/src/lib/constants';
import { getQuizEn } from '@/src/lib/sbti-quiz';
import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'SBTI Test — Take the Free 30-Question Personality Quiz (2026)',
  description:
    'Take the viral Chinese SBTI personality test in English. 30 questions, 27 possible types including the hidden DRUNK and HHHH fallback. Instant result with traits, compatibility, and the chengyu that matches your type.',
  keywords: [
    'sbti test',
    'sbti personality test',
    'sbti quiz',
    'take sbti test',
    'sbti test english',
    'sbti 27 types test',
    'sbti online',
    'free sbti test',
    'silly behavioral type indicator test',
    'chinese personality test',
  ].join(', '),
  alternates: {
    canonical: 'https://www.chineseidioms.com/sbti/test',
    languages: {
      'x-default': '/sbti/test',
      en: '/sbti/test',
      ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/sbti/test`])),
    },
  },
  openGraph: {
    title: 'SBTI Test — 30 Questions, 27 Types, Instant Result',
    description:
      'The viral Chinese SBTI personality test in English. Find your type in under 5 minutes — from CTRL to MALO to the hidden DRUNK.',
    url: 'https://www.chineseidioms.com/sbti/test',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SBTI Test — 30 Questions, 27 Types',
    description: 'Take the viral Chinese personality test. 30 questions, instant result.',
  },
};

export default function SbtiTestPage() {
  const quiz = getQuizEn();

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'SBTI Personality Test',
      about: { '@type': 'Thing', name: 'SBTI — Silly Behavioral Type Indicator' },
      educationalLevel: 'Entertainment',
      inLanguage: 'en',
      url: 'https://www.chineseidioms.com/sbti/test',
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: 'https://www.chineseidioms.com/sbti' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'SBTI Test',
          item: 'https://www.chineseidioms.com/sbti/test',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long does the SBTI test take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'About 4–6 minutes. There are 30 main questions with 3 answer choices each.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the SBTI test free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. No signup, no payment, no email required. Your answers stay in your browser.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the SBTI test accurate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "SBTI is for entertainment. It's a parody of MBTI, not a clinical assessment. The 27 types are satirical but the vibes feel scarily specific — which is why it went viral.",
          },
        },
        {
          '@type': 'Question',
          name: 'Are my answers saved anywhere?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Only in your own browser (localStorage), so you can resume if you close the tab. Nothing is sent to a server. Clearing your browser storage removes everything.',
          },
        },
      ],
    },
  ];

  const ldJson = JSON.stringify(structuredData);

  return (
    <>
      <Script
        id="ld-sbti-test"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {ldJson}
      </Script>

      <div className="min-h-screen">
        <QuizClient
          resultBasePath="/sbti/test/result"
          backHref="/sbti"
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
