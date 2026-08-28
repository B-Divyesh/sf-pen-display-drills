# Adversarial first-read review 1

## Verdict: FAIL

Reviewed 2026-08-28 UTC against <https://pen-display-drills.sociobot.in> and commit `092ef84aecec69cf8b0078684465fac27e9f24ea`.

The first-read, routing, offline, privacy-isolation, accessibility-smoke, and visual-identity checks are positive. The release fails because its one-click demo and README promise two sample *scores* that are not shown, while the claim test only checks a completion count. The README also has two over-limit sentences and an unlisted storage claim.

## First 30 seconds

Fresh Chromium contexts with service workers blocked:

| Viewport | What it does | For whom | First action | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Five-minute practice to make tablet lines steadier, using targets and feedback. | New tablet artists who need guidance rather than a blank canvas. | `Try it with sample data` | PASS: action bottom at 625 px; all three facts end at 775 px. |
| 1440×900 | Same. | Same. | `Try it with sample data` | PASS: action bottom at 717 px; all three facts end at 826 px. |

The wording that made this clear was the headline, “Practice steadier lines in five minutes,” the audience sentence, “For new tablet artists who want clear targets and feedback instead of a blank canvas,” and the adjacent action note, “Start on drill 3 with two sample scores.” No first-screen blocking finding applies.

One click opened `/demo`, showing the Box drill, `2 sample drills complete`, the `Demo — sample data, nothing is saved` banner, Reset demo, and Start for real. The last three controls remain sticky on a 390 px screen while the canvas is in view. The missing visible scores are recorded as F-1-1.

## Findings

### F-1-1 — BLOCKING — Demo claim says scores exist, but the live demo never shows them

- **Quote/location:** Hero action note and README: “Start on drill 3 with two sample scores.” `/demo` and README also say it starts with “two sample scores.” `.factory/claims.json` claim `demo-sandbox`: “The demo starts with two sample scores and can be reset without saving data.”
- **Observed:** The first demo screen says only `2 sample drills complete`. It contains neither `82` nor `76`, nor any score history. `src/main.ts` creates `const sampleScores = isDemo ? [82, 76] : [];` and resets it to those values, but never renders it. The exact claim test at `tests/product.spec.ts:6` asserts only `2 sample drills complete` and Box, so it cannot prove the stated claim.
- **Why this misleads:** A first-time visitor is told they will see example feedback, but lands on a blank target with a completion counter. This is weaker than the promised, realistic sample data and does not visibly demonstrate the product’s feedback loop.
- **Concrete fix:** Render a persistent sample-history readout in demo mode, for example `Sample scores: 82/100 · 76/100`, ideally beside the completion count, and seed the matching completed sample strokes if the history represents prior work. Make Reset demo restore those displayed values. Change `@claim:demo-sandbox` to assert both scores are visible before and after reset, as well as the isolated storage condition.

### F-1-2 — Minor — README claim-test sentence exceeds the 22-word cap

- **Quote/location:** README, “The claim tests cover offline reload, local-only practice, geometric feedback, demo reset, input methods, free drills, legacy-license restore, the five-minute timer, and account-free use.”
- **Observed:** 24 words.
- **Why this loses clarity:** The reader has to hold a nine-item inventory in one sentence.
- **Concrete fix:** “Claim tests cover offline reload, local practice, feedback, demo reset, and input methods. They also cover free drills, license restore, the timer, and account-free use.”

### F-1-3 — Minor — README license-storage sentence exceeds the 22-word cap

- **Quote/location:** README Privacy section, “Existing Space Pack licenses can be restored from the practice desk; verification stores a supplied token and its daily verification result only when a license is supplied.”
- **Observed:** 27 words.
- **Why this loses clarity:** It combines restore instructions, a storage policy, and a condition in one sentence.
- **Concrete fix:** “Restore an existing Space Pack license from the practice desk. If you do, this browser stores the token and its last check result.”

### F-1-4 — Medium — README makes an unlisted, untested license-storage claim

