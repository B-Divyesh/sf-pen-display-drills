# Verify five-minute tablet drawing drills — round 5

## Verdict: FAIL

Reviewed 2026-09-06 UTC against <https://pen-display-drills.sociobot.in>.

- Implementation candidate: `3c7f77f7c9a80a9f397b38c2d82754a80467e786`
- Documentation baseline: `acca723b36d33356875693f03d6706b13f5f1081`
- Findings: **1 medium**
- Untested claims: **0**

The 404 wording repair is deployed and correct. The product, demo, claims, offline path, and recovery flows otherwise work. A fresh enlarged-text check found clipped content on phone-sized screens. The acceptance rule requires zero findings, so the result is FAIL.

## Finding

### F-V5-1 — Medium — Enlarged text is clipped on phone-sized screens

- **Scope:** `/`, `/demo`, `/practice`, `/privacy`, and `/terms` at a 390 × 844 viewport with the root text size increased to 200%.
- **Observed:** `main` has `overflow-x: clip`. At 200% text size, its content needs 449 px on `/demo`, 462 px on `/practice`, 471 px on `/privacy`, 512 px on `/`, and 536 px on `/terms`, while the viewport remains 390 px. The demo heading ends at x=449 and the landing heading at x=491.5. The right side is not reachable because the clipping container does not scroll. The demo timer visibly loses its final digit, and headings lose text at the right edge.
- **Evidence:** `/work/.evidence/verification-5/live-phone-demo-text-200.png`, `text-resize-detail.json`, and `text-resize-routes.json`.
- **Impact:** People who enlarge text can lose the job heading, legal-page headings, and part of the session timer. The normal-size mobile layout passes, but the attached accessibility contract requires 200% text without loss.
- **Required change:** At the phone breakpoint, let headings and the session meter shrink or wrap within the available width. Remove clipping that hides resized text. Add a 390 px browser regression that increases root text to 200% and asserts that important text boxes remain inside `main` without hidden overflow.

## First screen

Fresh Chromium phone and desktop contexts blocked service workers and had no stored state. The page was read before scrolling.

| View | Job | Audience | First action | Result |
| --- | --- | --- | --- | --- |
| Phone, 390 × 844 | Five-minute practice for steadier tablet lines with target feedback. | New tablet artists who want guidance instead of a blank canvas. | `Try it with sample data` | Pass at normal text size. The action ends at 573.1 px and all three facts end at 722.5 px. |
| Desktop, 1440 × 900 | Same. | Same. | `Try it with sample data` | Pass. The action ends at 699 px and all three facts end at 808.1 px. |

The live wording is “Practice steadier lines in five minutes,” “For new tablet artists who want clear targets and feedback instead of a blank canvas,” and “Try it with sample data.” The adjacent result says, “Start on drill 3 with two sample scores.” The three facts state offline use after the first visit, tab-only practice, and five free core drills.

## Demo and real-data isolation

The landing action opened `/demo` in one click. The first product screen showed the Box drill, `2 sample drills complete`, the persistent `Demo — sample data, nothing is saved` banner, and `82/100 · 76/100` sample scores.

An accurate live line produced `99/100` and “0.2 px average deviation.” The banner stayed at the top of the scrolled phone screen. Reset restored Box, the two seed scores, and an empty current result. Start for real opened `/practice` with `No drills complete yet`, no banner, and no transferred data.

The full flow made no off-origin request and left local storage, session storage, cookies, and IndexedDB empty. Both documented demo entries discarded a supplied `license` parameter without a request or new storage. A pre-existing real-license sentinel remained unchanged.

## Declared claims

