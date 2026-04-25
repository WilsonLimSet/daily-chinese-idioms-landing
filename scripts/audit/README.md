# SEO Audit Scripts

Weekly Google Search Console audit pipeline.

## Local usage

```bash
# One-time auth (browser flow, saves refresh token)
node scripts/audit/gsc-auth.js

# Pull data + generate report
node scripts/audit/pull-gsc.js
node scripts/audit/report.js

# Resubmit sitemaps (run when content has changed substantially)
node scripts/audit/resubmit-sitemaps.js

# List GSC properties (sanity check)
node scripts/audit/list-properties.js
```

Data lands in `audits/data/YYYY-MM-DD/`, the markdown report at `audits/YYYY-MM-DD.md`. Both gitignored except the markdown report (so the report can be committed via PR).

## Files

- `_lib.js` — shared GSC client setup
- `gsc-auth.js` — one-time OAuth flow
- `pull-gsc.js` — pulls queries, pages, page×query, countries, devices, sitemaps
- `report.js` — analyzes JSON dumps, writes markdown audit
- `resubmit-sitemaps.js` — pings GSC to recrawl all 15 sitemaps
- `list-properties.js` — lists accessible GSC properties

## GitHub Actions automation

`.github/workflows/weekly-audit.yml` runs every Monday at 06:00 UTC and opens a PR with the new audit on branch `audit/YYYY-MM-DD`.

### Required GitHub secrets

Add these at: GitHub repo > Settings > Secrets and variables > Actions > New repository secret

| Secret | Source | How to populate |
|---|---|---|
| `GSC_OAUTH_JSON` | `.gsc-oauth.json` contents | `pbcopy < .gsc-oauth.json` then paste |
| `GSC_TOKEN_JSON` | `.gsc-token.json` contents | `pbcopy < .gsc-token.json` then paste |

`GITHUB_TOKEN` is provided automatically by Actions and used to open the PR.

### Token refresh

The OAuth refresh token in `.gsc-token.json` is long-lived but Google can revoke it under various conditions:
- Account password change
- 6+ months of inactivity (the workflow runs weekly, so this won't trip)
- App moved out of "Testing" mode without re-consent
- User explicitly revokes at <https://myaccount.google.com/permissions>

If the workflow starts failing with auth errors, run `node scripts/audit/gsc-auth.js` locally and update the `GSC_TOKEN_JSON` secret with the new file contents.

## Adding Vercel Analytics (Pro plan)

Not yet wired. To add: create token at <https://vercel.com/account/tokens>, store as `VERCEL_TOKEN`, plus `VERCEL_TEAM_ID` and `VERCEL_PROJECT_ID`. Then a `pull-vercel.js` script can use the Insights API to grab top pages, referrers, and country breakdowns.
