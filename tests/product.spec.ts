import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('@claim:demo-sandbox opens a seeded demo and resets it', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:pen-display-drills', 'real-license-sentinel');
    localStorage.setItem('sb_license_verdict:pen-display-drills', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('2 sample drills complete')).toBeVisible();
  await expect(page.getByText('Sample scores', { exact: true })).toBeVisible();
  await expect(page.locator('[data-sample-scores]')).toHaveText('82/100 · 76/100');
  await expect(page.getByRole('heading', { name: 'Box', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('2 sample drills complete')).toBeVisible();
  await expect(page.locator('[data-sample-scores]')).toHaveText('82/100 · 76/100');
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

test('@claim:local-practice sends no demo data off origin or stores it', async ({ page }) => {
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
  expect(outsideRequests).toEqual([]);
  expect(await page.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookies: document.cookie,
    databases: 'databases' in indexedDB ? await indexedDB.databases() : [],
  }))).toEqual({ local: [], session: [], cookies: '', databases: [] });
  await page.reload();
  await expect(page.locator('[data-score]')).toHaveText('—');
});

test('@claim:offline-reload reloads the demo without a network', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { name: 'Train your hand for five minutes' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect.poll(() => page.evaluate(async () => {
    const script = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src;
    const style = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href;
    const registration = await navigator.serviceWorker.getRegistration();
    return Boolean(registration?.active && navigator.serviceWorker.controller && script && style
      && await caches.match(script, { ignoreVary: true }) && await caches.match(style, { ignoreVary: true })
      && await caches.match(location.href, { ignoreVary: true }));
  })).toBe(true);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Train your hand for five minutes' })).toBeVisible();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);
  await expect(page.locator('[data-feedback]')).not.toHaveText('Make one stroke to get a reading.');
  await context.setOffline(false);
});

test('@claim:input-methods accepts pen, mouse, touch, and keyboard drawing', async ({ page }) => {
  await page.goto('/practice');
  const canvas = page.locator('canvas');
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Drawing area did not render.');
  for (const pointerType of ['mouse', 'pen', 'touch']) {
    await page.getByRole('button', { name: 'Reset drill' }).click();
    await canvas.evaluate((node, data) => {
      const target = node as HTMLCanvasElement;
      const fire = (type: string, x: number, y: number) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 31, pointerType: data.pointerType, clientX: x, clientY: y }));
      fire('pointerdown', data.x + 40, data.y + 80);
      fire('pointermove', data.x + 180, data.y + 120);
      fire('pointerup', data.x + 180, data.y + 120);
    }, { pointerType, x: box.x, y: box.y });
    await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);
  }
});

test('@claim:license-restore restores a legacy Space pack license from the practice desk', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=restored-license', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/practice');
  await page.getByText('Have a license? Paste it', { exact: true }).click();
  await page.getByLabel('License token').fill('restored-license');
  await page.getByRole('button', { name: 'Restore license' }).click();
  await expect(page.getByText('License verified. The space pack is now active.')).toBeVisible();
  await expect.poll(() => page.locator('.pack-tab:not([disabled])').count()).toBe(3);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:pen-display-drills'))).toBe('restored-license');
});

test('@claim:license-storage stores only a supplied token and its daily check result', async ({ page }) => {
  let checks = 0;
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=stored-license', async (route) => {
    checks += 1;
    await route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } });
  });
  await page.goto('/practice');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await page.getByText('Have a license? Paste it', { exact: true }).click();
  await page.getByLabel('License token').fill('stored-license');
  const before = Date.now();
  await page.getByRole('button', { name: 'Restore license' }).click();
  await expect(page.getByText('License verified. The space pack is now active.')).toBeVisible();
  await expect.poll(() => checks).toBe(1);
  const stored = await page.evaluate(() => ({
    keys: Object.keys(localStorage).sort(),
    token: localStorage.getItem('sb_license:pen-display-drills'),
    verdict: JSON.parse(localStorage.getItem('sb_license_verdict:pen-display-drills') ?? 'null') as { valid: boolean; checkedAt: number } | null,
  }));
  expect(stored.keys).toEqual(['sb_license:pen-display-drills', 'sb_license_verdict:pen-display-drills']);
  expect(stored.token).toBe('stored-license');
  expect(stored.verdict?.valid).toBe(true);
  expect(stored.verdict?.checkedAt).toBeGreaterThanOrEqual(before);
  expect(stored.verdict?.checkedAt).toBeLessThanOrEqual(Date.now());

  await page.reload();
  await page.waitForTimeout(100);
  expect(checks).toBe(1);

  await page.evaluate(() => localStorage.setItem('sb_license_verdict:pen-display-drills', JSON.stringify({ valid: true, checkedAt: Date.now() - 86_400_001 })));
  await page.reload();
  await expect.poll(() => checks).toBe(2);
});

