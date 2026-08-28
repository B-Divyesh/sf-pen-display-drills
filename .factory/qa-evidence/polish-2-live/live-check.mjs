import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const base = 'https://pen-display-drills.sociobot.in';
const out = '.factory/qa-evidence/polish-2-live';
const browser = await chromium.launch();
const report = { routes: {}, axe: {}, requests: {}, firstScreen: {}, demo: {}, offline: {}, consoleErrors: [] };

const coldPage = async (viewport = { width: 1280, height: 900 }, serviceWorkers = 'block') => {
  const context = await browser.newContext({ viewport, serviceWorkers });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.consoleErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('404')) report.consoleErrors.push(message.text());
  });
  return { context, page };
};

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const { context, page } = await coldPage(viewport);
    await page.goto(base, { waitUntil: 'networkidle' });
    const action = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
    const facts = await page.locator('.plain-facts').boundingBox();
    assert(action && action.y + action.height <= viewport.height);
    assert(facts && facts.y + facts.height <= viewport.height);
    const key = `${viewport.width}x${viewport.height}`;
    report.firstScreen[key] = { actionBottom: action.y + action.height, factsBottom: facts.y + facts.height };
    await page.screenshot({ path: `${out}/home-cold-${viewport.width}.png` });
    await page.getByRole('link', { name: 'Try it with sample data' }).click();
    assert.equal(new URL(page.url()).pathname, '/demo');
    await context.close();
  }

  {
    const { context, page } = await coldPage({ width: 390, height: 844 });
    const outside = [];
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== base) outside.push(request.url());
    });
    await page.addInitScript(() => {
      localStorage.setItem('sb_license:pen-display-drills', 'live-real-sentinel');
      localStorage.setItem('sb_license_verdict:pen-display-drills', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    });
    await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/demo');
    assert.equal(await page.locator('[data-sample-scores]').textContent(), '82/100 · 76/100');
    assert.equal(await page.getByText('2 sample drills complete').count(), 1);
    await page.getByRole('button', { name: 'Reset demo' }).click();
    assert.equal(await page.locator('[data-sample-scores]').textContent(), '82/100 · 76/100');
    assert.equal(await page.evaluate(() => localStorage.getItem('sb_license:pen-display-drills')), 'live-real-sentinel');
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:') || key.startsWith('practice:'))), []);
    await page.locator('canvas').scrollIntoViewIfNeeded();
    const banner = await page.locator('.demo-bar').boundingBox();
    assert(banner && banner.y >= 0 && banner.y + banner.height <= 844);
    await page.screenshot({ path: `${out}/demo-sticky-mobile.png` });
    await page.getByRole('link', { name: 'Start for real' }).click();
    assert.equal(new URL(page.url()).pathname, '/practice');
    assert.equal(await page.locator('.demo-bar').count(), 0);
    assert.equal(await page.getByText('No drills complete yet').count(), 1);
    assert.deepEqual(outside, []);
    report.demo = { canonicalPath: '/demo', scores: [82, 76], outsideRequests: outside, sentinelPreserved: true, stickyBanner: true };
    await context.close();
  }

  {
    const { context, page } = await coldPage({ width: 1280, height: 900 });
    const outside = [];
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== base) outside.push({ url: request.url(), method: request.method(), body: request.postData() });
    });
    await page.route('https://api.sociobot.in/**', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
    await page.goto(`${base}/practice`, { waitUntil: 'networkidle' });
    const canvas = page.locator('canvas');
    await canvas.focus();
    await page.keyboard.press('Space');
    for (let index = 0; index < 8; index += 1) await page.keyboard.press('Shift+ArrowRight');
    await page.keyboard.press('Space');
    assert.match(await page.locator('[data-score]').textContent(), /\d+\/100/);
    await page.getByText('Have a license? Paste it', { exact: true }).click();
    await page.getByLabel('License token').fill('live-privacy-token');
    await page.getByRole('button', { name: 'Restore license' }).click();
    await page.getByText('License verified. The space pack is now active.').waitFor();
    assert.equal(outside.length, 1);
    const sent = new URL(outside[0].url);
    assert.equal(sent.origin, 'https://api.sociobot.in');
    assert.equal(sent.pathname, '/api/v1/products/pen-display-drills/verify');
    assert.deepEqual([...sent.searchParams.entries()], [['license', 'live-privacy-token']]);
    assert.equal(outside[0].method, 'GET');
    assert.equal(outside[0].body, null);
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).sort()), ['sb_license:pen-display-drills', 'sb_license_verdict:pen-display-drills']);
    report.requests.license = outside;
    await context.close();
  }

  const routeExpectations = {
    '/': ['Pen Display Drills — five-minute drawing practice', 'https://pen-display-drills.sociobot.in/'],
    '/demo': ['Demo — Pen Display Drills', `${base}/demo`],
    '/practice': ['Practice — Pen Display Drills', `${base}/practice`],
    '/privacy': ['Privacy — Pen Display Drills', `${base}/privacy`],
    '/terms': ['Terms — Pen Display Drills', `${base}/terms`],
    '/missing-page': ['Page not found — Pen Display Drills', `${base}/missing-page`],
  };
  for (const [path, [title, canonical]] of Object.entries(routeExpectations)) {
    const { context, page } = await coldPage();
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), path === '/missing-page' ? 404 : 200);
    assert.equal(await page.title(), title);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonical);
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('h1').count(), 1);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
    assert.deepEqual(serious, []);
    report.routes[path] = { status: response?.status(), title, canonical };
    report.axe[path] = serious;
    if (path === '/') {
      const body = await page.locator('body').textContent() ?? '';
      assert(body.includes('A practice desk, not a drawing app'));
      assert(body.includes('The free practice desk is the complete current release.'));
      assert(!body.includes('drill desk'));
    }
    if (path === '/privacy') {
      await page.screenshot({ path: `${out}/privacy-cold-desktop.png`, fullPage: true });
      assert((await page.locator('body').textContent() ?? '').includes('License verification sends the token you paste to Sociobot.'));
      assert.equal(await page.getByRole('link', { name: 'privacy@sociobot.in' }).getAttribute('href'), 'mailto:privacy@sociobot.in');
    }
    if (path === '/terms') assert.equal(await page.getByRole('link', { name: 'support@sociobot.in' }).getAttribute('href'), 'mailto:support@sociobot.in');
    await context.close();
  }

  {
    const { context, page } = await coldPage();
    await page.goto(base);
    await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
    await page.goBack();
    assert.equal(await page.getByRole('heading', { name: 'Practice steadier lines in five minutes' }).evaluate((node) => node === document.activeElement), true);
    await context.close();
  }

  {
    const { context, page } = await coldPage({ width: 390, height: 844 }, 'allow');
    await page.goto(`${base}/?demo=1`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await context.setOffline(true);
    const response = await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(response?.status(), 200);
    assert.equal(await page.getByText('Demo — sample data, nothing is saved').count(), 1);
    assert.equal(await page.locator('[data-sample-scores]').textContent(), '82/100 · 76/100');
    report.offline = { status: response?.status(), banner: true, scores: [82, 76] };
    await context.setOffline(false);
    await context.close();
  }

  assert.deepEqual(report.consoleErrors, []);
  await writeFile(`${out}/cold-check.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
