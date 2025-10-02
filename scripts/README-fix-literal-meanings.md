# Fix Literal Meanings Script

## Problem
Many idiom translations have English words in the `meaning` field (literal translation) instead of being properly translated to the target language.

Examples:
- French: "Tamis sable pick gold" ❌ → Should be: "Tamiser sable choisir or" ✅
- Spanish: "Golden Wind Jade Dew" ❌ → Should be: "Viento dorado rocío de jade" ✅
- Indonesian: "Point Deer Call Horse" ❌ → Should be: "Tunjuk rusa sebut kuda" ✅

## Solution
The `fix-literal-meanings.js` script translates all literal meanings with:
- **Slow rate limiting** (2 seconds between requests) to control costs
- **Automatic progress saving** every 10 translations
- **Smart detection** - only translates fields with English words

## Usage

### Fix a single language (recommended for testing)
```bash
node scripts/fix-literal-meanings.js fr    # French
node scripts/fix-literal-meanings.js es    # Spanish
node scripts/fix-literal-meanings.js id    # Indonesian
```

### Fix all languages (will take 6-8 hours!)
```bash
node scripts/fix-literal-meanings.js
```

## Available Languages
- `es` - Spanish (~50 fixes needed)
- `pt` - Portuguese (~57 fixes)
- `id` - Indonesian (~107 fixes)
- `vi` - Vietnamese (~39 fixes)
- `ja` - Japanese (~6 fixes)
- `ko` - Korean (~12 fixes)
- `th` - Thai (~15 fixes)
- `hi` - Hindi (~2 fixes)
- `ar` - Arabic (~5 fixes)
- `fr` - French (~53 fixes)
- `tl` - Tagalog (~8 fixes)
- `ms` - Malay (~15 fixes)
- `ru` - Russian (0 fixes - already clean!)

## Cost Estimation

### Per Language
- ~50 translations × 2 seconds = **~100 seconds** (~2 minutes)
- Gemini API cost: **$0.01 - $0.05** per language

### All Languages (except Russian)
- ~370 translations total
- Time: **~12-15 minutes** for all languages combined
- Cost: **$0.10 - $0.50** total

## Progress Tracking
The script:
1. Shows each idiom being processed
2. Displays before/after translations
3. Saves progress every 10 translations
4. Shows summary at the end

Example output:
```
  [67/381] 披沙拣金 - Translating...
    Current: "Tamis sable pick gold"
    ✅ New: "Tamiser sable choisir or"

  💾 Progress saved: 10 fixed so far
```

## Safety Features
- ✅ Only translates fields with English words
- ✅ Preserves metaphoric_meaning (already correct)
- ✅ Saves progress incrementally (no data loss)
- ✅ Rate limited to prevent API overload
- ✅ Can be resumed if interrupted

## Running in Background (for all languages)

### Start in background
```bash
nohup node scripts/fix-literal-meanings.js > fix-meanings.log 2>&1 &
```

### Check progress
```bash
tail -f fix-meanings.log
```

### Check if still running
```bash
ps aux | grep fix-literal-meanings
```

## After Running
1. Verify the changes: `git diff public/translations/*/idioms.json`
2. Test the build: `npm run build`
3. Commit changes: `git add . && git commit -m "Fix literal meaning translations"`
