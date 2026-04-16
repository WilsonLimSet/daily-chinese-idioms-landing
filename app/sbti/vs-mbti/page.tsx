import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'SBTI vs MBTI — What&apos;s the Difference? (27 Types vs 16 Types)',
  description: 'SBTI is the viral Chinese parody of MBTI with 27 satirical types. Full comparison: origin, science, types, cultural meaning, and which is more accurate.',
  keywords: [
    'sbti vs mbti',
    'sbti or mbti',
    'difference between sbti and mbti',
    'is sbti real',
    'is sbti accurate',
    'sbti vs 16 personalities',
    'sbti types vs mbti types',
    'mbti parody',
    'chinese mbti',
  ].join(', '),
  alternates: {
    canonical: 'https://www.chineseidioms.com/sbti/vs-mbti',
    languages: {
      'x-default': '/sbti/vs-mbti',
      en: '/sbti/vs-mbti',
      ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/sbti/vs-mbti`])),
    },
  },
  openGraph: {
    title: 'SBTI vs MBTI — Full Comparison',
    description: 'SBTI (27 types, viral 2026) vs MBTI (16 types, Jungian psychology). Which one is right for you?',
    url: 'https://www.chineseidioms.com/sbti/vs-mbti',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'article',
  },
};

const COMPARISON = [
  { attr: 'Number of types', sbti: '27 (25 regular + 2 special)', mbti: '16' },
  { attr: 'Origin', sbti: 'Bilibili content creator, April 2026', mbti: 'Katharine Briggs & Isabel Myers, 1940s' },
  { attr: 'Based on', sbti: 'Chinese internet slang and modern life satire', mbti: 'Jungian cognitive function theory' },
  { attr: 'Number of questions', sbti: '30 + special questions', mbti: '60–100 (varies)' },
  { attr: 'Number of dimensions', sbti: '15 (across 5 models)', mbti: '4 (E/I, S/N, T/F, J/P)' },
  { attr: 'Type names', sbti: 'Internet slang: CTRL, BOSS, MALO, DRUNK…', mbti: 'Four-letter codes: INTJ, ENFP…' },
  { attr: 'Scientific claim', sbti: 'None — entertainment only', mbti: 'Pseudo-scientific; widely criticized' },
  { attr: 'Hidden/secret types', sbti: 'Yes — DRUNK, HHHH fallback', mbti: 'No' },
  { attr: 'Cultural tone', sbti: 'Self-mocking, Gen-Z humor', mbti: 'Corporate, self-improvement' },
  { attr: 'Best for', sbti: 'Sharing on social media, meme relatability', mbti: 'Self-reflection, team workshops' },
];

const FAQ = [
  {
    q: 'Is SBTI more accurate than MBTI?',
    a: 'Neither is scientifically validated. MBTI has been criticized for decades for poor test-retest reliability and weak theoretical grounding. SBTI openly admits it\'s entertainment. In practical terms: MBTI feels more "serious" and is used in HR/workshops; SBTI feels more "accurate" to many people because its labels describe recognizable modern behaviors rather than abstract cognitive functions. Accuracy depends on what you want — clinical? Neither. Relatable? SBTI often wins.',
  },
  {
    q: 'Can I take SBTI and MBTI at the same time?',
    a: 'Yes — they measure different things. MBTI maps 4 psychological preferences; SBTI maps 15 behavior/emotion patterns in satirical form. Many people take both, share both results, and enjoy how different they feel. Your MBTI stays relatively stable across years; your SBTI might shift based on mood, life phase, or how chaotic your week has been.',
  },
  {
    q: 'Why did SBTI go viral when MBTI already exists?',
    a: 'MBTI has been mainstream in China for years, especially on social platforms. SBTI caught fire because it named things MBTI can\'t — specifically modern Chinese internet experiences like 打工人 (worker-drone) fatigue, 吗喽 (monkey-brain) chaos, 酒鬼 (drunkard) escapism, and 愤世者 (bitter-cynic) culture. The names are funny and specific, which is exactly what MBTI type names aren\'t.',
  },
  {
    q: 'What\'s the SBTI equivalent of INTJ?',
    a: 'Closest matches: CTRL (Controller — planning, structure, mastery) and THIN-K (Thinker — logic, analysis, cognitive distance). INTJs often get one of those two on SBTI, though the tests measure different axes so the mapping is imperfect.',
  },
  {
    q: 'What\'s the SBTI equivalent of ENFP?',
    a: 'Most ENFPs land on MALO (Monkey Brain Trickster — playful, inventive, anti-formal) or JOKE-R (Clown — humor-driven, atmosphere-maker). Both capture the scattered creative energy ENFPs are known for.',
  },
  {
    q: 'Is SBTI Chinese-only?',
    a: 'Originally Chinese (went viral in April 2026 on Bilibili, Weibo, and Xiaohongshu) but now available in English, Japanese, Korean, and a dozen other languages. The type names stay in their original English-ish form (CTRL, BOSS, MALO) across all language versions because they\'re part of the brand.',
  },
];

export default function SbtiVsMbtiPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'SBTI vs MBTI — Full Comparison',
      description: 'Head-to-head comparison of SBTI (Silly Behavioral Type Indicator) and MBTI.',
      author: { '@type': 'Organization', name: 'Chinese Idioms' },
      publisher: { '@type': 'Organization', name: 'Chinese Idioms', logo: { '@type': 'ImageObject', url: 'https://www.chineseidioms.com/icon.png' } },
      mainEntityOfPage: 'https://www.chineseidioms.com/sbti/vs-mbti',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id="sbti-vs-mbti-ld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/sbti" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI Guide
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            SBTI vs MBTI — What&apos;s the Difference?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            SBTI is the viral Chinese meme parody of MBTI that took over social media in April 2026. They&apos;re both personality tests — but they&apos;re measuring very different things, aimed at very different audiences, with very different claims to accuracy. Here&apos;s the honest head-to-head.
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">SBTI</h2>
            <p className="text-indigo-900/70 text-sm mb-3">Silly Behavioral Type Indicator</p>
            <ul className="space-y-1 text-sm text-indigo-900/80">
              <li>• 27 types</li>
              <li>• Chinese internet culture</li>
              <li>• Released 2026, viral</li>
              <li>• Entertainment-first</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">MBTI</h2>
            <p className="text-slate-700 text-sm mb-3">Myers-Briggs Type Indicator</p>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• 16 types (INTJ, ENFP…)</li>
              <li>• Jungian cognitive functions</li>
              <li>• Released 1940s</li>
              <li>• Workshops, HR, self-reflection</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Side-by-Side Comparison</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Attribute</th>
                  <th className="text-left p-4 font-semibold text-indigo-700">SBTI</th>
                  <th className="text-left p-4 font-semibold text-slate-700">MBTI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="p-4 font-medium text-gray-900">{row.attr}</td>
                    <td className="p-4 text-gray-700">{row.sbti}</td>
                    <td className="p-4 text-gray-700">{row.mbti}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <AdUnit type="in-article" />

        <section className="mb-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> When SBTI wins
            </h3>
            <ul className="space-y-2 text-sm text-green-900/80 leading-relaxed">
              <li>✓ You want something shareable on social media</li>
              <li>✓ You want labels that describe modern internet behaviors</li>
              <li>✓ You&apos;re bored of INTJ/ENFP and want fresher language</li>
              <li>✓ You want to laugh at yourself</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> When MBTI wins
            </h3>
            <ul className="space-y-2 text-sm text-slate-700/90 leading-relaxed">
              <li>✓ You want a framework for serious self-reflection</li>
              <li>✓ You need it for team workshops or coaching</li>
              <li>✓ You want cross-cultural language that everyone knows</li>
              <li>✓ You care about type stability across years</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">SBTI Type ↔ MBTI Type Rough Map</h2>
          <p className="text-gray-600 mb-5 text-sm">
            The tests measure different axes, so this mapping is loose. But here&apos;s what people commonly land on:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { sbti: 'CTRL (Controller)', mbti: 'INTJ, ESTJ' },
              { sbti: 'BOSS (Leader)', mbti: 'ENTJ, ESTJ' },
              { sbti: 'THIN-K (Thinker)', mbti: 'INTP, INTJ' },
              { sbti: 'MALO (Trickster)', mbti: 'ENFP, ENTP' },
              { sbti: 'JOKE-R (Clown)', mbti: 'ESFP, ENTP' },
              { sbti: 'MUM (Mother)', mbti: 'ISFJ, ESFJ' },
              { sbti: 'LOVE-R (Romantic)', mbti: 'INFP, ENFP' },
              { sbti: 'MONK (Monk)', mbti: 'INFJ, INTJ' },
              { sbti: 'GOGO (Doer)', mbti: 'ESTP, ESFP' },
              { sbti: 'DEAD (Exhausted Sage)', mbti: 'INFJ in burnout' },
            ].map((row, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3">
                <span className="font-bold text-indigo-700 text-sm">{row.sbti}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-slate-700 text-sm">{row.mbti}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }, i) => (
              <details key={i} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <summary className="cursor-pointer font-semibold text-gray-900 text-base sm:text-lg flex items-start justify-between gap-4">
                  <span>{q}</span>
                  <ChevronRight className="w-5 h-5 mt-1 flex-shrink-0 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Explore All 27 SBTI Types</h2>
          <Link
            href="/sbti"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
          >
            SBTI Type Directory
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href="/sbti" className="text-gray-600 hover:text-gray-900">SBTI</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang="en" />
          </div>
        </div>
      </footer>
    </div>
  );
}
