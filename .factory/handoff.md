# Repair handoff — perfection loop 1

## Status

**PASS.** Every finding in `.factory/review-1.md` is fixed, tested, pushed, deployed, and cold-checked at <https://pen-display-drills.sociobot.in>. No earlier review or polish report exists in repository history.

Functional repair commit: `89601c4271fb4da474ebabdc8a753515ddc4377a`.

## What changed

- The one-click demo now visibly starts on Box with sample scores `82/100 · 76/100`.
- Completing a demo drill appends its score. Reset demo restores the two seeds, Box, the count, and a clean canvas.
- The demo remains memory-only and does not read or write real practice or license data.
- A new `license-storage` claim proves the exact disclosed keys and one-day valid-verdict refresh window.
- README copy now uses “demo” consistently and every reviewed sentence stays within 22 words.
- SPA navigation now updates route titles, descriptions, canonical URLs, Open Graph fields, and Twitter fields. Back navigation restores focus to the page heading.
- `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/demo.md`, and `.factory/polish-1.md` record the repaired contract and evidence.

The mid-century drafting-console palette, typography, ruled geometry, instrument controls, and motion policy remain unchanged.

## Verification

Clean clone `/tmp/pen-display-polish-1-CvC4mw` at `89601c4`:

- `npm ci`: 159 packages; 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 10/10 passed independently.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: 6 Vitest tests and 29 Chromium Playwright tests passed.
- `npm run build`: passed; `dist/index.html` exists.
- `npm audit --omit=dev`: 0 vulnerabilities.

Build budgets:

- JavaScript: 27,411 bytes raw; 9.83 kB gzip.
- CSS: 20,493 bytes raw; 5.54 kB gzip.
- Hero WebP: 52,488 bytes.
- No downloaded fonts.

The Playwright suite covers the full drill flow, input methods, distinct target coverage, demo isolation/reset, license restore/storage, offline reload, mobile layout, touch targets, route history/focus, metadata, and axe checks. All five core drills were also completed against production at `100/100`, with no console errors.

## Deployment and live evidence

- Static deployment: Azure Static Web Apps deployment `1a11dfcf-15f1-4d5f-9ba9-66fd361ef900` succeeded.
- Production URL: <https://pen-display-drills.sociobot.in>.
- Fifteen public production files matched `dist/` byte-for-byte: [deployment-hashes.json](qa-evidence/polish-1-live/deployment-hashes.json).
- Cold route/demo/privacy/offline audit: [cold-check.json](qa-evidence/polish-1-live/cold-check.json).
- Factory URL verifier: HTTP 200, correct title/lang/main/h1, no missing alt or labels, and no console errors: [verify.json](qa-evidence/polish-1-live/verify-url/verify.json).
- Live demo screenshots: [desktop](qa-evidence/polish-1-live/demo-cold-desktop.png), [mobile](qa-evidence/polish-1-live/demo-cold-mobile.png), and [sticky mobile banner](qa-evidence/polish-1-live/demo-sticky-mobile.png).
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, 70 KiB transfer: [lighthouse.json](qa-evidence/polish-1-live/lighthouse.json).
- PWA update simulation moved `pen-drills-qa-update-1` to `pen-drills-qa-update-2`, showed the update notice, retained `/demo`, and logged no errors.
- Live response headers include HSTS, `nosniff`, strict-origin referrer policy, denied camera/microphone/geolocation, and the restrictive product CSP.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh pen-display-drills dist
```

## Known gaps and next steps

None for the reviewed product contract. Infrastructure, DNS, and billing remain factory-owned.
