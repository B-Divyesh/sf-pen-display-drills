# Adversarial first-read review 2

## Verdict: FAIL

Reviewed 2026-08-28 UTC against <https://pen-display-drills.sociobot.in> and
commit `f980ec1990609c74f52e98dcc594d2fb4c734727`.

The first-screen path, one-click demo, real-data isolation, offline reload,
claims that are listed, routing, and accessibility checks pass. This review
fails because a privacy-relevant sentence makes a promise that has no matching
claim entry and because the same work surface is called both a “drill desk” and
a “practice desk”.

## First 30 seconds

Fresh Chromium contexts were used with service workers blocked. Both views made
the product, audience, and first action clear before scrolling.

| Viewport | What it does | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 390 x 844 | Five-minute drills make tablet lines steadier using targets and feedback. | New tablet artists who need guidance instead of a blank canvas. | `Try it with sample data` | Pass. CTA: 579–625 px; all three facts end at 775 px. |
| 1440 x 900 | Same. | Same. | `Try it with sample data` | Pass. CTA: 671–717 px; all three facts end at 826 px. |

The exact copy that establishes this is “Practice steadier lines in five
minutes,” “For new tablet artists who want clear targets and feedback instead
of a blank canvas.” and “Try it with sample data.” No first-screen blocking
finding applies.

## Findings

### F-2-1 — Medium — Privacy page makes an unlisted outbound-data promise

- **Quote/location:** `/privacy`, under `What leaves your device`: “License
  verification sends only a supplied license token to Sociobot when needed.”
- **Observed:** `.factory/claims.json` has no claim for the payload or
  destination of license verification. `license-restore` proves that a mocked
  valid token unlocks the pack; `license-storage` proves local keys and the
  daily cache window. Neither test observes every request in the restore flow
  or asserts the disclosed outbound data policy.
- **Why this matters:** This is a privacy statement a visitor may rely on
  before entering a license. A successful restore is not evidence that no
  other application data is sent.
- **Concrete fix:** Add a `license-verification-privacy` claim and tagged
  clean-context browser test. Intercept the full restore flow and assert that
  the only application request to `api.sociobot.in` is the documented verify
  request containing the pasted token, with no drawing, pressure, or score
  data. Rewrite the sentence to the narrower, testable “License verification
  sends the token you paste to Sociobot.” If that test is not added, remove the
  sentence.

### F-2-2 — Minor — The work surface has two visitor-facing names

- **Quote/location:** Landing preview action: “Open a clean practice desk.”
  Landing boundary heading: “A drill desk, not a drawing app.” Landing paid
  copy: “The free drill desk is the complete current release.” README calls it
  a “browser practice desk.”
- **Observed:** `.factory/copy-audit.md` defines the main work surface as
  `practice desk`, yet the live landing and README alternate with `drill desk`.
- **Why this matters:** A cold visitor has to infer whether a drill desk is a
  different mode from the practice desk. This violates the documented
  one-term-per-concept rule.
- **Concrete fix:** Use `practice desk` everywhere for the work surface. For
  example: “A practice desk, not a drawing app” and “The free practice desk is
  the complete current release.” Update the terminology table accordingly.

## Copy audit

Counts treat hyphenated words and numerals as one word. Labels, navigation,
headings, and controls are listed after the sentence tables because they are
not sentences. No reviewed sentence exceeds 22 words. No banned marketing word
appears. F-2-2 is the one terminology inconsistency.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For new tablet artists who want clear targets and feedback instead of a blank canvas. | 15 | Pass |
| Start on drill 3 with two sample scores. | 8 | Pass |
| Works offline after your first visit. | 6 | Listed: `offline-reload` |
| Practice stays in this tab. | 5 | Listed: `local-practice` |
| Five core drills are free. | 5 | Listed: `five-core-free` |
| A focused desk for hand control. | 6 | Pass |
| A target band shows the route. | 6 | Pass |
| Each stroke returns its average distance from that route. | 9 | Listed: `geometric-feedback` |
| Choose lines, ellipses, boxes, or perspective. | 6 | Pass |
| Use a pen, mouse, touch, or arrow keys. | 9 | Listed: `input-methods` |
| Adjust your next stroke using the distance score. | 8 | Pass |
| There are no brushes, layers, feeds, or automated critique. | 9 | Pass; scope boundary |
| The desk measures geometry and leaves the artistic choices to you. | 11 | Pass; scope boundary |
| Your strokes stay in memory and disappear when the tab closes. | 11 | Listed: `local-practice` |
| Only an optional paid license is stored on this device. | 10 | Listed: `license-storage` |
| The free drill desk is the complete current release. | 10 | F-2-2 |
| It includes line control, ellipses, boxes, and one- and two-point perspective. | 11 | Pass |
| Read the practice terms. | 4 | Pass; result-naming action |
| Five-minute drawing practice with geometric feedback. | 6 | Pass |
| Console artwork generated for this product. | 6 | Pass; provenance also recorded in design document |

