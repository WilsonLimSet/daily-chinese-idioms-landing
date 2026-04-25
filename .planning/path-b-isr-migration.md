# Path B: Migrate from `output: 'export'` to ISR on Vercel

Research notes for the next major build-time optimization.

## Current state

- `next.config.ts` has `output: 'export'` → forces every page to be pre-rendered into `out/`
- ~30,000 HTML files (after Path A cuts) deployed as static files
- Build dominated by static generation: ~10–14 min for the static export step

## Why ISR is the right next move

Most of the 30k pages get **<1 click/month**. Pre-rendering them at every build wastes minutes for content nobody requests. ISR (Incremental Static Regeneration) flips it:

- Pre-render only the **top ~2,000 pages by traffic**
- Let everything else render **on-demand** the first time it's requested, then cache for X hours
- Build drops from 10+ min to 2–3 min

## Migration plan

### Step 1: Replace the two post-build scripts

**`scripts/post-build-html-lang.js`** (rewrites `<html lang="en">` → `<html lang="X">` for each translated locale)

This is the trickiest blocker. App Router root layout (`app/layout.tsx`) doesn't have access to the `[lang]` dynamic param — `<html>` element can only be set there.

Three options, ranked:

1. **Read locale from URL via middleware → headers → root layout** (cleanest). Middleware sets an `x-lang` header from the path. Root layout reads it via `headers()` and sets `<html lang={lang}>`.
   ```ts
   // middleware.ts
   export function middleware(req: NextRequest) {
     const lang = req.nextUrl.pathname.split('/')[1];
     const supported = ['ar','de','es','fr','hi','id','ja','ko','ms','pt','ru','th','tl','vi'];
     const headers = new Headers(req.headers);
     headers.set('x-lang', supported.includes(lang) ? lang : 'en');
     return NextResponse.next({ request: { headers } });
   }
   ```
   ```tsx
   // app/layout.tsx
   import { headers } from 'next/headers';
   export default async function RootLayout({ children }) {
     const lang = (await headers()).get('x-lang') ?? 'en';
     return <html lang={lang}>{children}</html>;
   }
   ```
   Works with ISR. Middleware runs on every request even for cached pages, so the lang attribute is correct.

2. **Keep the post-build script** — it still works on the pre-rendered subset. For ISR-rendered pages, the lang attribute would default to "en". Not ideal for SEO but not catastrophic.

3. **Use route groups `app/(en)/`, `app/(zh)/`, ...** — requires major restructuring; not worth it.

**Recommendation: option 1**. ~30 min of work.

**`scripts/post-build-english-slugs.js`** (creates English-slug aliases for translated listicle HTML files)

The aliases are essentially redirects with the same content. With ISR, replace this with `vercel.ts` redirects:

```ts
// vercel.ts
export const config: VercelConfig = {
  redirects: [
    // For each language, redirect English-slug requests to the translated slug.
    // Build the list at deploy time from public/translations/<lang>/listicles.json.
    ...buildSlugRedirects(),
  ],
};
```

Build the redirect list at deploy time by reading `public/translations/*/listicles.json`. ~1 hour of work.

### Step 2: Update `generateStaticParams` for each dynamic route

Current pattern (in every `[slug]` route):
```ts
export async function generateStaticParams() {
  return getAllItems().map(i => ({ slug: i.slug }));
}
```

New pattern (top-N + on-demand):
```ts
export const dynamicParams = true; // allow on-demand rendering for unlisted slugs
export const revalidate = 86400;   // cache for 24 hours

export async function generateStaticParams() {
  // Pre-render only the top 100 by GSC clicks (last 28d)
  const top = await getTopSlugsForRoute('blog');
  return top.map(slug => ({ slug }));
}
```

`getTopSlugsForRoute` reads `audits/data/<latest>/pages_last_28d.json` (which we already pull weekly). Falls back to a curated default list if the audit data is missing.

Routes to update:
- `app/blog/[slug]/page.tsx` — top 100 idioms
- `app/blog/lists/[slug]/page.tsx` — top 100 listicles
- `app/[lang]/blog/[slug]/page.tsx` — top 50 per language
- `app/[lang]/blog/lists/[slug]/page.tsx` — top 50 per language
- `app/sbti/[type]/page.tsx` — all 27 types (small enough to keep all)
- `app/[lang]/sbti/[type]/page.tsx` — all types × all langs (small enough)
- `app/dramas/[slug]/page.tsx` — all dramas (small)
- `app/characters/[slug]/page.tsx` — top 100 chars (rest on-demand)
- `app/phrases/[slug]/page.tsx`, `app/poems/[slug]/page.tsx`, `app/slang/[slug]/page.tsx` — top 50 each

Pre-render budget: ~2,000–3,000 pages total. Build time: 2–3 min projected.

### Step 3: Verify caching

With `output: 'export'` removed, Vercel serves dynamic routes via Functions. Each unique slug hits a Function once, then is cached on Vercel's CDN for `revalidate` seconds. Cache hits cost nothing.

Sanity-check the cache behavior on a preview deploy:
- `curl -I https://<preview-url>/blog/some-slug` — should return `x-vercel-cache: MISS` first time, `HIT` after
- Pre-rendered pages should always be `HIT` from the start

### Step 4: Preview deploy + smoke test

Before promoting:
1. Deploy from a preview branch
2. Hit one URL from each section (`/blog/X`, `/sbti/Y`, `/dramas/Z`, `/[lang]/blog/X` for 3 langs, etc.)
3. Verify:
   - Renders correctly
   - `<html lang="X">` matches URL
   - Canonical tag points to right URL
   - hreflang tags present
   - Structured data renders
4. Run Lighthouse on a few pages — should score same as before

### Step 5: Promote to production

Standard Vercel promotion. Rollback path: revert the `next.config.ts` change to re-add `output: 'export'`.

## Effort estimate

| Step | Time |
|---|---|
| Replace `post-build-html-lang.js` with middleware/headers approach | 30 min |
| Replace `post-build-english-slugs.js` with `vercel.ts` redirects | 1 hr |
| Update `generateStaticParams` across ~10 routes | 1.5 hr |
| Helper for top-N from GSC data | 45 min |
| Preview deploy + smoke test | 1.5 hr |
| Production promotion + 24h watch | 30 min |
| **Total** | **~5–6 hours** |

## Risks + mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| SEO regression from missing hreflang or wrong canonical | Medium | Smoke test sample URLs from each section before promoting |
| First-visit latency on uncached pages (~1–2s) | Low | Pre-render top 2k pages; long-tail visitors are rare |
| Vercel Function bills jump | Low (Pro plan absorbs) | Monitor for first week; can lower revalidate window if needed |
| Wrong lang attribute on uncached pages if middleware misfires | Medium | Test middleware locally before deploy; verify with curl on preview |
| Loss of static-only deployability | Inherent to migration | Accepted — Vercel is the host |

## Open questions

1. Do we want **all** localized pages to be ISR-eligible, or hard-block low-yield languages (de, tl, hi) entirely? Either path works.
2. Should we use `unstable_cacheLife` (Next 15 cache components) for finer cache control, or stick with `revalidate`? `revalidate` is simpler.
3. What's the monthly Vercel bill ceiling we're comfortable with? Determines how aggressive we can be on revalidate.

## Recommendation

Do the migration **after** we've confirmed Path A delivered the expected savings (current build run will tell us). If Path A gets us to ~14 min and that's tolerable for a few weeks, no rush. If it doesn't help much, schedule Path B for next week.
