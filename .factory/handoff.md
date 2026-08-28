# Repair handoff — 2026-08-28

## Status

Repaired the two release-blocking findings from independent verification commit `3dbf8a52b820b95ac06d53c2eac0e41a0143090c` for candidate `b2a95934a610a70946c39e340bb9adb7c3019d1f`.

1. Removed the unprovable universal phrase “any drawing tablet” from both the initial HTML description and SPA route metadata. The remaining input promise is the separately claimed and tested browser pen, mouse, touch, and keyboard behavior.
2. Rendered the already-implemented legacy-license restore flow on `/practice`: a visible “Have a license? Paste it” disclosure opens a labeled token field and “Restore license” action. It is omitted from `/demo`, so demo mode remains isolated and never verifies a license.

The restore form has a bound label, native required validation, `aria-describedby`, and a polite live result. A valid token is sent only to the existing Sociobot verification endpoint, then enables the three legacy Space Pack drills. Invalid tokens are removed and receive an actionable message; no unavailable checkout is advertised.

## Regression coverage

- Added `@claim:license-restore` to `.factory/claims.json` and an exact Playwright flow. It mocks a valid Sociobot response, opens the real control, pastes a token, submits it, verifies the stored token, and confirms all three pack drills unlock.
- Added metadata regression coverage that asserts the exact home description and rejects the removed universal tablet phrase.
- Added a 390px keyboard/axe regression: Enter opens the disclosure, the labeled field becomes visible, summary/input/button are each at least 44px, and axe reports no serious or critical violation.
- Preserved the existing coverage for five free drills, exact geometric completion, pen/mouse/touch/keyboard input, timer, demo isolation, offline reload, update activation, mobile layout, and route accessibility.

## Verification

Performed from a clean dependency install:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

Results:

- `npm ci`: 159 packages installed; 0 vulnerabilities.
- `npm test`: 6 Vitest tests and 25 Chromium Playwright tests passed.
- `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev`: passed; audit reported 0 vulnerabilities.
- Every exact claims command passed individually: `demo-sandbox`, `geometric-feedback`, `five-core-free`, `local-practice`, `offline-reload`, `input-methods`, `license-restore`, `five-minute-session`, and `account-free`.
- Local desktop and 390px browser coverage includes keyboard drawing, the restore form, route structure, focus, 200% text sizing, reduced motion, and axe WCAG A/AA serious/critical checks.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/qa-evidence/repair-3-local` passed: HTTP 200, title, `lang=en`, one `h1`, `main`, image alt text, labeled buttons, and zero console errors. Its JSON report and screenshots are committed in that evidence directory.
- `node .factory/qa-evidence/sw-update.mjs` passed: cache `pen-drills-qa-update-1` changed to `pen-drills-qa-update-2`, the update toast activated the worker, `/demo` and its banner remained, and there were no errors.
- Local Lighthouse mobile categories: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7s, TBT 0ms, CLS 0, total transfer 74 KiB. Report: `.factory/qa-evidence/repair-3-local/lighthouse.json`.
- Production build output is `dist/` (316 KiB total). Initial JS is 26,840 bytes raw / 9.63 KiB gzip and CSS is 20,222 bytes raw / 5.49 KiB gzip. The hero WebP is 52,488 bytes. No third-party fonts or scripts ship.

Representative build hashes:

- `index.html`: `a31b1cb69975e2591a416e88db00f414c8c0428e8d0cd49c6876ca9fa9afec58`
- `assets/index-DzImjTAh.js`: `9ea5774ad45b74717df673f305bde805e3950e776e84dc227679096e71f490ac`
- `assets/index-BV_XmEhR.css`: `433b7ab2e08f4f57a981553f6be07536eda40eeb258458f8b76f3c46b5d9d5fc`
- `sw.js`: `80ce25aa3ed88beef0f8d4615d7f9edbc57f0496a055d89605f70762329bb0cd`

## Deploy and post-deploy check

Deployed `dist/` with `/opt/fleet/lib/deploy-static.sh pen-display-drills dist`. Azure Static Web Apps deployment `9979d866-7f96-4059-834e-3e090d86235d` completed successfully to `https://brave-grass-041fb4f10.7.azurestaticapps.net`, and the configured custom domain `https://pen-display-drills.sociobot.in` returned HTTPS 200.

Live identity passed: production `index.html`, JS, CSS, and service worker SHA-256 values exactly match the hashes above. The old tablet phrase is absent. Hashed JS serves `Cache-Control: public, max-age=31536000, immutable`; HTML revalidates every 30 seconds. Live headers include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and the restrictive CSP. `/missing-page` returns HTTP 404.

Live verification passed at desktop and 390px:

- `verify-url.sh` on `/demo`: HTTP 200, title, language, one `h1`, `main`, alt/label checks, and zero console errors; evidence is `.factory/qa-evidence/repair-3-live/`.
- The restore disclosure opened with Enter at 390px; its summary, field, and submit control measured 366×44, 366×46, and 366×46 px. Axe reported no serious/critical findings and no console errors.
- A live `/demo` keyboard stroke scored `0/100` without any off-origin request. After service-worker control, a network-disabled reload returned 200, retained the demo banner, and a keyboard stroke scored `40/100` with no errors.

The factory checkout endpoint remains unavailable (`404`) and the product intentionally has no checkout, price, or purchase copy. Existing returned licenses remain restorable; do not add purchase copy until the factory registers a working checkout.

## Run locally

```sh
npm ci
npm run dev
# open /demo for the isolated sample, or /practice for a real empty desk
```

Use `npm test` for the complete unit/browser suite and `npm run build` to produce `dist/`.
