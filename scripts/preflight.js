#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function exitWithError(msg) {
  console.error('\nERROR: ' + msg + '\n');
  process.exit(1);
}

// Check for Cloudflare account id in env or wrangler.toml
const envAccountId = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '';
let fileAccountId = '';
try {
  const wranglerPath = path.resolve(process.cwd(), 'wrangler.toml');
  const raw = fs.readFileSync(wranglerPath, 'utf8');
  const m = raw.match(/account_id\s*=\s*"([^"]*)"/i);
  if (m) fileAccountId = m[1].trim();
} catch (err) {
  // ignore if file missing; we still rely on env
}

const hasAccount = !!(envAccountId && envAccountId !== '') || !!(fileAccountId && fileAccountId !== '');
if (!hasAccount) {
  exitWithError('Cloudflare Account ID is missing. Set `CF_ACCOUNT_ID` env var or add `account_id` to `wrangler.toml`.');
}

// Check for API token
const apiToken = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || process.env.CF_TOKEN || '';
if (!apiToken) {
  console.warn('Warning: CF API token not found in env (CF_API_TOKEN / CLOUDFLARE_API_TOKEN). Wrangler may still be authenticated via other means.');
}

// Optional: check D1 database id if d1 block exists in wrangler.toml
try {
  const wranglerPath = path.resolve(process.cwd(), 'wrangler.toml');
  if (fs.existsSync(wranglerPath)) {
    const raw = fs.readFileSync(wranglerPath, 'utf8');
      // Only consider an active D1 block if the line with [[d1_databases]] is not commented out
      const lines = raw.split(/\r?\n/);
      let d1Found = false;
      for (const line of lines) {
        if (/\[\[d1_databases\]\]/.test(line) && !/^\s*#/.test(line)) {
          d1Found = true;
          break;
        }
      }
      if (d1Found) {
        const m = raw.match(/database_id\s*=\s*"([^"]*)"/i);
        const envD1 = process.env.D1_DATABASE_ID || process.env.D1_DB_ID || '';
        if (!((m && m[1] && m[1].trim() !== '') || envD1)) {
          exitWithError('D1 binding found in `wrangler.toml` but no `database_id` set. Set `D1_DATABASE_ID` env var or add `database_id` to `wrangler.toml`.');
        }
      }
  }
} catch (err) {
  // ignore
}

console.log('Preflight checks passed.');
process.exit(0);
