# Overnight Report — 2026-06-06

Worked through: model migration off Gemini, a **fact-fabrication bug** in the article pipeline, a fresh AdSense+GSC audit, a content-quality audit vs Pursuit of Jade, and a build. Read this top-to-bottom before deploying anything.

---

## 🔴 Most important finding: the article pipeline was fabricating scandals about real people

`scripts/generate-trending-series.js` had hardcoded **example "drama facts"** in its self-review feedback prompt (line ~680):

> "...cite at least 3 specific drama facts: Douban rating, Tencent heat score, **Zhao Liying controversy, OST plagiarism scandal, Huangyang Tiantian meta-layer**, specific episode ranges, SEA fandom..."

When a brief was **thin on real facts**, gpt-5.2 (and presumably Gemini before it) copied those *example* names into the article **as if they were facts** — inventing an "OST plagiarism scandal" and a "Zhao Liying controversy" and attributing them to **Road to Success / Yu Shuxin**, which has none of that (0 occurrences in its brief). That's false, potentially defamatory content about real public figures.

**What I checked:**
- Confirmed fabrication in this session's draft `road-to-success-real-history.md` (now deleted).
- Scanned **all live blog articles** for the same bait terms. The other hits (rebirth, fate-chooses-you) are **legitimate** — those names are in their briefs and accurate (e.g., "Zhao Liying in *The Killing of Three Thousand Crows* (2020)" is a real credit).
- The two **live** Road to Success articles (dated 2026-04-30) are **clean**. **No fabrication is currently in production.**

**Fix applied** (in `scripts/generate-trending-series.js`):
- Removed the hardcoded example names from the review-feedback and intro-hook prompts.
- Added a hard **NO FABRICATION** rule to the writer prompt: the brief is the only source of facts; never invent ratings/scores/awards/controversies; never attribute wrongdoing to a real person unless it's verbatim in the brief.

**Root cause is thin briefs.** The fix stops fabrication, but with a thin brief the articles just go *vague* about the drama. To get Pursuit-of-Jade-quality, briefs need **real research** (see audit below).

---

## ✅ Model migration: Gemini → OpenAI (done)

Per your instruction ("dont ever use gemini, use openai"):
- **Article writer + all structured steps → `gpt-5.2`** (was `gemini-2.5-pro` / `gpt-4o`). You vetoed 4o; 5.2 writes ~2,200–2,600-word drafts vs 4o's ~1,000.
- **Listicle translation → `gpt-5-mini`** (was `gemini-2.0-flash`).
- Gemini removed from both scripts, `package.json`, `.env`, `.env.bak`; `package-lock.json` synced.
- **New OpenAI key** set in `.env` (verified working).
- ⚠️ **Rotate that key** — you pasted it in chat, so it's in the transcript. Generate a fresh one and replace it in `.env`.

**Two infra fixes required to make it work:**
1. The sandbox network drops API connections idle >~60s; gpt-5.2 reasoning on long articles exceeds that → "Connection error". **Fixed by streaming every call.**
2. Streams still occasionally terminate mid-flight. **Added retry (4x with backoff)** around every call.

---

## 📊 AdSense + GSC audit (fresh pull, `audits/2026-06-05.md`)

- **Clicks:** 15,404 / 28d (**−23%**), 3,391 / 7d (**−25%**). The decline is **Pursuit of Jade cooling off** (its history page dropped −44% w/w). The breakout vertical is decaying and nothing ramped to replace it.
- **AdSense:** SGD **25.94** / 28d, page RPM **SGD 0.87** (low — traffic skews to low-RPM countries: ID/TH/VN/MY). USA is #1 by clicks but only 1.6% CTR.
- **Per-page earnings are blank** — AdSense's `PAGE_URL` needs **URL Channels** configured (AdSense → Reports → URL Channels). Quick win so you can see which pages actually earn.

