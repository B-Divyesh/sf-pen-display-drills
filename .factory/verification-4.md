# Independent product verification 4

## Verdict: PASS

- Candidate: `82956d8369e951bd3bd0e467beb0b17dbe2207d7`
- Branch at start: `main`, clean and equal to `origin/main`
- Live URL: <https://pen-display-drills.sociobot.in>
- Verified: 2026-08-28 UTC
- Artifact: offline-first static PWA

The candidate is releasable. The smallest useful product works end to end, every declared claim test passes, the live deployment is byte-for-byte the candidate build, and the earlier license-contrast, mobile-demo, and immutable-image defects are repaired in production. No critical, high, medium, or low product defects were found.

## Mandatory first-read gate: PASS

A cold browser with service workers blocked was opened before product navigation.

- What it does: “Practice steadier lines in five minutes,” with immediate geometric distance feedback.
- For whom: “For new tablet artists who want clear targets and feedback instead of a blank canvas.”
- What to click first: “Try it with sample data.” Adjacent text says, “Start on drill 3 with two sample scores.”
- One click opened `/demo`, already showing the Box drill and two sample completions.
- Desktop 1440×900: headline, audience sentence, action, and three facts all fit in the first viewport; the action ends at y=716.95 and the facts at y=826.09.
- Mobile 390×844: the same content fits; the action ends at y=625.05 and the facts at y=774.52.

Evidence: `qa-evidence/verification-4/live-cold-desktop.png` and `qa-evidence/verification-4/first-screen-bounds.jsonl`.

## Claims-first gate: PASS

`.factory/claims.json` exists and contains nine claims. Each ID appears in exactly one `@claim:<id>` browser test. A literal pre-install probe could not launch Vitest because a clean clone has no `node_modules`; after the required lockfile install with `npm ci`, every exact manifest command ran independently and exited 0.

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

The landing page, practice desk, legal pages, manifest, README, and copy audit were cross-checked. Public promises map to these tests. A separate live pen event carrying pressure also produced no off-origin request or stored state, closing the privacy edge beyond the local mouse-based claim flow.

Evidence: `qa-evidence/verification-4/claim-results.txt` and the nine adjacent claim logs.

## Clean repository gates: PASS

- `npm ci`: PASS — 159 packages installed; 0 vulnerabilities reported.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS — 6 Vitest tests and 28 Chromium Playwright tests.
- `npm run build`: PASS — TypeScript check, Vite production build, and service-worker injection completed; `dist/` exists.
- `npm audit --omit=dev`: PASS — 0 vulnerabilities.
- Bundle: JS 26,853 bytes raw / 9,627 gzip; CSS 20,221 bytes raw / 5,494 gzip; hero WebP 52,488 bytes; no downloaded fonts. All are well below the contract budgets.

## End-to-end and recovery coverage: PASS

Fresh live browser sessions exercised the real core workflow.

| Drill | Live score | Required coverage | Result |
| --- | ---: | --- | --- |
| Straight line | 100/100 | 1 of 1 | PASS |
| Ellipse | 100/100 | 45 of 45 | PASS |
| Box | 100/100 | 8 of 8 | PASS |
| One-point perspective | 100/100 | 8 of 8 | PASS |
| Two-point perspective | 100/100 | 9 of 9 | PASS |

Each Finish action produced the correct drill summary. Additional cases passed:

- Demo seed and Reset demo restore Box, two sample completions, and an empty current score.
- Start for real opens an empty `/practice` session with no banner or transferred data.
- A click without movement creates no score and cannot finish.
- A far-off stroke returned `0/100`, `270.2 px away`, and could not finish.
- Undo returned the score to `—` and kept Finish disabled.
- Box and perspective completion require distinct target coverage; one repeated/easy segment cannot finish.
- Pen, touch, mouse fallback, and keyboard input each return a numeric score.
- `N` at the fifth free drill wraps to the first free drill instead of selecting a locked drill.
- Empty license input uses required validation. Invalid input gives an actionable message. A simulated network failure says “Reconnect and try again,” and a retry enables all three existing-license drills.
- Invalid-license label and recovery copy measure 9.95:1 contrast on the drafting surface.
- The five free drills load without account or sign-in UI. Entra validation is not applicable.

Evidence: `qa-evidence/verification-4/live-core-flow.json`, `live-independent-qa.json`, and `license-recovery-contrast.json`.

## Accessibility and responsive behavior: PASS

