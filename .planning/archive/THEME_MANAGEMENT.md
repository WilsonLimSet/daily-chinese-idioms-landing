# Theme Management Guide

## Current Theme Structure

Your site now has **exactly 5 themes** across all 14 languages (English + 13 translations):

1. **Life Philosophy** (107 idioms - 28%)
2. **Wisdom & Learning** (93 idioms - 24%)
3. **Success & Perseverance** (91 idioms - 24%)
4. **Relationships & Character** (66 idioms - 17%)
5. **Strategy & Action** (24 idioms - 6%)

**Total:** 381 idioms

---

## How Themes Work in Your System

### Blog Post Generation
When `scripts/generate-todays-post.js` runs, it:

1. **Reads** from `public/idioms.json` (or `public/translations/{lang}/idioms.json`)
2. **Finds** the idiom by ID based on date calculation
3. **Uses** the `theme` field directly from the idiom object
4. **Does NOT generate** new themes - it only reads existing data

### Theme Sources
- **English:** `public/idioms.json`
- **Spanish:** `public/translations/es/idioms.json`
- **Portuguese:** `public/translations/pt/idioms.json`
- **Indonesian:** `public/translations/id/idioms.json`
- **Vietnamese:** `public/translations/vi/idioms.json`
- **Japanese:** `public/translations/ja/idioms.json`
- **Korean:** `public/translations/ko/idioms.json`
- **Thai:** `public/translations/th/idioms.json`
- **Hindi:** `public/translations/hi/idioms.json`
- **Arabic:** `public/translations/ar/idioms.json`
- **French:** `public/translations/fr/idioms.json`
- **Tagalog:** `public/translations/tl/idioms.json`
- **Malay:** `public/translations/ms/idioms.json`
- **Russian:** `public/translations/ru/idioms.json`

---

## ✅ Confirmed: New Blogs Use Existing Themes Only

**Yes, it's confirmed!** New idiom blogs created will **always** use one of the 5 existing themes because:

1. The blog generation script reads themes from idiom JSON files
2. All idiom JSON files only contain these 5 themes
3. No script automatically generates NEW themes
4. Scripts only FIX/UPDATE existing idiom data, they don't add new idioms

---

## How to Add New Idioms (Future)

If you need to add new idioms beyond the current 381, you must:

### 1. **Manually Edit `public/idioms.json`**

Add a new idiom with this structure:

```json
{
  "id": "ID382",
  "characters": "新成语",
  "pinyin": "xīn chéng yǔ",
  "meaning": "Literal meaning",
  "example": "Example sentence",
  "chineseExample": "中文例句",
  "theme": "Life Philosophy",  // ⚠️ MUST be one of the 5 themes
  "description": "Full description...",
  "metaphoric_meaning": "Metaphorical meaning",
  "traditionalCharacters": "新成語",
  "description_tr": "Traditional description...",
  "chineseExample_tr": "繁體中文例句"
}
```

### 2. **⚠️ Theme Field is MANDATORY**

The `theme` field **MUST** be one of these exact values:

- `"Life Philosophy"`
- `"Wisdom & Learning"`
- `"Success & Perseverance"`
- `"Relationships & Character"`
- `"Strategy & Action"`

**Case-sensitive!** Must match exactly.

### 3. **Translate to All Languages**

After adding to English `public/idioms.json`, you must also add the same idiom (with translated fields) to all 13 language files, using the correct translated theme name:

| English | Spanish | Portuguese | Indonesian |
|---------|---------|------------|------------|
| Life Philosophy | Filosofía de Vida | Filosofia de Vida | Filosofi Hidup |
| Wisdom & Learning | Sabiduría y Aprendizaje | Sabedoria e Aprendizagem | Kebijaksanaan & Pembelajaran |
| Success & Perseverance | Éxito y Perseverancia | Sucesso e Perseverança | Sukses & Ketekunan |
| Relationships & Character | Relaciones y Carácter | Relacionamentos e Caráter | Hubungan & Karakter |
| Strategy & Action | Estrategia y Acción | Estratégia e Ação | Strategi & Tindakan |

(Full translation table in `scripts/fix-theme-translations.js`)

---

## Theme Validation Checklist

Before deploying changes with new idioms:

- [ ] All idioms have a `theme` field
- [ ] All themes match one of the 5 standard themes (case-sensitive)
- [ ] All 14 language files are synchronized (same idiom IDs)
- [ ] Theme translations are consistent across languages
- [ ] Run theme count verification (see below)

