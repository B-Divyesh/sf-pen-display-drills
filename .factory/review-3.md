# Adversarial first-read review 3

## Verdict: FAIL

Reviewed 2026-08-29 UTC against <https://pen-display-drills.sociobot.in> and
the repository at `edc60740c73e34ea35ae5d8fb2ae0d60d52cd01d`.

The ordinary first screen is clear and the ordinary one-click demo works.
However, the documented direct demo entry can write to real license storage
while it displays “nothing is saved.” This violates the demo sandbox contract
and leaves one blocking finding. One minor copy-contract finding remains.

## First 30 seconds

Fresh Chromium contexts blocked service workers and opened the landing page
before navigation.

| Viewport | What it does | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Five-minute drills for steadier tablet lines, with geometric feedback. | New tablet artists who want targets instead of a blank canvas. | `Try it with sample data` | Pass |
| 1440×900 | Same. | Same. | `Try it with sample data` | Pass |

The exact copy that made this clear was “Practice steadier lines in five
minutes,” “For new tablet artists who want clear targets and feedback instead
of a blank canvas,” and “Try it with sample data.” The adjacent outcome says,
“Start on drill 3 with two sample scores.” At 390 px the facts end at y=774.5;
at 1440 px they end at y=826.1. No first-screen blocking finding applies.

One normal click opened `/demo` with the Box drill, “2 sample drills
complete,” visible scores `82/100 · 76/100`, and the persistent “Demo —
sample data, nothing is saved” banner. Reset restored that state. Start for
real opened an empty `/practice` desk. This ordinary flow made no off-origin
request and left local/session storage and cookies empty.

## Findings

### F-3-1 — BLOCKING — A documented direct demo URL saves a real license token

- **Quote/location:** The live `/demo` banner says “Demo — sample data,
  nothing is saved.” README and `.factory/demo.md` document
  `/?demo=1` as a demo entry. `.factory/claims.json` claim
  `demo-sandbox` says the demo “can be reset without saving data.”
- **Observed:** In a fresh live browser context, opening
  `https://pen-display-drills.sociobot.in/?demo=1&license=demo-license-sentinel`
  ended at `/demo`, kept the demo banner, and produced
  `localStorage['sb_license:pen-display-drills'] =
  'demo-license-sentinel'`. The browser made no off-origin request, so the
  token remained rather than being verified and removed. Source confirms the
  cause: `captureReturnedLicense()` writes the `license` parameter before
  it tests whether the route is demo, while `currentPath()` already treats
  `?demo=1` as `/demo`.
- **Why this misleads:** The demo is explicitly promised to be isolated.
  Anyone following the documented direct entry with an extra query parameter
  can leave data in the real license namespace while the banner says nothing
  is saved. The `@claim:demo-sandbox` test proves only the landing-click
  route, not the documented direct entry or the complete sandbox boundary.
- **Concrete fix:** Determine demo mode before processing returned-license
  parameters, and ignore or remove `license` on `/demo` and
  `/?demo=1` without any storage write or verification request. Add a
  clean-context `@claim:demo-sandbox` assertion for
  `/?demo=1&license=demo-license-sentinel`: it must canonicalize to
  `/demo`, preserve no real keys, make no Sociobot request, and leave any
  pre-existing real-license sentinel unchanged.

### F-3-2 — Minor — Landing chrome retains non-informative invented labels

- **Quote/location:** Landing eyebrow “Tablet calibration desk · Series 05,”
  section eyebrow “Live system,” and illustration caption “Fig. 01 A focused
  desk for hand control.”
- **Observed:** These labels do not name a visitor task or section in plain
  words. “Series 05” is invented product lore, “Live system” is generic
  jargon, and “A focused desk for hand control” does not tell a visitor what
  the pictured interface does. They conflict with the plain-words rule that
  decorative labels and lines without usable information are removed.
- **Why this loses clarity:** On a 30-second phone visit, this text competes
  with the actual job, target, feedback, and action without adding a decision
  or instruction.
- **Concrete fix:** Remove “Series 05” and “Fig. 01.” Replace “Live system”
  with “Stroke feedback example,” and either remove its caption or write
  “The practice desk compares each stroke with a target.”

## Copy audit

