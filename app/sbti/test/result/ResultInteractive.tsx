'use client';

import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { decodeVector, DIMENSION_ORDER } from '@/src/lib/sbti-engine';
import type { DimensionMeta } from '@/src/lib/sbti-quiz';
import RadarChart from './RadarChart';
import ShareRow from './ShareRow';
import DimensionBreakdown from './DimensionBreakdown';

type Props = {
  typeCode: string;
  typeSlug: string;
  rarity?: number;
  isDrunk: boolean;
  isFallback: boolean;
  secondaryCode?: string;
  secondaryDisplayName?: string;
  dimensions: Record<string, DimensionMeta>;
  tagline: string;
  /** Canonical URL back to this result page (including lang prefix if any). */
  resultPath: string;
  /** Path to the full type profile (e.g. /sbti/ctrl or /ja/sbti/ctrl). */
  fullProfilePath: string;
  /** Path to retake the test (e.g. /sbti/test). */
  retakePath: string;
  isRtl?: boolean;
  i18n: {
    takeTheTest: string;
    matchStrong: string;
    matchGood: string;
    matchPartial: string;
    rarityTemplate: string;
    hiddenTypeBadge: string;
    hiddenTypeDesc: string;
    brokeModelBadge: string;
    brokeModelDesc: string;
    closestTemplate: string;
    normalBestTemplate: string;
    noResultTitle: string;
    noResultDesc: string;
    definingTraits: string;
    showAll: string;
    hideAll: string;
    profileKicker: string;
    profileHeading: string;
    profileSub: string;
  };
};

