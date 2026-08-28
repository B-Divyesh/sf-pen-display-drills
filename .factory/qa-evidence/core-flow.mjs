import { chromium } from 'playwright';

const definitions = {
  line: [[[0.12, 0.7], [0.88, 0.3]]],
  ellipse: Array.from({ length: 64 }, (_, index) => {
    const point = (angle) => {
      const x = Math.cos(angle) * 0.31;
      const y = Math.sin(angle) * 0.27;
      return [0.5 + x * Math.cos(-0.18) - y * Math.sin(-0.18), 0.5 + x * Math.sin(-0.18) + y * Math.cos(-0.18)];
    };
    return [point(index / 64 * Math.PI * 2), point((index + 1) / 64 * Math.PI * 2)];
  }),
  box: [
    [[0.28, 0.28], [0.65, 0.25]], [[0.65, 0.25], [0.67, 0.65]], [[0.67, 0.65], [0.3, 0.69]], [[0.3, 0.69], [0.28, 0.28]],
    [[0.28, 0.28], [0.43, 0.17]], [[0.65, 0.25], [0.79, 0.16]], [[0.43, 0.17], [0.79, 0.16]], [[0.79, 0.16], [0.67, 0.65]],
  ],
  'one-point': [
    [[0.27, 0.45], [0.64, 0.45]], [[0.64, 0.45], [0.64, 0.77]], [[0.64, 0.77], [0.27, 0.77]], [[0.27, 0.77], [0.27, 0.45]],
    [[0.27, 0.45], [0.5, 0.2]], [[0.64, 0.45], [0.5, 0.2]], [[0.64, 0.77], [0.5, 0.2]], [[0.27, 0.77], [0.5, 0.2]],
  ],
  'two-point': [
    [[0.5, 0.39], [0.5, 0.78]], [[0.5, 0.39], [0.06, 0.28]], [[0.5, 0.39], [0.94, 0.28]], [[0.5, 0.78], [0.06, 0.28]], [[0.5, 0.78], [0.94, 0.28]],
    [[0.31, 0.57], [0.31, 0.68]], [[0.69, 0.57], [0.69, 0.68]], [[0.31, 0.57], [0.94, 0.28]], [[0.69, 0.57], [0.06, 0.28]],
  ],
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));
await page.goto('https://pen-display-drills.sociobot.in/practice', { waitUntil: 'networkidle' });
const results = {};
for (const [id, segments] of Object.entries(definitions)) {
  await page.locator(`[data-drill="${id}"]`).click();
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error(`Canvas missing for ${id}`);
  if (id === 'ellipse') {
    const points = [segments[0][0], ...segments.map((segment) => segment[1])];
    await page.mouse.move(box.x + points[0][0] * box.width, box.y + points[0][1] * box.height);
    await page.mouse.down();
    for (const point of points.slice(1)) await page.mouse.move(box.x + point[0] * box.width, box.y + point[1] * box.height);
    await page.mouse.up();
  } else {
    for (const [from, to] of segments) {
      await page.mouse.move(box.x + from[0] * box.width, box.y + from[1] * box.height);
      await page.mouse.down();
      for (let step = 1; step <= 10; step += 1) await page.mouse.move(box.x + (from[0] + (to[0] - from[0]) * step / 10) * box.width, box.y + (from[1] + (to[1] - from[1]) * step / 10) * box.height);
      await page.mouse.up();
    }
  }
  results[id] = {
    name: await page.locator('[data-drill-name]').textContent(),
    score: await page.locator('[data-score]').textContent(),
    feedback: await page.locator('[data-feedback]').textContent(),
    progress: await page.locator('[data-progress]').textContent(),
    finishEnabled: await page.getByRole('button', { name: 'Finish drill' }).isEnabled(),
  };
  await page.getByRole('button', { name: 'Finish drill' }).click();
  results[id].summary = await page.locator('[data-summary-copy]').textContent();
  await page.getByRole('button', { name: 'Repeat this drill' }).click();
}
console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