**Biggest opportunities (page-2 impressions you're not capturing):**
| Target | Impressions | Pos | Clicks |
|---|---:|---:|---:|
| **yu shuxin** (actor hub) | 13,173 | 11.8 | ~1 |
| **legend of zang hai** (Xiao Zhan) | 2,287 | 10.4 | 1 |
| **road to success cdrama** | 1,690 | 9.5 | 2 |
| **love beyond the grave** (rising +420%) | — | — | strong |

---

## 🔍 Content quality audit: new gpt-5.2 articles vs Pursuit of Jade

| Dimension | Pursuit of Jade (gold) | New gpt-5.2 | Verdict |
|---|---|---|---|
| Length | ~1,300–2,000 words | ~1,700–2,200 words | **New wins** |
| Internal idiom links | ~4 | 9–10 | **New wins** |
| Idiom origin stories (史记, Du Fu, dynasties) | strong, accurate | strong, accurate | **Tie — both good** |
| Drama-specific facts (dates, ratings, episodes, cast) | dense & real (入赘, Tang Code, Song 960–1279) | sparse / **fabricated when brief is thin** | **Gold wins — this is the gap** |

**Conclusion:** gpt-5.2's structure, length, linking, and cultural/idiom content **match or beat** the gold standard. The *only* deficiency is drama-specific grounding — and that's a **brief problem, not a model problem**. Pursuit of Jade had a rich, human-edited brief; the auto-generated briefs (Road to Success, Zang Hai) are thin (their own `verifyFlags` say "release date needed, ratings needed" — likely because these titles are upcoming/just-aired with little public data yet).

**Recommendation:** before generating a cluster, enrich the brief with real web research (the script already supports `research --topic ... --research-file <web-research.md>`). Feed it real cast, premise, setting, release status. Then gpt-5.2 will produce Pursuit-of-Jade-grade articles. Generating from thin briefs = safe-but-generic at best.

---

## 🧹 Listicle merge — REVISED: mostly not worth it

I pulled the per-query data (`page_query_last_28d`) to test whether the "duplicate" pairs actually compete for the same queries. They mostly don't. Revised verdict:

| Facet | Verdict | Why |
|---|---|---|
| **success** | ✅ **Merge** | 3 pages all rank for "chinese proverbs about success" (idioms pos 76, sayings pos 13.5, career-success pos 57). Real cannibalization on a 174-impr query. Redirect idioms + career-success → `chinese-sayings-about-success`. |
| love | ⚠️ Optional | Real overlap on "proverbs about love" but both pages buried at pos 18–71 — too far back for a merge to rescue. Low payoff. |
| happiness | ❌ **Don't** | Different intents: idioms page ranks pos 4–6 for "happy phrases / idioms for happy"; quotes page ranks pos 2–7 for "quotes/proverbs about happiness". Merging LOSES a query cluster. |
| patience | ❌ Pointless | `chinese-sayings-about-patience` already dominates everything (pos 2.4 even for "idioms about patience"). The idioms page is harmless 0-click dead weight. |
| change / family / friendship | ⏸️ Skip for now | Same pattern — a clear winner already exists; merging gains ~nothing. |

**Reality check:** the entire duplicate-pair set is ~200 clicks/28d, most already captured by the winners. Best-case upside from merging is a few dozen clicks/month vs. Pursuit of Jade's 1,391. **This is low-priority housekeeping, not a growth lever.**

**Queued: the `success` merge only.** Mechanism (English): add 301s in `vercel.json` (`chinese-idioms-about-success` and `chinese-idioms-for-career-success` → `chinese-sayings-about-success`); to avoid 404ing the 15 translations, keep the redirect-only approach (don't delete from `listicles.ts`) OR add per-language redirects. Marginal either way — do it when convenient, don't prioritize.

---

## 🌅 Your GSC / morning checklist

1. **Rotate the OpenAI key** in `.env`.
2. **Review the regenerated drama drafts** (clean, non-fabricating) in `content/blog/road-to-success-*` and `legend-of-zang-hai-*` — decide publish or enrich-first.
3. **AdSense:** add URL Channels so per-page earnings populate.
4. **After deploy:** GSC → resubmit sitemaps (`node scripts/audit/resubmit-sitemaps.js`) and request indexing for new/changed URLs.
5. **Listicle merge:** deprioritized — only the `success` consolidation is worth doing (see revised section). Net upside is tens of clicks/month; not a growth lever.

---

## What was pushed vs held

- **Pushed to `main`:** pipeline fixes (OpenAI migration, streaming, retry, **anti-fabrication**), synced lockfile, refreshed audit report, this report.
- **Held (in working tree, NOT deployed):** regenerated drama drafts — pending your review, because I won't auto-publish fresh AI articles about real people after finding the fabrication bug.
- **Not done:** listicle merge (destructive; awaiting your go).