test('@claim:license-verification-privacy sends only the pasted token to Sociobot', async ({ page }) => {
  const crossOriginRequests: Array<{ url: string; method: string; body: string | null }> = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') {
      crossOriginRequests.push({ url: request.url(), method: request.method(), body: request.postData() });
    }
  });
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({
    json: { valid: true, reason: 'ok', expires_at: null },
  }));

  await page.goto('/practice');
  const canvas = page.locator('canvas');
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 8; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  await expect(page.locator('[data-score]')).toHaveText(/\d+\/100/);

  await page.getByText('Have a license? Paste it', { exact: true }).click();
  await page.getByLabel('License token').fill('privacy-token');
  await page.getByRole('button', { name: 'Restore license' }).click();
  await expect(page.getByText('License verified. The space pack is now active.')).toBeVisible();

  expect(crossOriginRequests).toHaveLength(1);
  const request = crossOriginRequests[0];
  const url = new URL(request.url);
  expect(url.origin).toBe('https://api.sociobot.in');
  expect(url.pathname).toBe('/api/v1/products/pen-display-drills/verify');
  expect([...url.searchParams.entries()]).toEqual([['license', 'privacy-token']]);
  expect(request.method).toBe('GET');
  expect(request.body).toBeNull();
});

test('a valid returned license still opens the three legacy themed drills', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=sample-license', (route) => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/practice?license=sample-license');
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('.pack-tab')).toHaveCount(3);
  for (const button of await page.locator('.pack-tab').all()) await expect(button).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:pen-display-drills'))).toBe('sample-license');
});

test('@claim:five-minute-session starts every practice desk at five minutes', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.locator('[data-timer]')).toHaveText('05:00');
});

test('@claim:account-free opens the five core drills without an account or saved practice data', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.locator('[data-drill]:not(.pack-tab)')).toHaveCount(5);
  await expect(page.locator('input[type="email"], input[type="password"], [role="dialog"]')).toHaveCount(0);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), cookies: document.cookie }))).toEqual({ local: [], session: [], cookies: '' });
});

test('home metadata does not make an unprovable universal tablet compatibility claim', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Practice straight lines, ellipses, boxes, and perspective with immediate geometric feedback.');
  await expect(page.locator('body')).not.toContainText('any drawing tablet');
});

test('the license restore control works by keyboard and fits a 390px screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/practice');
  const restore = page.getByText('Have a license? Paste it', { exact: true });
  await restore.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('License token')).toBeVisible();
  for (const control of [restore, page.getByLabel('License token'), page.getByRole('button', { name: 'Restore license' })]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.min(box?.width ?? 0, box?.height ?? 0)).toBeGreaterThanOrEqual(44);
  }
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('license recovery label and error text retain 4.5:1 contrast on the drafting desk', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=invalid-license', (route) => route.fulfill({ json: { valid: false, reason: 'invalid', expires_at: null } }));
  await page.goto('/practice');
  await page.getByText('Have a license? Paste it', { exact: true }).click();
  await page.getByLabel('License token').fill('invalid-license');
  await page.getByRole('button', { name: 'Restore license' }).click();
  const message = page.locator('[data-license-message]');
  await expect(message).toContainText('This license is not active');
  const contrast = await page.evaluate(() => {
    const luminance = (color: string) => {
      const values = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
      const channels = values.map((value) => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const ratio = (foreground: string, background: string) => {
      const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    };
    const label = getComputedStyle(document.querySelector('label[for="license-token"]')!).color;
    const status = getComputedStyle(document.querySelector('[data-license-message]')!).color;
    return { label: ratio(label, 'rgb(223, 211, 182)'), status: ratio(status, 'rgb(223, 211, 182)') };
  });
  expect(contrast.label).toBeGreaterThanOrEqual(4.5);
  expect(contrast.status).toBeGreaterThanOrEqual(4.5);
});

test('the mobile demo status and reset controls stay visible while drawing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.locator('canvas').scrollIntoViewIfNeeded();
  const banner = page.locator('.demo-bar');
  await expect(banner).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
  const box = await banner.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.y ?? -1).toBeGreaterThanOrEqual(0);
  expect((box?.y ?? 0) + (box?.height ?? Infinity)).toBeLessThanOrEqual(844);
  await expect(banner).toHaveCSS('position', 'sticky');
});

