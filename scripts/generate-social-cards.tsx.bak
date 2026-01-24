/**
 * Social Card Generator for Chinese Idioms
 *
 * Usage:
 *   npx tsx scripts/generate-social-cards.tsx
 *   npx tsx scripts/generate-social-cards.tsx --id ID001
 *   npx tsx scripts/generate-social-cards.tsx --batch 10
 *
 * Requirements:
 *   npm install @vercel/og sharp
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import satori from 'satori';
import sharp from 'sharp';

// Load idioms data
const idiomsPath = join(process.cwd(), 'public', 'idioms.json');
const idioms = JSON.parse(readFileSync(idiomsPath, 'utf-8'));

// Output directory
const outputDir = join(process.cwd(), 'public', 'social-cards');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Load font (you'll need to have this font file)
const fontPath = join(process.cwd(), 'scripts', 'fonts', 'NotoSansSC-Regular.ttf');
const fontBoldPath = join(process.cwd(), 'scripts', 'fonts', 'NotoSansSC-Bold.ttf');

interface Idiom {
  id: string;
  characters: string;
  pinyin: string;
  meaning: string;
  metaphoric_meaning: string;
  description: string;
  theme: string;
  example?: string;
  chineseExample?: string;
}

// Split pinyin into individual syllables with tones above each character
function splitPinyin(pinyin: string): string[] {
  return pinyin.split(' ');
}

// Card component as JSX-like object for satori
function createCardSVG(idiom: Idiom, imageDataUrl?: string) {
  const pinyinParts = splitPinyin(idiom.pinyin);
  const characters = idiom.characters.split('');

  // Truncate description to ~150 words for card
  const shortDescription = idiom.description.length > 400
    ? idiom.description.substring(0, 400) + '...'
    : idiom.description;

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '800px',
        height: '1200px',
        backgroundColor: '#fefefe',
        fontFamily: 'Noto Sans SC',
        padding: '40px',
      },
      children: [
        // Header
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #e5e5e5',
              paddingBottom: '16px',
              marginBottom: '24px',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' },
                  children: 'ChineseIdioms.com',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: '20px', color: '#666' },
                  children: '每日成语',
                },
              },
            ],
          },
        },
        // Image placeholder area
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '350px',
              backgroundColor: '#f5f5f0',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e0e0e0',
            },
            children: imageDataUrl ? {
              type: 'img',
              props: {
                src: imageDataUrl,
                style: {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                },
              },
            } : {
              type: 'span',
              props: {
                style: { color: '#999', fontSize: '18px' },
                children: `[Insert illustration for: ${idiom.meaning}]`,
              },
            },
          },
        },
        // Pinyin + Characters
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginBottom: '20px',
            },
            children: characters.map((char, i) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
                children: [
                  {
                    type: 'span',
                    props: {
                      style: { fontSize: '22px', color: '#666', marginBottom: '4px' },
                      children: pinyinParts[i] || '',
                    },
                  },
                  {
                    type: 'span',
                    props: {
                      style: { fontSize: '64px', fontWeight: 'bold', color: '#1a1a1a' },
                      children: char,
                    },
                  },
                ],
              },
            })),
          },
        },
        // Meaning section
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '20px',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: '18px', color: '#2563eb', fontWeight: 'bold', marginBottom: '8px' },
                  children: '含义 / Meaning',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: '20px', color: '#1a1a1a', fontWeight: '600', marginBottom: '4px' },
                  children: idiom.metaphoric_meaning,
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: '16px', color: '#666' },
                  children: `Literal: "${idiom.meaning}"`,
                },
              },
            ],
          },
        },
        // Origin section
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: '18px', color: '#2563eb', fontWeight: 'bold', marginBottom: '8px' },
                  children: '由来 / Origin & Usage',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: '15px', color: '#444', lineHeight: '1.6' },
                  children: shortDescription,
                },
              },
            ],
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'center',
              borderTop: '1px solid #e5e5e5',
              paddingTop: '16px',
              marginTop: '16px',
            },
            children: {
              type: 'span',
              props: {
                style: { fontSize: '14px', color: '#999' },
                children: '© ChineseIdioms.com',
              },
            },
          },
        },
      ],
    },
  };
}

async function generateCard(idiom: Idiom, imagePath?: string) {
  console.log(`Generating card for ${idiom.id}: ${idiom.characters}`);

  // Load image if provided
  let imageDataUrl: string | undefined;
  if (imagePath && existsSync(imagePath)) {
    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = imagePath.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    imageDataUrl = `data:${mimeType};base64,${base64}`;
  }

  // For now, generate without image (placeholder)
  const card = createCardSVG(idiom, imageDataUrl);

  // Load fonts
  let fontData: ArrayBuffer;
  let fontBoldData: ArrayBuffer;

  try {
    fontData = readFileSync(fontPath);
    fontBoldData = readFileSync(fontBoldPath);
  } catch {
    console.log('Font files not found. Using system fonts or download Noto Sans SC.');
    console.log('Download from: https://fonts.google.com/noto/specimen/Noto+Sans+SC');
    console.log('Place in: scripts/fonts/NotoSansSC-Regular.ttf and NotoSansSC-Bold.ttf');
    return;
  }

  // Generate SVG using satori
  const svg = await satori(card as any, {
    width: 800,
    height: 1200,
    fonts: [
      {
        name: 'Noto Sans SC',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Noto Sans SC',
        data: fontBoldData,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  // Save
  const outputPath = join(outputDir, `${idiom.id}-${idiom.characters}.png`);
  writeFileSync(outputPath, pngBuffer);
  console.log(`Saved: ${outputPath}`);
}

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let targetId: string | undefined;
  let batchCount: number | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      targetId = args[i + 1];
    }
    if (args[i] === '--batch' && args[i + 1]) {
      batchCount = parseInt(args[i + 1]);
    }
  }

  if (targetId) {
    // Generate single card
    const idiom = idioms.find((i: Idiom) => i.id === targetId);
    if (idiom) {
      await generateCard(idiom);
    } else {
      console.log(`Idiom ${targetId} not found`);
    }
  } else if (batchCount) {
    // Generate batch
    for (let i = 0; i < Math.min(batchCount, idioms.length); i++) {
      await generateCard(idioms[i]);
    }
  } else {
    // Generate all
    console.log(`Generating cards for all ${idioms.length} idioms...`);
    for (const idiom of idioms) {
      await generateCard(idiom);
    }
  }
}

main().catch(console.error);