- **Quote/location:** The second clause of the README sentence in F-1-3: “verification stores a supplied token and its daily verification result only when a license is supplied.”
- **Observed:** `.factory/claims.json` has `license-restore`, but it promises only restoration. Its tagged test checks the token after a mocked valid restore; it does not assert the stored verification result, that no license-related storage exists before a license is supplied, or the stated daily condition.
- **Why this matters:** This is a privacy-relevant statement a visitor can rely on. A passing restore test is not evidence for the narrower persistence promise.
- **Concrete fix:** Add a `license-storage` entry to `.factory/claims.json` and a tagged browser test that, from a clean context, verifies no license keys exist before user input, verifies exactly the disclosed token/check-result keys after a mocked restore, and verifies the refresh interval is at most one day. Keep the rewritten plain-language sentence from F-1-3 only if that test passes; otherwise remove the detailed storage promise.

### F-1-5 — Minor — README calls the demo a “sandbox,” then changes the term again

- **Quote/location:** README heading `Try the sandbox`; README sentence “The demo does not read or write a practice storage namespace.” Elsewhere the product consistently calls this flow `demo`.
- **Observed:** “Sandbox” and “storage namespace” are technical terms, and `sandbox` is an inconsistent name for the same visitor-facing flow.
- **Why this loses clarity:** A visitor following the landing’s Demo link should not have to infer that “sandbox” is the same thing.
- **Concrete fix:** Rename the heading to `Try the demo` and write: “The demo does not save or use your practice data.” Keep implementation namespace details in `.factory/demo.md`, not visitor-facing README copy.

## Copy audit

Counts treat hyphenated words and numerals as one word. All landing sentences are at or below 22 words. The only over-limit sentences are F-1-2 and F-1-3.

### Landing page sentences

| Copy | Words |
| --- | ---: |
| Practice steadier lines in five minutes | 6 |
| For new tablet artists who want clear targets and feedback instead of a blank canvas. | 15 |
| Start on drill 3 with two sample scores. | 8 |
| Works offline after your first visit. | 6 |
| Practice stays in this tab. | 5 |
| Five core drills are free. | 5 |
| A focused desk for hand control. | 6 |
| A target band shows the route. | 6 |
| Each stroke returns its average distance from that route. | 9 |
| Choose lines, ellipses, boxes, or perspective. | 6 |
| Use a pen, mouse, touch, or arrow keys. | 8 |
| Adjust your next stroke using the distance score. | 8 |
| There are no brushes, layers, feeds, or automated critique. | 9 |
| The desk measures geometry and leaves the artistic choices to you. | 11 |
| Your strokes stay in memory and disappear when the tab closes. | 11 |
| Only an optional paid license is stored on this device. | 10 |
| The free drill desk is the complete current release. | 9 |
| It includes line control, ellipses, boxes, and one- and two-point perspective. | 11 |
| Five-minute drawing practice with geometric feedback. | 6 |
| Console artwork generated for this product. | 6 |

