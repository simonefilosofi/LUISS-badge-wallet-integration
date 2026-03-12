/**
 * Cloudflare Worker — LUISS Pass Signing Proxy
 *
 * Proxies requests to the WalletWallet API using a server-side API key,
 * so end-users never need to supply their own credentials.
 *
 * Required secret (set via `wrangler secret put WW_API_KEY`):
 *   WW_API_KEY  — your WalletWallet API key (ww_live_…)
 *
 * Deploy:
 *   npm install -g wrangler
 *   wrangler login
 *   wrangler secret put WW_API_KEY
 *   wrangler deploy
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    // Parse incoming pass data
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400, headers: CORS_HEADERS });
    }

    // Forward to WalletWallet with the stored API key
    let upstream;
    try {
      upstream = await fetch('https://api.walletwallet.dev/api/pkpass', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${env.WW_API_KEY}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      return new Response(`Upstream fetch failed: ${err.message}`, { status: 502, headers: CORS_HEADERS });
    }

    const data        = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('Content-Type') || 'application/vnd.apple.pkpass';

    return new Response(data, {
      status:  upstream.status,
      headers: { ...CORS_HEADERS, 'Content-Type': contentType },
    });
  },
};
