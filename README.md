# Pen Display Drills

Practice tablet lines and perspective with five-minute feedback drills.

Pen Display Drills is an offline-capable browser practice desk for early digital artists. It overlays geometric targets for straight lines, ellipses, boxes, and one-point or two-point perspective. Every stroke receives an average deviation reading. Practice strokes and scores stay in the current tab.

The five core drills are free and do not require an account.

## Try the sandbox

Open `/demo`, `/?demo=1`, or visit <https://pen-display-drills.sociobot.in/demo>. It starts on the box drill with two sample scores. Resetting the demo returns to that state. The demo does not read or write a practice storage namespace.

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

`npm test` runs unit tests and Playwright browser tests. The claim tests cover offline reload, local-only practice, geometric feedback, demo reset, input methods, free drills, legacy-license restore, the five-minute timer, and account-free use.

`npm run build` runs TypeScript checks and writes the static deployment to `dist/`. The first visit installs a service worker. A visited drill can then reload offline.

## Deploy

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` supplies the SPA fallback and security headers for Azure Static Web Apps. The factory owns DNS and production deployment.

## Privacy

Drawings, pressure information, and practice scores are not uploaded or persisted. Existing Space Pack licenses can be restored from the practice desk; verification stores a supplied token and its daily verification result only when a license is supplied. Read the in-product [privacy page](https://pen-display-drills.sociobot.in/privacy) and [terms](https://pen-display-drills.sociobot.in/terms).

## Project notes

- Product scope: [.factory/brief.json](.factory/brief.json)
- Visual system and artwork provenance: [.factory/design.md](.factory/design.md)
- Verifiable claims: [.factory/claims.json](.factory/claims.json)
- Demo contract: [.factory/demo.md](.factory/demo.md)
- Build handoff: [.factory/handoff.md](.factory/handoff.md)

Licensed under the [MIT License](LICENSE).
