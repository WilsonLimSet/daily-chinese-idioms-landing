# SBTI Quiz — Implementation Plan

Status: in progress (built 2026-04-17).

## Goal

Own "sbti test [lang]" search intent in 14 languages. Current `/sbti/what-is` FAQ literally forfeits it ("We don't host the quiz ourselves"). Thai-speaking users already outperform every other market 15x on SBTI listicles despite having no quiz — the demand is real and we're currently funneling it to competitors.

## Source of truth

Canonical quiz data and scoring algorithm pulled from [pingfanfan/SBTI](https://github.com/pingfanfan/SBTI) — MIT-licensed, authored by a fan of the original creator (@蛆肉儿串儿 on Bilibili). Data and engine snapshotted to `/tmp/sbti-src/` during research phase.

**Attribution posture:** this is a fan re-implementation. Creator credit (@蛆肉儿串儿, https://space.bilibili.com/417038183) appears on the quiz page, the result page, the FAQ, and in Quiz structured data as `creditText`/`author`. We paraphrase rather than verbatim-translate the creator's distinctive question prose (Q1 monologue, Q14 lollipop, etc.) to ship an adaptation rather than a literal rip.

## Scope decisions (made, not TBD)

1. **Type codes.** The canonical source uses `OG8K` (喔该8K meme) and `FU?K` (visual censor). Our existing codebase, JSON data, URLs, translations, and 14-language sitemaps already use **OJBK** and **FUCK**. We keep our codes. The quiz data file substitutes `OG8K → OJBK` and `FU?K → FUCK` so engine output maps directly to existing `/sbti/{slug}` profiles. No mass migration.
2. **Route.** `/sbti/test` and `/{lang}/sbti/test`. Matches "sbti test" intent better than `/quiz`.
3. **Result page.** Separate lightweight route at `/sbti/test/result/{type}?v=<vector>&sim=<N>`. Its canonical points at `/sbti/{type}` (no canonical conflict). Radar chart + "your result" framing + CTA to full profile.
4. **Scoring.** 100% client-side. Pure functions in `src/lib/sbti-engine.ts` (port of `engine.js`).
5. **No ads during quiz flow.** CLS/LCP killer. Ads only below fold on result page.
6. **Attribution.** Footer on quiz + result page + FAQ update.
7. **Rollout.** English first (validate). Then Thai + SEA (ID, VI, TL). Then JP, KR, PT, ES, AR, HI, RU, FR, DE bulk.

## Mechanics (confirmed from source code)

- 30 main questions, each tagged with 1 of 15 dimensions. Each dimension owns exactly 2 questions.
- Options valued 1/2/3 (Q14 and Q27 are inverted — preserve `value` field, don't infer from position).
- Dimension raw score (2–6) → `L` (≤3), `M` (4), `H` (5+).
- 15-char L/M/H vector compared to 25 standard type patterns via Manhattan distance (L=1, M=2, H=3).
- Sort by distance asc, tiebreak by exact-match count desc, then similarity desc.
- `similarity = max(0, round((1 − distance/30) × 100))`.
- **HHHH fallback** at similarity < **60%** (canonical code says 60, some blogs say 80 — we trust the code).
- **DRUNK hidden trigger:** `drink_gate_q1` ("hobbies?") inserted at a random position in the question stream. If user picks "drinking" (value 3), `drink_gate_q2` appears immediately after. If they pick the "baijiu in a thermos" option (value 2), result is overridden to DRUNK; best normal match retained as secondary.

## Architecture

```
src/lib/sbti-engine.ts          Pure TS scoring (port of engine.js, ~150 LOC)
src/lib/sbti-quiz.ts             Loader with language fallback (mirrors sbti.ts pattern)
src/data/sbti-quiz.en.json       30 questions + 2 drink-gate + dimension meta + type patterns
public/translations/{lang}/sbti-quiz.json   Translated question/option text (13 languages)

app/sbti/test/page.tsx           Server: metadata, schema, breadcrumbs
app/sbti/test/QuizClient.tsx     Client: state machine, question flow, DRUNK branching, localStorage
app/sbti/test/result/[type]/page.tsx       Server: result wrapper, radar chart, CTA to /sbti/{type}
app/[lang]/sbti/test/page.tsx    Localized entry
app/[lang]/sbti/test/QuizClient.tsx   (or share the EN client with lang prop)
app/[lang]/sbti/test/result/[type]/page.tsx
```

## Scope estimate

~8 engineering days total. This session ships the architecture + EN + infra; translations batched with Gemini script that runs offline.

| Task | Status |
|---|---|
| Plan doc | done |
| Engine port | — |
| EN quiz data | — |
| Quiz page + client | — |
| Result page | — |
| Localized routes | — |
| Translation script (Gemini) | — |
| Sitemap + robots | — |
| Hub gap fixes (hreflang, ItemList URLs, FAQ) | — |
| Internal linking | — |

## Risks & mitigations

- **Creator objects to commercial re-host.** Strong attribution, paraphrase, "fan implementation" framing. Offer to take down on request.
- **Scoring drifts from canonical.** Unit tests against 5+ hand-computed vectors from the pingfanfan demo before merging.
- **Translation of culturally-loaded questions** (Q1 monologue, Q22 blank prompt, Q20 toilet, drink-gate baijiu thermos). Flag these in the Gemini prompt as "preserve tone/absurdity, localize cultural references" — spot-check Thai, Japanese, Korean, Arabic minimum.
- **Random drink-gate position** must be deterministic per session (not per render) — store seed in localStorage.
- **Inverted scoring** (Q14 high-value-first, Q27 reversed). Translation must never reorder options. Gemini prompt locks the option order.
- **Canonical conflict** with existing `/sbti/what-is` FAQ saying "we don't host the quiz." Update that FAQ entry in the same PR that ships the quiz.

## Success metric

6-week check: does `/sbti/test` crack top-10 for "sbti test" in any of 14 languages? Thai and EN are the two to watch first.