A fresh clone of `main` at `acca723b36d33356875693f03d6706b13f5f1081` received the documented `npm ci`. Every claim ID occurs in exactly one tagged browser test. All 11 exact commands in `.factory/claims.json` ran independently and passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `geometric-feedback` | `npm test -- --grep @claim:geometric-feedback` | PASS |
| `five-core-free` | `npm test -- --grep @claim:five-core-free` | PASS |
| `local-practice` | `npm test -- --grep @claim:local-practice` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `input-methods` | `npm test -- --grep @claim:input-methods` | PASS |
| `license-restore` | `npm test -- --grep @claim:license-restore` | PASS |
| `license-storage` | `npm test -- --grep @claim:license-storage` | PASS |
| `license-verification-privacy` | `npm test -- --grep @claim:license-verification-privacy` | PASS |
| `five-minute-session` | `npm test -- --grep @claim:five-minute-session` | PASS |
| `account-free` | `npm test -- --grep @claim:account-free` | PASS |

The live landing page, practice desk, legal pages, README, and copy audit were cross-checked against the claim manifest. No missing, false, incomplete, or untested public claim was found.

## Normal, invalid, boundary, and recovery checks

- Straight line, Ellipse, Box, One-point perspective, and Two-point perspective each completed live at `100/100` with full distinct-target coverage and the correct summary.
- A click without movement left the score empty and Finish disabled. A far-off stroke returned `0/100`, explained the deviation, and kept Finish disabled. Undo restored the empty score.
- Repeating one Box edge cannot complete the drill. `N` at the fifth free drill wraps to Straight line instead of selecting a locked drill.
- Pen, mouse, touch, and keyboard input each produced numeric feedback. The keyboard canvas kept focus and announced a result.
- The timer starts at `05:00`; an accelerated complete interval reached `Time`.
- Empty license input triggered native required validation. A failed check said to reconnect; retry against a valid fixture enabled all three existing-license drills. Invalid-token behavior and single-check cleanup passed the browser suite.
- A forced missing canvas context showed “The drawing area could not start. Reload this page or update your browser.”
- A live invalid verification request returned HTTP 200 with `valid:false`, `Cache-Control: no-store`, and CORS restricted to the product origin.

This is a static PWA. Product-backend tenant isolation, restart persistence, health, and 429 checks do not apply. The Sociobot license verifier is an external dependency, not this product's backend. No CLI, library, or desktop artifact exists.

## Accessibility, routes, links, and 404

- `/`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200. `/missing-page` deliberately returned 404.
- Every checked route had `lang=en`, one `h1`, one `main`, an ordered heading outline, a route-specific title, and a canonical URL.
- Axe 4.10.2 reported zero WCAG A/AA violations on all six routes at both checked sizes. This automated result does not cover the enlarged-text clipping in F-V5-1.
- At normal text size, all visible mobile controls measured at least 44 × 44 CSS px and no route overflowed 390 px.
- Reduced-motion emulation changed animation and transition durations to 0.01 ms.
- The skip link showed a 3 px cyan outline and moved focus to the landing `h1`. Back navigation restored focus to the destination `h1`. The drawing area remained keyboard-operable without a trap.
- All crawled HTTP links returned 200. The two contact links are explicit `mailto:` links.
- The repaired 404 now has title `Page not found — Pen Display Drills`, `h1` text `Page not found`, direct explanation, and a working return action. The expected main-document 404 console entry is not a product error.

The earlier F-5-1 wording finding is resolved. The unknown route contains no metaphorical heading or invented eyebrow.

## Offline, update, privacy, and performance

- A fresh live `/?demo=1` visit activated the service worker and canonicalized to `/demo`. Offline reload returned 200, kept the demo banner, and scored a keyboard stroke at `40/100` without errors.
- The update simulation showed “An updated practice desk is ready,” activated through `Update now`, replaced cache `pen-drills-qa-update-1` with `pen-drills-qa-update-2`, and retained `/demo` with its banner.
- The manifest has a versioned start URL, standalone display, matching colors, 192 px and 512 px icons, and a maskable icon.
- Source and request inspection found no analytics, tracking, third-party fonts/scripts, embedded credentials, or direct payment-provider integration. The only allowed cross-origin application path is the documented Sociobot license verifier.
- Live headers include HSTS, `nosniff`, a strict-origin referrer policy, camera/microphone/geolocation denial, and a restrictive CSP matching actual resources.
- Lighthouse 13.4.1 scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, and total transfer 74 KiB.
- The production build contains 9.78 kB gzip JavaScript and 5.54 kB gzip CSS. The hero image is 52,488 bytes and no font is downloaded.

