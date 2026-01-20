# Architecture

**Analysis Date:** 2026-01-21

## Pattern Overview

**Overall:** Static-Hybrid Content Platform with Next.js App Router

**Key Characteristics:**
- Static generation (SSG) for blog posts and idiom pages
- API routes for dynamic search and data serving
- Edge middleware for internationalization and redirects
- Client-side interactivity for filters and language selection

## Layers

**Presentation Layer (Pages & Components):**
- Purpose: Render UI and handle user interactions
- Contains: React components, pages, layouts
- Location: `app/` directory
- Depends on: Service layer for data
- Used by: Browser/client

**Service Layer:**
- Purpose: Core business logic and data processing
- Contains: Blog generation, internationalization, utilities
- Location: `src/lib/`
- Depends on: Data layer (JSON files, markdown)
- Used by: Presentation layer, API routes

**Utility Layer:**
- Purpose: Shared helper functions
- Contains: Pinyin processing, rate limiting
- Location: `src/lib/utils/`
- Depends on: Node.js built-ins
- Used by: Service layer, API routes

**Data Layer:**
- Purpose: Static data storage
- Contains: JSON idiom database, markdown blog content
- Location: `public/idioms.json`, `content/blog/`, `public/translations/`
- Depends on: File system
- Used by: Service layer

## Data Flow

**Blog Post Rendering (SSG):**

1. Build time: `generateStaticParams()` executes
2. `getAllBlogPosts()` loads idioms from `public/idioms.json`
3. Optional markdown overrides read from `content/blog/*.md`
4. `generateBlogPost()` creates BlogPost objects with date-based idiom selection
5. Next.js generates static HTML pages
6. Browser receives pre-rendered content

**Search Request Flow:**

1. User query: `GET /api/search?q=terms`
2. `rateLimit()` checks IP-based request limit
3. `getAllBlogPosts()` retrieves all posts
4. Scoring algorithm: exact matches (+100), partial matches (+25-50)
5. Filter, sort by score, limit to top 20
6. JSON response returned

**Language Detection Flow:**

1. Request arrives at edge middleware
2. `Accept-Language` header parsed
3. Match against 13 supported languages
4. Redirect to detected language route or set cookie
5. Page renders with translated content from `public/translations/{lang}/`

## Key Abstractions

**BlogPost:**
- Purpose: Represents a single blog post with idiom data
- Location: `src/lib/blog.ts`, `src/lib/blog-intl.ts`
- Pattern: Data transfer object with date-based idiom cycling

**Idiom:**
- Purpose: Chinese idiom with translations and metadata
- Contains: characters, pinyin, meaning, theme, description, examples
- Pattern: JSON schema with traditional/simplified variants

**RateLimiter:**
- Purpose: Throttle API requests by IP
- Location: `src/lib/utils/rate-limit.ts`
- Pattern: In-memory token bucket with configurable windows

## Entry Points

**Edge Middleware:**
- Location: `middleware.ts`
- Triggers: Every request
- Responsibilities: Language detection, HTTPS redirect, canonical headers

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Page load
- Responsibilities: Global metadata, fonts, analytics setup

**API Routes:**
- Location: `app/api/*/route.ts`
- Triggers: API requests
- Routes: `/api/search`, `/api/blog-posts`, `/api/rss`

## Error Handling

**Strategy:** Return appropriate HTTP status codes with generic messages

**Patterns:**
- Rate limit exceeded: 429 with retry headers
- Internal errors: 500 with generic message
- Not found: 404 via Next.js default

## Cross-Cutting Concerns

**Logging:**
- Console.log/warn for development
- Vercel logs in production (stdout/stderr)

**Validation:**
- TypeScript for compile-time type checking
- Runtime validation minimal (trusted internal data)

**SEO:**
- Comprehensive Schema.org structured data
- Dynamic sitemap and robots.txt
- hreflang for 13 languages
- OpenGraph and Twitter cards

---

*Architecture analysis: 2026-01-21*
*Update when major patterns change*
