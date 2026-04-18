#!/usr/bin/env node
/**
 * Fill in the missing translated fields on public/translations/{lang}/poems.json:
 *   - title
 *   - form
 *   - theme
 *   - poet.name (transliterate for non-Latin scripts)
 *   - poet.dynasty
 *   - poet.bio
 *
 * The existing translated analysis/background/translation blocks are left alone.
 *
 * Source of EN field values: we read any existing translation JSON (e.g. pt)
 * because every lang's file currently has English copies of these fields — that
 * is the bug this script fixes. We use `pt` as the reference for the EN
 * scaffold since it is canonical (translated by Gemini earlier; the non-
 * translated fields stayed English).
 *
 * Usage:
 *   node scripts/translate-poems-fields.js            # all 13 langs
 *   node scripts/translate-poems-fields.js pt         # one lang
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGS = {
  ar: 'Arabic',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  hi: 'Hindi',
  id: 'Indonesian',
  ja: 'Japanese',
  ko: 'Korean',
  ms: 'Malay',
  pt: 'Portuguese (Brazilian)',
  ru: 'Russian',
  th: 'Thai',
  tl: 'Filipino/Tagalog',
  vi: 'Vietnamese',
};

// Source of truth for EN title/form/theme/poet scaffold. Using `fr` (not `pt`)
// because my earlier pt run already overwrote those fields with translations;
// `fr` still has English scaffold for all these.
const REFERENCE_PATH = path.join(__dirname, '..', 'public', 'translations', 'fr', 'poems.json');
const reference = JSON.parse(fs.readFileSync(REFERENCE_PATH, 'utf8'));

const sourceFields = reference.map(p => ({
  slug: p.slug,
  originalSlug: p.originalSlug || p.slug,
  title: p.title,
  form: p.form,
  theme: p.theme,
  poet: {
    name: p.poet.name,
    dynasty: p.poet.dynasty,
    bio: p.poet.bio,
  },
}));

function buildPrompt(langName, poemsToTranslate) {
  const minimal = poemsToTranslate.map(p => ({
    slug: p.slug,
    title_en: p.title,
    form_en: p.form,
    theme_en: p.theme,
    poet_name_en: p.poet.name,
    poet_dynasty_en: p.poet.dynasty,
    poet_bio_en: p.poet.bio,
  }));

  return `Translate the following Chinese-poetry metadata into natural, idiomatic ${langName}. Return ONLY a single JSON object with shape:

{ "translations": [ { "slug": "...", "title": "...", "form": "...", "themeTranslated": "...", "poet_name": "...", "poet_dynasty": "...", "poet_bio": "..." }, ... ] }

Rules:
- Keep "slug" byte-identical.
- Translate "title" (English renderings of Chinese poems like "Quiet Night Thought", "Ode to the Goose") into ${langName}. Treat these as titles a ${langName}-speaking reader would see in a poetry anthology.
- Translate "form" (e.g. "Five-character Quatrain (五言绝句)") into ${langName}. Keep the Chinese term in parentheses unchanged.
- Translate "themeTranslated" (e.g. "Homesickness & Longing", "Nature & Landscape", "Friendship & Farewell", "War & Frontier", "Love & Devotion", "Life & Philosophy", "Seasons & Time") into idiomatic ${langName}. Translate the ENTIRE phrase (both sides of "&").
- For "poet_name": keep pinyin romanization for Latin-script target languages (pt, es, fr, de, id, vi, ms, tl). For non-Latin scripts (ja, ko, ru, ar, hi, th), transliterate the pinyin into the target script (e.g. Li Bai → リ・バイ for Japanese, Ли Бай for Russian, لي باي for Arabic, ली बाई for Hindi).
- Translate "poet_dynasty" (e.g. "Tang Dynasty", "Song Dynasty") into natural ${langName}.
- Translate "poet_bio" into natural flowing ${langName}, preserving tone and facts.

Source (JSON):
${JSON.stringify(minimal, null, 2)}

Return the translations object now.`;
}

async function translateLang(langCode, langName) {
  const outPath = path.join(__dirname, '..', 'public', 'translations', langCode, 'poems.json');
  if (!fs.existsSync(outPath)) {
    return { skipped: true, reason: 'file missing' };
  }
  const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  if (!Array.isArray(existing) || existing.length === 0) {
    return { skipped: true, reason: 'invalid shape' };
  }

  const r = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: buildPrompt(langName, sourceFields) }],
  });
  const parsed = JSON.parse(r.choices[0].message.content);
  if (!Array.isArray(parsed.translations)) {
    throw new Error('translations array missing from response');
  }
  const bySlug = new Map(parsed.translations.map(t => [t.slug, t]));

  // Source-of-truth English themes (keep stable so pages can group by them)
  const bySourceSlug = new Map(reference.map(r => [r.slug, r]));

  for (const poem of existing) {
    const t = bySlug.get(poem.slug) || bySlug.get(poem.originalSlug);
    if (!t) continue;
    const ref = bySourceSlug.get(poem.slug) || bySourceSlug.get(poem.originalSlug);

    poem.title = t.title || poem.title;
    poem.form = t.form || poem.form;
    // theme stays English (stable grouping key); themeTranslated used for display.
    poem.theme = ref ? ref.theme : poem.theme;
    poem.themeTranslated = t.themeTranslated || poem.theme;

    if (poem.poet) {
      poem.poet.name = t.poet_name || poem.poet.name;
      poem.poet.dynasty = t.poet_dynasty || poem.poet.dynasty;
      poem.poet.bio = t.poet_bio || poem.poet.bio;
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(existing, null, 2), 'utf8');
  return { ok: true, count: parsed.translations.length };
}

(async () => {
  const only = process.argv[2];
  const entries = only ? [[only, LANGS[only]]] : Object.entries(LANGS);
  if (only && !LANGS[only]) {
    console.error(`Unknown lang: ${only}`);
    process.exit(1);
  }
  console.log(`Filling poem fields for ${entries.length} language(s)…`);
  let ok = 0, failed = 0;
  for (const [code, name] of entries) {
    process.stdout.write(`→ ${code} (${name})… `);
    try {
      const r = await translateLang(code, name);
      if (r.skipped) console.log(`skipped (${r.reason})`);
      else {
        console.log(`done (${r.count} poems)`);
        ok++;
      }
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }
  console.log(`\n${ok} done, ${failed} failed.`);
})();