## Build and live identity

Clean-clone gates passed:

- `npm run typecheck`
- `npm run lint`
- `npm test` — 6 Vitest tests and 32 Chromium tests
- `npm run build` — produced `dist/`
- `npm audit --omit=dev` — zero vulnerabilities

All 15 public files from the clean build matched production byte for byte. `staticwebapp.config.json` correctly returned 404 because it is deployment configuration. Commits after implementation `3c7f77f` are documentation-only, so the live runtime is the reviewed implementation candidate.

## Earlier findings

Every earlier review and verification finding, including minor and low items, was checked.

| Earlier finding | Current disposition |
| --- | --- |
| Desktop first action below the fold | Fixed at normal text size; action ends at 699 px. |
| Advertised dead `$6` checkout | Fixed; no sale, price, or checkout link remains. Existing-license restore remains available. |
| Drills completed without distinct target coverage | Fixed; all five live drills required and reached full coverage. |
| Claims manifest or tests were incomplete | Fixed; 11 listed claims each have one tagged test and all commands pass. |
| Mobile actions were below 44 px | Fixed at normal text size; current scan found none. |
| Hashed assets lacked immutable caching | Fixed; generated assets are content-addressed and receive immutable caching. |
| `N` stopped at a locked drill | Fixed; it wraps to Straight line. |
| Returned invalid licenses verified twice | Fixed; regression passes and the token is removed. |
| Unknown paths were soft 404s | Fixed; unknown paths return HTTP 404 with recovery UI. |
| Universal “any drawing tablet” claim | Fixed; the wording is absent and supported input types are tested. |
| Existing licenses had no restore control | Fixed; keyboard, valid, invalid, and network paths pass. |
| License label and error contrast failed | Fixed; the contrast regression passes. |
| Demo banner disappeared on mobile | Fixed at normal text size; the sticky banner and both actions remain visible. |
| Unversioned images used immutable caching | Fixed; both image filenames contain their content hash. |
| F-1-1 — demo scores were not visible | Fixed; `82/100 · 76/100` is visible and restored by Reset demo. |
| F-1-2 — README claim sentence was too long | Fixed; the inventory is split into short sentences. |
| F-1-3 — README license sentence was too long | Fixed; the wording is split into short sentences. |
| F-1-4 — license-storage promise was unlisted | Fixed; `license-storage` tests exact keys and the one-day interval. |
| F-1-5 — demo naming was inconsistent | Fixed; visitor copy consistently uses `demo`. |
| F-2-1 — outbound-data promise was unlisted | Fixed; `license-verification-privacy` observes the only request. |
| F-2-2 — the work surface had two names | Fixed; visitor copy uses `practice desk`. |
| F-3-1 — direct demo URLs could save a license | Fixed; both forms discard the parameter before storage or network work. |
| F-3-2 — landing used invented labels | Fixed; useful section labels replaced them. |
| F-5-1 — 404 used metaphorical wording | Fixed; the route now says `Page not found` and the recovery action works. |

F-V5-1 is a newly observed accessibility finding. It contradicts earlier reports that 200% text had no loss; the saved screenshot and element measurements show the current behavior directly.

## Scope and remaining dependency

Deterministic geometric feedback is the right implementation for the brief, which explicitly excludes automated critique. Import, export, and sync are not implied for a temporary, save-nothing practice session. No missed-leverage finding applies.

The five core drills are complete and free. Existing Space Pack licenses can be restored. New checkout remains unavailable until the external billing registration exists; the product makes no current sale or price claim.

Evidence is under `/work/.evidence/verification-5/`. No product source code was changed during verification.
