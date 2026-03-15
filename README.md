# LUISS Wallet Pass Generator

Because opening an app in the rain at 8am should be a crime.

## What is this?

This little tool turns your LUISS badge into an **Apple Wallet pass** — the same place you keep your boarding passes and loyalty cards.
Once it's in Wallet, you can scan in at the entrance with a **double-click of the side button**, straight from the lock screen. No app, no login, no password reset at 7:58am.

## How do I use it?

Three steps, I promise:

1. **Take a screenshot** of your QR code from the LUISS app (do it now, while you remember your password).
2. **Go to the website**, upload the screenshot, type your name and matricola (ID number).
3. **Download the pass** and add it to Apple Wallet. Done.

That's it. Next time you walk into LUISS, just double-click the side button and hold your phone to the reader. You're in.

## Is my data safe? 🔒

Yes — and here's why you can trust that:

- **Your QR code never leaves your device.** It's read and processed entirely in your browser. Nothing is uploaded, stored or sent anywhere.
- **Your name and matricola** are only used to personalise the pass locally. We don't store them, log them, or care about them.
- The only thing that briefly touches a server is a small, anonymised signature request needed to make Apple accept the pass (iOS requires a cryptographic signature — boring legal stuff). No personal data is included in that request.
- There's no account, no tracking, no cookies, no funny business.

Your badge is yours. It stays yours.

---

> **From now on the information written in the readme are for developers.**
> *If you don't code I would spare you this suffering.*
> *But if you really want to move forward...you're welcome.*


---

## How signing works

Raw `.pkpass` files need a cryptographic signature or iOS won't touch them.
Since getting an Apple Developer certificate costs $99/year and you're a student, we use a [Cloudflare Worker](worker.js) that proxies to the [WalletWallet API](https://walletwallet.dev). The API key lives encrypted on the worker. You get a signed pass. Everyone goes home happy.
```
Browser → Cloudflare Worker → WalletWallet API → signed .pkpass → 🍎
```

## Project structure
```
index.html      The whole UI. One file. We're not animals.
app.js          QR decoding, pass assembly, signing logic
style.css       Makes it look like we know what we're doing
worker.js       Cloudflare Worker (the signing middleman)
wrangler.toml   Wrangler config for deployment
lib/            jsQR, JSZip, Forge — bundled so you don't need npm
assets/         Logo and icons
```

## Running locally

No build step. No `npm install`. No Docker. Just:
```bash
open index.html
```

Revolutionary.

## Deploying the signing worker

If you want to host your own signing worker instead of trusting ours:
```bash
npm install -g wrangler
wrangler login
wrangler secret put WW_API_KEY   # paste your WalletWallet API key
wrangler deploy
```

Then update `WORKER_URL` in `app.js` with your worker's URL.

## Libraries used

- [jsQR](https://github.com/cozmo/jsQR) — reads QR codes so you don't have to
- [JSZip](https://stuk.github.io/jszip/) — builds the `.pkpass` archive
- [Forge](https://github.com/digitalbazaar/forge) — handles the cryptographic bits we'd rather not think about
- [WalletWallet](https://walletwallet.dev) — signs the pass like a real adult

## Contributing

Found a bug? Open an issue. Have a fix? Open a PR.
Are you a LUISS IT admin reading this? Hi. Please just add official Wallet support, I can help. I'm begging you.
