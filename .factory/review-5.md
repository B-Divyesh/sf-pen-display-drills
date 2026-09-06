# Review five-minute tablet drawing drills — round 5

## Verdict: FAIL

Reviewed 2026-09-06 UTC against <https://pen-display-drills.sociobot.in>.

- Implementation candidate: `482e305ee4d1b89901efa228e5aa897acd209c8b`
- Documentation baseline: `3c24269ac8710d7b254c755e56eba6ec06d9152d`
- Findings: **1 minor**
- Untested claims: **0**

The product works end to end and every declared claim passes. One minor copy finding remains on the designed 404 page. The acceptance rule requires zero findings, so the result is FAIL.

## First screen

Fresh Chromium contexts used blocked service workers and no stored state. The page was read before scrolling.

| View | Job | Audience | First action | Result |
| --- | --- | --- | --- | --- |
| Phone, 390 × 844 | Five-minute drills for steadier tablet lines with target feedback. | New tablet artists who want guidance instead of a blank canvas. | `Try it with sample data` | Pass. The action ends at 573 px and all three facts end at 723 px. |
| Desktop, 1440 × 900 | Same. | Same. | `Try it with sample data` | Pass. The action ends at 699 px and all three facts end at 809 px. |

The exact live text is “Practice steadier lines in five minutes,” “For new tablet artists who want clear targets and feedback instead of a blank canvas,” and “Try it with sample data.” The adjacent result says, “Start on drill 3 with two sample scores.” The job, audience, action, outcome, and three facts are visible without scrolling in both views.

## Finding

### F-5-1 — Minor — The 404 heading uses a metaphor instead of naming the error

- **Location:** Any unknown route, including `/missing-page`.
- **Observed copy:** The eyebrow says “Reading outside range” and the `h1` says “This page is off the drawing board.”
- **Evidence:** The route correctly returns HTTP 404 and provides a working return link. Its title is already the plain “Page not found — Pen Display Drills.” The page structure and recovery path are not defective; only the two visible labels fail the attached rule against metaphor, invented lore, and headings that do not name their section.
- **Impact:** A visitor must interpret two instrument/drawing phrases before reaching the direct explanation, “The address does not match a drill or policy page.” This is a minor clarity problem, not a broken 404.
- **Required change:** Use `Page not found` as the `h1`. Remove the eyebrow or replace it with a direct label such as `Unknown address`. Keep the existing explanation and return action.

## Demo and real-data isolation

The first-screen action opened `/demo` in one click. The first product screen showed:

- the Box drill;
- `2 sample drills complete`;
- the persistent `Demo — sample data, nothing is saved` banner;
- `Sample scores` with `82/100 · 76/100`;
- `Reset demo` and `Start for real`.

Reset restored Box, the two scores, and an empty current score. On a scrolled 390 px phone, the banner remained sticky at the top and both actions stayed visible. `Start for real` opened `/practice` with `No drills complete yet`, no demo banner, and no transferred result.

A full live draw/reset/leave flow made no off-origin request and left local storage, session storage, cookies, and IndexedDB empty. A synthetic pen stroke with pressure produced a score, sent nothing off origin, stored nothing, and disappeared on reload. Direct `/?demo=1&license=demo-license-sentinel` and `/demo?license=demo-license-sentinel` entries canonicalized to `/demo`, made no verification request, wrote no new state, and preserved a pre-existing real-license sentinel.

## Declared claims

A clean clone at `/tmp/pen-display-review-5-o7d8fX` received the documented `npm ci`. It installed 159 packages and reported zero vulnerabilities. All 11 claim IDs occur in exactly one tagged browser test. Every exact command from `.factory/claims.json` was run independently and passed.

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

The live landing page, practice desk, README, privacy page, and terms were cross-checked against the manifest. No missing, false, incomplete, or untested testable claim was found. The 404 wording in F-5-1 is a copy-contract defect, not an untested product claim.

## Normal, invalid, boundary, and recovery checks

- Accurate live traces completed Straight line, Ellipse, Box, One-point perspective, and Two-point perspective. Each returned `100/100`, full distinct-target coverage, and the correct completion summary.
- A click without movement left the score empty and Finish disabled. A far-off stroke returned `0/100`, explained the deviation, and kept Finish disabled. Undo restored the empty score.
- Repeated coverage of one Box edge cannot complete the drill. The `N` shortcut wraps from the fifth free drill to the first instead of selecting a locked drill.
- Keyboard, mouse fallback, pen, and touch input each produced numeric feedback.
- The timer starts at `05:00`; an accelerated full interval reached the terminal `Time` state.
- Empty license input triggered required-field validation. A mocked invalid token showed “This license is not active. Check the token and try again.” A failed network check showed “Reconnect and try again”; retrying against a valid fixture enabled all three legacy pack drills.
- A forced missing canvas context replaced the canvas with “The drawing area could not start. Reload this page or update your browser.”
- One live invalid verification GET returned 200 with `{valid:false, reason:"invalid"}`, `Cache-Control: no-store`, and CORS restricted to the product origin.

This is a static PWA. Backend tenant isolation, server restart persistence, health, and product-server rate limiting do not apply. The external Sociobot license service is not this product's backend. No CLI, library, or desktop artifact exists.

## Accessibility, mobile, routes, and links

