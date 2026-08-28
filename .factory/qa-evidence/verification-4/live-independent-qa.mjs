import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const live = 'https://pen-display-drills.sociobot.in';
const browser = await chromium.launch({ headless: true });
const result = { generatedAt: new Date().toISOString(), routes: {}, keyboard: {}, mobile: {}, flow: {}, recovery: {} };

for (const path of ['/', '/demo', '/practice', '/privacy', '/terms', '/missing-page']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  const response = await page.goto(`${live}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  result.routes[path] = {
    status: response?.status(), title: await page.title(), lang: await page.locator('html').getAttribute('lang'),
    h1: await page.locator('h1').allTextContents(), main: await page.locator('main').count(), errors,
    axeSeriousCritical: axe.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? '')).map(v => v.id),
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(live, { waitUntil: 'networkidle' });
  await page.locator('.skip-link').focus();
  const skip = await page.evaluate(() => {
    const element = document.activeElement;
    const style = element ? getComputedStyle(element) : null;
    const rect = element?.getBoundingClientRect();
    return { text: element?.textContent?.trim(), outline: style?.outline, box: rect ? { width: rect.width, height: rect.height } : null };
  });
  await page.keyboard.press('Enter');
  const afterSkip = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  await page.getByRole('link', { name: 'Try it with sample data' }).focus();
  const ctaFocus = await page.evaluate(() => getComputedStyle(document.activeElement).outline);
  await page.keyboard.press('Enter');
  await page.waitForURL('**/demo');
  await page.locator('canvas').waitFor();
  await page.locator('canvas').focus();
  await page.keyboard.press('Space');
  for (let i = 0; i < 12; i += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  result.keyboard = { skip, afterSkip, ctaFocus, demoUrl: page.url(), score: await page.locator('[data-score]').textContent(), active: await page.evaluate(() => document.activeElement?.tagName) };
  await context.close();
}

for (const path of ['/', '/demo', '/practice', '/privacy', '/terms']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${live}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const metrics = await page.evaluate(() => {
    const visible = element => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'; };
    const undersized = [...document.querySelectorAll('a[href],button,input,summary')].filter(visible).map(element => { const rect = element.getBoundingClientRect(); return { text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 70), width: rect.width, height: rect.height }; }).filter(v => v.width < 44 || v.height < 44);
    const moving = [...document.querySelectorAll('*')].filter(element => { const s = getComputedStyle(element); return !['0s', '0.00001s'].includes(s.animationDuration) || !['0s', '0.00001s'].includes(s.transitionDuration); }).map(element => ({ tag: element.tagName, animation: getComputedStyle(element).animationDuration, transition: getComputedStyle(element).transitionDuration })).slice(0, 10);
    return { scrollWidth: document.documentElement.scrollWidth, width: innerWidth, undersized, moving };
  });
  let sticky = null;
  if (path === '/demo') {
    await page.locator('canvas').scrollIntoViewIfNeeded();
    sticky = await page.evaluate(() => { const bar = document.querySelector('.demo-bar'); const rect = bar?.getBoundingClientRect(); return { position: bar ? getComputedStyle(bar).position : null, top: rect?.top, bottom: rect?.bottom, resetVisible: Boolean([...document.querySelectorAll('button')].find(e => e.textContent?.includes('Reset demo'))?.getBoundingClientRect().height), startVisible: Boolean([...document.querySelectorAll('a')].find(e => e.textContent?.includes('Start for real'))?.getBoundingClientRect().height) }; });
    await page.screenshot({ path: '.factory/qa-evidence/verification-4/live-mobile-demo-scrolled.png', fullPage: false });
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const text200 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth }));
  result.mobile[path] = { metrics, sticky, text200, errors, axeSeriousCritical: axe.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? '')).map(v => v.id) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', request => requests.push(request.url()));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${live}/demo`, { waitUntil: 'networkidle' });
  const seed = { completed: await page.locator('[data-completed]').textContent(), drill: await page.locator('[data-drill-name]').textContent() };
  await page.getByRole('button', { name: /01.*Line/i }).click();
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('No canvas');
  await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down(); await page.mouse.up();
  const clickOnly = { score: await page.locator('[data-score]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await page.mouse.move(box.x + 20, box.y + 10); await page.mouse.down(); await page.mouse.move(box.x + box.width - 20, box.y + 10, { steps: 12 }); await page.mouse.up();
  const far = { score: await page.locator('[data-score]').textContent(), feedback: await page.locator('[data-feedback]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await page.getByRole('button', { name: 'Undo stroke' }).click();
  const undo = { score: await page.locator('[data-score]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const reset = { completed: await page.locator('[data-completed]').textContent(), drill: await page.locator('[data-drill-name]').textContent(), score: await page.locator('[data-score]').textContent() };
  await page.getByRole('link', { name: 'Start for real' }).click();
  const real = { url: page.url(), banner: await page.locator('.demo-bar').count(), completed: await page.locator('[data-completed]').textContent(), storage: await page.evaluate(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie, idb: indexedDB.databases ? await indexedDB.databases() : [] })) };
  result.flow = { seed, clickOnly, far, undo, reset, real, errors, offOrigin: requests.filter(url => new URL(url).origin !== live) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=network-recovery', route => route.abort('failed'));
  await page.goto(`${live}/practice`, { waitUntil: 'networkidle' });
  await page.getByText('Have a license? Paste it', { exact: true }).click();
  await page.getByLabel('License token').fill('network-recovery');
  await page.getByRole('button', { name: 'Restore license' }).click();
  await page.waitForFunction(() => document.querySelector('[data-license-message]')?.textContent?.includes('could not be checked'));
  const failed = await page.locator('[data-license-message]').textContent();
  await page.unrouteAll({ behavior: 'wait' });
  await page.route('https://api.sociobot.in/api/v1/products/pen-display-drills/verify?license=network-recovery', route => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.getByRole('button', { name: 'Restore license' }).click();
  await page.waitForFunction(() => document.querySelector('[data-license-message]')?.textContent?.includes('verified'));
  const recoveredMessage = await page.locator('[data-license-message]').textContent();
  await page.waitForFunction(() => document.querySelectorAll('.pack-tab:not([disabled])').length === 3);
  const recovered = { message: recoveredMessage, enabledPackDrills: await page.locator('.pack-tab:not([disabled])').count(), storedKeys: await page.evaluate(() => Object.keys(localStorage)) };
  result.recovery = { failed, recovered };
  await context.close();
}

await browser.close();
console.log(JSON.stringify(result, null, 2));
