# Testing Patterns

**Analysis Date:** 2026-01-21

## Test Framework

**Current State: NO TEST FRAMEWORK CONFIGURED**

- No test files in codebase (no `.test.ts`, `.spec.ts`, `__tests__/`)
- No test runner installed (no vitest, jest, @testing-library)
- No test scripts in `package.json`

**Run Commands:**
```bash
npm run dev                    # Development server
npm run build                  # Production build
npm run lint                   # ESLint only
# No test command available
```

## Test File Organization

**Recommended Structure (not yet implemented):**
```
src/lib/__tests__/
  blog.test.ts
  constants.test.ts
  utils/
    rate-limit.test.ts
    pinyin.test.ts
app/components/__tests__/
  LanguageSelector.test.tsx
app/api/__tests__/
  search.test.ts
```

**Naming Convention (recommended):**
- Unit tests: `{module}.test.ts`
- Integration: `{feature}.integration.test.ts`
- E2E: `{flow}.e2e.test.ts`

## Code That Should Have Tests

**High Priority (Core Logic):**
- `src/lib/utils/rate-limit.ts` - Rate limiting behavior
- `src/lib/utils/pinyin.ts` - Pinyin tone mark removal, slug generation
- `src/lib/blog.ts` - Blog post generation, date-to-idiom mapping
- `src/lib/constants.ts` - Language validation functions

**Medium Priority (Components):**
- `app/components/LanguageSelector.tsx` - Language switching
- `app/blog/BlogClient.tsx` - Search and filter logic
- `middleware.ts` - Language detection, redirects

**API Routes:**
- `app/api/search/route.ts` - Search scoring algorithm
- `app/api/blog-posts/route.ts` - Rate limiting integration
- `app/api/rss/route.ts` - XML generation, escaping

## Coverage

**Current Coverage:** 0% (no tests)

**Recommended Targets:**
- Utilities: 100% (pure functions, easy to test)
- Components: 70%+ (user interactions)
- API routes: 80%+ (validation, error handling)
- Pages: 40%+ (integration tests)

## Linting & Formatting

**ESLint:**
- Config: `eslint.config.mjs` (flat config format)
- Extends: `next/core-web-vitals`, `next/typescript`
- Run: `npm run lint`

**Prettier:**
- Not configured (no `.prettierrc`)
- Relies on ESLint for style enforcement

**TypeScript:**
- Strict mode enabled
- Type checking via `tsc` during build

## CI/CD Pipeline

**GitHub Actions:**
- Workflow: `.github/workflows/generate-daily-blog.yml`
- Purpose: Automated blog post generation
- No test workflow configured

**Deployment:**
- Vercel automatic deployment on main branch
- No pre-deployment test gate

## Recommended Test Setup

**Framework Choice:** Vitest (recommended for Next.js)

**Dependencies to Add:**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "jsdom": "^22.0.0"
  }
}
```

**Scripts to Add:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Test Patterns (Recommended)

**Unit Test Structure:**
```typescript
import { describe, it, expect } from 'vitest';
import { removeToneMarks } from './pinyin';

describe('removeToneMarks', () => {
  it('should remove tone marks from pinyin', () => {
    expect(removeToneMarks('nǐ hǎo')).toBe('ni hao');
  });
});
```

**Mocking (for file system):**
```typescript
import { vi } from 'vitest';
import * as fs from 'fs';

vi.mock('fs');
```

---

*Testing analysis: 2026-01-21*
*Update when test infrastructure is added*