### Landing labels, headings, and controls

| Copy | Words | Result |
| --- | ---: | --- |
| Pen Display Drills | 3 | Wordmark; pass |
| Demo / Drills / Privacy / Terms | 1 each | Navigation; pass |
| Tablet calibration desk · Series 05 | 5 | Decorative instrument label; pass |
| Practice steadier lines in five minutes | 6 | One h1; pass |
| Try it with sample data | 5 | Result-naming primary action; pass |
| See where the line wandered | 6 | h2; pass |
| Live system / Procedure / Boundaries / Current release | 2 / 1 / 1 / 2 | Section labels; pass |
| Average deviation / On target | 2 / 2 | Readout labels; pass |
| How each drill works | 4 | h2; pass |
| Pick a target / Draw over the guide / Read the gauge | 3 / 4 / 3 | h3 verbs; pass |
| A drill desk, not a drawing app | 7 | h2; F-2-2 |
| Five focused drills, ready to use | 6 | h2; pass |
| Open a clean practice desk | 5 | Result-naming action; F-2-2 terminology |
| Example score of 84 out of 100 | 7 | Accessible example label; pass |
| Built by Param Factory / Version 1.0 · build 2026.08 | 4 / 4 | Footer labels; pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Practice tablet lines and perspective with five-minute feedback drills. | 9 | Pass |
| Pen Display Drills is an offline-capable browser practice desk for early digital artists. | 13 | F-2-2 terminology |
| It overlays geometric targets for straight lines, ellipses, boxes, and one-point or two-point perspective. | 14 | Pass |
| Every stroke receives an average deviation reading. | 7 | Listed: `geometric-feedback` |
| Practice strokes and scores stay in the current tab. | 9 | Listed: `local-practice` |
| The five core drills are free and do not require an account. | 12 | Listed: `five-core-free`, `account-free` |
| Open `/demo`, `/?demo=1`, or visit the production demo URL. | 9 | Pass |
| It starts on the box drill with two visible sample scores. | 11 | Listed: `demo-sandbox` |
| Resetting the demo returns to that state. | 7 | Listed: `demo-sandbox` |
| The demo does not save or use your practice data. | 10 | Listed: `demo-sandbox`, `local-practice` |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Use a pen, mouse, touch, or the canvas keyboard controls. | 10 | Listed: `input-methods` |
| `npm test` runs unit tests and Playwright browser tests. | 9 | Pass |
| Claim tests cover offline reload, local practice, feedback, demo reset, and input methods. | 13 | Pass |
| They also cover free drills, license restore, license storage, the timer, and account-free use. | 14 | Pass |
| `npm run build` runs TypeScript checks and writes the static deployment to `dist/`. | 13 | Pass |
| The first visit installs a service worker. | 7 | Covered by `offline-reload` |
| A visited drill can then reload offline. | 7 | Listed: `offline-reload` |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` supplies the SPA fallback and security headers for Azure Static Web Apps. | 13 | Pass |
| The factory owns DNS and production deployment. | 7 | Pass |
| Drawings, pressure information, and practice scores are not uploaded or persisted. | 11 | Listed: `local-practice` |
| Restore an existing Space Pack license from the practice desk. | 10 | Listed: `license-restore`; F-2-2 terminology |
| If you do, this browser stores the token and its last check result. | 13 | Listed: `license-storage` |
| After a valid check, it waits a day before checking again. | 11 | Listed: `license-storage` |
| Read the in-product privacy page and terms. | 7 | Pass |
| Licensed under the MIT License. | 5 | Pass |

README headings (`Try the demo`, `Run locally`, `Test and build`, `Deploy`,
`Privacy`, and `Project notes`) make sense out of context. Its action labels
are specific. No button uses a generic verb.

## Demo, sandbox, and claims verification

- One click from the live hero opened `/demo`. Its first screen already showed
  the Box drill, `2 sample drills complete`, and `Sample scores 82/100 ·
  76/100`.
- The persistent banner read “Demo — sample data, nothing is saved” and exposed
  both `Reset demo` and `Start for real`. At 390 px it remained visible while
  drawing.
- Reset restored Box, both scores, and the two-complete count. `Start for real`
  opened an unbannered `/practice` desk with `No drills complete yet`.
- A pre-existing real-license sentinel remained byte-for-byte unchanged before
  and after demo/reset/leave. Demo created no practice or demo storage keys and
  made no off-origin request.
- In a fresh browser, `/?demo=1` canonicalized to `/demo`, gained service
  worker control, then reloaded offline with HTTP 200 and accepted a keyboard
  stroke (`40/100`). No console error occurred.

A clean clone at `/tmp/pen-display-review-2-clean-7TGshA` completed `npm ci`.
All exact `.factory/claims.json` commands passed independently:

| Claim id | Result |
| --- | --- |
| `demo-sandbox` | Pass |
| `geometric-feedback` | Pass |
| `five-core-free` | Pass |
| `local-practice` | Pass |
| `offline-reload` | Pass |
| `input-methods` | Pass |
| `license-restore` | Pass |
| `license-storage` | Pass |
| `five-minute-session` | Pass |
| `account-free` | Pass |

`npm test` also passed: 6 Vitest tests and 29 Chromium tests. `npm run build`
passed and wrote `dist/`; initial gzip sizes were 9.83 kB JavaScript and 5.54
kB CSS. These passes do not resolve F-2-1 because the affected live privacy
sentence has no corresponding claim entry or assertion.

## Earlier findings and history

Every earlier report in the repository was read: `review-1.md`, `polish-1.md`,
and the prior handoff. All five prior findings are actually fixed on the live
site and in the source, rather than merely marked fixed:

| Earlier id | Confirmed result |
| --- | --- |
| F-1-1 | `/demo` visibly shows `82/100 · 76/100`; Reset restores them; the tagged claim asserts them. |
| F-1-2 | README claim-test inventory is split into 13- and 14-word sentences. |
| F-1-3 | README license text is now three direct sentences of 10, 13, and 11 words. |
| F-1-4 | `license-storage` is listed and passes a tagged clean-context test for exact keys and daily refresh. |
| F-1-5 | README says `Try the demo` and `practice data`; the visitor-facing flow consistently says demo. |

F-2-1 and F-2-2 are new findings, not regressions of those ids.

## Structure, accessibility, and scope

- Direct live routes `/`, `/demo`, `/practice`, `/privacy`, and `/terms`
  returned 200. `/missing-page` returned a designed 404 with a recovery link.
  Every route had one `main`, one h1, route-specific title/description/canonical
  metadata, OG/Twitter data, and the SVG favicon. The Back button returned to
  `/` and focused its h1.
- Crawled same-origin header, footer, skip, demo, drills, privacy, and terms
  links all returned 200. The Param Factory link is visibly external; mail links
  are explicit on the privacy and terms pages.
- Live Axe checks found zero serious or critical WCAG 2 A/AA violations on all
  six routes. Fresh normal routes logged no console errors. The expected direct
  HTTP 404 is reported by Chromium as a failed 404 resource, not a page script
  error.
- The live mid-century drafting-console visual system is distinct: dark enamel
  panel, cream paper, amber gauges, ruled geometry, and an original product
  illustration. It is not a generic SaaS hero/card template.
- The brief does not imply AI, syncing, or export. This short, local,
  no-account skill drill appropriately uses deterministic geometric feedback;
  adding an AI feature would be decorative. No provider key or AI runtime call
  was found.

## What would make this perfect

Add and pass the narrow license-verification privacy claim test (or remove the
unlisted promise), then choose `practice desk` as the only name for the work
surface. Repeat this entire cold live review after those repairs.