Counts treat a hyphenated word, numeral, and path as one word. No reviewed
sentence exceeds 22 words and no banned marketing adjective appears. F-3-2
records the non-sentence label/caption failure separately.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For new tablet artists who want clear targets and feedback instead of a blank canvas. | 15 | Pass |
| Start on drill 3 with two sample scores. | 8 | Listed: `demo-sandbox` |
| Works offline after your first visit. | 6 | Listed: `offline-reload` |
| Practice stays in this tab. | 5 | Listed: `local-practice` |
| Five core drills are free. | 5 | Listed: `five-core-free` |
| A focused desk for hand control. | 6 | F-3-2 |
| A target band shows the route. | 6 | Pass; interface description |
| Each stroke returns its average distance from that route. | 9 | Listed: `geometric-feedback` |
| Choose lines, ellipses, boxes, or perspective. | 6 | Pass |
| Use a pen, mouse, touch, or arrow keys. | 8 | Listed: `input-methods` |
| Adjust your next stroke using the distance score. | 8 | Pass |
| There are no brushes, layers, feeds, or automated critique. | 9 | Pass; scope boundary |
| The desk measures geometry and leaves the artistic choices to you. | 11 | Pass; scope boundary |
| Your strokes stay in memory and disappear when the tab closes. | 11 | Listed: `local-practice` |
| Only an optional paid license is stored on this device. | 10 | Listed: `license-storage` |
| The free practice desk is the complete current release. | 9 | Pass |
| It includes line control, ellipses, boxes, and one- and two-point perspective. | 11 | Pass |
| Read the practice terms. | 4 | Pass |
| Five-minute drawing practice with geometric feedback. | 6 | Pass |
| Console artwork generated for this product. | 6 | Pass; provenance |

### Landing headings, labels, and controls