Landing headings and action labels were also checked: `Practice steadier lines in five minutes`, `See where the line wandered`, `How each drill works`, `Pick a target`, `Draw over the guide`, `Read the gauge`, `A drill desk, not a drawing app`, and `Five focused drills, ready to use` make sense in context. `Try it with sample data`, `Open a clean practice desk`, and `Read the practice terms` are result-naming verbs. No banned marketing adjective was found.

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Practice tablet lines and perspective with five-minute feedback drills. | 9 | Pass |
| Pen Display Drills is an offline-capable browser practice desk for early digital artists. | 13 | Pass |
| It overlays geometric targets for straight lines, ellipses, boxes, and one-point or two-point perspective. | 14 | Pass |
| Every stroke receives an average deviation reading. | 7 | Pass |
| Practice strokes and scores stay in the current tab. | 9 | Pass |
| The five core drills are free and do not require an account. | 12 | Pass |
| Open `/demo`, `/?demo=1`, or visit the production demo URL. | 9 | Pass |
| It starts on the box drill with two sample scores. | 10 | F-1-1 |
| Resetting the demo returns to that state. | 7 | F-1-1 |
| The demo does not read or write a practice storage namespace. | 11 | F-1-5 |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Use a pen, mouse, touch, or the canvas keyboard controls. | 10 | Pass |
| `npm test` runs unit tests and Playwright browser tests. | 9 | Pass |
| The claim tests cover offline reload, local-only practice, geometric feedback, demo reset, input methods, free drills, legacy-license restore, the five-minute timer, and account-free use. | 24 | F-1-2 |
| `npm run build` runs TypeScript checks and writes the static deployment to `dist/`. | 13 | Pass |
| The first visit installs a service worker. | 7 | Pass |
| A visited drill can then reload offline. | 7 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` supplies the SPA fallback and security headers for Azure Static Web Apps. | 13 | Pass |
| The factory owns DNS and production deployment. | 7 | Pass |
| Drawings, pressure information, and practice scores are not uploaded or persisted. | 11 | Pass |
| Existing Space Pack licenses can be restored from the practice desk; verification stores a supplied token and its daily verification result only when a license is supplied. | 27 | F-1-3, F-1-4 |
| Read the in-product privacy page and terms. | 7 | Pass |
| Licensed under the MIT License. | 5 | Pass |

README headings are readable except `Try the sandbox` (F-1-5). `Run locally`, `Test and build`, `Deploy`, `Privacy`, and `Project notes` are understandable in their documentation context.

## Claims and sandbox verification

An isolated clean clone was created under `/tmp/pen-display-review-GhgrWi`; `npm ci` installed 159 packages with 0 vulnerabilities. Every exact command from `.factory/claims.json` exited 0:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS command; inadequate for the stated score claim (F-1-1) |
| `geometric-feedback` | PASS |
| `five-core-free` | PASS |
| `local-practice` | PASS |
| `offline-reload` | PASS |
| `input-methods` | PASS |
| `license-restore` | PASS command; does not cover the README storage claim (F-1-4) |
| `five-minute-session` | PASS |
| `account-free` | PASS |

Fresh live-browser checks additionally confirmed:

- Demo navigation made no off-origin requests. Before and after a draw/reset/leave flow, localStorage, sessionStorage, cookies, and IndexedDB were empty. Start for real opened `/practice` with no banner and `No drills complete yet`.
- A fresh service-worker-controlled `/?demo=1` visit canonicalized to `/demo`; after network interception/offline mode, reload returned 200 with the demo banner and no console error.
- The live landing and README map their other observable promises to manifest entries. F-1-1 is a listed-but-false claim; F-1-4 is an unlisted detailed storage promise.

## Structure, history, and scope

- Every product route has one `h1` and one `main`; route titles, descriptions, canonical URLs, OG/Twitter metadata, favicon, and Apple touch icon are present. `/missing-page` is a designed HTTP 404 with a return action.
- Direct deep links for `/`, `/demo`, `/practice`, `/privacy`, and `/terms` returned 200. Browser Back returned from `/demo` to `/` and focused the new `h1`; the live region updated with the route title. Crawled same-origin navigation links returned 200; the external Param Factory link is explicit.
- Header/footer are consistent and include Demo, Drills, Privacy, Terms, the product one-liner, Param Factory, and build id. The mid-century drafting-console system is visibly product-specific, not a generic SaaS template.
- No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The prior handoff and verification reports marked the demo claim pass, but the live check above confirms their asserted “two sample scores” condition is not actually fixed or demonstrated; F-1-1 supersedes that conclusion.
- No missed AI, import/export, or sync feature is required by the brief. Local deterministic geometric feedback is the appropriate core workflow; no AI runtime feature or embedded provider key was found.

## What would make this perfect

Show and test the two actual seeded scores in the demo, make README copy shorter and consistently call the flow a demo, and add a narrow verifiable license-storage claim. Then rerun all claim commands from a clean clone and repeat the cold live demo check.