---

## Verify Theme Consistency

Run this command to verify all languages have exactly 5 themes:

```bash
for lang in en es pt id vi ja ko th hi ar fr tl ms ru; do
  if [ "$lang" = "en" ]; then
    file="public/idioms.json"
  else
    file="public/translations/$lang/idioms.json"
  fi
  count=$(cat $file | jq '[.[].theme] | unique | length')
  echo "$lang: $count themes"
done
```

**Expected output:** Every language should show `5 themes`

---

## Scripts That Modify Theme Data

These scripts **update** existing idiom themes but **don't create new themes**:

- `scripts/fix-themes.js` - Standardizes theme translations across languages
- `scripts/fix-theme-translations.js` - Fixes theme translation inconsistencies
- `scripts/translate-*.js` - Translate idiom content (preserves theme structure)

None of these scripts add new themes or new idioms.

---

## Theme Hub Pages

Theme hub pages are located at:

- **English:** `/themes/[theme-slug]` (e.g., `/themes/life-philosophy`)
- **Multilingual:** `/[lang]/themes/[theme-slug]` (e.g., `/es/themes/filosofia-de-vida`)

Theme slugs in code:

```typescript
const THEME_SLUGS = [
  'life-philosophy',
  'relationships-character',
  'strategy-action',
  'success-perseverance',
  'wisdom-learning'
];
```

These are defined in:
- `app/themes/[theme]/page.tsx`
- `app/themes/page.tsx`
- `app/[lang]/themes/[theme]/page.tsx`
- `app/sitemap.ts`

---

## What If I Want to Add a 6th Theme?

If you genuinely need a 6th theme in the future (not recommended for consistency), you must:

1. **Update all idiom JSON files** (14 files total)
   - Add the new theme in English to `public/idioms.json`
   - Add translated theme names to all 13 language files

2. **Update theme hub pages** (3 files)
   - `app/themes/[theme]/page.tsx` - Add to `THEME_MAP` and `THEME_DESCRIPTIONS`
   - `app/themes/page.tsx` - Add to `THEME_MAP` and `THEME_DESCRIPTIONS`
   - `app/[lang]/themes/[theme]/page.tsx` - Add to `THEME_MAP`

3. **Update sitemap**
   - `app/sitemap.ts` - Add new theme slug to `THEME_SLUGS`

4. **Update translation mapping**
   - `scripts/fix-theme-translations.js` - Add theme to `THEME_TRANSLATIONS`

5. **Update backlink strategy document**
   - `SEO_BACKLINK_STRATEGY.md` - Update theme counts and examples

**Total files to update:** ~20+ files

---

## Current Files Modified for 5-Theme Structure

During the recent consolidation, these files were updated:

✅ `public/idioms.json` - Merged "Character & Behavior" → "Relationships & Character"
✅ All 13 `public/translations/{lang}/idioms.json` files
✅ `app/themes/[theme]/page.tsx` - Removed character-behavior theme
✅ `app/themes/page.tsx` - Removed character-behavior theme
✅ `app/[lang]/themes/[theme]/page.tsx` - Removed character-behavior theme
✅ `app/sitemap.ts` - Removed character-behavior from THEME_SLUGS
✅ `content/blog/2025-10-01-jin-ge-tie-ma.md` - Fixed duplicate date
✅ All 13 multilingual blog files for Oct 1

---

## Monitoring Theme Health

Regularly check for theme issues:

```bash
# Check unique themes per language
cat public/idioms.json | jq '[.[].theme] | unique'

# Count idioms per theme
cat public/idioms.json | jq '[.[] | .theme] | group_by(.) | map({theme: .[0], count: length})'

# Verify all languages have 5 themes
for lang in en es pt id vi ja ko th hi ar fr tl ms ru; do
  if [ "$lang" = "en" ]; then
    file="public/idioms.json"
  else
    file="public/translations/$lang/idioms.json"
  fi
  count=$(cat $file | jq '[.[].theme] | unique | length')
  if [ "$count" != "5" ]; then
    echo "⚠️  $lang has $count themes (expected 5)"
  fi
done
```

---

## Summary

✅ **New blogs automatically use existing themes** - No risk of new themes being created
✅ **381 idioms, 5 themes, 14 languages** - All synchronized
✅ **Theme-based SEO hub pages** - All updated to 5 themes
✅ **Sitemap includes theme pages** - Optimized for search engines

Your theme structure is now **locked and consistent** across the entire site! 🎉
