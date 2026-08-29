import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://pen-display-drills.sociobot.in';
const evidence = new URL('.', import.meta.url).pathname;
const expected = new Map([
  ['/', 'Pen Display Drills — five-minute drawing practice'],
  ['/demo', 'Demo — Pen Display Drills'],
  ['/practice', 'Practice — Pen Display Drills'],
  ['/privacy', 'Privacy — Pen Display Drills'],
  ['/terms', 'Terms — Pen Display Drills'],
  ['/missing-page', 'Page not found — Pen Display Drills'],
]);

await mkdir(evidence, { recursive: true });
const browser = await chromium.launch();
const report = { routes: [], directDemo: null, sentinelDemo: null, homeCopy: null, privacyCopy: null, offlineDemo: null };

for (const [path, title] of expected) {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const snapshot = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  }));
  report.routes.push({
    path,
    status: response?.status(),
    expectedTitle: title,
    ...snapshot,
    seriousOrCritical: axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id),
    errors,
  });
  if (path === '/privacy') {
    const text = (await page.locator('main').innerText()).toLowerCase();
    report.privacyCopy = {
      hasTestedVerificationSentence: text.includes('license verification sends the token you paste to sociobot.'),
      hasNoUntestedOnlySentence: !text.includes('sends only a supplied license token'),
    };
  }
  await context.close();
}

{
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const offOrigin = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin) offOrigin.push(request.url());
  });
  const response = await page.goto(`${origin}/?demo=1&license=demo-license-sentinel`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const resetScores = await page.locator('[data-sample-scores]').textContent();
  await page.screenshot({ path: `${evidence}/direct-demo-390.png`, fullPage: true });
  report.directDemo = {
    status: response?.status(),
    url: page.url(),
    offOrigin,
    resetScores,
    state: await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
      cookies: document.cookie,
      banner: document.querySelector('.demo-bar')?.textContent?.replace(/\s+/g, ' ').trim(),
      scores: document.querySelector('[data-sample-scores]')?.textContent,
    })),
  };
  await context.close();
}

{
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(() => {
    localStorage.setItem('sb_license:pen-display-drills', 'real-license-sentinel');
    localStorage.setItem('sb_license_verdict:pen-display-drills', JSON.stringify({ valid: true, checkedAt: 1 }));
  });
  const page = await context.newPage();
  const response = await page.goto(`${origin}/demo?license=demo-license-sentinel`, { waitUntil: 'networkidle' });
  report.sentinelDemo = {
    status: response?.status(),
    url: page.url(),
    state: await page.evaluate(() => ({
      token: localStorage.getItem('sb_license:pen-display-drills'),
      verdict: localStorage.getItem('sb_license_verdict:pen-display-drills'),
    })),
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  const response = await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('canvas').focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  report.offlineDemo = {
    status: response?.status(),
    url: page.url(),
    banner: await page.locator('.demo-bar').textContent(),
    score: await page.locator('[data-score]').textContent(),
  };
  await context.setOffline(false);
  await context.close();
}

{
  for (const [name, viewport] of [['home-cold-390.png', { width: 390, height: 844 }], ['home-cold-1440.png', { width: 1440, height: 900 }]]) {
    const context = await browser.newContext({ serviceWorkers: 'block', viewport });
    const page = await context.newPage();
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${evidence}/${name}` });
    const text = (await page.locator('body').innerText()).toLowerCase();
    report.homeCopy ??= {};
    report.homeCopy[name] = {
      hasStrokeFeedbackExample: text.includes('stroke feedback example'),
      hasTargetCaption: text.includes('the practice desk compares each stroke with a target.'),
      removedLabelsAbsent: !['tablet calibration desk', 'series 05', 'fig. 01', 'live system', 'a focused desk for hand control.'].some((label) => text.includes(label)),
      usesOneWorkSurfaceTerm: !text.includes('drill desk') && text.includes('practice desk'),
    };
    await context.close();
  }
}

await browser.close();
await writeFile(`${evidence}/cold-check.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

const badRoutes = report.routes.filter((route) => route.status !== (route.path === '/missing-page' ? 404 : 200)
  || route.title !== route.expectedTitle || route.lang !== 'en' || route.h1 !== 1 || route.main !== 1
  || route.canonical !== `${origin}${route.path}` || route.seriousOrCritical.length || route.errors.length);
const direct = report.directDemo;
const sentinel = report.sentinelDemo;
const badDirect = direct.status !== 200 || direct.url !== `${origin}/demo` || direct.offOrigin.length
  || JSON.stringify(direct.state.local) !== '[]' || JSON.stringify(direct.state.session) !== '[]' || direct.state.cookies !== ''
  || direct.state.scores !== '82/100 · 76/100' || direct.resetScores !== '82/100 · 76/100'
  || !direct.state.banner?.includes('Demo — sample data, nothing is saved');
const badSentinel = sentinel.status !== 200 || sentinel.url !== `${origin}/demo`
  || sentinel.state.token !== 'real-license-sentinel' || sentinel.state.verdict !== JSON.stringify({ valid: true, checkedAt: 1 });
const badCopy = Object.values(report.homeCopy).some((item) => !item.hasStrokeFeedbackExample || !item.hasTargetCaption || !item.removedLabelsAbsent || !item.usesOneWorkSurfaceTerm);
const badPrivacy = !report.privacyCopy.hasTestedVerificationSentence || !report.privacyCopy.hasNoUntestedOnlySentence;
const badOffline = report.offlineDemo.status !== 200 || report.offlineDemo.url !== `${origin}/demo`
  || !report.offlineDemo.banner?.includes('Demo') || !/^\d+\/100$/.test(report.offlineDemo.score ?? '');
process.exit(badRoutes.length || badDirect || badSentinel || badCopy || badPrivacy || badOffline ? 1 : 0);
