# Repair handoff — 2026-08-28

## Status: repaired and deployed

This repair addresses every release-blocking finding in independent verification 3 for candidate `a99dd2d5ab698435a10dba5e4a1b537ebd17b919`. The product remains the same offline-first Vite/TypeScript PWA and preserves the researched brief, five free drills, local-only practice, demo sandbox, and optional existing-license restore.

Product repair commit: `78ed3c1 fix: restore mobile demo and license readability`.

## Repairs made

1. **Readable license recovery** — the existing-license label and every recovery/status message now use the dark drafting-ink token on the cream desk. A live invalid-license flow at 390 px measures **9.95:1** for both label and message against `#dfd3b6`, exceeding the 4.5:1 requirement.
2. **Persistent mobile demo controls** — the small-screen rule no longer overrides `.demo-bar` from `sticky` to `relative`. After scrolling the 390 px demo canvas into view, the deployed banner remains at `y=0..84`, with Reset demo and Start for real visible.
3. **Safe immutable artwork caching** — the hero and social WebP files are content-addressed (`instrument-console-ef16bd9f2ce7.webp` and `social-card-51b57592432d.webp`). Every reference (application, Open Graph/Twitter metadata, and service-worker precache) now uses those names, so the existing immutable `/assets/*` response policy applies only to content-addressed artwork and Vite-hashed JS/CSS. The former unversioned hero URL returns 404 in production.

## Regression coverage

`tests/product.spec.ts` now adds exact browser coverage for the verifier findings:

- invalid-license label and error-message contrast calculated from computed colors at 390 px, each required to be at least 4.5:1;
- a 390×844 demo scroll to the canvas, asserting sticky banner position, viewport intersection, Reset demo, and Start for real;
- content-addressed artwork references verified against the first 12 characters of each file's SHA-256 before the immutable asset policy applies.

All prior regression coverage remains intact, including distinct target coverage before finishing Box, the free-pack `N` boundary, no duplicate returned-license verification, the cold desktop first screen, 44 px mobile targets, keyboard drawing, local privacy, and offline reload.

## Verification run

Fresh local installation and repository gates:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

Results: `npm ci` installed 159 packages with 0 vulnerabilities; typecheck and lint passed; `npm test` passed **6 Vitest tests and 28 Chromium Playwright tests**; build passed; production audit reported 0 vulnerabilities. The production build is in `dist/`: JS is 26,853 bytes raw / 9.64 KB gzip and CSS is 20,221 bytes raw / 5.49 KB gzip. The 52,488-byte hero stays within the image budget.

Every exact command in `.factory/claims.json` was rerun separately and passed:

```sh
npm test -- --grep @claim:demo-sandbox
npm test -- --grep @claim:geometric-feedback
npm test -- --grep @claim:five-core-free
npm test -- --grep @claim:local-practice
npm test -- --grep @claim:offline-reload
npm test -- --grep @claim:input-methods
npm test -- --grep @claim:license-restore
npm test -- --grep @claim:five-minute-session
npm test -- --grep @claim:account-free
```

Browser and accessibility checks:

- Live desktop (1440×900): landing title is correct; sample-data action ends at y=717 and the three facts end at y=826; no console/page errors.
- Live mobile (390×844): scrolling to the canvas kept the demo banner at y=0..84, its computed position is `sticky`, and a keyboard stroke returned `40/100` with no console/page errors.
- Live mocked invalid-license recovery at 390 px returned the intended recovery text and measured 9.95:1 label and message contrast.
- Playwright axe on the live mobile demo reported zero serious/critical WCAG A/AA violations. The complete route suite in `npm test` also checks all six routes with axe, semantics, titles, language, and landmarks.
- `/opt/fleet/lib/verify-url.sh https://pen-display-drills.sociobot.in/demo .factory/qa-evidence/repair-4-verify-url` passed: HTTP 200, `Demo — Pen Display Drills`, `lang=en`, one h1, main landmark, no missing image alt, no unlabeled buttons, and no console errors. Its report and screenshots are retained under `.factory/qa-evidence/repair-4-verify-url/`.
- The local privacy claim intercepts the complete demo drawing flow and confirms no off-origin requests, local/session storage, cookies, or IndexedDB data. The live license request is restricted by CSP to Sociobot's verification endpoint.

PWA and response-policy checks:

- A fresh live `/?demo=1` visit (canonicalized to `/demo`) activated cache `pen-drills-2c2547acae49`; with the browser offline, `/demo` reloaded HTTP 200, retained its banner, and a keyboard stroke returned `40/100` without errors.
- `node .factory/qa-evidence/sw-update.mjs` passed: the update toast appeared, cache `pen-drills-qa-update-1` was replaced by `pen-drills-qa-update-2`, and the demo banner remained after activation.
- Production responses include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and the configured CSP. Vite JS/CSS and the new hash-addressed WebP files use `Cache-Control: public, max-age=31536000, immutable`.
- All 15 deployed public files were fetched and SHA-256 compared with `dist/`; every hash matched. This verifies that production serves the repair output rather than a stale build.

Performance:

- Fresh live Lighthouse mobile: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, total transfer 69 KiB. Report: `.factory/qa-evidence/repair-4-lighthouse.json`.

## Deployment

The `dist/` output from `78ed3c1` was deployed to Azure Static Web Apps production target `sf-pen-display-drills` using the factory work-order static deployment configuration. Azure reported success at <https://brave-grass-041fb4f10.7.azurestaticapps.net>; the canonical production URL <https://pen-display-drills.sociobot.in> was then used for the live checks above.

## Known gaps / next steps

No known release blockers or product gaps remain. No deployment infrastructure, DNS, billing configuration, or researched brief was changed by this repair.
