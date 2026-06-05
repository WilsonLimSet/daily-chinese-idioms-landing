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

## 🧹 Listicle merge — ready to apply (NOT yet executed)

Confirmed cannibalization: 306 listicles, with duplicate variants competing on the same query. Data-backed winners (keep) / losers (301 → winner), English-first:

| Facet | Keep | Redirect (loser) |
|---|---|---|
| love | `chinese-sayings-about-love` | `chinese-idioms-about-love` |
| success | `chinese-sayings-about-success` | `chinese-idioms-about-success` |
| happiness | `chinese-quotes-about-happiness` | `chinese-idioms-about-happiness` |
| patience | `chinese-sayings-about-patience` | `chinese-idioms-about-patience` |
| change | `chinese-sayings-about-change` | `chinese-idioms-about-change` |
| family | `chinese-proverbs-about-family` | `chinese-idioms-about-family` |
| friendship | `chinese-sayings-about-friendship` | `deep-friendship`, `friendship-loyalty` |

**Mechanism** (per the repo's existing pattern): remove loser from `src/lib/listicles.ts`, add to `src/lib/removed-listicle-slugs.json`, add 301 in `vercel.json`.

**Why I didn't auto-run it:** it's destructive (301s get hard-cached by Google) and **removing an English base also removes all 15 translated versions**, so each loser needs its translated slug redirected per language or those pages 404. That's surgery I didn't want to do unattended right after catching a fabrication bug. Say the word and I'll do English-first cleanly, then translations.

---

## 🌅 Your GSC / morning checklist

1. **Rotate the OpenAI key** in `.env`.
2. **Review the regenerated drama drafts** (clean, non-fabricating) in `content/blog/road-to-success-*` and `legend-of-zang-hai-*` — decide publish or enrich-first.
3. **AdSense:** add URL Channels so per-page earnings populate.
4. **After deploy:** GSC → resubmit sitemaps (`node scripts/audit/resubmit-sitemaps.js`) and request indexing for new/changed URLs.
5. **Decide on the listicle merge** (table above) — I'll execute on your go.

---

## What was pushed vs held

- **Pushed to `main`:** pipeline fixes (OpenAI migration, streaming, retry, **anti-fabrication**), synced lockfile, refreshed audit report, this report.
- **Held (in working tree, NOT deployed):** regenerated drama drafts — pending your review, because I won't auto-publish fresh AI articles about real people after finding the fabrication bug.
- **Not done:** listicle merge (destructive; awaiting your go).
