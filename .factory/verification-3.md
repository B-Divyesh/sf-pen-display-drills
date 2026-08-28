# Independent product verification 3

## Verdict: FAIL

- Candidate: `a99dd2d5ab698435a10dba5e4a1b537ebd17b919`
- Branch at start: `main`, clean and equal to `origin/main`
- Live URL: <https://pen-display-drills.sociobot.in>
- Verified: 2026-08-28 UTC
- Artifact: offline-first static PWA

The core product is functional, fast, private by default, and deployed from the candidate. Every listed claim command and repository quality gate passes. The release nevertheless fails the acceptance contract for two user-visible reasons: the existing-license form has unreadable text, and the required persistent demo banner stops being persistent on a 390 px phone. A separate cache-policy defect can leave unversioned imagery stale after future releases.

## Release-blocking findings

### High — License label and recovery messages have 1.06:1 and 1.40:1 contrast

On live `/practice`, open “Have a license? Paste it,” enter an invalid token, and submit. The form is rendered on the cream drafting desk (`rgb(223, 211, 182)`), but styles retained from a dark-panel treatment make the label `rgb(209, 220, 218)` and the status/error text `rgb(255, 248, 231)`.

- “License token”: **1.06:1** contrast, 13.6 px regular text.
- “This license is not active. Check the token and try again.”: **1.40:1** contrast, 13.6 px regular text.
- Required contrast: **4.5:1**.

Both the field's identity and the recovery instruction are nearly invisible at desktop and mobile sizes. Axe reports these nodes as `color-contrast` **incomplete**, not passing, because the parent drafting surface also has a CSS grid gradient; manual measurement against its solid base color is decisive. This violates the explicit contrast and form-error baselines.

Evidence: [`qa-evidence/verification-3/live-mobile-license-contrast.png`](qa-evidence/verification-3/live-mobile-license-contrast.png).

### High — The mandatory demo banner disappears on mobile

The demo contract requires a persistent “Demo — sample data, nothing is saved” banner with Reset and Start-for-real actions. At 390×844 the banner initially occupies `y=65..148.58`, but after scrolling to the drawing canvas (`scrollY=595`) its rectangle is `y=-530..-446.42`, completely outside the viewport.

The desktop treatment remains sticky. The mobile media rule changes `.demo-bar` from `position: sticky` to `position: relative`, so a person using the actual drill no longer sees that they are in a disposable sandbox or how to leave/reset it. This is a direct failure of the attached demo-sandbox requirement.

Evidence: [`qa-evidence/verification-3/live-mobile-demo.png`](qa-evidence/verification-3/live-mobile-demo.png), captured after scrolling the canvas into view.

## Other finding

### Medium — Unversioned images are cached as immutable for one year

The live responses for `/assets/instrument-console.webp` and `/assets/social-card.webp` send:

`Cache-Control: public, max-age=31536000, immutable`

Those filenames contain no content hash. `staticwebapp.config.json` applies the immutable rule to every `/assets/*` file, not only Vite's hashed JS/CSS. A future deployment that changes either image at the same URL can remain stale in browser/CDN cache for a year; a newly installed service worker can also populate its new cache from that stale HTTP-cache response. Only content-hashed assets should receive immutable caching.

## Mandatory first-read gate: PASS

Fresh Chromium contexts with service workers blocked were opened at 1440×900 and 390×844.

- What it does: “Practice steadier lines in five minutes.”
- For whom: “For new tablet artists who want clear targets and feedback instead of a blank canvas.”
- What to click first: “Try it with sample data.” Adjacent copy says it starts on drill 3 with two sample scores.
- One click opens `/demo`, already showing the Box drill and two sample completions.
- The primary action and all three plain facts are visible in both first viewports.

Evidence: [`qa-evidence/verification-3/live-cold-desktop.png`](qa-evidence/verification-3/live-cold-desktop.png) and [`qa-evidence/verification-3/live-cold-mobile.png`](qa-evidence/verification-3/live-cold-mobile.png).

## Claims-first gate

