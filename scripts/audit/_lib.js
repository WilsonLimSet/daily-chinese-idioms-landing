// Shared GSC client setup for audit scripts.
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const ROOT = path.resolve(__dirname, '..', '..');
const OAUTH_PATH = path.join(ROOT, '.gsc-oauth.json');
const TOKEN_PATH = path.join(ROOT, '.gsc-token.json');

function getAuthedClient() {
  if (!fs.existsSync(OAUTH_PATH) || !fs.existsSync(TOKEN_PATH)) {
    throw new Error('Missing credentials. Run `node scripts/audit/gsc-auth.js` first.');
  }
  const creds = JSON.parse(fs.readFileSync(OAUTH_PATH, 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  const { client_id, client_secret } = creds.installed || creds.web;

  const oauth2 = new google.auth.OAuth2(client_id, client_secret);
  oauth2.setCredentials(tokens);
  return oauth2;
}

function getSearchConsole() {
  return google.searchconsole({ version: 'v1', auth: getAuthedClient() });
}

module.exports = { getAuthedClient, getSearchConsole, ROOT };
