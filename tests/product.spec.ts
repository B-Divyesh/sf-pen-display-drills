import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-sandbox opens a seeded demo and resets it', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:pen-display-drills', 'real-license-sentinel');
    localStorage.setItem('sb_license_verdict:pen-display-drills', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('2 sample drills complete')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Box', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('2 sample drills complete')).toBeVisible();
  for (const button of await page.locator('.pack-tab').all()) await expect(button).toBeDisabled();
  await expect(page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('practice:') || key.startsWith('demo:')))).resolves.toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:pen-display-drills'))).toBe('real-license-sentinel');
});

test('@claim:geometric-feedback returns an observable distance score', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /01.*Line/i }).click();
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  await page.mouse.move(box.x + box.width * 0.12, box.y + box.height * 0.7);
  await page.mouse.down();
  for (let step = 1; step <= 12; step += 1) {
    await page.mouse.move(box.x + box.width * (0.12 + 0.76 * step / 12), box.y + box.height * (0.7 - 0.4 * step / 12));
  }
  await page.mouse.up();
  await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);
  await expect(page.locator('[data-feedback]')).toContainText('average deviation');
  await expect(page.getByRole('button', { name: 'Finish drill' })).toBeEnabled();
});

test('@claim:five-core-free keeps all five core drills available', async ({ page }) => {
  await page.goto('/practice');
  const core = page.locator('[data-drill]:not(.pack-tab)');
  await expect(core).toHaveCount(5);
  for (const button of await core.all()) await expect(button).toBeEnabled();
  await expect(page.locator('.pack-tab')).toHaveCount(3);
  for (const button of await page.locator('.pack-tab').all()) await expect(button).toBeDisabled();
});

test('@claim:local-practice sends no demo data off origin', async ({ page }) => {
  const outsideRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outsideRequests.push(request.url());
  });
  await page.goto('/demo');
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Drawing area did not render.');
  await page.mouse.move(box.x + 50, box.y + 50);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 100, { steps: 8 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Finish drill' }).click();
  expect(outsideRequests).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
});

test('@claim:offline-reload reloads the demo without a network', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await expect.poll(() => page.evaluate(async () => {
    const script = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src;
    const style = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href;
    return Boolean(script && style && await caches.match(script) && await caches.match(style) && await caches.match(location.href));
  })).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Train your hand for five minutes' })).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:input-methods accepts pointer and keyboard drawing', async ({ page }) => {
  await page.goto('/practice');
  const canvas = page.locator('canvas');
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);
  await page.getByRole('button', { name: 'Reset drill' }).click();
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Drawing area did not render.');
  await page.mouse.move(box.x + 40, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 180, box.y + 120, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);
});

test('@claim:paid-pack verifies a returned license and opens three themed drills', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=sample-license', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/practice?license=sample-license');
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('.pack-tab')).toHaveCount(3);
  for (const button of await page.locator('.pack-tab').all()) await expect(button).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:pen-display-drills'))).toBe('sample-license');
});

for (const path of ['/', '/demo', '/practice', '/privacy', '/terms', '/missing-page']) {
  test(`accessible page structure on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/.+— Pen Display Drills|Pen Display Drills —/);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('mobile practice fits a 390px screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const canvasBox = await page.locator('canvas').boundingBox();
  expect(canvasBox?.width).toBeLessThanOrEqual(390);
});

test('history navigation restores routes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — Pen Display Drills');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Practice steadier lines in five minutes' })).toBeVisible();
});
