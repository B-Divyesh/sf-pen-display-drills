# Independent product verification 2

## Verdict: FAIL

- Candidate: `b2a95934a610a70946c39e340bb9adb7c3019d1f`
- Branch at start: `main`, clean and equal to `origin/main`
- Live URL: <https://pen-display-drills.sociobot.in>
- Verified: 2026-08-28 UTC
- Artifact: offline-first static PWA

The repaired product works well and the live deployment is byte-for-byte the candidate. All eight mandatory claim commands, the full test suite, lint, type checks, build, offline/update flows, accessibility scans, and performance budgets pass. The release still fails the attached acceptance contract because one public absolute claim is not listed or provable, and the retained legacy paid pack has no required purchase-restore control.

## Release-blocking findings

### High — “Any drawing tablet” is an unlisted, unprovable claim

The live home description says:

> Practice straight lines, ellipses, boxes, and perspective with immediate geometric feedback on any drawing tablet.

This appears in the served `<meta name="description">`, `index.html`, and the client route metadata. `.factory/claims.json` has no compatibility claim at that location. `input-methods` promises and tests browser pen, mouse, touch, and keyboard events; synthetic Pointer Events cannot prove the universal “any drawing tablet” wording across tablet hardware, mappings, drivers, browsers, and operating systems.

The claims acceptance contract explicitly makes an unlisted claim release-blocking. Remove “any,” narrow it to the tested Pointer Events behavior, or add an honestly bounded claim and suitable compatibility evidence.

### Medium — Existing paid-pack licenses cannot be restored in the UI

The live `/practice` route renders three disabled “Space pack” drills and retains Sociobot verification/storage code for returned legacy tokens; its mocked valid-token integration test passes. It contains zero inputs and no “Have a license? Paste it” action. The only supported restore route is the undocumented `?license=<token>` return URL mechanism.

This misses the attached paid-unlock requirement to provide an explicit restore-purchase field. It also leaves the locked controls without an available next step. Either add the required restore flow or remove the legacy paid surface and license behavior completely until billing is available.

The checkout endpoint itself still returns `404 {"error":"enabled factory product","status":404}`. The candidate no longer advertises a checkout or price, so that external deployment limitation is recorded as context rather than a separate candidate defect.

## Mandatory first-read gate: PASS

Fresh Chromium context, service workers blocked, 1440×900:

- What it does: “Practice steadier lines in five minutes.”
- For whom: “For new tablet artists who want clear targets and feedback instead of a blank canvas.”
- What to click first: “Try it with sample data.” The adjacent copy says it starts on drill 3 with two sample scores.
- The action bottom was `716.95 px`; all three plain facts ended at `826.09 px`, inside the `900 px` viewport.
- One click opened `/demo`, Box, two sample completions, and the persistent “Demo — sample data, nothing is saved” banner.

The same action and facts are visible at 390×844. Evidence: `qa-evidence/verification-2-live-mobile-home.png` and `qa-evidence/verification-2-live-mobile-demo.png`.

## Claims-first gate

After the required clean `npm ci`, every exact command in `.factory/claims.json` passed before broader product QA:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `geometric-feedback` | `npm test -- --grep @claim:geometric-feedback` | PASS |
| `five-core-free` | `npm test -- --grep @claim:five-core-free` | PASS |
| `local-practice` | `npm test -- --grep @claim:local-practice` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `input-methods` | `npm test -- --grep @claim:input-methods` | PASS |
| `five-minute-session` | `npm test -- --grep @claim:five-minute-session` | PASS |
| `account-free` | `npm test -- --grep @claim:account-free` | PASS |

Each invocation also ran all six unit tests before its selected browser test. The unlisted claim above means the green manifest is necessary but not sufficient for acceptance.

## Clean repository gates

- `npm ci`: PASS — 159 packages installed, 0 vulnerabilities.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 6 Vitest tests and 22 Playwright tests.
- `npm run build`: PASS — exact production build wrote `dist/`.
- `npm audit --omit=dev`: PASS — 0 vulnerabilities.
- Output: JS 26,341 bytes raw / 9.46 KiB gzip; CSS 20,222 bytes raw / 5.49 KiB gzip; no font download; hero WebP 52,488 bytes.

## Independent end-to-end evidence

### Normal cases

Accurate live traces independently completed every free drill:

| Drill | Last score | Coverage | Completion |
| --- | ---: | --- | --- |
| Straight line | 100/100 | 1 of 1 | PASS |
| Ellipse | 100/100 | 45 of 45 required guide sections | PASS |
| Box | 100/100 | 8 of 8 | PASS |
| One-point perspective | 100/100 | 8 of 8 | PASS |
| Two-point perspective | 100/100 | 9 of 9 | PASS |

Each finish action produced a drill-specific summary. Mouse, synthetic pen, synthetic touch, and keyboard input each produced a numeric score. The timer changed from `05:00` to `04:58` after 2.2 seconds.

### Boundaries, invalid input, and recovery

- A down/up event with no movement left the score at `—` and Finish disabled.
- A far-off stroke returned `0/100`, `182.1 px away`, no coverage, and Finish disabled.
- Eight accurate repeats over the same Box edge stayed at `1 of 8`; Finish remained disabled.
- Undo returned the desk to no score/no coverage; Reset restored the seeded demo; “Start for real” opened an empty Straight line session with no demo banner or transferred result.
- Demo reset restored Box and exactly two sample completions.
- `R` reset keyboard input; `N` advanced from Box to One-point perspective and skips the locked boundary in the repository regression.
- A fresh invalid live license made one 200 verification request, stripped the query, removed the token, kept all five core drills enabled, and kept all pack drills locked.
- No console or page errors occurred on the five normal routes or through these flows.