`.factory/claims.json` exists. After clean `npm ci`, every exact listed command was run separately before broader QA. Each manifest ID occurs in exactly one `@claim:<id>` browser test.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `geometric-feedback` | `npm test -- --grep @claim:geometric-feedback` | PASS |
| `five-core-free` | `npm test -- --grep @claim:five-core-free` | PASS |
| `local-practice` | `npm test -- --grep @claim:local-practice` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `input-methods` | `npm test -- --grep @claim:input-methods` | PASS |
| `license-restore` | `npm test -- --grep @claim:license-restore` | PASS |
| `five-minute-session` | `npm test -- --grep @claim:five-minute-session` | PASS |
| `account-free` | `npm test -- --grep @claim:account-free` | PASS |

Each command also ran all six unit tests before its selected Playwright test. Landing, legal, README, and demo copy were cross-checked against the manifest; no additional release-blocking claim mismatch was found. The non-persistent mobile banner is a sandbox-contract failure that the narrower `demo-sandbox` claim does not test.

## Clean repository gates

- `npm ci`: PASS — 159 packages installed; audit reported 0 vulnerabilities.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — 6 Vitest tests and 25 Chromium Playwright tests.
- `npm run build`: PASS — exact production output written to `dist/`.
- `npm audit --omit=dev`: PASS — 0 vulnerabilities.
- Output: JS 26,840 bytes raw / 9,615 bytes gzip; CSS 20,222 bytes raw / 5,473 bytes gzip; hero WebP 52,488 bytes; no shipped fonts.

## End-to-end and boundary evidence

Accurate live traces completed each free drill:

| Drill | Score | Required coverage | Result |
| --- | ---: | --- | --- |
| Straight line | 100/100 | 1 of 1 | PASS |
| Ellipse | 100/100 | 45 of 45 | PASS |
| Box | 100/100 | 8 of 8 | PASS |
| One-point perspective | 100/100 | 8 of 8 | PASS |
| Two-point perspective | 100/100 | 9 of 9 | PASS |

Each Finish action produced a drill-specific summary. Additional live checks:

- Mouse, synthetic pen and touch Pointer Events, and keyboard arrows each produced a numeric score.
- The timer moved from `05:00` to `04:58` after 2.2 seconds.
- A click without movement produced no score and kept Finish disabled.
- A far-off stroke scored `0/100`, reported `272.3 px away`, covered no target, and kept Finish disabled.
- An accurate line scored `100/100`; Undo restored `—` and disabled Finish.
- `N` at the final free drill wrapped to Straight line instead of selecting a locked pack.
- Reset demo restored Box, exactly two sample completions, and an empty score.
- Start for real opened `/practice` with Straight line, no demo banner, no completed drills, no transferred score, and empty storage.
- Empty license submission used native required validation. A mocked network failure announced “Reconnect and try again”; a retry with a valid fixture enabled all three existing-license pack drills after the designed 500 ms rerender.
- No console/page errors occurred in normal flows.

## Accessibility and responsive checks

- Axe 4.10.2 found zero reported serious/critical violations on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the designed 404 at desktop, and on all five real routes at mobile size. The manual contrast failure above is present in axe's serious `incomplete` list because of the gradient background.
- Every route has `lang=en`, one `h1`, one `main`, ordered headings, route-specific title, and no missing image alt.
- The skip link is the first focus target when starting from the document, measures 181×49 px, and has a 3 px visible cyan outline. Enter moves focus to the main heading.
- From the home heading, Tab reaches “Try it with sample data”; Enter opens the demo. The canvas is keyboard-operable and gives an announced numeric result.
- Visible mobile controls are at least 44×44 CSS px. Normal 390 px pages have no horizontal page overflow. At 200% root text sizing, content width remains equal to the effective viewport width.
- Reduced-motion emulation reduces animation and transition durations to 0.01 ms.
- `verify-url.sh` on the live `/demo` passed title, language, one-heading, main, alt/label, and console checks. Evidence: [`qa-evidence/verification-3/verify-url/verify.json`](qa-evidence/verification-3/verify-url/verify.json).

