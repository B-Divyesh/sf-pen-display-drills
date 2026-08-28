# Pen Display Drills

Practice tablet lines and perspective with five-minute feedback drills.

Pen Display Drills is an offline-capable browser practice desk for early digital artists. It overlays geometric targets for straight lines, ellipses, boxes, and one-point or two-point perspective. Every stroke receives an average deviation reading. Practice strokes and scores stay in the current tab.

The five core drills are free and do not require an account.

## Try the demo

Open `/demo`, `/?demo=1`, or visit <https://pen-display-drills.sociobot.in/demo>. It starts on the box drill with two visible sample scores. Resetting the demo returns to that state. The demo does not save or use your practice data.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use a pen, mouse, touch, or the canvas keyboard controls.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests and Playwright browser tests. Claim tests cover offline reload, local practice, feedback, demo reset, and input methods. They also cover free drills, license restore, license storage, license privacy, the timer, and account-free use.

`npm run build` runs TypeScript checks and writes the static deployment to `dist/`. The first visit installs a service worker. A visited drill can then reload offline.

## Deploy

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` supplies the SPA fallback and security headers for Azure Static Web Apps. The factory owns DNS and production deployment.

## Privacy

Drawings, pressure information, and practice scores are not uploaded or persisted. Restore an existing Space Pack license from the practice desk. If you do, this browser stores the token and its last check result. After a valid check, it waits a day before checking again. Read the in-product [privacy page](https://pen-display-drills.sociobot.in/privacy) and [terms](https://pen-display-drills.sociobot.in/terms).

## Project notes

- Product scope: [.factory/brief.json](.factory/brief.json)
- Visual system and artwork provenance: [.factory/design.md](.factory/design.md)
- Verifiable claims: [.factory/claims.json](.factory/claims.json)
- Demo contract: [.factory/demo.md](.factory/demo.md)
- Build handoff: [.factory/handoff.md](.factory/handoff.md)

Licensed under the [MIT License](LICENSE).