| Copy | Words | Result |
| --- | ---: | --- |
| Tablet calibration desk · Series 05 | 5 | F-3-2: decorative/invented label |
| Practice steadier lines in five minutes | 6 | Pass: one h1, job-first |
| Try it with sample data | 5 | Pass: result-naming primary action |
| See where the line wandered | 5 | Pass: feedback section heading |
| Live system | 2 | F-3-2: vague section label |
| How each drill works | 4 | Pass |
| Procedure | 1 | Pass: steps label |
| Pick a target / Draw over the guide / Read the gauge | 3 / 4 / 3 | Pass: useful verb headings |
| Boundaries | 1 | Pass with its boundary heading |
| A practice desk, not a drawing app | 7 | Pass |
| Current release | 2 | Pass |
| Five focused drills, ready to use | 6 | Pass |
| Open a clean practice desk | 5 | Pass: result-naming action |
| Fig. 01 A focused desk for hand control. | 8 | F-3-2 |
| Demo / Drills / Privacy / Terms | 1 each | Pass: navigation labels |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Practice tablet lines and perspective with five-minute feedback drills. | 9 | Pass |
| Pen Display Drills is an offline-capable browser practice desk for early digital artists. | 13 | Pass |
| It overlays geometric targets for straight lines, ellipses, boxes, and one-point or two-point perspective. | 14 | Pass |
| Every stroke receives an average deviation reading. | 7 | Listed: `geometric-feedback` |
| Practice strokes and scores stay in the current tab. | 9 | Listed: `local-practice` |
| The five core drills are free and do not require an account. | 12 | Listed: `five-core-free`, `account-free` |
| Open `/demo`, `/?demo=1`, or visit the production demo URL. | 9 | Pass |
| It starts on the box drill with two visible sample scores. | 11 | Listed: `demo-sandbox` |
| Resetting the demo returns to that state. | 7 | Listed: `demo-sandbox` |
| The demo does not save or use your practice data. | 10 | F-3-1 on the documented direct entry |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Use a pen, mouse, touch, or the canvas keyboard controls. | 10 | Listed: `input-methods` |
| `npm test` runs unit tests and Playwright browser tests. | 9 | Pass |
| Claim tests cover offline reload, local practice, feedback, demo reset, and input methods. | 13 | Pass |
| They also cover free drills, license restore, license storage, license privacy, the timer, and account-free use. | 15 | Pass |
| `npm run build` runs TypeScript checks and writes the static deployment to `dist/`. | 13 | Pass |
| The first visit installs a service worker. | 7 | Listed: `offline-reload` |
| A visited drill can then reload offline. | 7 | Listed: `offline-reload` |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` supplies the SPA fallback and security headers for Azure Static Web Apps. | 13 | Pass |
| The factory owns DNS and production deployment. | 7 | Pass |
| Drawings, pressure information, and practice scores are not uploaded or persisted. | 11 | Listed: `local-practice` |
| Restore an existing Space Pack license from the practice desk. | 10 | Listed: `license-restore` |
| If you do, this browser stores the token and its last check result. | 13 | Listed: `license-storage` |
| After a valid check, it waits a day before checking again. | 11 | Listed: `license-storage` |
| Read the in-product privacy page and terms. | 7 | Pass |
| Licensed under the MIT License. | 5 | Pass |

README headings (`Try the demo`, `Run locally`, `Test and build`,
`Deploy`, `Privacy`, and `Project notes`) name their sections. Buttons
and links use named outcomes; no generic Submit/Continue action was found.

## Claims and sandbox verification

After a fresh `npm ci` (159 packages, 0 vulnerabilities), every exact
command listed in `.factory/claims.json` passed:

| Claim ID | Result |
| --- | --- |
| `demo-sandbox` | Pass for normal landing-click flow; insufficient for F-3-1 |
| `geometric-feedback` | Pass |
| `five-core-free` | Pass |
| `local-practice` | Pass |
| `offline-reload` | Pass |
| `input-methods` | Pass |
| `license-restore` | Pass |
| `license-storage` | Pass |
| `license-verification-privacy` | Pass |
| `five-minute-session` | Pass |
| `account-free` | Pass |

`npm test` passed (6 Vitest tests and 31 Playwright tests). `npm run
typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev`
also passed. The build wrote `dist/`; gzip output was 9.82 kB JavaScript and
5.54 kB CSS.

The normal live demo request log contained only same-origin requests, and its
storage was empty before and after drawing, Reset demo, and Start for real.
The query-parameter case in F-3-1 is a separate sandbox escape. No additional
claim-like landing or README statement lacked a claims entry; the one failed
promise is already listed as `demo-sandbox`.

## History, structure, and scope

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, handoff, and
verification record was read. The current live site and source actually fix
each prior finding:

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | Demo visibly shows `82/100 · 76/100`; Reset restores both. |
| F-1-2 | README claim inventory is split into short sentences. |
| F-1-3 | README license copy is split into short direct sentences. |
| F-1-4 | `license-storage` exists and its tagged test checks exact keys and daily refresh. |
| F-1-5 | Visitor-facing copy consistently says “demo.” |
| F-2-1 | Privacy uses the narrow tested Sociobot-token statement and `license-verification-privacy` exists. |
| F-2-2 | Live landing and README consistently use “practice desk.” |

F-3-1 is a new direct-entry sandbox regression/coverage gap, not a re-opened
earlier ID.

Fresh live checks confirmed route-specific title, description, canonical URL,
OG/Twitter metadata, favicon, one h1, one main, and an accessible heading
outline on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, and the
designed `/missing-page` 404. All normal routes returned 200; the recovery
page returned HTTP 404. All normal internal and external links returned 200;
mail links were explicit. The skip link on the intentional 404 naturally
resolves to that same 404 document but works as an in-document anchor.

Back navigation restored the destination h1 focus. Axe found zero serious or
critical WCAG A/AA violations on all six routes at 390 px. Normal routes
logged no console or page errors; Chromium correctly reports the intentional
404 response as a failed main-document resource. The shared header/footer,
skip link, Privacy/Terms links, responsive controls, original drafting-console
art, and mid-century instrument-panel visual system are present. The identity
is distinct rather than a generic SaaS template.

The brief does not imply an AI critique, import/export, or sync feature.
Deterministic local geometric feedback is the appropriate core workflow. No
runtime AI call, provider key, tracker, third-party font, or payment-provider
integration was found.

## What would make this perfect

Make every documented demo URL reject returned-license parameters before any
storage access, and test that exact boundary from a clean context. Remove or
replace the three decorative landing labels with plain task information. Then
rerun every manifest command, the direct demo URL check, and this complete
cold review. A PASS requires zero remaining findings.
