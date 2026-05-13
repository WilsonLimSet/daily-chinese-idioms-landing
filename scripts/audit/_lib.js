// Shared Google API client setup for audit scripts.
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const ROOT = path.resolve(__dirname, '..', '..');
const OAUTH_PATH = path.join(ROOT, '.gsc-oauth.json');
const GSC_TOKEN_PATH = path.join(ROOT, '.gsc-token.json');
const ADSENSE_TOKEN_PATH = path.join(ROOT, '.adsense-token.json');

function buildClient(tokenPath, authScriptName) {
  if (!fs.existsSync(OAUTH_PATH) || !fs.existsSync(tokenPath)) {
    throw new Error(`Missing credentials. Run \`node scripts/audit/${authScriptName}\` first.`);
  }
  const creds = JSON.parse(fs.readFileSync(OAUTH_PATH, 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  const { client_id, client_secret } = creds.installed || creds.web;

  const oauth2 = new google.auth.OAuth2(client_id, client_secret);
  oauth2.setCredentials(tokens);
  return oauth2;
}

function getAuthedClient() {
  return buildClient(GSC_TOKEN_PATH, 'gsc-auth.js');
}

function getSearchConsole() {
  return google.searchconsole({ version: 'v1', auth: getAuthedClient() });
}

function getAdSense() {
  return google.adsense({ version: 'v2', auth: buildClient(ADSENSE_TOKEN_PATH, 'adsense-auth.js') });
}

module.exports = { getAuthedClient, getSearchConsole, getAdSense, ROOT };