- `/`, `/demo`, `/practice`, `/privacy`, and `/terms` return 200. `/missing-page` deliberately returns 404 and renders a designed recovery page; the expected HTTP 404 is not a defect.
- Every checked route has `lang=en`, one `h1`, one `main`, a route-specific title and canonical URL, consistent navigation/footer, and no script error. The expected failed-main-resource console entry on the deliberate 404 was classified as expected.
- Axe 4.10.2 reported zero WCAG A/AA violations of any severity on all six routes at 390 px. Desktop scans reported zero serious or critical violations.
- The live URL verifier passed `/demo`: title, language, one `h1`, main landmark, image alternatives, labeled buttons, and zero console errors.
- The skip link is keyboard-visible with a 3 px cyan outline and moves focus to the `h1`. Enter opens the sample action. The canvas remains focused and operable from the keyboard. Back navigation restores focus to the destination `h1` and updates the polite route announcement.
- All visible mobile links, buttons, inputs, and summaries measured at least 44 × 44 CSS px. No page overflow appeared at 390 px or 200% root text size.
- Reduced-motion emulation reduced animation and transition durations to 0.01 ms.
- Every crawled product link and the external Param Factory link returned 200. Privacy and Terms are reachable as real URLs.

## Offline, update, privacy, and performance

- A fresh live `/?demo=1` visit activated the service worker and canonicalized to `/demo`. Offline reload returned HTTP 200, kept the banner, and scored a keyboard stroke at `40/100`.
- The update simulation against the exact build showed “An updated practice desk is ready,” activated through `Update now`, replaced cache `pen-drills-qa-update-1` with `pen-drills-qa-update-2`, and retained the demo route and banner without errors.
- The manifest has a versioned start URL, standalone display, matching theme colors, a 192 px icon, a 512 px maskable icon, and a 180 px Apple icon.
- Source and request inspection found no analytics, tracking, third-party fonts/scripts, raw model credentials, or direct payment-provider integration. The only allowed cross-origin application path is the product-specific Sociobot license verifier.
- Live response headers include HSTS, `nosniff`, a strict-origin referrer policy, camera/microphone/geolocation denial, and a restrictive CSP matching actual resources.
- Lighthouse 13.4.1 scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.2 s, TBT 10 ms, CLS 0, and total transfer 74 KiB.
- The production build contains 9.80 kB gzip JavaScript and 5.54 kB gzip CSS. The hero image is 52,488 bytes and no font is downloaded.

## Build and live identity

The clean-clone quality gates passed:

- `npm run typecheck`
- `npm run lint`
- `npm test` — 6 Vitest tests and 31 Chromium tests
- `npm run build` — produced `dist/`
- `npm audit --omit=dev` — zero vulnerabilities

All 15 public files from the clean `dist/` build matched production byte for byte, including HTML, generated JavaScript and CSS, service worker, manifest, offline fallback, robots, sitemap, icons, and images. There are no product-code changes after `482e305`; commits `45d9d2f` and `3c24269` are documentation-only. The live runtime is therefore the reviewed implementation candidate.

## Earlier findings

Every earlier review and verification finding, including minor and low items, was inspected.

| Earlier finding | Current disposition |
| --- | --- |
| First desktop action below the fold | Fixed. Current desktop action ends at 699 px; facts end at 809 px. |
| Advertised dead `$6` checkout | Fixed by removing the sale, price, and checkout link. No current purchase claim or dead link exists. Existing-license restore remains available. |
| Multi-stroke drills completed after one stroke | Fixed. Distinct target coverage is required and independently completed for all five drills. |
| Incomplete claims manifest and tests | Fixed. Eleven claims each have one tagged test; all exact commands pass. |
| Mobile actions below 44 px | Fixed. Current mobile target scan found none. |
| Hashed assets lacked immutable caching | Fixed. Generated assets receive immutable caching. |
| `N` stopped at the locked pack | Fixed. It wraps to Straight line. |
| Invalid returned license verified twice | Fixed. The regression test records one request and token removal. |
| Unknown routes returned a soft 404 | Fixed. Unknown routes return HTTP 404 with recovery UI. F-5-1 concerns only its wording. |
| Universal “any drawing tablet” claim | Fixed. The universal wording is absent; input support is stated and tested by event type. |
| Existing licenses had no paste/restore control | Fixed. The control is keyboard-accessible and its valid, invalid, and network paths pass. |
| License label and error contrast | Fixed. The regression test measures at least 4.5:1; current measured ratio is 9.95:1. |
| Demo banner disappeared on mobile | Fixed. It remains sticky with Reset demo and Start for real visible. |
| Unversioned images used immutable caching | Fixed. Both WebP filenames include the first 12 SHA-256 characters. |
| F-1-1: sample scores were not visible | Fixed. `82/100 · 76/100` is visible and restored by reset. |
| F-1-2: long README claim sentence | Fixed. The inventory is split and below 22 words per sentence. |
| F-1-3: long README license sentence | Fixed. The copy is split into direct short sentences. |
| F-1-4: license-storage claim was unlisted | Fixed. `license-storage` tests exact keys and the daily refresh interval. |
| F-1-5: demo had inconsistent names | Fixed. Visitor copy consistently uses `demo`. |
| F-2-1: outbound-data promise was unlisted | Fixed. `license-verification-privacy` records the request and payload. |
| F-2-2: work surface had two names | Fixed. Visitor copy consistently uses `practice desk`. |
| F-3-1: direct demo URLs could save a license | Fixed. Both direct-entry forms discard the parameter before storage or network work. |
| F-3-2: landing used invented labels | Fixed. The removed labels remain absent and replacement text explains the feedback example. |

The previous round-4 PASS conditions remain true. F-5-1 is newly recorded because the current plain-words contract also applies to the 404 page.

## Scope check

Deterministic geometric feedback is the product's core job. The brief explicitly excludes automated critique, so adding AI would not help the required workflow. Import, export, and sync are not implied for an intentionally temporary, save-nothing practice session. No missed-leverage finding applies.

## Required next step

Replace the two metaphorical 404 labels with direct page-not-found wording. Then rerun the route copy check and the full review. No other product change is requested by this report.
