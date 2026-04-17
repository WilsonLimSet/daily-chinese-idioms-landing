import { ImageResponse } from 'next/og';
import {
  getAllSbtiTypesEn,
  getSbtiType,
  typeCodeToSlug,
} from '@/src/lib/sbti';
import { LANGUAGES } from '@/src/lib/constants';

export const alt = 'SBTI personality type';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Languages whose scripts the default next/og font can render without
// advanced OpenType features. Arabic, Hindi, Thai, etc. need custom font
// loading to render correctly — those langs' OG pages fall back to the
// site's page-level OG metadata (which is text-only).
const OG_LANGS = new Set(['en', 'es', 'pt', 'fr', 'de', 'id', 'vi', 'tl', 'ms', 'ja', 'ko', 'ru']);

export async function generateStaticParams() {
  const langs = Object.keys(LANGUAGES).filter(l => OG_LANGS.has(l));
  const types = getAllSbtiTypesEn().map(t => typeCodeToSlug(t.code));
  const out: { lang: string; type: string }[] = [];
  for (const lang of langs) {
    for (const type of types) {
      out.push({ lang, type });
    }
  }
  return out;
}

export default async function OgImage({
  params,
}: {
  params: { lang: string; type: string };
}) {
  const sbti = getSbtiType(params.type, params.lang);
  const code = (sbti?.code ?? 'SBTI').replace(/[^A-Z0-9?!-]/gi, '').slice(0, 6);
  const displayName = sbti?.displayName ?? '';
  const tagline = sbti?.tagline ?? '';
  const isRtl = params.lang === 'ar';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#030712',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at top, rgba(185, 28, 28, 0.22) 0%, transparent 60%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 640,
            fontWeight: 900,
            letterSpacing: '-0.06em',
            color: 'rgba(255, 255, 255, 0.04)',
            lineHeight: 1,
          }}
        >
          {code}
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: '#f87171' }} />
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            SBTI · chineseidioms.com
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 240,
              fontWeight: 900,
              letterSpacing: '-0.06em',
              lineHeight: 0.9,
            }}
          >
            {code}
          </div>
          {displayName && (
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                marginTop: 12,
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              {displayName}
            </div>
          )}
          {tagline && (
            <div
              style={{
                fontSize: 26,
                marginTop: 18,
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 1050,
                lineHeight: 1.35,
                display: 'flex',
              }}
            >
              {`“${tagline.length > 130 ? tagline.slice(0, 127) + '…' : tagline}”`}
            </div>
          )}
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: 999, background: '#f87171' }} />
          <span>{code}</span>
          <div style={{ width: 4, height: 4, borderRadius: 999, background: '#f87171' }} />
          <span>27 / 30 / 5m</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
