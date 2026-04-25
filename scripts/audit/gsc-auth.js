#!/usr/bin/env node
/* eslint-disable no-console */
// One-time auth flow for Google Search Console.
// Run: node scripts/audit/gsc-auth.js
// Opens browser, you sign in with the Google account that owns the GSC property,
// the refresh token is saved to .gsc-token.json (gitignored) for future use.

const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');
const { execFile } = require('child_process');
const { google } = require('googleapis');

const ROOT = path.resolve(__dirname, '..', '..');
const OAUTH_PATH = path.join(ROOT, '.gsc-oauth.json');
const TOKEN_PATH = path.join(ROOT, '.gsc-token.json');

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/webmasters',
];

function openBrowser(url) {
  const [cmd, args] =
    process.platform === 'darwin' ? ['open', [url]] :
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] :
    ['xdg-open', [url]];
  execFile(cmd, args, (err) => {
    if (err) console.log(`\nCouldn't auto-open browser. Visit this URL manually:\n${url}\n`);
  });
}

async function main() {
  if (!fs.existsSync(OAUTH_PATH)) {
    console.error(`Missing ${OAUTH_PATH}. Place your OAuth Desktop client JSON there.`);
    process.exit(1);
  }

  const creds = JSON.parse(fs.readFileSync(OAUTH_PATH, 'utf8'));
  const { client_id, client_secret } = creds.installed || creds.web || {};
  if (!client_id || !client_secret) {
    console.error('OAuth JSON malformed: expected `installed` or `web` block with client_id/client_secret.');
    process.exit(1);
  }

  const PORT = 53682;
  const redirectUri = `http://localhost:${PORT}/oauth2callback`;

  const oauth2 = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  const server = http.createServer(async (req, res) => {
    try {
      if (!req.url || !req.url.startsWith('/oauth2callback')) {
        res.writeHead(404); res.end(); return;
      }
      const u = new URL(req.url, `http://localhost:${PORT}`);
      const code = u.searchParams.get('code');
      const error = u.searchParams.get('error');
      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Auth error: ${error}`);
        console.error(`Auth error: ${error}`);
        server.close();
        process.exit(1);
      }
      if (!code) {
        res.writeHead(400); res.end('Missing code'); return;
      }

      const { tokens } = await oauth2.getToken(code);
      if (!tokens.refresh_token) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('No refresh token returned. Revoke access at https://myaccount.google.com/permissions and rerun.');
        console.error('\nNo refresh token returned. This usually means you previously authorized this client.');
        console.error('Fix: visit https://myaccount.google.com/permissions, remove "Chinese Idioms Audit", then rerun this script.\n');
        server.close();
        process.exit(1);
      }

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      fs.chmodSync(TOKEN_PATH, 0o600);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body style="font-family:system-ui;padding:40px;"><h1>Authenticated</h1><p>Token saved. You can close this tab.</p></body></html>');

      console.log(`\nRefresh token saved to ${TOKEN_PATH}`);
      console.log('This file is gitignored. Keep it secret.\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('Failed:', err.message);
      try { res.writeHead(500); res.end(err.message); } catch {}
      server.close();
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`\nListening on http://localhost:${PORT}`);
    console.log('Opening browser for Google sign-in...\n');
    openBrowser(authUrl);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
