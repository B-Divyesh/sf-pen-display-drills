import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const LIVE = 'https://pen-display-drills.sociobot.in';
const routes = ['/', '/demo', '/practice', '/privacy', '/terms', '/missing-page'];
const browser = await chromium.launch({ headless: true });
const result = { generatedAt: new Date().toISOString(), routes: {}, flows: {}, responsive: {}, offline: {} };

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`));
  page.on('request', (request) => requests.push(request.url()));
  const response = await page.goto(`${LIVE}${route}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  result.routes[route] = {
    status: response?.status(),
    finalUrl: page.url(),
    title: await page.title(),
    lang: await page.locator('html').getAttribute('lang'),
    h1: await page.locator('h1').allTextContents(),
    mainCount: await page.locator('main').count(),
    errors,
    offOriginRequests: requests.filter((url) => new URL(url).origin !== LIVE),
    axeSeriousCritical: axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.length })),
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(LIVE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(100);
  const firstScreen = await page.evaluate(() => {
    const candidate = [...document.querySelectorAll('a,button')].find((element) => element.textContent?.includes('Try it with sample data'));
    const rect = candidate?.getBoundingClientRect();
    return {
      activeElement: document.activeElement?.tagName + ':' + document.activeElement?.textContent?.trim(),
      ctaRect: rect ? { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } : null,
      ctaFullyInViewport: Boolean(rect && rect.top >= 0 && rect.bottom <= innerHeight),
      viewport: { width: innerWidth, height: innerHeight },
    };
  });
  await page.keyboard.press('Tab');
  const firstTab = await page.evaluate(() => {
    const element = document.activeElement;
    const style = element ? getComputedStyle(element) : null;
    return { tag: element?.tagName, text: element?.textContent?.trim(), outline: style?.outline, rect: element ? element.getBoundingClientRect().toJSON() : null };
  });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  const demoSeed = {
    url: page.url(),
    banner: await page.getByText('Demo — sample data, nothing is saved').isVisible(),
    completed: await page.locator('[data-completed]').textContent(),
    drill: await page.locator('[data-drill-name]').textContent(),
    storageBefore: await page.evaluate(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie, idb: indexedDB.databases ? await indexedDB.databases() : [] })),
  };
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Demo canvas missing');
  await page.mouse.move(box.x + 80, box.y + 80);
  await page.mouse.down();
  await page.mouse.up();
  const zeroLength = { score: await page.locator('[data-score]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  const keyboardStroke = { score: await page.locator('[data-score]').textContent(), feedback: await page.locator('[data-feedback]').textContent(), progress: await page.locator('[data-progress]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await page.getByRole('button', { name: 'Undo stroke' }).click();
  const afterUndo = { score: await page.locator('[data-score]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  const prematureFinish = { progress: await page.locator('[data-progress]').textContent(), finishDisabled: await page.getByRole('button', { name: 'Finish drill' }).isDisabled() };
  await page.getByRole('button', { name: 'Finish drill' }).click();
  const summary = { visible: await page.getByRole('heading', { name: 'Drill complete' }).isVisible(), copy: await page.locator('[data-summary-copy]').textContent(), focused: await page.evaluate(() => document.activeElement?.textContent?.trim()) };
  await page.getByRole('button', { name: 'Repeat this drill' }).click();
  const repeated = { deskVisible: await page.locator('.desk').isVisible(), score: await page.locator('[data-score]').textContent() };
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const reset = { completed: await page.locator('[data-completed]').textContent(), drill: await page.locator('[data-drill-name]').textContent(), score: await page.locator('[data-score]').textContent(), storageAfter: await page.evaluate(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie, idb: indexedDB.databases ? await indexedDB.databases() : [] })) };
  result.flows.demo = { firstScreen, firstTab, demoSeed, zeroLength, keyboardStroke, afterUndo, prematureFinish, summary, repeated, reset, errors, offOriginRequests: requests.filter((url) => new URL(url).origin !== LIVE) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(`${LIVE}/practice`, { waitUntil: 'networkidle' });
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Practice canvas missing');
  const syntheticStroke = async (kind) => {
    await canvas.dispatchEvent('pointerdown', { pointerId: kind === 'touch' ? 41 : 42, pointerType: kind, clientX: box.x + 45, clientY: box.y + 70, bubbles: true });
    await canvas.dispatchEvent('pointermove', { pointerId: kind === 'touch' ? 41 : 42, pointerType: kind, clientX: box.x + 185, clientY: box.y + 115, bubbles: true });
    await canvas.dispatchEvent('pointerup', { pointerId: kind === 'touch' ? 41 : 42, pointerType: kind, clientX: box.x + 185, clientY: box.y + 115, bubbles: true });
    return page.locator('[data-score]').textContent();
  };
  const touchScore = await syntheticStroke('touch');
  await page.getByRole('button', { name: 'Reset drill' }).click();
  const penScore = await syntheticStroke('pen');
  await page.getByRole('button', { name: 'Reset drill' }).click();
  await canvas.dispatchEvent('mousedown', { clientX: box.x + 45, clientY: box.y + 70, bubbles: true });
  await canvas.dispatchEvent('mousemove', { clientX: box.x + 185, clientY: box.y + 115, bubbles: true });
  await canvas.dispatchEvent('mouseup', { clientX: box.x + 185, clientY: box.y + 115, bubbles: true });
  const mouseFallbackScore = await page.locator('[data-score]').textContent();
  await page.getByRole('button', { name: /05.*2-point/i }).click();
  await canvas.focus();
  await page.keyboard.press('n');
  const nAtLockedBoundary = await page.locator('[data-drill-name]').textContent();
  result.flows.inputs = { touchScore, penScore, mouseFallbackScore, nAtLockedBoundary };
  await context.close();
}

for (const route of ['/', '/demo', '/privacy']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  await page.goto(`${LIVE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(100);
  const metrics = await page.evaluate(() => {
    const cta = [...document.querySelectorAll('a,button')].find((element) => element.textContent?.includes('Try it with sample data'));
    const ctaRect = cta?.getBoundingClientRect();
    const targets = [...document.querySelectorAll('a,button,input,summary')].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
    }).map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, text: element.textContent?.trim()?.replace(/\s+/g, ' ').slice(0, 70), width: Math.round(rect.width), height: Math.round(rect.height) }; });
    const animated = [...document.querySelectorAll('*')].filter((element) => {
      const style = getComputedStyle(element);
      return style.animationDuration !== '0s' || style.transitionDuration !== '0s';
    }).map((element) => ({ tag: element.tagName, className: element.className, animation: getComputedStyle(element).animationDuration, transition: getComputedStyle(element).transitionDuration })).slice(0, 20);
    return { scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, ctaRect: ctaRect ? { top: ctaRect.top, bottom: ctaRect.bottom } : null, ctaFullyInViewport: Boolean(ctaRect && ctaRect.top >= 0 && ctaRect.bottom <= innerHeight), undersizedTargets: targets.filter((target) => target.width < 44 || target.height < 44), animated };
  });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  await page.screenshot({ path: `.factory/qa-evidence/live-mobile-${route === '/' ? 'home' : route.slice(1)}.png`, fullPage: false });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.waitForTimeout(50);
  const text200 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, scrollHeight: document.documentElement.scrollHeight }));
  result.responsive[route] = { metrics, text200, errors, axeSeriousCritical: axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.length })) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  await page.goto(`${LIVE}/?demo=1`, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const before = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
    return { url: location.href, controller: navigator.serviceWorker.controller?.scriptURL, active: registration?.active?.state, waiting: registration?.waiting?.state ?? null, caches: await caches.keys() };
  });
  await context.setOffline(true);
  const response = await page.reload({ waitUntil: 'domcontentloaded' });
  const canvas = page.locator('canvas');
  await canvas.focus();
  await page.keyboard.press('Space');
  for (let index = 0; index < 12; index += 1) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Space');
  const after = { responseStatus: response?.status(), url: page.url(), heading: await page.locator('h1').textContent(), banner: await page.getByText('Demo — sample data, nothing is saved').isVisible(), score: await page.locator('[data-score]').textContent(), errors };
  result.offline = { before, after };
  await context.setOffline(false);
  await context.close();
}

await browser.close();
console.log(JSON.stringify(result, null, 2));
