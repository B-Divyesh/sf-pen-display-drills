import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const files = await readdir(new URL('../dist/assets/', import.meta.url));
const buildAssets = files.filter((file) => file.endsWith('.js') || file.endsWith('.css')).sort().map((file) => `/assets/${file}`);
const buildVersion = createHash('sha256').update(buildAssets.join('\n')).digest('hex').slice(0, 12);
const serviceWorkerUrl = new URL('../dist/sw.js', import.meta.url);
const source = await readFile(serviceWorkerUrl, 'utf8');
const injected = source
  .replace('/* inject:assets */ []', JSON.stringify(buildAssets))
  .replace('__BUILD_VERSION__', buildVersion);
if (injected === source || injected.includes('/* inject:assets */ []') || injected.includes('__BUILD_VERSION__')) {
  throw new Error('A service worker build marker was not injected.');
}
await writeFile(serviceWorkerUrl, injected);
