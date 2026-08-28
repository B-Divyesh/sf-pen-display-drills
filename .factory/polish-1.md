# Perfection-loop polish 1

Status: **PASS**  
Reviewed source: `c7e14d9f2116e5d90c9435fa9eebdb88dbbf914f`  
Functional repair: `89601c4271fb4da474ebabdc8a753515ddc4377a`  
Production: <https://pen-display-drills.sociobot.in>

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists in repository history. This document maps every finding in `review-1.md`.

| Finding | Change made | Test evidence | Screenshot evidence | Cold live check |
| --- | --- | --- | --- | --- |
| F-1-1 — demo scores were not shown | Added a visible `Sample scores` readout with `82/100 · 76/100`. New completed scores join the history. Reset demo restores exactly the two seeds and Box drill. | `@claim:demo-sandbox opens a seeded demo and resets it` asserts both scores before and after reset, the Box seed, locked pack, and storage isolation. The live audit also completed Box, saw a third score, then reset to the two seeds. | [`demo-cold-desktop.png`](qa-evidence/polish-1-live/demo-cold-desktop.png), [`demo-cold-mobile.png`](qa-evidence/polish-1-live/demo-cold-mobile.png) | `/` → one click → `/demo`; both scores visible. Direct `/?demo=1` canonicalized to `/demo`. Reset restored `82/100 · 76/100`. |
| F-1-2 — long README claim-test sentence | Split the 24-word inventory into two sentences of 13 and 14 words. Added license storage to the second sentence. | `.factory/copy-audit.md`, “Review 1 README rewrites”; `npm run lint`; full `npm test`. | [`home-cold-mobile.png`](qa-evidence/polish-1-live/home-cold-mobile.png) confirms the approved first-screen copy stayed intact. | `/` retained the approved ≤22-word landing copy and one-click action after deployment. |
| F-1-3 — long README license sentence | Replaced the 27-word sentence with three direct sentences of 10, 13, and 11 words. | `.factory/copy-audit.md`, “Review 1 README rewrites”; `@claim:license-storage stores only a supplied token and its daily check result`. | [`privacy-cold-mobile.png`](qa-evidence/polish-1-live/privacy-cold-mobile.png) | `/privacy` states the same narrow token/result storage behavior and links remain live. |
| F-1-4 — unlisted license-storage claim | Added `license-storage` to `.factory/claims.json`. Its clean-context test proves no keys exist before input, exactly the token and verdict keys exist after a valid restore, no second check occurs within a day, and a stale result is checked again. | `npm test -- --grep @claim:license-storage` passed independently in clean clone `/tmp/pen-display-polish-1-CvC4mw`; the full suite also passed. | [`privacy-cold-mobile.png`](qa-evidence/polish-1-live/privacy-cold-mobile.png) | `/privacy` loaded with its route title, canonical URL, one `h1`, one `main`, and zero serious/critical axe findings. |
| F-1-5 — inconsistent “sandbox” wording | Renamed `Try the sandbox` to `Try the demo`. Replaced “practice storage namespace” with “practice data.” Namespace details remain only in `.factory/demo.md`. | `.factory/copy-audit.md` terminology table; `@claim:demo-sandbox opens a seeded demo and resets it`. | [`demo-cold-mobile.png`](qa-evidence/polish-1-live/demo-cold-mobile.png), [`demo-sticky-mobile.png`](qa-evidence/polish-1-live/demo-sticky-mobile.png) | `/`, `/demo`, and the banner consistently use “demo”; Reset demo and Start for real remain visible at 390×844. |

## Regression evidence

- Clean clone: `npm ci`, all ten exact `.factory/claims.json` commands, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --omit=dev` passed at `89601c4`.
- Full suite: 6 Vitest tests and 29 Chromium Playwright tests passed. Axe reported zero serious/critical issues on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the designed 404.
- Live routes: `/`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200. `/missing-page` returned 404 with the designed recovery page. Titles and canonical URLs matched every route; Back restored heading focus.
- Demo isolation: no off-origin requests, practice/demo storage keys, session storage, cookies, or IndexedDB databases. A pre-existing real-license sentinel was untouched.
- PWA: a fresh `/?demo=1` visit activated the worker, canonicalized to `/demo`, reloaded offline with HTTP 200, and retained the two visible scores. The update simulation replaced the cache and preserved the demo route without errors.
- Deployment: Azure Static Web Apps deployment `1a11dfcf-15f1-4d5f-9ba9-66fd361ef900`; all 15 public files matched `dist/` byte-for-byte.
- Live verification: [`cold-check.json`](qa-evidence/polish-1-live/cold-check.json), [`verify.json`](qa-evidence/polish-1-live/verify-url/verify.json), and [`deployment-hashes.json`](qa-evidence/polish-1-live/deployment-hashes.json).
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 0 ms, CLS 0. Evidence: [`lighthouse.json`](qa-evidence/polish-1-live/lighthouse.json).

All five findings are resolved. No finding of any severity remains.
