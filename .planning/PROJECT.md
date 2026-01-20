# Chinese Idioms SEO Optimization

## What This Is

SEO improvements and content hub creation for the Daily Chinese Idioms website to increase organic search traffic and improve rankings for both individual idiom pages and broader search terms.

## Core Value

- Better rankings for 381+ individual idiom pages through improved titles and metadata
- Capture broader search queries ("Chinese business idioms", "idioms about perseverance") via thematic hub pages
- Increase CTR through optimized titles and rich snippets

## Requirements

### Validated

- Existing idiom database (681 entries)
- 13-language support working (es, pt, id, vi, ja, ko, th, hi, ar, fr, tl, ms, ru)
- Schema markup already implemented (FAQ, BreadcrumbList, DefinedTerm, BlogPosting)
- Related posts functionality (4 posts by theme)
- Definition box above fold
- Pinyin variants for search

### Active

- [ ] Improve page titles to show value immediately (add metaphoric meaning + "Chinese Idiom")
- [ ] Expand related idioms from 4 to 6-8 per page
- [ ] Create rich pillar pages for 5 themes:
  - Life Philosophy (107 idioms)
  - Wisdom & Learning (93 idioms)
  - Success & Perseverance (91 idioms)
  - Relationships & Character (66 idioms)
  - Strategy & Action (24 idioms)
- [ ] Optimize meta descriptions based on GSC query patterns
- [ ] Add "Chengyu Dictionary" hub page (high-volume query)

### Out of Scope

- Audio pronunciation - later phase
- Flashcards/printable versions - later phase
- Translating 300 new idioms - separate task

## Constraints

- **Translation pipeline must work** - all changes must be compatible with 13-language setup
- **No external dependencies** - use existing Next.js/React/Tailwind stack
- **Minimal API costs** - avoid Gemini API usage where possible

## Success Metrics

- Google Search Console: CTR, impressions, average position
- Traffic: organic pageviews from search
- Target: 30-40% CTR improvement on title changes

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rich pillar pages over simple lists | Better SEO value, more internal linking | Pending |
| Focus on pinyin + "meaning" in titles | GSC data shows these queries dominate | Pending |
| 5 theme hubs initially | Matches existing theme categorization | Pending |

## Context

### GSC Query Insights

Top performing patterns:
- Pinyin without tones: "ai wu ji wu", "zhi xing he yi"
- "meaning" suffix: "ai wu ji wu meaning", "long ma jing shen meaning"
- Dictionary queries: "chengyu dictionary" (34 clicks), "chinese idiom dictionary"
- Japanese queries strong: 柳暗花明 (1,667 impressions)
- Thai translations performing: 莫名其妙 แปล, 守株待兔 แปล

Top markets: US, Singapore, Indonesia, Japan, Thailand, Malaysia

### Current Title Format

```
急功近利 (jí gōng jìn lì): meaning in English, origin & examples
```

### Proposed Title Format

```
急功近利 (jí gōng jìn lì) - Seek Quick Success | Chinese Idiom
```

---

*Last updated: 2026-01-21 after initialization*
