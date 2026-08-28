# Independent product verification

## Verdict: FAIL

- Candidate: `cf85a9a8dfcf7362e4c65f0e6d6371daea92b755`
- Branch at start: `main`, clean and equal to `origin/main`
- Live URL: <https://pen-display-drills.sociobot.in>
- Verified: 2026-08-28 UTC
- Artifact: PWA/offline static site

The candidate is not releasable. The mandatory cold first-screen gate fails on desktop, the advertised paid checkout is a live 404, and a multi-stroke drill can be declared complete after one stroke. The claim suite passes as written, but it does not prove several material parts of its own claims and several public claims are not listed.

## Release-blocking findings

### High — The cold desktop first screen has no visible first action

At a fresh 1440×900 viewport, the page says what it does (“Practice steadier lines in five minutes”) and who it is for (“For new tablet artists…”). The intended first action, “Try it with sample data,” starts at `y=927.8` and ends at `y=975.8`, below the 900 px viewport. The three plain facts are also below the fold. A cold visitor therefore cannot see what to click first on the first screen. This is an explicit acceptance failure even though the action is visible at 390×844 and opens the seeded demo in one click once reached.

Evidence: `qa-evidence/live-cold-desktop.png`; automated bounds in `qa-evidence/browser-qa.mjs`.

First-read transcript:

- What it does: five-minute practice for steadier tablet lines with target feedback.
- For whom: new tablet artists who want guidance instead of a blank canvas.
- What to click first: intended action is “Try it with sample data,” but it is not visible in the cold desktop viewport.

### High — The advertised $6 purchase cannot be made

The production “Buy the themed pack — $6” link points to:

`https://api.sociobot.in/api/v1/products/pen-display-drills/checkout`

Fresh GET and link-crawl checks both returned HTTP 404 with no redirect. Every other crawled HTTP link returned 200. The free product still works, but the advertised paid transaction is dead. The mocked `@claim:paid-pack` test cannot detect this deployment failure.

### High — Drill completion does not enforce the drill

On the demo’s Box drill, one stroke produces “1 of 7 target strokes drawn,” but immediately enables “Finish drill.” Clicking it produces “Drill complete” and increments the completion counter. This also works with a `0/100` stroke. The same logic enables completion after the first stroke for the 8-stroke and 9-stroke perspective drills.

The scorer measures only the distance of submitted points to the nearest target. It does not require length, target coverage, or distinct target segments. Repeating one easy edge can therefore satisfy the displayed count. Box also renders eight target segments while its progress model caps at seven. This weakens the core feedback loop, not only a secondary state.

Normal-path control evidence is positive: independently tracing all visible targets produced `100/100` and a completion summary for line, ellipse, box, one-point, and two-point drills. See `qa-evidence/core-flow.mjs`.

### High — The claims contract is incomplete despite green tests

All seven claim commands pass after installation, but important observable promises are either under-tested or absent from `.factory/claims.json`:

- `paid-pack` mocks only a valid verification response and counts three enabled buttons. It does not test the checkout, `$6`, one-time purchase wording, or the three named drills. The real checkout is 404.
- `input-methods` exercises browser mouse/pointer input and keyboard, not explicit pen and touch events. Independent QA did confirm synthetic `pointerType=pen`, `pointerType=touch`, mouse fallback, and keyboard all return scores, but the declared claim test itself does not prove the whole claim.
- `local-practice` inspects only `localStorage` plus outbound requests. The public privacy wording also promises no saved drawings, pressure, or scores and says closing the tab removes them.
- Public but unlisted claims include “five-minute” practice, compatibility with “any drawing tablet,” account-free use, and invalid/expired/revoked license behavior.

The attached claims contract makes an unlisted claim or an inadequately proven listed claim a release failure.

## Other findings

### Medium — Multiple mobile actions are smaller than 44×44 CSS px

At 390 px, measured examples include “Reset demo” at 83×34, “Start for real” at 77×22, the nav “Demo” link at 40×44, footer links at about 25 px tall, and the inline purchase-terms link at 91×15. Axe does not flag target-size issues in this configuration, but these fail the supplied touch-target baseline.

