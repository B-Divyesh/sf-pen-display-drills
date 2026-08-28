import { readdir, readFile, writeFile } from 'node:fs/promises';

const files = await readdir(new URL('../dist/assets/', import.meta.url));
const buildAssets = files.filter((file) => file.endsWith('.js') || file.endsWith('.css')).map((file) => `/assets/${file}`);
const serviceWorkerUrl = new URL('../dist/sw.js', import.meta.url);
const source = await readFile(serviceWorkerUrl, 'utf8');
const injected = source.replace('/* inject:assets */ []', JSON.stringify(buildAssets));
if (injected === source) throw new Error('Service worker asset marker was not found.');
await writeFile(serviceWorkerUrl, injected);
