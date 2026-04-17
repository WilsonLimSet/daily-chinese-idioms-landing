'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DIMENSION_ORDER, type DimensionLevels, type Level } from '@/src/lib/sbti-engine';
import type { DimensionMeta } from '@/src/lib/sbti-quiz';

type Props = {
  levels: DimensionLevels;
  dimensions: Record<string, DimensionMeta>;
  i18n: { highlightsLabel: string; showAll: string; hideAll: string };
};

function levelToken(level: Level) {
  if (level === 'H')
    return { dot: 'bg-red-400', chip: 'text-red-600 bg-red-50', label: 'High' };
  if (level === 'L')
    return { dot: 'bg-amber-400', chip: 'text-amber-700 bg-amber-50', label: 'Low' };
  return { dot: 'bg-gray-300', chip: 'text-gray-600 bg-gray-100', label: 'Mid' };
}

export default function DimensionBreakdown({ levels, dimensions, i18n }: Props) {
  const [expanded, setExpanded] = useState(false);

  const extremeDims = DIMENSION_ORDER.filter(d => {
    const lvl = levels[d];
    return lvl === 'H' || lvl === 'L';
  });
  const highlightDims = (extremeDims.length > 0 ? extremeDims : DIMENSION_ORDER).slice(0, 6);
  const visible = expanded ? DIMENSION_ORDER : highlightDims;

  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
        {i18n.highlightsLabel}
      </p>
      <ul className="space-y-4">
        {visible.map(dim => {
          const dimMeta = dimensions[dim];
          const level = levels[dim];
          if (!dimMeta || !level) return null;
          const t = levelToken(level);
          return (
            <li key={dim} className="flex items-start gap-3 border-b border-gray-200/80 pb-4 last:border-0">
              <span className={'mt-2 h-1 w-1 shrink-0 rounded-full ' + t.dot} />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-900">{dimMeta.name}</span>
                  <span className={'rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ' + t.chip}>
                    {t.label}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-[1.6] text-gray-600">
                  {dimMeta.levels[level]}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {DIMENSION_ORDER.length > highlightDims.length && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 transition hover:text-red-500"
        >
          {expanded ? i18n.hideAll : i18n.showAll}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
