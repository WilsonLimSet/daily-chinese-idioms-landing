import { ImageResponse } from 'next/og';
import { getAllSbtiTypesEn, getSbtiType, typeCodeToSlug } from '@/src/lib/sbti';

export const alt = 'SBTI personality type';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return getAllSbtiTypesEn().map(t => ({ type: typeCodeToSlug(t.code) }));
}

export default async function OgImage({ params }: { params: { type: string } }) {
  const sbti = getSbtiType(params.type);
  const code = sbti?.code ?? 'SBTI';
  const displayName = sbti?.displayName ?? 'Silly Behavioral Type Indicator';
  const tagline = sbti?.tagline ?? 'The viral Chinese personality test.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.2)',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            SBTI TEST
          </div>
          <div style={{ fontSize: 22, opacity: 0.9 }}>chineseidioms.com</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 28, opacity: 0.85, marginBottom: 8 }}>Your type is</div>
          <div style={{ fontSize: 240, fontWeight: 900, lineHeight: 1, letterSpacing: -6 }}>
            {code}
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, marginTop: 12 }}>{displayName}</div>
          <div style={{ fontSize: 30, opacity: 0.9, marginTop: 18, fontStyle: 'italic', maxWidth: 1000 }}>
            {tagline.length > 110 ? tagline.slice(0, 107) + '…' : tagline}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, opacity: 0.9 }}>
          <div>27 types · 30 questions · 5 minutes</div>
          <div>Take the test →</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
