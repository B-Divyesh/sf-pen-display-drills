# Repair handoff — perfection loop 2

## Status

**PASS.** Every finding in `.factory/review-1.md` and `.factory/review-2.md` is fixed, tested, deployed, and rechecked cold on production. The finding-by-finding record is in `.factory/polish-2.md`.

## What changed

- Added claim `license-verification-privacy` and a clean-context browser test for the complete draw-and-restore flow. It proves the sole cross-origin application request is a bodyless Sociobot verification GET containing exactly the pasted token.
- Rewrote `/privacy` to the tested sentence: “License verification sends the token you paste to Sociobot.”
- Standardized the visitor-facing work-surface name to “practice desk” in landing copy and the accessible region name.
- Preserved the earlier repairs: visible demo scores `82/100 · 76/100`, isolated `/demo` and `/?demo=1`, reset and exit controls, short README copy, and the tested license-storage disclosure.
- Updated the catalog description to a 78-character, verb-first sentence: “Practice steadier tablet lines and perspective in five-minute feedback drills.”
- Preserved the mid-century drafting-console identity and the `pwa-offline` static artifact class.

## Verification evidence

- Clean clone `/tmp/pen-display-polish-2-wyevlC`: `npm ci`, all 11 commands from `.factory/claims.json`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --omit=dev` passed. Evidence: `.factory/qa-evidence/polish-2-local/clean-clone.log`.
- Full suite: 6 Vitest tests and 30 Playwright Chromium tests passed. The suite covers claims, routes, history focus, first-screen bounds, 390 px layout, 44 px targets, input methods, privacy, service-worker offline reload, and demo isolation.
- Accessibility: Playwright Axe found zero serious or critical violations on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and `/missing-page`. `/opt/fleet/lib/verify-url.sh` also passed title, language, main landmark, image alternatives, buttons, console, desktop, and mobile checks. Evidence: `.factory/qa-evidence/polish-2-live/verify-url/verify.json`.
- Browser/privacy/offline: the cold production audit found no console errors; all five real routes returned 200; `/missing-page` returned 404; titles and canonicals matched; Back restored `h1` focus; the demo retained its scores offline; demo activity made no off-origin request or stored practice data; the real-license sentinel remained unchanged. Evidence: `.factory/qa-evidence/polish-2-live/cold-check.json`.
- Build budgets: initial JavaScript is 9.82 kB gzip and CSS is 5.54 kB gzip. `npm audit --omit=dev` found zero vulnerabilities.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s, TBT 0 ms, CLS 0. Evidence: `.factory/qa-evidence/polish-2-live/lighthouse-summary.json`.
- Visual checks: `.factory/qa-evidence/polish-2-live/home-cold-390.png`, `home-cold-1440.png`, `demo-sticky-mobile.png`, and `privacy-cold-desktop.png`.

## Deployment

- Source repair commit: `e6406d4c10178e0da82ac39dd9d422afdb1464f3`.
- Azure Static Web Apps deployment: `305c2ea0-d15e-4932-995e-c0f5718c61e6`.
- Live URL: <https://pen-display-drills.sociobot.in>.
- All 15 deployed public files matched the local `dist/` SHA-256 hashes. Evidence: `.factory/qa-evidence/polish-2-live/deployment-hashes.tsv`.
- The live URL was opened in fresh Chromium contexts after deployment at 390 × 844 and 1440 × 900. Every current and earlier finding passed its production recheck.

## Run locally

```sh
npm ci
npm test
npm run build
```

The deployable site is written to `dist/` with `index.html` at its root.

## Known gaps and next steps

None. No review finding or required acceptance item remains unresolved.
