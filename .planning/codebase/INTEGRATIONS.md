# External Integrations

**Analysis Date:** 2026-01-21

## APIs & External Services

**Google Generative AI (Gemini):**
- Package: `@google/generative-ai 0.24.1` - `package.json`
- Auth: API key in `GEMINI_API_KEY` env var - `.env`
- Status: Installed but usage not visible in main app code

**Vercel Analytics:**
- Package: `@vercel/analytics 1.4.1` - `package.json`
- Integration: Analytics component in `app/layout.tsx`
- Purpose: User analytics and performance monitoring

## Data Storage

**Static JSON Database:**
- `public/idioms.json` - Master idiom database (365+ entries)
- `public/translations/{lang}/idioms.json` - Translated idioms (13 languages)
- Access: File system read via `fs.readFileSync()`

**Markdown Content:**
- Location: `content/blog/*.md`
- Format: Frontmatter (gray-matter) + markdown body
- Purpose: Optional blog post overrides

**No External Database:**
- All data is file-based
- No Redis, PostgreSQL, or other database

## Authentication & Identity

**No Authentication System:**
- Public content only
- No user accounts or sessions

**Google Site Verification:**
- Config: `GOOGLE_SITE_VERIFICATION` env var
- Usage: Metadata in `app/layout.tsx`

## Monitoring & Observability

**Analytics:**
- Vercel Analytics - Built-in with `@vercel/analytics`
- No custom event tracking

**Error Tracking:**
- Not configured (no Sentry or similar)
- Relies on Vercel logs

**Logging:**
- Console.log/warn in development
- Vercel stdout/stderr in production

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js hosting
- Project ID: `prj_B1wBP1vRwi6wOxbKqXJEx78DxX8r` - `.vercel/project.json`
- Deployment: Automatic on main branch push

**CI Pipeline:**
- GitHub Actions: `.github/workflows/generate-daily-blog.yml`
- Purpose: Automated daily blog post generation
- No test or lint workflow

## Environment Configuration

**Development:**
- Required: `GEMINI_API_KEY`, `NEXT_PUBLIC_SITE_URL`
- Optional: `GOOGLE_SITE_VERIFICATION`
- Location: `.env.local` (gitignored)

**Production:**
- Secrets: Configured in Vercel dashboard
- Same variables as development

## Internal APIs

**Search API:**
- Route: `app/api/search/route.ts`
- Method: GET with query param `q`
- Rate limit: 30 requests/minute
- Returns: Top 20 results with relevance scoring

**Blog Posts API:**
- Route: `app/api/blog-posts/route.ts`
- Method: GET
- Rate limit: 50 requests/minute
- Returns: All blog posts

**RSS Feed:**
- Route: `app/api/rss/route.ts`
- Format: XML RSS 2.0 with Atom link
- Rate limit: 20 requests/minute
- Cache: `s-maxage=3600, stale-while-revalidate`

## Rate Limiting

**Implementation:**
- In-memory rate limiter - `src/lib/utils/rate-limit.ts`
- IP detection via headers: X-Forwarded-For, X-Real-IP, CF-Connecting-IP
- Auto-cleanup: Expired entries removed hourly

**Limits:**
- Search API: 30 req/min
- Blog Posts API: 50 req/min
- RSS Feed: 20 req/min

**Headers Returned:**
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## SEO & Social

**Structured Data:**
- Schema.org: WebSite, BlogPosting, DefinedTerm, BreadcrumbList
- Location: `app/layout.tsx`, `app/blog/[slug]/page.tsx`

**Social Cards:**
- OpenGraph metadata
- Twitter cards
- Image: `public/og-image.png`

**Sitemap & Robots:**
- Dynamic generation: `app/sitemap.ts`, `app/robots.ts`
- Includes all blog posts and language variants

## Internationalization

**Supported Languages (13):**
- es, pt, id, vi, ja, ko, th, hi, ar, fr, tl, ms, ru

**Detection:**
- Accept-Language header parsing in `middleware.ts`
- Cookie persistence: `lang-preference`

**Content Sources:**
- UI strings: `src/lib/translations.ts`
- Idiom content: `public/translations/{lang}/idioms.json`

## Third-Party Links

**App Store:**
- iOS app: "Daily Chinese Idioms" (ID: 6740611324)
- Link: Referenced in `app/page.tsx`, `app/layout.tsx`

**Author Site:**
- wilsonlimset.com - Referenced in footer

---

*Integration audit: 2026-01-21*
*Update when adding/removing external services*
