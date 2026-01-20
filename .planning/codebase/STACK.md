# Technology Stack

**Analysis Date:** 2026-01-21

## Languages

**Primary:**
- TypeScript 5 - All application code (`package.json`, `tsconfig.json`)

**Secondary:**
- JavaScript - Build scripts, config files (`scripts/*.js`)

## Runtime

**Environment:**
- Node.js (no specific version constraint - no .nvmrc or engines field)
- Next.js 15.5.7 with App Router and Turbopack

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.5.7 - Full-stack React framework with App Router - `package.json`, `next.config.ts`
- React 19.0.1 - UI library - `package.json`
- React DOM 19.0.1 - DOM rendering - `package.json`

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework - `tailwind.config.ts`
- PostCSS 8 - CSS transformation - `postcss.config.mjs`

**Testing:**
- Not configured (no test runner installed)

**Build/Dev:**
- Turbopack - Build engine bundler (via `next dev --turbopack`)
- TypeScript 5 - Type checking and compilation

## Key Dependencies

**Critical:**
- gray-matter 4.0.3 - YAML/frontmatter parser for markdown - `src/lib/blog.ts`
- remark 15.0.1 - Markdown processor - `app/blog/[slug]/page.tsx`
- remark-html 16.0.1 - Markdown to HTML converter - `app/blog/[slug]/page.tsx`
- date-fns 4.1.0 - Date manipulation library - `src/lib/blog.ts`

**UI:**
- lucide-react 0.473.0 - Icon library - `app/page.tsx`, `app/blog/BlogClient.tsx`

**Infrastructure:**
- @google/generative-ai 0.24.1 - Google Gemini AI SDK - `package.json`
- @vercel/analytics 1.4.1 - User analytics - `app/layout.tsx`

## Configuration

**Environment:**
- `.env` files with `GEMINI_API_KEY`, `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`
- `.env.example` template provided

**Build:**
- `tsconfig.json` - TypeScript strict mode, ES2017 target, bundler module resolution
- `next.config.ts` - Image optimization, caching, redirects
- `tailwind.config.ts` - Theme customization
- `postcss.config.mjs` - Tailwind plugin
- `eslint.config.mjs` - ESLint flat config extending Next.js core-web-vitals

## Platform Requirements

**Development:**
- Any platform with Node.js
- No external dependencies required

**Production:**
- Vercel hosting (configured via `.vercel/project.json`)
- Automatic deployment on main branch push
- Image optimization with Vercel domains

---

*Stack analysis: 2026-01-21*
*Update after major dependency changes*
