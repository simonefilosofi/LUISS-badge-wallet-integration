# LUISS Wallet Pass Generator

A browser-based tool that lets LUISS University students save their badge QR code to Apple Wallet — no Apple Developer account, no app, no data sent to any server except for signing.

## What it does

1. **Upload your badge QR code** — take a screenshot of your LUISS badge and drop it in. The QR code is decoded directly in the browser.
2. **Enter your name and role** — the pass is pre-filled with LUISS branding.
3. **Download** — get a signed `.pkpass` ready to add to Apple Wallet on your iPhone.

Once added, you can scan in at any LUISS badge reader straight from the lock screen — no app to open, no login, no waiting.

The LUISS app has a habit of forcing password resets at the worst possible moments: standing in the rain, running late for an 8am lecture, freezing fingers, no time. This gets rid of that entirely.

## How signing works

Signing is handled by a [Cloudflare Worker](worker.js) that proxies requests to the [WalletWallet API](https://walletwallet.dev). The API key is stored as an encrypted secret on the worker — students never need their own credentials.

```
Browser → Cloudflare Worker → WalletWallet API → signed .pkpass
```

## Project structure

```
index.html      Main UI
app.js          QR decoding, pass assembly, signing logic
style.css       Styles
worker.js       Cloudflare Worker (signing proxy)
wrangler.toml   Wrangler config for deployment
lib/            jsQR, JSZip, Forge (bundled, no npm required)
assets/         Logo and icons
```

## Running locally

Just open `index.html` in a browser — no build step, no dependencies to install.

```bash
open index.html
```

## Deploying the signing worker

```bash
npm install -g wrangler
wrangler login
wrangler secret put WW_API_KEY   # paste your WalletWallet API key
wrangler deploy
```

Then update `WORKER_URL` in `app.js` with your worker's URL.

## Libraries used

- [jsQR](https://github.com/cozmo/jsQR) — QR code decoding
- [JSZip](https://stuk.github.io/jszip/) — `.pkpass` ZIP assembly
- [Forge](https://github.com/digitalbazaar/forge) — PKCS#7 stub signature
- [WalletWallet](https://walletwallet.dev) — pass signing API
