# Coding Conventions

**Analysis Date:** 2026-01-21

## Naming Patterns

**Files:**
- kebab-case for utilities: `rate-limit.ts`, `blog-intl.ts`, `pinyin.ts`
- PascalCase for React components: `LanguageSelector.tsx`, `BlogClient.tsx`
- `page.tsx`, `layout.tsx`, `route.ts` for Next.js App Router conventions

**Functions:**
- camelCase for all functions: `getAllBlogPosts()`, `removeToneMarks()`
- Verb-based names for actions: `generateBlogPost()`, `detectLanguage()`
- No special prefix for async functions

**Variables:**
- camelCase for variables: `rateLimitResult`, `detectedLang`
- UPPER_SNAKE_CASE for constants: `SUPPORTED_LANGUAGES`, `TONE_MAP`, `POSTS_PER_PAGE`
- Boolean prefixes: `is`, `has` - `isOpen`, `hasToneMarks`

**Types:**
- PascalCase for interfaces and types: `BlogPost`, `RateLimitResult`, `Idiom`
- No `I` prefix for interfaces
- Type predicates use `is`: `code is LanguageCode`

## Code Style

**Formatting:**
- 2-space indentation
- Semicolons required
- Single quotes for strings in TypeScript
- Double quotes for JSX attributes

**Linting:**
- ESLint with `eslint.config.mjs` (flat config format)
- Extends `next/core-web-vitals` and `next/typescript`
- Run: `npm run lint`

**TypeScript:**
- Strict mode enabled (`tsconfig.json`)
- ES2017 target
- Bundler module resolution
- Path alias: `@/*` maps to root directory

## Import Organization

**Order:**
1. External packages (react, next, date-fns)
2. Internal modules (@/src/lib, @/app/components)
3. Relative imports (./utils, ../types)
4. Type imports (import type { ... })

**Grouping:**
- Blank line between groups
- Named imports preferred over default

**Path Aliases:**
- `@/*` maps to project root
- Example: `@/src/lib/blog`, `@/app/components/LanguageSelector`

## Error Handling

**Patterns:**
- Try-catch at API route boundaries
- Return appropriate HTTP status codes
- Rate limit exceeded: 429 with headers

**Error Types:**
- Generic error messages for users
- Detailed logging for debugging (console.log/warn)

## Logging

**Framework:**
- Console.log for development
- Vercel logs in production

**Patterns:**
- Log at API boundaries
- Warn on fallback behavior
- No logging in utility functions

## Comments

**When to Comment:**
- Explain why, not what
- Document complex algorithms (date-based idiom selection)
- Note TODOs with context

**JSDoc:**
- Required for exported utility functions
- Use @param, @returns, @default tags
- Include @example for complex functions

**Example:**
```typescript
/**
 * Rate limit a request
 * @param request - The incoming request
 * @param options - Rate limit configuration
 * @returns Rate limit result with remaining quota
 */
```

## Function Design

**Size:**
- Keep under 50 lines
- Extract helpers for complex logic

**Parameters:**
- Max 3-4 parameters
- Use options object for more: `rateLimit(request, options)`
- Destructure in function body

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- TypeScript return type annotations

## Module Design

**Exports:**
- Named exports for utilities and types
- Default exports for React components only
- Re-export from index files sparingly

**Organization:**
- One primary purpose per file
- Co-locate related functions
- Separate types into dedicated files when large

---

*Convention analysis: 2026-01-21*
*Update when patterns change*
