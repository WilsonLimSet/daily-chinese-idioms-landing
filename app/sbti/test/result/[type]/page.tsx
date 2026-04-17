import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getAllSbtiTypesEn, getSbtiType, typeCodeToSlug } from '@/src/lib/sbti';
import { getQuizEn } from '@/src/lib/sbti-quiz';
import { LANGUAGES } from '@/src/lib/constants';
import ResultInteractive from '../ResultInteractive';

export async function generateStaticParams() {
  const slugs = getAllSbtiTypesEn().map(t => ({ type: typeCodeToSlug(t.code) }));
  slugs.push({ type: 'hhhh' });
  slugs.push({ type: 'drunk' });
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const sbti = getSbtiType(type);
  const canonical = sbti
    ? `https://www.chineseidioms.com/sbti/${type}`
    : `https://www.chineseidioms.com/sbti/test/result/${type}`;
  const title = sbti ? `SBTI ${sbti.code} — ${sbti.displayName}` : 'Your SBTI Result';
  const description = sbti
    ? `${sbti.tagline} See the full profile — traits, compatibility, and the chengyu that matches your type.`
    : 'Your SBTI personality test result.';
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'x-default': `/sbti/${type}`,
        en: `/sbti/${type}`,
        ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/sbti/${type}`])),
      },
    },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `https://www.chineseidioms.com/sbti/test/result/${type}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'article',
    },
  };
}

const RARITY_PCT: Record<string, number> = {
  CTRL: 3, 'ATM-er': 4, 'Dior-s': 7, BOSS: 3, 'THAN-K': 5, 'OH-NO': 5, GOGO: 4,
  SEXY: 3, 'LOVE-R': 2, MUM: 4, FAKE: 3, OJBK: 6, MALO: 5, 'JOKE-R': 2,
  'WOC!': 5, 'THIN-K': 6, SHIT: 4, ZZZZ: 5, POOR: 3, MONK: 2, IMSB: 2,
  SOLO: 3, FUCK: 2, DEAD: 2, IMFW: 3,
};

export default async function SbtiResultPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const sbti = getSbtiType(type);
  if (!sbti) notFound();

  const quiz = getQuizEn();
  const isFallback = sbti.code === 'HHHH';
  const isDrunk = sbti.code === 'DRUNK';
  const rarity = RARITY_PCT[sbti.code];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero — fully static, no query-params */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        >
          <span className="text-[36vw] font-bold leading-none tracking-tight text-white/[0.04] md:text-[24rem]">
            {sbti.code.replace(/[^A-Z0-9?!-]/gi, '').slice(0, 6)}
          </span>
        </div>

        <nav className="relative mx-auto max-w-5xl px-6 pt-6">
          <Link
            href="/sbti/test"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {quiz.ui.result.retakeTest}
          </Link>
        </nav>

        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-20 md:pt-16 md:pb-24">
          <p className="sbti-reveal mb-6 text-[11px] font-semibold uppercase tracking-[0.25em]">
            <span className="inline-flex items-center gap-2 text-white/40">
              <span
                className={
                  'h-1 w-1 rounded-full ' +
                  (isDrunk ? 'bg-rose-400' : isFallback ? 'bg-amber-400' : 'bg-red-400')
                }
              />
              {isDrunk ? quiz.ui.result.hiddenType : isFallback ? quiz.ui.result.fallbackType : quiz.ui.result.yourResult}
            </span>
          </p>

          <h1 className="sbti-reveal-delay-1 text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-[6rem]">
            {sbti.code}
          </h1>
          <p className="sbti-reveal-delay-1 mt-3 text-xl text-white/60 md:text-2xl">
            {sbti.displayName}
          </p>
          <p className="sbti-reveal-delay-2 mt-6 max-w-2xl text-lg italic leading-[1.55] text-white/75 md:text-xl">
            &ldquo;{sbti.tagline}&rdquo;
          </p>

          {/* Interactive: similarity, rarity, special callouts, no-v state */}
          <Suspense fallback={null}>
            <ResultInteractive
              typeCode={sbti.code}
              typeSlug={type}
              rarity={rarity}
              isDrunk={isDrunk}
              isFallback={isFallback}
              dimensions={quiz.dimensions}
              tagline={sbti.tagline}
              resultPath={`/sbti/test/result/${type}`}
              fullProfilePath={`/sbti/${type}`}
              retakePath="/sbti/test"
              i18n={quiz.ui.result}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