- Axe 4.10.2 reported zero serious/critical WCAG A/AA violations on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the designed 404 at desktop; all five real routes also passed at 390 px.
- Each route has `lang=en`, one `h1`, one `main`, an ordered heading structure, and a route-specific title.
- The skip link is 181×49 px with a visible 3 px cyan outline and bypasses the header. The sample action has the same focus treatment and opens the demo with Enter.
- The drawing canvas is keyboard operable and announces numeric feedback through the live region. No keyboard trap was found.
- Every visible mobile link, button, input, and summary is at least 44×44 CSS px.
- At 390×844, no tested route has horizontal overflow. At 200% root text size, content remains within the 390 px viewport.
- With reduced motion, measured animation and transition durations are 0.01 ms.
- After scrolling the mobile demo canvas into view, the banner stays sticky at y=0..83.58 with Reset demo and Start for real visible.
- `/opt/fleet/lib/verify-url.sh` passed the live demo: HTTP 200, correct title/language, one h1, main landmark, alt text and labels, and no console errors.

Normal routes produced no console or page errors. The intentional `/missing-page` response is a real HTTP 404 and Chromium reports that expected main-document network status; the designed recovery page itself has no script error.

## Privacy, outbound requests, and policies: PASS

- The complete live demo draw/reset/leave flow made only same-origin requests.
- After a live synthetic pen stroke with nonzero pressure, localStorage, sessionStorage, cookies, and IndexedDB were empty; reload cleared the score.
- Source and network review found no analytics, telemetry, third-party fonts/scripts, Azure credentials, or direct payment-provider integration.
- License verification sends only the user-supplied token to `api.sociobot.in`, returns `Cache-Control: no-store`, and allows the exact production origin through CORS.
- Live pages send HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, camera/microphone/geolocation denial, and a restrictive CSP matching actual resources and the license endpoint.
- Generated JS, CSS, and content-addressed WebP assets use `public, max-age=31536000, immutable`; HTML, manifest, and service worker revalidate after 30 seconds.
- All public HTTP links return 200. The only non-200 route is the intentional designed 404.

## Rate limiting: PASS

The only server-side product call is Sociobot license verification. In a fresh rapid sequential burst, requests 1–30 returned 200 and request 31 returned 429. Requests 31–35 included `Retry-After` values of 2–3 seconds. This satisfies the required throttling behavior.

Evidence: `qa-evidence/verification-4/rate-limit-final.txt`.

## PWA and offline behavior: PASS

- The manifest has a scoped, versioned start URL, standalone display, matching theme/background colors, 192×192 and 512×512 icons, and a maskable 512 icon. The Apple icon is 180×180.
- A fresh live `/?demo=1` visit canonicalized to `/demo`, activated `/sw.js`, and created cache `pen-drills-2c2547acae49`.
- With the browser then offline, `/demo` reloaded as HTTP 200, retained the demo banner, and keyboard drawing returned `40/100` without errors.
- An isolated update simulation showed the in-app update notice, activated the new worker, replaced cache `pen-drills-qa-update-1` with `pen-drills-qa-update-2`, reloaded `/demo`, and retained the demo state without errors.

Evidence: `qa-evidence/verification-4/live-offline.json` and `sw-update.json`.

## Live deployment identity and performance: PASS

All 15 deployable files in `dist/` were fetched from production and SHA-256 compared. HTML, JS, CSS, service worker, manifest, offline fallback, robots, sitemap, images, and icons all match byte-for-byte. `staticwebapp.config.json` is deployment configuration and is not served as a public file.

Representative hashes:

- `index.html`: `e534f529a3a63eb3c6d87e8c7ba325c96563d17199db8dfafcf0e524c6d110b0`
- `assets/index-DXCeaTyu.js`: `97e7926289f5465db6183349dfcaa2c1d497363228d32e2d9ee127246c5049ad`
- `assets/index-bZfqsgNQ.css`: `a8b86667d330f23e9a96d69634ab8c7bbcfc91bb6f1ab7cb47983cc5014b9902`
- `sw.js`: `2e49f45b0dc4ae0d036a7305dc92d68621e877feffdf1c04f3cf1a1041799204`

Fresh Lighthouse 13.4.1 mobile simulation:

- Performance 97; Accessibility 100; Best Practices 100; SEO 100.
- FCP 1.1 s; LCP 1.4 s; TBT 190 ms; CLS 0; Speed Index 1.2 s.
- Total transferred size 74 KiB.

Evidence: `qa-evidence/verification-4/deployment-hashes.txt` and `lighthouse-live.json`.

## Defects by severity and scope notes

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Informational external state: the Sociobot checkout URL for this slug still returns 404. The candidate does not link it, state a price, or promise that new purchases are available. Instead it accurately calls the five free drills the complete current release and offers only an existing-license restore path. The researched smallest useful product is fully available without payment. Enabling a new paid sale remains factory billing work outside this repository and is not a candidate release blocker.

Library/CLI packaging and backend concurrency, health, and persistence checks are not applicable to this static PWA. AI critique is explicitly a non-goal; deterministic local geometry is the appropriate implementation.

No product source code was changed during verification.
