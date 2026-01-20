# Codebase Concerns

**Analysis Date:** 2026-01-21

## Tech Debt

**In-Memory Rate Limiting - Production Unfit:**
- Issue: Uses in-memory Map for rate limiting with setInterval cleanup
- Files: `src/lib/utils/rate-limit.ts` (lines 11-21)
- Why: Quick implementation for MVP
- Impact: Rate limiting completely ineffective in scaled/multi-instance deployments. Does NOT persist across server restarts.
- Fix approach: Migrate to Redis or Vercel KV for production-grade rate limiting

**Duplicate Page Components:**
- Issue: Near-identical code between English and multilingual routes
- Files:
  - `app/blog/[slug]/page.tsx` (405 lines)
  - `app/[lang]/blog/[slug]/page.tsx` (404 lines)
  - `app/themes/[theme]/page.tsx` (255 lines)
  - `app/[lang]/themes/[theme]/page.tsx` (260 lines)
- Why: Incremental i18n implementation
- Impact: Bug fixes must be made twice; maintenance burden
- Fix approach: Extract shared logic into reusable components

**Large Monolithic Translations File:**
- Issue: Single file with all UI translations
- File: `src/lib/translations.ts` (1,386 lines)
- Why: Rapid prototyping
- Impact: Slow imports, not tree-shakeable, hard to maintain
- Fix approach: Split by language or use i18n library (next-intl)

**Duplicate Tone Mark Logic:**
- Issue: TONE_MAP defined in multiple places
- Files: `app/blog/[slug]/page.tsx` (lines 33-44), `src/lib/utils/pinyin.ts`
- Why: Copy-paste during development
- Impact: Inconsistent updates, code duplication
- Fix approach: Use single source from pinyin.ts

## Known Bugs

**No critical bugs identified during analysis.**

## Security Considerations

**Unsanitized HTML Rendering:**
- Risk: XSS if markdown content contains malicious HTML
- Files: `app/blog/[slug]/page.tsx`, `app/[lang]/blog/[slug]/page.tsx`
- Current mitigation: Content is internal (trusted source)
- Recommendations: Add sanitization via DOMPurify when rendering external content

**Hardcoded Domain:**
- Risk: Inconsistent behavior if domain changes
- Files: `middleware.ts` (line 35), `app/api/rss/route.ts` (line 20)
- Current mitigation: NEXT_PUBLIC_SITE_URL available but not always used
- Recommendations: Use environment variable consistently everywhere

**Missing Environment Variable Validation:**
- Risk: Silent failures if env vars missing
- Files: `app/layout.tsx` (line 79) - GOOGLE_SITE_VERIFICATION
- Current mitigation: None
- Recommendations: Validate required env vars at startup

## Performance Bottlenecks

**All Blog Posts Loaded Client-Side:**
- Problem: All 365+ posts loaded in browser for search/filter
- File: `app/blog/BlogClient.tsx`
- Measurement: ~50KB of post data transferred
- Cause: No server-side search utilized
- Improvement path: Use /api/search for server-side filtering with pagination

**getAllBlogPosts() Called Repeatedly:**
- Problem: No caching of blog post generation
- Files: `src/lib/blog.ts`, `src/lib/blog-intl.ts`
- Cause: Fresh computation on every call
- Improvement path: Add memoization or static generation at build time

## Fragile Areas

**Date-Based Idiom Selection:**
- Why fragile: Complex algorithm cycling through 365+ idioms by date
- Files: `src/lib/blog.ts` (lines 58-111)
- Common failures: Off-by-one errors, timezone issues
- Safe modification: Add comprehensive unit tests before changing
- Test coverage: No tests

**Middleware Language Detection:**
- Why fragile: Multiple conditions for redirects and cookies
- File: `middleware.ts`
- Common failures: Redirect loops, cookie not persisting
- Safe modification: Test all language/path combinations
- Test coverage: No tests

## Scaling Limits

**In-Memory Rate Limiting:**
- Current capacity: Single server instance only
- Limit: Breaks completely with multiple instances
- Symptoms at limit: Rate limits bypassed
- Scaling path: Redis-based rate limiting

**Static File Generation:**
- Current capacity: 365+ blog posts
- Limit: Build time increases with more content
- Symptoms at limit: Slow deploys
- Scaling path: ISR (Incremental Static Regeneration) or on-demand generation

## Dependencies at Risk

**No critical dependency risks identified.**

All major dependencies (Next.js, React, Tailwind) are actively maintained.

## Missing Critical Features

**No Test Coverage:**
- Problem: Zero automated tests
- Current workaround: Manual testing
- Blocks: Safe refactoring, confident deploys
- Implementation complexity: Medium (setup Vitest, write tests)

**No Error Tracking:**
- Problem: No Sentry or similar service
- Current workaround: Check Vercel logs manually
- Blocks: Proactive issue detection
- Implementation complexity: Low (add Sentry SDK)

## Test Coverage Gaps

**All Core Logic Untested:**
- What's not tested: Rate limiting, pinyin processing, blog generation, search scoring
- Risk: Regressions go unnoticed
- Priority: High
- Difficulty: Low-medium (pure functions are easy to test)

**API Error Scenarios:**
- What's not tested: 429 responses, malformed requests, edge cases
- Risk: Production errors not caught before deploy
- Priority: Medium
- Difficulty: Medium (need API mocking)

---

*Concerns audit: 2026-01-21*
*Update as issues are fixed or new ones discovered*
