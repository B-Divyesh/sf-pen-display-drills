import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const root = join(process.cwd(), 'dist');
let version = 1;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1:4180');
  if (url.pathname === '/__flip') {
    version += 1;
    response.end(String(version));
    return;
  }
  let relative = normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
  if (!relative || !extname(relative)) relative = 'index.html';
  try {
    let body = await readFile(join(root, relative));
    if (relative === 'sw.js') body = Buffer.from(body.toString().replace(/pen-drills-[a-zA-Z0-9-]+/, `pen-drills-qa-update-${version}`));
    response.writeHead(200, { 'Content-Type': types[extname(relative)] ?? 'application/octet-stream', 'Cache-Control': relative === 'sw.js' ? 'no-store' : 'public, max-age=0' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('not found');
  }
});
await new Promise((resolve) => server.listen(4180, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));
await page.goto('http://127.0.0.1:4180/demo', { waitUntil: 'networkidle' });
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
const before = await page.evaluate(async () => ({ controller: navigator.serviceWorker.controller?.scriptURL, caches: await caches.keys() }));
await page.request.get('http://127.0.0.1:4180/__flip');
await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration?.update(); });
await page.locator('[data-update-toast]').waitFor({ state: 'visible' });
const toast = await page.locator('[data-update-toast]').textContent();
await page.getByRole('button', { name: 'Update now' }).click();
await page.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.active?.state === 'activated');
await page.waitForFunction(async () => (await caches.keys()).some((key) => key.endsWith('qa-update-2')));
const after = await page.evaluate(async () => ({ url: location.href, controller: navigator.serviceWorker.controller?.scriptURL, caches: await caches.keys(), heading: document.querySelector('h1')?.textContent, banner: document.querySelector('.demo-bar')?.textContent?.replace(/\s+/g, ' ').trim() }));
console.log(JSON.stringify({ before, toast: toast?.replace(/\s+/g, ' ').trim(), after, errors }, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));