test('immutable artwork URLs are content-addressed', async () => {
  const config = await readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8');
  const references = await Promise.all([
    readFile(new URL('../src/main.ts', import.meta.url), 'utf8'),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/sw.js', import.meta.url), 'utf8'),
  ]);
  expect(config).toContain('"route": "/assets/*"');
  expect(config).toContain('max-age=31536000, immutable');
  const assets = [...new Map([...references.join('\n').matchAll(/\/assets\/([a-z-]+)-([a-f0-9]{12})\.webp/g)].map((match) => [`${match[1]}-${match[2]}`, match])).values()];
  expect(assets).toHaveLength(2);
  for (const [, name, hash] of assets) {
    const bytes = await readFile(new URL(`../public/assets/${name}-${hash}.webp`, import.meta.url));
    expect(createHash('sha256').update(bytes).digest('hex').slice(0, 12)).toBe(hash);
  }
});

test('requires distinct target coverage before completing a box drill', async ({ page }) => {
  await page.goto('/demo');
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Drawing area did not render.');
  const draw = async (from: [number, number], to: [number, number]) => {
    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], { steps: 12 });
    await page.mouse.up();
  };
  const boxEdges: Array<[[number, number], [number, number]]> = [
    [[.28, .28], [.65, .25]], [[.65, .25], [.67, .65]], [[.67, .65], [.3, .69]], [[.3, .69], [.28, .28]],
    [[.28, .28], [.43, .17]], [[.65, .25], [.79, .16]], [[.43, .17], [.79, .16]], [[.79, .16], [.67, .65]],
  ];
  await draw(...boxEdges[0]);
  await expect(page.locator('[data-progress]')).toContainText('1 of 8 target lines covered');
  await expect(page.getByRole('button', { name: 'Finish drill' })).toBeDisabled();
  for (const edge of boxEdges.slice(1)) await draw(...edge);
  await expect(page.locator('[data-progress]')).toContainText('8 of 8 target lines covered');
  await expect(page.getByRole('button', { name: 'Finish drill' })).toBeEnabled();
});

test('the N shortcut skips locked drills at the free-pack boundary', async ({ page }) => {
  await page.goto('/practice');
  await page.getByRole('button', { name: /05.*2-point/i }).click();
  await page.locator('canvas').focus();
  await page.keyboard.press('n');
  await expect(page.getByRole('heading', { name: 'Straight line', exact: true })).toBeVisible();
});

test('a returned invalid license verifies only once and is removed', async ({ page }) => {
  let calls = 0;
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=returned-invalid', async (route) => {
    calls += 1;
    await route.fulfill({ json: { valid: false, reason: 'invalid', expires_at: null } });
  });
  await page.goto('/practice?license=returned-invalid');
  await expect(page).toHaveURL(/\/practice$/);
  await expect.poll(() => calls).toBe(1);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:pen-display-drills'))).toBeNull();
});

test('the cold desktop first screen keeps its first action and facts in view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const action = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  const facts = await page.locator('.plain-facts').boundingBox();
  expect(action && action.y + action.height).toBeLessThanOrEqual(900);
  expect(facts && facts.y + facts.height).toBeLessThanOrEqual(900);
});

test('mobile interactive controls meet the 44px touch-target baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const control of await page.locator('a[href]:visible, button:visible').all()) {
    const box = await control.boundingBox();
    expect(box, await control.textContent() ?? 'control').not.toBeNull();
    expect(Math.min(box?.width ?? 0, box?.height ?? 0), await control.textContent() ?? 'control').toBeGreaterThanOrEqual(44);
  }
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
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pen-display-drills.sociobot.in/privacy');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Pen Display Drills');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://pen-display-drills.sociobot.in/privacy');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Practice steadier lines in five minutes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Practice steadier lines in five minutes' })).toBeFocused();
});

test('static deployment rewrites only real app routes and returns unknown paths as 404', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    navigationFallback?: unknown;
    routes: Array<{ route: string; rewrite?: string; statusCode?: number }>;
    responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
  };
  expect(config.navigationFallback).toBeUndefined();
  for (const route of ['/demo', '/practice', '/privacy', '/terms']) {
    expect(config.routes).toContainEqual({ route, rewrite: '/index.html' });
  }
  expect(config.routes.some((route) => route.route === '/*')).toBe(false);
  expect(config.routes.some((route) => route.rewrite && route.statusCode)).toBe(false);
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/index.html', statusCode: 404 });
});