## Privacy, requests, and response policies

- A complete demo draw/reset/leave flow made no off-origin request.
- Before and after the flow, `localStorage`, `sessionStorage`, cookies, and IndexedDB databases were empty.
- Code and network review found no analytics, telemetry, third-party fonts/scripts, Azure credentials, or direct payment-provider integration.
- License verification sends only the supplied token to `api.sociobot.in`; the valid fixture stored only the expected token and verdict. The real invalid-token response uses `Cache-Control: no-store` and allows exactly `https://pen-display-drills.sociobot.in` through CORS.
- Live HTML includes HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and a restrictive CSP matching the app's resources and license endpoint. No CSP violation occurred.
- All crawled product and external HTTP links returned 200. `/missing-page` correctly returned 404 and rendered the designed recovery page.
- Sign-in/Entra checks are not applicable: the core product has no sign-in and requires no account.

## Rate limiting

The only server-side product call is the Sociobot license-verification endpoint. A fresh rapid sequential burst completed in 565 ms: requests 1–30 returned 200, and request 31 returned 429. The 429 response included `Retry-After: 4` and body `Too Many Requests! Wait for 4s`. Rate limiting therefore passes with an observed allowance of 30 requests.

## PWA, offline, and update behavior

- Manifest: standalone display, scoped versioned start URL, matching theme/background colors, 192×192 icon, 512×512 maskable icon, and 180×180 Apple icon.
- Fresh live service worker: activated controller with cache `pen-drills-fcc2e8b003d0`; generated JS and CSS were cached.
- Offline reload: after the first live visit, canonical `/demo` reloaded with HTTP 200 while network-disabled, retained the demo state/banner, and keyboard drawing scored `40/100` without errors.
- Update simulation against the exact candidate build changed cache `pen-drills-qa-update-1` to `pen-drills-qa-update-2`, displayed “An updated practice desk is ready,” activated via “Update now,” removed the old cache, and preserved the demo route and seed without errors.

## Live deployment identity and performance

Every public file generated in `dist/` was fetched from production and SHA-256 compared. HTML, generated JS/CSS, service worker, manifest, offline fallback, robots, sitemap, icons, and images are byte-for-byte matches.

Representative hashes:

- `index.html`: `a31b1cb69975e2591a416e88db00f414c8c0428e8d0cd49c6876ca9fa9afec58`
- `assets/index-DzImjTAh.js`: `9ea5774ad45b74717df673f305bde805e3950e776e84dc227679096e71f490ac`
- `assets/index-BV_XmEhR.css`: `433b7ab2e08f4f57a981553f6be07536eda40eeb258458f8b76f3c46b5d9d5fc`
- `sw.js`: `80ce25aa3ed88beef0f8d4615d7f9edbc57f0496a055d89605f70762329bb0cd`

Fresh live Lighthouse 13.0.1 mobile simulation:

- Performance 97; Accessibility 100; Best Practices 100; SEO 100.
- FCP 1.0 s; LCP 1.3 s; TBT 200 ms; CLS 0; Speed Index 1.9 s.
- Total transfer 74 KiB.

Evidence: [`qa-evidence/verification-3/lighthouse-live.json`](qa-evidence/verification-3/lighthouse-live.json).

## Scope notes and required next steps

- Library/CLI consumer packaging and backend concurrency/health/persistence checks are not applicable to this static PWA.
- AI critique is explicitly a non-goal; deterministic local geometry is appropriate.
- No product source was modified during verification.

Before release:

1. Restyle the license label and all status/error messages for at least 4.5:1 contrast on the drafting-paper background, and add a test that handles axe's gradient-background incomplete result or directly asserts contrast.
2. Keep the demo status/reset/start-for-real banner sticky at 390 px while the user scrolls through the drill, and test its viewport intersection after scrolling to the canvas.
3. Hash the artwork filenames or stop sending `immutable` for those stable URLs.
4. Rerun all manifest commands and repeat independent live verification after deployment.