### Medium — Hashed production assets are not cached immutably

The versioned JS and CSS responses both use `Cache-Control: public, must-revalidate, max-age=30`. The performance contract calls for long-lived immutable caching for hashed assets. This does not hurt the measured first load, but it causes unnecessary revalidation and misses the required caching policy.

### Low — The keyboard “next drill” shortcut stops at the paywall

The help says `N` selects the next drill. On the fifth free drill, pressing `N` attempts the locked first paid drill and leaves the user on Two-point perspective. It should skip locked drills or explain the boundary.

### Low — Invalid license return performs duplicate verification

Opening `/practice?license=returned-invalid` generated two simultaneous verification requests before settling locked and removing the token. The query was stripped correctly and no paid drill opened, but duplicate calls waste rate-limit capacity.

### Low — Unknown paths are soft 404s

`/missing-page` renders a designed not-found page and correct title, but the HTTP response is 200 rather than 404.

## Claims-first gate

The required claim commands were attempted before broader inspection. The literal pre-install attempts could not start because dependencies were absent (`vitest: not found`, exit 127). After the required clean `npm ci`, every exact command from `.factory/claims.json` passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — 4 unit + 1 selected browser test |
| `geometric-feedback` | `npm test -- --grep @claim:geometric-feedback` | PASS — 4 unit + 1 selected browser test |
| `five-core-free` | `npm test -- --grep @claim:five-core-free` | PASS — 4 unit + 1 selected browser test |
| `local-practice` | `npm test -- --grep @claim:local-practice` | PASS — 4 unit + 1 selected browser test |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 4 unit + 1 selected browser test |
| `input-methods` | `npm test -- --grep @claim:input-methods` | PASS — 4 unit + 1 selected browser test |
| `paid-pack` | `npm test -- --grep @claim:paid-pack` | PASS — 4 unit + 1 selected browser test |

## Build and repository gates

- `npm ci`: PASS; 59 packages installed, 0 vulnerabilities.
- `npm test`: PASS; 4 Vitest unit tests and all 15 Playwright tests.
- `npm run build`: PASS; includes `tsc --noEmit`, Vite production build, and service-worker asset injection.
- Lint: no lint script or separate lint configuration exists.
- Output: `dist/` generated, 316 KB total.
- Bundle sizes: JS 26.66 KB raw / 9.54 KB gzip; CSS 20.12 KB raw / 5.48 KB gzip; hero WebP 52.49 KB; no downloaded fonts.
- `npm audit`: PASS; 0 vulnerabilities.

## End-to-end and boundary evidence

- Seeded demo: PASS. One click reaches `/demo`, shows a persistent “Demo — sample data, nothing is saved” banner, Box, and two completed sample drills.
- Demo reset/start-over: PASS. Reset restores Box, two sample completions, and an empty score.
- Empty and boundary input: PASS for a click without movement; it produces no score and keeps Finish disabled.
- Normal core flows: PASS for straight line, ellipse, box, one-point, and two-point targets; accurate traces scored 100 and produced summaries.
- Undo/reset/repeat: PASS. Undo clears the only score and disables Finish; repeat restores the desk empty.
- Invalid license: PASS. A blank field uses native required validation; an invalid live token reports “not active” and removes the token.
- Network error recovery: PASS with a controlled failed request followed by a valid response; the second submission activates the pack.
- Input devices: PASS independently for keyboard, mouse fallback events, and Pointer Events marked as pen and touch.
- Keyboard boundary: FAIL as noted above for `N` at the final free drill.

## Live deployment identity

The live deployment matches the candidate’s clean production output. Every public file in `dist/` was fetched and SHA-256 compared. HTML, JS, CSS, service worker, manifest, images, icons, offline files, robots, and sitemap were byte-for-byte matches. `staticwebapp.config.json` correctly returned 404 because it is deployment configuration rather than a public asset.

