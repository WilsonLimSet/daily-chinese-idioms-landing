# Drama Content Pipeline

Turn any Chinese drama/movie/song into 4+ articles × 14 languages in ~1 hour of your time.

## Why this pipeline works

Your top-performing content is drama companion articles (Pursuit of Jade: 3,650 clicks across top 3 pages = ~50% of English traffic). AI Overviews can't eat narrative/cultural context, so this format is defensible. The formula is:

1. **"[Drama] Chinese Idioms Every Fan Should Know"** — listicle format
2. **"[Drama] Famous Quotes Explained"** — quote breakdown (top CTR driver)
3. **"History/Culture Behind [Drama]"** — cultural moat, AI-Overview-proof
4. **"Learn Chinese Watching [Drama]"** — language-learning angle

Optional bonus articles for hot dramas:
- **"[Drama] Ending Explained"** — captures `结局解析` search spikes
- **"[Character] Through Chinese Idioms"** — character study format

## Full workflow (4 steps)

### Step 1 — Web research (manual, ~15 min per drama)

The `generate-trending-series.js` script uses GPT-4o, which has a training cutoff and knows nothing about 2026 dramas. For fresh content you need web-sourced facts.

**Option A: Ask Claude Code to research.** Spin up 1-3 parallel research agents with a prompt like:

> Deep research on the Chinese drama "[Name]" (中文 title if known) for SEO content on chineseidioms.com. Cover: plot summary, cast with Chinese names, Douban rating, viral Weibo/Douyin moments, 15 chengyu relevant to the drama, 10-15 memorable Chinese quotes with pinyin + English, historical/cultural context, trending search angles, international fandom footprint. Use Douban, Baidu Baike, MyDramaList, Weibo. Report in structured markdown, 1,500-2,500 words.

Save the output as a markdown file in `content/series-briefs/research/{slug}.md`. See existing examples:
- `content/series-briefs/research/rebirth-princess-agents-2.md`
- `content/series-briefs/research/generation-to-generation.md`

**Option B: If GPT-4o probably knows the drama** (classic novels, pre-2024 shows), skip this step and let the script research from its training data.

### Step 2 — Generate the brief (~3 min)

```bash
# With external research (preferred for 2024+ dramas):
node scripts/generate-trending-series.js research \
  --topic "Rebirth (冰湖重生)" \
  --articles 4 \
  --research-file content/series-briefs/research/rebirth-princess-agents-2.md

# Without (GPT-4o researches from training data):
node scripts/generate-trending-series.js research \
  --topic "Journey to the West" \
  --articles 4
```

This creates `content/series-briefs/{slug}.json` with:
- Structured research
- ~30 idioms matched from your catalog with explanations
- 4 planned articles with outlines

### Step 3 — Review and edit the brief (~15 min)

Open the JSON brief. Check:
- **Article titles** — each should include the drama name + year for CTR
- **Article slugs** — must be unique, URL-safe
- **Idiom assignments** — avoid repeating the same idiom across articles
- **Outlines** — remove anything speculative; add specific scene/character references
- **Descriptions** — 140-160 chars, front-load the emotional hook

Tip: the research phase flags uncertain facts with `verifyFlags` — fact-check these before generating.

### Step 4 — Generate articles (~5 min)

```bash
node scripts/generate-trending-series.js generate \
  --brief content/series-briefs/rebirth-bing-hu-chong-sheng.json
```

Writes 4 markdown files to `content/blog/`. Each is 1,500-3,000 words.

### Step 5 — Review articles (~20 min)

- Scan each article for factual hallucinations (dates, cast names, plot details)
- Check that internal `/blog/[idiom-slug]` links resolve to real pages
- Cross-link between the 4 articles (the script does this automatically but verify)
- Verify frontmatter `theme` matches one of: `Success & Perseverance`, `Life Philosophy`, `Wisdom & Learning`, `Relationships & Character`, `Strategy & Action`

### Step 6 — Translate to 13 languages (~15 min, mostly waiting)

```bash
node scripts/translate-blog-articles-fast.js
```

Writes translated copies to `content/blog/translations/{lang}/{slug}.md` for all 13 non-English languages.

### Step 7 — Deploy

```bash
npm run build
# verify locally, then push
```

Each article × 14 languages = 14 URLs. Four articles = 56 URLs per drama. Plus automatic sitemap inclusion and hreflang tagging (handled by `app/sitemap.ts` and blog route metadata).

## Picking dramas to cover

**High priority signals:**
- Currently airing or aired within last 60 days
- Douban has 50,000+ ratings (proves search volume exists)
- Major cast (Dilraba, Wang Yibo, Zhao Lusi, etc.) OR a sequel/adaptation of a famous work
- Trending on Weibo 热搜 or Douyin
- Existing Viki/WeTV/Netflix international distribution (captures non-Chinese traffic)

**Where to find signals:**
- **Weibo 热搜** (热搜榜) — daily trending
- **Douban 热门剧集** (trending dramas) — douban.com/tv
- **Douyin drama hashtags** — high view counts = search volume
- **MyDramaList "Currently Airing"** — international demand proxy
- **Google Trends** — "[drama name] explained", "[drama name] cast"

**Rule of thumb:** if a drama has 10B+ Douyin plays, 500k+ MyDramaList watchers, and a viral quote or scene — it's worth the pipeline.

## Current queue

Ready to run right now (research already done):

```bash
# Rebirth (Princess Agents 2) — hot, controversial, nostalgia traffic
node scripts/generate-trending-series.js research \
  --topic "Rebirth (冰湖重生)" \
  --articles 4 \
  --research-file content/series-briefs/research/rebirth-princess-agents-2.md

# Generation to Generation — Song-dynasty poem SEO moat
node scripts/generate-trending-series.js research \
  --topic "Generation to Generation (江湖夜雨十年灯)" \
  --articles 4 \
  --research-file content/series-briefs/research/generation-to-generation.md
```

After each `research` command, review the generated brief, then run `generate --brief <path>` to produce the articles.

## Cost/time budget per drama

| Step | Human time | API cost |
|---|---|---|
| Research (web + agents) | 15 min | ~$0.30 (3 Claude agents) |
| Run `research` script | 3 min | ~$0.05 (GPT-4o idiom matching + planning) |
| Review brief | 15 min | $0 |
| Run `generate` script | 5 min | ~$0.20 (GPT-4o for 4 articles) |
| Review articles | 20 min | $0 |
| Translate 13 languages | 15 min (mostly waiting) | ~$1-2 (Gemini/OpenAI) |
| **Total** | **~1.5 hours** | **~$2-3** |

Output: 56 pages (4 articles × 14 languages) that internally link to 20+ idiom pages, passing authority through the graph.
