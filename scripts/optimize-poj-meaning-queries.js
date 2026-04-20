#!/usr/bin/env node
/**
 * One-off: rewrite the Pursuit of Jade "Why jade symbolism matters" article's
 * title + description in every translation to lead with each language's
 * native "what does X mean" query pattern, capturing the large volume of
 * "pursuit of jade meaning / artinya / 意味 / signification" searches.
 *
 * GSC evidence (7d):
 *   pursuit of jade artinya — 961 imp, pos 9.2, 0.1% CTR (Indonesian)
 *   逐玉 意味 — 198 imp, pos 2.2, 1.52% CTR (Japanese)
 *   pursuit of jade meaning — 681 imp, pos 1.6, 2.64% CTR (English)
 *   + many long-tail variants across 14 langs
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TRANS_DIR = path.join(__dirname, '..', 'content/blog/translations');

// Each preset targets a specific high-volume query pattern, per article.
const PRESETS = {
  meaning: {
    originalSlug: 'pursuit-of-jade-why-jade-symbolism-matters-chinese-culture',
    articleSummary: 'why the Chinese drama is called "Pursuit of Jade" (逐玉) — what the title means, the symbolism of jade in Chinese culture',
    langInfo: {
      es: { name: 'Spanish', keyword: 'significado', queryHint: 'pursuit of jade significado / que significa pursuit of jade' },
      pt: { name: 'Brazilian Portuguese', keyword: 'significado', queryHint: 'pursuit of jade significado / o que significa pursuit of jade' },
      id: { name: 'Indonesian', keyword: 'artinya', queryHint: 'pursuit of jade artinya / arti pursuit of jade' },
      vi: { name: 'Vietnamese', keyword: 'nghĩa là gì', queryHint: 'pursuit of jade nghĩa là gì / pursuit of jade có nghĩa là gì' },
      ja: { name: 'Japanese', keyword: '意味', queryHint: '逐玉 意味 / 逐玉とは / pursuit of jade 意味' },
      ko: { name: 'Korean', keyword: '뜻', queryHint: 'pursuit of jade 뜻 / 逐玉 뜻 / 추옥 뜻' },
      th: { name: 'Thai', keyword: 'แปลว่า', queryHint: 'pursuit of jade แปลว่าอะไร / pursuit of jade หมายถึง' },
      hi: { name: 'Hindi', keyword: 'ka matlab', queryHint: 'pursuit of jade ka matlab / pursuit of jade arth' },
      ar: { name: 'Arabic', keyword: 'معنى', queryHint: 'pursuit of jade معنى / معنى pursuit of jade' },
      fr: { name: 'French', keyword: 'signification', queryHint: 'pursuit of jade signification / que veut dire pursuit of jade' },
      de: { name: 'German', keyword: 'Bedeutung', queryHint: 'pursuit of jade Bedeutung / was bedeutet pursuit of jade' },
      tl: { name: 'Filipino/Tagalog', keyword: 'kahulugan', queryHint: 'pursuit of jade kahulugan / ano ang ibig sabihin ng pursuit of jade' },
      ms: { name: 'Malay', keyword: 'maksud', queryHint: 'pursuit of jade maksud / apa maksud pursuit of jade' },
      ru: { name: 'Russian', keyword: 'значение', queryHint: 'pursuit of jade значение / что значит pursuit of jade' },
    },
  },
  history: {
    originalSlug: 'pursuit-of-jade-history-behind-the-drama',
    articleSummary: 'the real history, dynasty, time period, and cultural setting behind the Chinese drama "Pursuit of Jade" (逐玉). Covers: is it based on a true story, which dynasty it is set in, matrilocal marriage customs, military purges, women warriors in Chinese history.',
    langInfo: {
      es: { name: 'Spanish', keyword: 'historia real', queryHint: 'pursuit of jade historia real / en qué dinastía está ambientada pursuit of jade / pursuit of jade basada en hechos reales' },
      pt: { name: 'Brazilian Portuguese', keyword: 'história real', queryHint: 'pursuit of jade história real / pursuit of jade baseado em fatos reais / qual dinastia pursuit of jade' },
      id: { name: 'Indonesian', keyword: 'kisah nyata', queryHint: 'pursuit of jade kisah nyata / pursuit of jade dinasti apa / sejarah pursuit of jade' },
      vi: { name: 'Vietnamese', keyword: 'lịch sử thật', queryHint: 'pursuit of jade có thật không / pursuit of jade triều đại nào / lịch sử đằng sau pursuit of jade' },
      ja: { name: 'Japanese', keyword: '史実', queryHint: '逐玉 史実 / 逐玉 どの時代 / pursuit of jade 実話 / 逐玉 歴史' },
      ko: { name: 'Korean', keyword: '실화', queryHint: 'pursuit of jade 실화 / 逐玉 시대 / pursuit of jade 역사 배경' },
      th: { name: 'Thai', keyword: 'เรื่องจริง', queryHint: 'pursuit of jade เรื่องจริง / pursuit of jade ยุคไหน / pursuit of jade ประวัติศาสตร์' },
      hi: { name: 'Hindi', keyword: 'सच्ची कहानी', queryHint: 'pursuit of jade सच्ची कहानी / pursuit of jade इतिहास / pursuit of jade किस वंश में' },
      ar: { name: 'Arabic', keyword: 'قصة حقيقية', queryHint: 'pursuit of jade قصة حقيقية / pursuit of jade أي سلالة / pursuit of jade تاريخ' },
      fr: { name: 'French', keyword: 'histoire vraie', queryHint: 'pursuit of jade histoire vraie / pursuit of jade quelle dynastie / pursuit of jade basé sur une histoire vraie' },
      de: { name: 'German', keyword: 'wahre Geschichte', queryHint: 'pursuit of jade wahre Geschichte / pursuit of jade Dynastie / pursuit of jade auf wahrer Begebenheit' },
      tl: { name: 'Filipino/Tagalog', keyword: 'tunay na kwento', queryHint: 'pursuit of jade tunay na kwento / pursuit of jade aling dinastiya / pursuit of jade kasaysayan' },
      ms: { name: 'Malay', keyword: 'kisah benar', queryHint: 'pursuit of jade kisah benar / pursuit of jade dinasti apa / pursuit of jade sejarah' },
      ru: { name: 'Russian', keyword: 'реальная история', queryHint: 'pursuit of jade реальная история / pursuit of jade какая династия / pursuit of jade историческая основа' },
    },
  },
};

async function rewriteMetadata({ lang, langName, keyword, queryHint, articleSummary, currentTitle, currentDescription }) {
  const prompt = `You are SEO-optimizing a blog article title and description to capture high-volume native-language queries in ${langName}.

The target search query pattern in ${langName}: "${queryHint}"

Article topic: ${articleSummary}

CURRENT TITLE (${langName}): ${currentTitle}
CURRENT DESCRIPTION (${langName}): ${currentDescription}

Rewrite the title and description in ${langName} so they:
1. Lead with the exact native-language phrasing that matches the target queries. Use the keyword "${keyword}" (or similar natural form) explicitly, preferably early.
2. Keep "Pursuit of Jade (逐玉)" intact as the brand anchor.
3. Title: 55-75 characters, compelling, directly answers the implicit question behind the search.
4. Description: 140-160 characters, starts with the answer (not a generic hook or "In this article..." opening).
5. Still accurate to the article's content.
6. Natural ${langName} — no clunky machine-translation phrasing.

Return ONLY JSON, no preamble:
{"title": "...", "description": "..."}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(res.choices[0].message.content);
}

async function runPreset(presetName, { dryRun, filterLang }) {
  const preset = PRESETS[presetName];
  if (!preset) { console.log(`Unknown preset: ${presetName}`); return; }

  const langs = filterLang ? [filterLang] : Object.keys(preset.langInfo);
  console.log(`\n=== Preset: ${presetName} ===`);
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Optimizing "${preset.originalSlug}" across ${langs.length} language(s)\n`);

  for (const lang of langs) {
    const info = preset.langInfo[lang];
    if (!info) { console.log(`  skip ${lang} — no lang info`); continue; }

    const langDir = path.join(TRANS_DIR, lang);
    if (!fs.existsSync(langDir)) { console.log(`  skip ${lang} — no lang dir`); continue; }

    let targetFile = null;
    for (const f of fs.readdirSync(langDir)) {
      if (!f.endsWith('.md')) continue;
      const { data } = matter(fs.readFileSync(path.join(langDir, f), 'utf-8'));
      if (data.originalSlug === preset.originalSlug) { targetFile = f; break; }
    }
    if (!targetFile) { console.log(`  skip ${lang} — no translation file for ${preset.originalSlug}`); continue; }

    const filePath = path.join(langDir, targetFile);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: fm, content } = matter(raw);

    console.log(`  ${lang} [${targetFile}]`);
    console.log(`    old title: ${fm.title}`);

    try {
      const { title, description } = await rewriteMetadata({
        lang,
        langName: info.name,
        keyword: info.keyword,
        queryHint: info.queryHint,
        articleSummary: preset.articleSummary,
        currentTitle: fm.title || '',
        currentDescription: fm.description || '',
      });
      console.log(`    new title: ${title}`);
      console.log(`    new desc:  ${description}`);
      if (!dryRun) {
        fm.title = title;
        fm.description = description;
        fs.writeFileSync(filePath, matter.stringify(content, fm));
      }
    } catch (err) {
      console.log(`    ✗ failed: ${err.message}`);
    }
    console.log('');
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const langArg = process.argv.indexOf('--lang');
  const filterLang = langArg !== -1 ? process.argv[langArg + 1] : null;
  const presetArg = process.argv.indexOf('--preset');
  const presetNames = presetArg !== -1
    ? [process.argv[presetArg + 1]]
    : Object.keys(PRESETS);

  for (const p of presetNames) {
    await runPreset(p, { dryRun, filterLang });
  }
  console.log(dryRun ? 'Dry run complete.' : 'Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