Representative hashes:

- `assets/index-BjJyTzhP.js`: `e0020b2f068b8219…`, match.
- `assets/index-aNSxVFo_.css`: `77dcb1ebe419626b…`, match.
- `index.html`: `13414891f82a61d7…`, match.
- `sw.js`: `ebfbbcf8a413db9c…`, match.

## Accessibility and responsive checks

- Live `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the not-found route each have `lang=en`, one `h1`, one `main`, route-specific titles, and no console/page errors.
- Playwright axe 4.10.2 found zero serious/critical WCAG A/AA issues on all six desktop routes and on home, demo, and privacy at 390 px.
- Keyboard focus is visible: the sample action has a 3 px cyan focus outline. Route changes move focus to the new `h1`, and the summary moves focus to “Try the next drill.”
- No keyboard trap was found. The initial page focuses the `h1`, so the first forward Tab skips header/skip-link controls and moves to the sample action; earlier controls remain reachable with Shift+Tab.
- 390×844 pages had no horizontal overflow. A 200% root text-size smoke test also had no content-width overflow.
- Reduced-motion emulation reduced all measured animation and transition durations to 0.01 ms.
- Mobile touch-target failures are listed above.
- `/opt/fleet/lib/verify-url.sh` passed the live demo query entry: HTTP 200, title, `lang`, one `h1`, main landmark, alt text, labels, and console checks.

## Privacy, requests, and response policies

- A complete demo draw/finish/reset flow made no off-origin requests.
- Before and after that demo flow, `localStorage`, `sessionStorage`, cookies, and IndexedDB databases were empty.
- Code and network review found no analytics, telemetry, third-party fonts, third-party scripts, Azure keys, or raw payment-provider integration.
- License verification sends a query token only to `api.sociobot.in`; its response uses `Cache-Control: no-store` and permits the product origin through CORS.
- Live document responses include CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial. No CSP violations appeared.
- All product routes and deployed static files returned 200; the only dead crawled link was checkout.

## Rate limiting

The public license verification endpoint was tested with a 120-request concurrent burst. Results were 30 HTTP 200 and 90 HTTP 429 in 1.004 seconds. The 429 responses included `Retry-After: 4` and body `Too Many Requests! Wait for 4s`. Because requests were concurrent, launch ordinal is not a meaningful “first” request; the observed burst allowance was 30 successful requests before/among throttling.

## PWA, offline, and update behavior

- Manifest: PASS; standalone display, scoped start URL, matching theme/background colors, 192×192 and 512×512 icons, with the 512 icon marked maskable.
- Fresh live service worker: PASS; controller active with cache `pen-drills-06aefa24401b`.
- Live offline reload: PASS. After first load of `/?demo=1`, the canonical `/demo` reloaded offline with HTTP 200 from cache, retained the demo banner, and scored a keyboard stroke (`40/100`) without console errors.
- Update behavior: PASS in an isolated local origin serving the exact built product. Changing only the served service-worker cache version displayed “An updated practice desk is ready”; “Update now” activated the new worker, replaced cache `qa-update-1` with `qa-update-2`, reloaded `/demo`, and retained the demo UI without errors. Harness: `qa-evidence/sw-update.mjs`.

## Performance

Live Lighthouse 13.4.1, mobile preset:

- Performance 98
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.0 s; LCP 1.3 s; TBT 160 ms; CLS 0; Speed Index 1.0 s
- Total transfer 74 KiB

All numerical loading and bundle budgets pass. The hashed-asset cache policy finding remains.

## Evidence inventory

- `qa-evidence/live-cold-desktop.png`
- `qa-evidence/live-mobile-home.png`
- `qa-evidence/live-mobile-demo.png`
- `qa-evidence/live-mobile-privacy.png`
- `qa-evidence/browser-qa.mjs`
- `qa-evidence/core-flow.mjs`
- `qa-evidence/sw-update.mjs`
- `qa-evidence/verify-url/verify.json` and screenshots

No product source code was changed during verification.
