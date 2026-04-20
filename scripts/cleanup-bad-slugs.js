#!/usr/bin/env node
/**
 * Regenerate specific problematic localized slugs.
 *
 * Usage: node scripts/cleanup-bad-slugs.js
 *
 * Targets slugs that have:
 *   - Language-code suffixes (-jp, -ms, -ar, -ru, etc.) appended
 *   - Too many English words in non-Latin-script language slugs
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const REDIRECTS_JSON = path.join(__dirname, '../content/blog/slug-redirects.json');
const VERCEL_JSON = path.join(__dirname, '../vercel.json');
const TRANS_DIR = path.join(__dirname, '../content/blog/translations');

const LANG_NAMES = {
  'es': 'Spanish', 'pt': 'Brazilian Portuguese', 'id': 'Indonesian',
  'vi': 'Vietnamese', 'ja': 'Japanese', 'ko': 'Korean', 'th': 'Thai',
  'hi': 'Hindi', 'ar': 'Arabic', 'fr': 'French', 'de': 'German',
  'tl': 'Filipino/Tagalog', 'ms': 'Malay', 'ru': 'Russian',
};

// Pairs to fix: (lang, originalSlug)
const TARGETS = [
  // Find and fix by localized slug matching
];

// Alternative: find all issues automatically
function autoTargets(redirects) {
  const found = [];
  const suffixes = ["-arabic","-japanese","-korean","-thai","-hindi","-russian","-malay","-english","-chinese","-spanish","-french","-german","-portuguese","-vietnamese","-indonesian","-tagalog"];
  for (const [origSlug, bylang] of Object.entries(redirects.articles || {})) {
    for (const [lang, loc] of Object.entries(bylang)) {
      if (!loc) continue;
      for (const suf of suffixes) {
        if (loc.endsWith(suf)) { found.push([lang, origSlug]); break; }
      }
    }
  }
  return found;
}

function sanitizeSlug(raw, fallback) {
  if (!raw) return fallback;
  const clean = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,80);
  return clean || fallback;
}

async function generateBetterSlug({ title, description, originalSlug, lang, langName }) {
  const prompt = `Regenerate a URL slug for a blog article. A previous attempt produced a bad slug that either contained a language-code suffix (like "-jp", "-ar", "-ms") or contained too many English words for a non-Latin-script language. Do better this time.

LANGUAGE: ${langName} (code: ${lang})
ORIGINAL ENGLISH SLUG: ${originalSlug}
TRANSLATED TITLE: ${title}
TRANSLATED DESCRIPTION: ${description}

STRICT RULES:
- Lowercase ASCII only (a-z, 0-9, hyphens). No special chars, no trailing language codes.
- DO NOT append "-${lang}", "-jp", "-ar", "-ms", etc. at the end. The URL path already encodes the language.
- For non-Latin-script languages (${lang}): romanize the translated title fully. Do NOT leave English words like "chinese", "explained", "idioms", "fans" in the slug — translate and romanize them.
- Brand anchors stay as-is: pursuit-of-jade, love-beyond-the-grave, first-frost, rebirth, guardians-of-dafeng, generation-to-generation, unveil-jadewind
- 40-80 characters. Must convey the article's topic in ${langName}.

Romanization systems:
- Korean: Revised Romanization (e.g., 중국 → jungguk, 성어 → seongeo, 유명한 → yumyeonghan)
- Japanese: Hepburn (e.g., 中国 → chugoku, 成語 → seigo, 有名な → yuumei-na)
- Thai: RTGS (e.g., สำนวนจีน → samnuan-chin, ชื่อเสียง → chue-siang)
- Arabic: ISO 233 / naturalized Latin (e.g., التعابير الصينية → altaabir alsiniya → altaabir-alsiniya)
- Russian: GOST (e.g., китайские идиомы → kitayskie idiomy)
- Hindi: Hunterian (e.g., चीनी मुहावरे → chini muhavare)

EXAMPLES OF GOOD vs BAD:
- BAD: "pursuit-of-jade-chimei-meigen-kaisetsu-jp" (ja) — has -jp suffix
- GOOD: "pursuit-of-jade-chumei-meigen-kaisetsu" (ja)
- BAD: "10-idioms-chinese-pursuit-of-jade-fans-arabic" (ar) — entirely English + "-arabic" suffix
- GOOD: "10-taabir-siniya-limushaahidi-pursuit-of-jade" (ar)
- BAD: "love-beyond-the-grave-baeritedeung-ghost-culture" (ko) — "ghost-culture" is English
- GOOD: "love-beyond-the-grave-jungguk-yurling-munhwa-hakseup" (ko)

Return ONLY the slug. No quotes, no explanation.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 120,
    temperature: 0.15,
  });
  return sanitizeSlug(res.choices[0].message.content.trim().split('\n')[0].trim(), originalSlug);
}

async function main() {
  const redirects = JSON.parse(fs.readFileSync(REDIRECTS_JSON, 'utf-8'));
  const vercel = JSON.parse(fs.readFileSync(VERCEL_JSON, 'utf-8'));

  const targets = TARGETS.length ? TARGETS : autoTargets(redirects);
  console.log(`Cleaning up ${targets.length} slugs\n`);

  for (const [lang, origSlug] of targets) {
    const langDir = path.join(TRANS_DIR, lang);
    const oldLocalized = redirects.articles[origSlug]?.[lang];
    if (!oldLocalized) { console.log(`  skip ${lang}/${origSlug} — not in map`); continue; }

    const oldPath = path.join(langDir, `${oldLocalized}.md`);
    if (!fs.existsSync(oldPath)) { console.log(`  skip ${lang}/${origSlug} — file missing`); continue; }

    const raw = fs.readFileSync(oldPath, 'utf-8');
    const { data: fm, content } = matter(raw);

    process.stdout.write(`  ${lang}/${origSlug}\n    old: ${oldLocalized}\n    new: `);
    const newLocalized = await generateBetterSlug({
      title: fm.title || origSlug,
      description: fm.description || '',
      originalSlug: origSlug,
      lang,
      langName: LANG_NAMES[lang],
    });
    console.log(newLocalized);

    if (newLocalized === oldLocalized) {
      console.log(`    ⚠️  same as before — leaving unchanged`);
      continue;
    }

    // Collision guard
    let finalNew = newLocalized;
    if (fs.existsSync(path.join(langDir, `${finalNew}.md`))) {
      let n = 2;
      while (fs.existsSync(path.join(langDir, `${newLocalized}-v${n}.md`))) n++;
      finalNew = `${newLocalized}-v${n}`;
    }

    // Write new file, delete old
    const newOutput = matter.stringify(content, { ...fm, originalSlug: origSlug });
    fs.writeFileSync(path.join(langDir, `${finalNew}.md`), newOutput);
    fs.unlinkSync(oldPath);

    // Update redirect map
    redirects.articles[origSlug][lang] = finalNew;

    // Update vercel.json: find and replace the existing redirect entry
    const src = `/${lang}/blog/${origSlug}`;
    const dst = `/${lang}/blog/${finalNew}`;
    const idx = vercel.redirects.findIndex(r => r.source === src);
    if (idx !== -1) {
      vercel.redirects[idx].destination = dst;
    } else {
      vercel.redirects.push({ source: src, destination: dst, permanent: true });
    }
  }

  fs.writeFileSync(REDIRECTS_JSON, JSON.stringify(redirects, null, 2));
  fs.writeFileSync(VERCEL_JSON, JSON.stringify(vercel, null, 2));
  console.log(`\n✅ Done. Redirect map + vercel.json updated.`);
}

main().catch(err => { console.error(err); process.exit(1); });