## Demo isolation, privacy, and outbound requests

- A complete cold demo/draw/reset/leave flow made no off-origin request.
- Before and after the flow, localStorage keys, sessionStorage keys, cookies, and IndexedDB databases were all empty.
- Reload cleared the practice stroke and score.
- Source and live-request review found no analytics, tracking, external fonts/scripts, Azure credentials, or direct payment-provider integration.
- License verification is the only product API path. It sends the supplied token to `api.sociobot.in`, returns `Cache-Control: no-store`, and allows the exact product origin via CORS.
- Rate limiting PASS: a rapid sequential burst returned 30 HTTP 200 responses; request 31 returned HTTP 429 with `Retry-After: 4` and body `Too Many Requests! Wait for 4s`.
- Sign-in and Entra authority checks are not applicable: the five free drills require no sign-in and the product renders no authentication UI.

## PWA and offline behavior

- Manifest fields, standalone display, themed splash colors, versioned start URL, 192px icon, 512px maskable icon, and 180px Apple icon are present and valid.
- A fresh live worker controlled canonical `/demo` using cache `pen-drills-970f7ea4815e`; the HTML, generated JS, and generated CSS were present in Cache Storage.
- After network disable, `/demo` reloaded with HTTP 200, retained its title/banner, and keyboard drawing returned `40/100` with no errors.
- Forced update simulation changed the worker/cache version, displayed “An updated practice desk is ready,” activated through “Update now,” removed the old cache, and preserved `/demo` plus its banner.

## Accessibility and responsive QA

- Playwright axe 4.10.2: zero serious/critical WCAG A/AA findings on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the designed 404 at desktop; also zero on all five real routes at 390 px.
- Every checked route has `lang=en`, one `h1`, one `main`, route-specific title, ordered headings, and no missing image alt text. The live 404 returns HTTP 404 and the designed page.
- Keyboard focus is visible (`3px` cyan outline). The skip link is visible when focused. SPA route changes focus the new `h1`; the drawing area exposes role, name, state instructions, and keyboard controls.
- At 390×844, every visible link/button measured at least 44×44 CSS px and document width stayed at 390 px. A 200% text-size check produced no page-width overflow.
- Reduced-motion emulation reduced animation/transition durations to `0.01 ms`.
- `/opt/fleet/lib/verify-url.sh https://pen-display-drills.sociobot.in/?demo=1 ...`: PASS — HTTP 200, title, `lang`, one `h1`, main, alt/label checks, and zero console errors.
- The 404 navigation itself produces Chromium's expected failed-resource console message for its HTTP 404 status; normal routes do not.

## Deployment identity, policies, links, and performance

Every public file generated in `dist/` was fetched from production and SHA-256 compared. HTML, JS, CSS, worker, manifest, offline fallback, robots, sitemap, icons, and images all matched. `staticwebapp.config.json` is deployment configuration and was correctly excluded from public-file comparison.

Representative hashes:

- `index.html`: `f929958a0974c471e0036008a1b2937fce1b428bfbf36a858402800fe9f9ba5d`
- `assets/index-ClQ_syS8.js`: `562433094f7b47b0cf65c73bdbfa935d83102e333ce8a234effd568109466242`
- `assets/index-BV_XmEhR.css`: `433b7ab2e08f4f57a981553f6be07536eda40eeb258458f8b76f3c46b5d9d5fc`
- `sw.js`: `b58f5b4ac6988f206576e535e8c4740e145f719c05c89cd922d0d332aab32d35`

Live policies include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and a restrictive CSP matching the app and Sociobot verification endpoint. Hashed JS/CSS use `public, max-age=31536000, immutable`; HTML and `sw.js` use 30-second revalidation. All crawled HTTP links returned 200; `mailto:` and in-page anchors were excluded.

Fresh throttled mobile Lighthouse on the live home page:

- Performance 100; Accessibility 100; Best Practices 100; SEO 100.
- FCP 0.9 s; LCP 1.2 s; TBT 10 ms; CLS 0; Speed Index 0.9 s.
- 74 KiB total transfer, including 52.6 KiB image, 9.6 KiB script, and 5.8 KiB stylesheet; zero fonts and zero third-party requests.

Local demo Lighthouse was also 100/100/100/100 with LCP 1.2 s, TBT 40 ms, CLS 0, and 22 KiB transfer.

## Scope notes

- Library/CLI consumer packaging: not applicable to this browser PWA.
- Backend concurrency, persistence, and health/build identity: not applicable to the static product. The only external product endpoint was covered by invalid-token, CORS, no-store, and burst-rate-limit checks.
- AI leverage: no AI feature is needed for deterministic geometric scoring; omitting it is appropriate.
- Product code was not changed during verification. Only this report, handoff, and three fresh screenshots were added.

## Required next steps

1. Remove or honestly narrow “any drawing tablet,” then list/test the resulting claim if it remains a product promise.
2. Add the required existing-license paste/restore path, or remove the legacy paid-pack surface and license behavior until a real billing product exists.
3. Rerun every manifest command and the full independent live checks after deployment.