export default function ResultInteractive({
  typeCode,
  typeSlug,
  rarity,
  isDrunk,
  isFallback,
  secondaryCode,
  secondaryDisplayName,
  dimensions,
  tagline,
  resultPath,
  fullProfilePath,
  retakePath,
  isRtl,
  i18n,
}: Props) {
  const searchParams = useSearchParams();
  const v = searchParams.get('v') ?? '';
  const simStr = searchParams.get('sim');
  const sec = searchParams.get('sec');

  const hasResult = v.length > 0;
  const levels = hasResult ? decodeVector(v) : {};
  const similarity =
    simStr != null ? Math.max(0, Math.min(100, parseInt(simStr, 10))) : null;
  const isSpecial = isFallback || isDrunk;

  const dimensionLabels: Record<string, string> = {};
  for (const dim of DIMENSION_ORDER) {
    const fullName = dimensions[dim]?.name ?? dim;
    dimensionLabels[dim] = fullName.split(/[\s&/-]/)[0];
  }

  const simLabel =
    similarity != null
      ? similarity >= 80
        ? i18n.matchStrong
        : similarity >= 65
        ? i18n.matchGood
        : i18n.matchPartial
      : null;

  const resultUrl = hasResult
    ? `https://www.chineseidioms.com${resultPath}?v=${v}${simStr ? `&sim=${simStr}` : ''}${sec ? `&sec=${sec}` : ''}`
    : `https://www.chineseidioms.com${fullProfilePath}`;

  // Secondary display name takes priority from props if we got it from the
  // server; otherwise fall back to the raw sec code from the URL.
  const secondaryShown = secondaryCode ?? sec ?? null;
  const secondaryLabel = secondaryDisplayName
    ? `${secondaryShown} (${secondaryDisplayName})`
    : secondaryShown;

  return (
    <>
      {/* Hero extras (injected inline near the title in the server shell via portal is overkill —
          just render the meta strip + special callouts as a dedicated section at the top). */}
      <div className="sbti-reveal-delay-2">
        {hasResult && !isSpecial && similarity != null && (
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-red-400" />
              <span className="text-white/50">
                <span className="font-semibold text-white">{similarity}%</span>
                {simLabel && <> · {simLabel}</>}
              </span>
            </div>
            {rarity != null && (
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                <span className="text-white/50">
                  {i18n.rarityTemplate.replace('{rarity}', String(rarity)).replace('{code}', typeCode)}
                </span>
              </div>
            )}
          </div>
        )}

        {isDrunk && hasResult && (
          <div className="relative mt-10 max-w-2xl overflow-hidden rounded-xl bg-white/[0.04] p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -end-4 select-none font-serif text-[100px] leading-none text-white/[0.04]"
            >
              !
            </div>
            <div className="relative">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-rose-500/20 px-2 py-0.5">
                <span className="h-1 w-1 rounded-full bg-rose-400" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-300">
                  {i18n.hiddenTypeBadge}
                </span>
              </div>
              <p className="text-[15px] leading-[1.7] text-white/80">
                {i18n.hiddenTypeDesc}
                {secondaryShown && (
                  <> {i18n.normalBestTemplate.replace('{code}', secondaryLabel ?? '')}</>
                )}
              </p>
            </div>
          </div>
        )}

        {isFallback && hasResult && (
          <div className="relative mt-10 max-w-2xl overflow-hidden rounded-xl bg-white/[0.04] p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -end-4 select-none font-serif text-[100px] leading-none text-white/[0.04]"
            >
              ?
            </div>
            <div className="relative">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-amber-500/20 px-2 py-0.5">
                <span className="h-1 w-1 rounded-full bg-amber-400" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-300">
                  {i18n.brokeModelBadge}
                </span>
              </div>
              <p className="text-[15px] leading-[1.7] text-white/80">
                {i18n.brokeModelDesc}
                {secondaryShown && (
                  <> {i18n.closestTemplate.replace('{code}', secondaryLabel ?? '')}</>
                )}
              </p>
            </div>
          </div>
        )}

        {!hasResult && (
          <div className="mt-10 max-w-xl">
            <p className="text-sm text-white/50">
              {i18n.noResultDesc.replace('{code}', typeCode)}
            </p>
            <Link
              href={retakePath}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              {i18n.takeTheTest}
              <ArrowRight className={'h-4 w-4' + (isRtl ? ' rotate-180' : '')} />
            </Link>
          </div>
        )}
      </div>

      {/* Radar + breakdown — mounts inside the body section of the server shell
          via CSS portal-free approach. Rendered as an absolutely-positioned block
          is not needed here; we'll render it as a sibling in the server shell
          by relying on a named slot. Simpler: we inline it here and let parent
          place us via flex/grid. */}
      {hasResult && Object.keys(levels).length > 0 && (
        <section className="mt-16 md:mt-20">
          <div className="bg-gray-50 py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
              <article className="sbti-reveal-delay-3 mb-16">
                <div className="mb-8 flex items-start gap-6 sm:gap-8">
                  <div className="hidden w-24 shrink-0 pt-1 sm:block">
                    <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">
                      15
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                      {i18n.profileKicker}
                    </p>
                    <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                      {i18n.profileHeading}
                    </h2>
                    {i18n.profileSub && (
                      <p className="mt-1 text-gray-500">{i18n.profileSub}</p>
                    )}
                  </div>
                </div>

                <div className="sm:ms-32">
                  <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                    <div className="rounded-xl border border-gray-200/80 bg-white p-6">
                      <RadarChart levels={levels} dimensionLabels={dimensionLabels} />
                    </div>
                    <div>
                      <DimensionBreakdown
                        levels={levels}
                        dimensions={dimensions}
                        i18n={{
                          highlightsLabel: i18n.definingTraits,
                          showAll: i18n.showAll,
                          hideAll: i18n.hideAll,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </article>

              <ShareLinks
                typeCode={typeCode}
                tagline={tagline}
                resultUrl={resultUrl}
              />
            </div>
          </div>
        </section>
      )}

      {/* If no v, still show the go-deeper CTAs below the hero */}
      {!hasResult && (
        <section className="mt-16 md:mt-20">
          <div className="bg-gray-50 py-16 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
              <GoDeeperRow
                typeCode={typeCode}
                typeSlug={typeSlug}
                fullProfilePath={fullProfilePath}
                isRtl={!!isRtl}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ShareLinks({
  typeCode,
  tagline,
  resultUrl,
}: {
  typeCode: string;
  tagline: string;
  resultUrl: string;
}) {
  return (
    <article>
      <div className="mb-8 flex items-start gap-6 sm:gap-8">
        <div className="hidden w-24 shrink-0 pt-1 sm:block">
          <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">·</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            Send it
          </p>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Share your type
          </h2>
        </div>
      </div>
      <div className="sm:ms-32">
        <ShareRow typeCode={typeCode} tagline={tagline} resultUrl={resultUrl} />
      </div>
    </article>
  );
}

function GoDeeperRow({
  typeCode,
  typeSlug,
  fullProfilePath,
  isRtl,
}: {
  typeCode: string;
  typeSlug: string;
  fullProfilePath: string;
  isRtl: boolean;
}) {
  const base = fullProfilePath.replace(/\/[^/]+$/, '');
  return (
    <article>
      <div className="mb-8 flex items-start gap-6 sm:gap-8">
        <div className="hidden w-24 shrink-0 pt-1 sm:block">
          <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">→</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            Go deeper
          </p>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Everything about {typeCode}
          </h2>
        </div>
      </div>
      <div className="grid gap-3 sm:ms-32 sm:grid-cols-3">
        <Link
          href={fullProfilePath}
          className="group flex items-center justify-between rounded-lg bg-gray-950 px-5 py-4 text-white transition hover:bg-red-500"
        >
          <span className="font-semibold">Full {typeCode} profile</span>
          <ArrowRight className={'h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1' + (isRtl ? ' rotate-180' : '')} />
        </Link>
        <Link
          href={`${base}/${typeSlug}/compatibility`}
          className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 text-gray-800 transition hover:border-red-200 hover:shadow-sm"
        >
          <span className="text-sm font-medium">Compatibility</span>
          <ArrowRight className={'h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400' + (isRtl ? ' rotate-180' : '')} />
        </Link>
        <Link
          href={`${base}/${typeSlug}/how-to-get`}
          className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 text-gray-800 transition hover:border-red-200 hover:shadow-sm"
        >
          <span className="text-sm font-medium">How to get {typeCode}</span>
          <ArrowRight className={'h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400' + (isRtl ? ' rotate-180' : '')} />
        </Link>
      </div>
    </article>
  );
}
