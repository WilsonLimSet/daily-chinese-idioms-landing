'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, AlertCircle } from 'lucide-react';

export type SignLite = {
  slug: string;
  animal: string;
  chineseName: string;
  pinyin: string;
  element: string;
  tagline: string;
  order: number; // 1 = Rat … 12 = Pig
};

export type FinderLabels = {
  yourBirthYear: string;
  birthMonthOptional: string;
  monthHint: string;
  bornInYearOf: string;
  boundaryWarn: string;      // tokens: {month} {year} {prev}
  readFullProfile: string;   // token: {animal}
  enterValidYear: string;    // token: {max}
  months: string[];          // 12 localized month names
};

const EN: FinderLabels = {
  yourBirthYear: 'Your birth year',
  birthMonthOptional: 'Birth month (optional)',
  monthHint: 'The Chinese zodiac year starts at Chinese New Year (late January–mid February), so your birth month matters near the boundary.',
  bornInYearOf: 'You were born in the Year of the',
  boundaryWarn: 'Born in {month}? Chinese New Year {year} fell in late January or February, so if you were born before it, your sign is actually the {prev}. Check the exact {year} Chinese New Year date to be sure.',
  readFullProfile: 'Read the full {animal} profile',
  enterValidYear: 'Enter a 4-digit year between 1900 and {max}.',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

function fill(t: string, v: Record<string, string | number>): string {
  return t.replace(/\{(\w+)\}/g, (_, k) => (v[k] !== undefined ? String(v[k]) : `{${k}}`));
}

// 2020 was the Year of the Rat (order 1). Pure client-side, no server deps.
function signIndexForYear(year: number): number {
  return ((year - 2020) % 12 + 12) % 12; // 0 = Rat … 11 = Pig
}

export default function SignFinderClient({
  signs,
  labels = EN,
  langPrefix = '',
}: {
  signs: SignLite[];
  labels?: FinderLabels;
  langPrefix?: string;
}) {
  const MONTHS = labels.months;
  const currentYear = 2026;
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>(''); // '' = not specified, else '0'-'11'

  const yearNum = parseInt(year, 10);
  const valid = year.length === 4 && !Number.isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear + 1;

  const idx = valid ? signIndexForYear(yearNum) : -1;
  const sign = idx >= 0 ? signs.find(s => s.order === idx + 1) : undefined;

  // Chinese New Year falls in late Jan–mid Feb. If the user was born in Jan or
  // early Feb, they may belong to the PREVIOUS sign. Flag it honestly.
  const monthNum = month === '' ? -1 : parseInt(month, 10);
  const nearBoundary = monthNum === 0 || monthNum === 1; // January or February
  const prevSign = sign ? signs.find(s => s.order === ((idx + 11) % 12) + 1) : undefined;

  return (
    <div>
      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="birth-year">
          {labels.yourBirthYear}
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="birth-year"
            type="number"
            inputMode="numeric"
            placeholder="1998"
            value={year}
            onChange={e => setYear(e.target.value.slice(0, 4))}
            min={1900}
            max={currentYear + 1}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:w-48"
          />
          <select
            aria-label={labels.birthMonthOptional}
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:flex-1"
          >
            <option value="">{labels.birthMonthOptional}</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-xs text-gray-400">{labels.monthHint}</p>
      </div>

      {/* Result */}
      {valid && sign && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="relative overflow-hidden bg-gray-950 p-8 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.25),transparent_60%)]" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">{labels.bornInYearOf}</p>
              <p className="mt-4 text-7xl font-bold leading-none text-white/90">{sign.chineseName}</p>
              <h2 className="mt-4 text-3xl font-bold">{sign.animal}</h2>
              <p className="mt-1 text-white/50">{sign.pinyin} · {sign.element}</p>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">{sign.tagline}</p>
            </div>
          </div>

          <div className="p-6">
            {nearBoundary && prevSign && (
              <div className="mb-5 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-sm leading-relaxed text-amber-800">
                  {fill(labels.boundaryWarn, { month: MONTHS[monthNum], year: yearNum, prev: `${prevSign.animal} (${prevSign.chineseName})` })}{' '}
                  <Link href={`${langPrefix}/zodiac/${prevSign.slug}`} className="font-semibold underline">
                    {prevSign.animal} →
                  </Link>
                </p>
              </div>
            )}
            <Link
              href={`${langPrefix}/zodiac/${sign.slug}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <Sparkles className="h-4 w-4" />
              {fill(labels.readFullProfile, { animal: sign.animal })}
            </Link>
          </div>
        </div>
      )}

      {year.length > 0 && !valid && (
        <p className="mt-4 text-sm text-gray-500">{fill(labels.enterValidYear, { max: currentYear + 1 })}</p>
      )}
    </div>
  );
}
