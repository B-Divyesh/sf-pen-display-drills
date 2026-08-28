import './styles.css';
import { drills, scoreStroke, targetsFor, type Point } from './drills';

const APP_NAME = 'Pen Display Drills';
const LICENSE_KEY = 'sb_license:pen-display-drills';
const VERDICT_KEY = 'sb_license_verdict:pen-display-drills';
const BILLING_URL = 'https://api.sociobot.in/api/v1/products/pen-display-drills';
const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;
if (!app) throw new Error('The app mount point is missing.');

type LicenseVerdict = { valid: boolean; checkedAt: number };
type Stroke = { points: Point[]; score: number };

const routeData: Record<string, { title: string; description: string }> = {
  '/': { title: 'Pen Display Drills — five-minute drawing practice', description: 'Practice straight lines, ellipses, boxes, and perspective with immediate geometric feedback on any drawing tablet.' },
  '/demo': { title: 'Demo — Pen Display Drills', description: 'Try a sample five-minute drawing drill without saving practice data.' },
  '/practice': { title: 'Practice — Pen Display Drills', description: 'Practice line control and perspective with immediate geometric feedback.' },
  '/privacy': { title: 'Privacy — Pen Display Drills', description: 'How Pen Display Drills handles practice data and licenses.' },
  '/terms': { title: 'Terms — Pen Display Drills', description: 'Terms for using Pen Display Drills and its optional practice pack.' },
};

function header(): string {
  return `<header class="site-header">
    <nav class="nav-shell" aria-label="Main navigation">
      <a class="wordmark" href="/" data-link><span class="wordmark-mark" aria-hidden="true">//</span><span>${APP_NAME}</span></a>
      <div class="nav-links">
        <a href="/demo" data-link>Demo</a>
        <a href="/practice" data-link>Drills</a>
        <a href="/privacy" data-link>Privacy</a>
      </div>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <div><strong>${APP_NAME}</strong><p>Five-minute drawing practice with geometric feedback.</p></div>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build-id">Version 1.0 · build 2026.08</p>
    <p class="art-credit">Console artwork generated for this product.</p>
  </footer>`;
}

function shell(content: string, demo = false): string {
  return `${header()}${demo ? `<aside class="demo-bar" aria-label="Demo status"><span><strong>Demo</strong> — sample data, nothing is saved</span><span><button type="button" class="text-button" data-reset-demo>Reset demo</button><a href="/practice" data-link>Start for real</a></span></aside>` : ''}<main id="main">${content}</main>${footer()}<div class="toast" data-update-toast hidden><span>An updated practice desk is ready.</span><button type="button" data-update>Update now</button></div>`;
}

function homePage(): string {
  return shell(`<section class="hero ruler-edge">
    <div class="hero-copy">
      <p class="eyebrow">Tablet calibration desk · Series 05</p>
      <h1 tabindex="-1">Practice steadier lines in five minutes</h1>
      <p class="lede">For new tablet artists who want clear targets and feedback instead of a blank canvas.</p>
      <div class="hero-action"><a class="button primary" href="/demo" data-link>Try it with sample data</a><span>Start on drill 3 with two sample scores.</span></div>
      <ul class="plain-facts" aria-label="Product facts">
        <li><span aria-hidden="true">●</span> Works offline after your first visit.</li>
        <li><span aria-hidden="true">●</span> Practice stays in this tab.</li>
        <li><span aria-hidden="true">●</span> Five core drills are free.</li>
      </ul>
    </div>
    <figure class="hero-figure">
      <img src="/assets/instrument-console.webp" width="960" height="640" alt="A mid-century drafting console measuring a stylus line on graph paper." fetchpriority="high" decoding="async">
      <figcaption><span>Fig. 01</span> A focused desk for hand control.</figcaption>
    </figure>
  </section>
  <section class="preview-section" aria-labelledby="preview-heading">
    <div class="section-label">Live system</div>
    <div class="preview-copy"><h2 id="preview-heading">See where the line wandered</h2><p>A target band shows the route. Each stroke returns its average distance from that route.</p><a class="arrow-link" href="/practice" data-link>Open a clean practice desk <span aria-hidden="true">→</span></a></div>
    <div class="mini-instrument" aria-label="Example score of 84 out of 100">
      <div class="mini-canvas" aria-hidden="true"><span class="target-line"></span><span class="sample-line"></span></div>
      <div class="mini-readout"><span>Average deviation</span><strong>4.0 px</strong><span class="status-good">On target</span></div>
    </div>
  </section>
  <section class="steps ruler-edge" aria-labelledby="steps-heading">
    <div class="section-label">Procedure</div><h2 id="steps-heading">How each drill works</h2>
    <ol><li><span>01</span><div><h3>Pick a target</h3><p>Choose lines, ellipses, boxes, or perspective.</p></div></li><li><span>02</span><div><h3>Draw over the guide</h3><p>Use a pen, mouse, touch, or arrow keys.</p></div></li><li><span>03</span><div><h3>Read the gauge</h3><p>Adjust your next stroke using the distance score.</p></div></li></ol>
  </section>
  <section class="limits" aria-labelledby="limits-heading">
    <div><div class="section-label">Boundaries</div><h2 id="limits-heading">A drill desk, not a drawing app</h2></div>
    <div class="limit-copy"><p>There are no brushes, layers, feeds, or automated critique. The desk measures geometry and leaves the artistic choices to you.</p><p>Your strokes stay in memory and disappear when the tab closes. Only an optional paid license is stored on this device.</p></div>
  </section>
  ${paidSection()}`);
}

function paidSection(): string {
  const licensed = hasValidCachedLicense();
  return `<section class="paid ruler-edge" aria-labelledby="paid-heading">
    <div class="paid-dial" aria-hidden="true"><span></span></div>
    <div><p class="eyebrow">Optional expansion</p><h2 id="paid-heading">Add the space drafting pack</h2><p>Get orbital rings, radar spokes, and gantry depth drills. The five core drills remain free.</p>
    <p class="price"><strong>$6</strong> once</p>
    ${licensed ? `<p class="license-ok"><span aria-hidden="true">●</span> Space drafting pack active</p>` : `<a class="button secondary" href="${BILLING_URL}/checkout">Buy the themed pack — $6 <span class="sr-only">at external checkout</span></a>`}
    <details class="restore"><summary>Have a license?</summary><form data-license-form><label for="license-token">Paste your license token</label><div><input id="license-token" name="license" autocomplete="off" required><button type="submit">Verify license</button></div><p class="form-message" data-license-message aria-live="polite"></p></form></details>
    <p class="fine-print">This is a one-time purchase. Sociobot and Dodo handle checkout and refunds. Read the <a href="/terms" data-link>purchase terms</a>.</p></div>
  </section>`;
}

function practicePage(isDemo: boolean): string {
  const licensed = hasValidCachedLicense();
  const coreButtons = drills.filter((drill) => !drill.paid).map((drill, index) => `<button type="button" class="drill-tab${index === (isDemo ? 2 : 0) ? ' active' : ''}" data-drill="${drill.id}" aria-pressed="${index === (isDemo ? 2 : 0)}"><span>${String(index + 1).padStart(2, '0')}</span>${drill.short}</button>`).join('');
  const packButtons = drills.filter((drill) => drill.paid).map((drill) => `<button type="button" class="drill-tab pack-tab" data-drill="${drill.id}" ${licensed ? '' : 'disabled'} aria-pressed="false"><span>${licensed ? '★' : '🔒'}</span>${drill.short}</button>`).join('');
  return shell(`<section class="practice-head">
    <div><p class="eyebrow">Calibration session · 05:00</p><h1 tabindex="-1">Train your hand for five minutes</h1><p>Draw over each amber target. Use the reading to adjust your next stroke.</p></div>
    <div class="session-meter"><span>Session time</span><strong data-timer>05:00</strong><span data-completed>${isDemo ? '2 sample drills complete' : 'No drills complete yet'}</span></div>
  </section>
  <section class="desk" aria-label="Drawing drill desk">
    <div class="selector"><div><span class="selector-label">Core drills</span>${coreButtons}</div><div><span class="selector-label">Space pack</span>${packButtons}</div></div>
    ${!licensed ? `<p class="pack-note">The space pack adds three themed drills for $6 once. <a href="/#paid-heading" data-link>View the pack</a>.</p>` : ''}
    <div class="desk-panel">
      <div class="drill-readout"><div><span class="readout-number" data-drill-number>${isDemo ? '03' : '01'}</span><div><h2 data-drill-name>${isDemo ? 'Box' : 'Straight line'}</h2><p data-drill-instruction></p></div></div><button type="button" class="quiet-button" data-help aria-expanded="false">Keyboard controls</button></div>
      <div class="keyboard-help" data-keyboard-help hidden><p>Focus the drawing area. Use arrow keys to move the crosshair. Press Space to lower or lift the pen. Press R to reset and N for the next drill.</p></div>
      <div class="canvas-frame"><canvas data-canvas tabindex="0" role="application" aria-label="Drawing area. Use a pen, mouse, touch, or keyboard arrows. Press Space to lower or lift the keyboard pen."></canvas><div class="canvas-badge">Target band: ±8 px</div></div>
      <div class="feedback-row" aria-live="polite">
        <div class="gauge"><div class="gauge-scale" aria-hidden="true"><span>Wide</span><span>Close</span><i data-needle></i></div><div><span>Last stroke</span><strong data-score>—</strong></div></div>
        <div class="feedback-copy"><strong data-feedback>Make one stroke to get a reading.</strong><span data-progress>No target lines covered yet.</span></div>
      </div>
      <p class="cue" data-cue></p>
      <div class="desk-actions"><button type="button" class="quiet-button" data-undo disabled>Undo stroke</button><button type="button" class="quiet-button danger-text" data-reset>Reset drill</button><button type="button" class="button primary" data-finish disabled>Finish drill</button></div>
    </div>
  </section>
  <section class="session-summary" data-session-summary hidden aria-labelledby="summary-heading"><div class="section-label">Session reading</div><h2 id="summary-heading">Drill complete</h2><p data-summary-copy></p><div><button type="button" class="button primary" data-next>Try the next drill</button><button type="button" class="quiet-button" data-redo>Repeat this drill</button></div></section>`, isDemo);
}

function legalPage(kind: 'privacy' | 'terms'): string {
  if (kind === 'privacy') return shell(`<article class="legal"><p class="eyebrow">Policy · effective 28 August 2026</p><h1 tabindex="-1">Your strokes stay on your device</h1><p>Pen Display Drills does not send or save drawings, pen pressure, or practice scores. Practice exists only in the current tab.</p><h2>What this site stores</h2><p>The service worker caches app files for offline use. If you buy or restore the space pack, this browser stores your license token and its last verification result.</p><h2>What leaves your device</h2><p>No practice data leaves your device. License verification sends only your license token to Sociobot when needed. Checkout is handled by Sociobot and Dodo under their own policies.</p><h2>Remove stored data</h2><p>Clear this site's browser data to remove cached app files and your license. Closing the tab removes every practice stroke and score.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p></article>`);
  return shell(`<article class="legal"><p class="eyebrow">Terms · effective 28 August 2026</p><h1 tabindex="-1">Use the drills for personal practice</h1><p>You may use the five core drills without an account. The software is provided as-is and does not replace art instruction or medical advice.</p><h2>Space drafting pack</h2><p>The space drafting pack costs $6 as a one-time purchase. It includes orbital rings, radar spokes, and gantry depth drills for one user.</p><p>Sociobot and Dodo are the merchant of record. They handle payment and refunds. A refunded, expired, or revoked license stops opening paid drills.</p><h2>Fair use</h2><p>Do not interfere with the service, bypass license checks, or resell a license token. You keep ownership of anything you draw.</p><h2>Changes and contact</h2><p>Material changes will appear on this page with a new effective date. Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for help.</p></article>`);
}

function notFoundPage(): string {
  return shell(`<section class="not-found"><div class="lost-dial" aria-hidden="true">404</div><p class="eyebrow">Reading outside range</p><h1 tabindex="-1">This page is off the drawing board</h1><p>The address does not match a drill or policy page.</p><a class="button primary" href="/" data-link>Return to the practice desk</a></section>`);
}

function currentPath(): string {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path;
}

function navigate(path: string, replace = false): void {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  render();
}

function render(): void {
  const path = currentPath();
  const meta = routeData[path];
  document.title = meta?.title ?? `Page not found — ${APP_NAME}`;
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = meta?.description ?? 'Return to Pen Display Drills.';
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://pen-display-drills.sociobot.in${path}`;
  if (path === '/') app.innerHTML = homePage();
  else if (path === '/demo') app.innerHTML = practicePage(true);
  else if (path === '/practice') app.innerHTML = practicePage(false);
  else if (path === '/privacy') app.innerHTML = legalPage('privacy');
  else if (path === '/terms') app.innerHTML = legalPage('terms');
  else app.innerHTML = notFoundPage();
  bindCommon();
  if (path === '/demo' || path === '/practice') initPractice(path === '/demo');
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.focus({ preventScroll: true });
    document.querySelector('#route-status')!.textContent = document.title;
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

function bindCommon(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || link.origin !== location.origin) return;
    event.preventDefault();
    navigate(`${link.pathname}${link.search}${link.hash}`);
  }));
  document.querySelector<HTMLFormElement>('[data-license-form]')?.addEventListener('submit', handleLicenseSubmit);
  document.querySelector<HTMLButtonElement>('[data-update]')?.addEventListener('click', () => navigator.serviceWorker.getRegistration().then((registration) => {
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
    registration?.waiting?.postMessage('SKIP_WAITING');
  }));
}

function hasValidCachedLicense(): boolean {
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as LicenseVerdict | null;
    return Boolean(localStorage.getItem(LICENSE_KEY) && verdict?.valid);
  } catch { return false; }
}

async function verifyLicense(token: string): Promise<boolean> {
  const response = await fetch(`${BILLING_URL}/verify?license=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error('The license server did not respond.');
  const result = await response.json() as { valid: boolean };
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
  return result.valid;
}

async function handleLicenseSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const field = form.elements.namedItem('license') as HTMLInputElement;
  const message = form.querySelector<HTMLElement>('[data-license-message]');
  if (!message) return;
  const token = field.value.trim();
  if (!token) { message.textContent = 'No license was entered. Paste the token and try again.'; return; }
  message.textContent = 'Checking this license…';
  try {
    localStorage.setItem(LICENSE_KEY, token);
    const valid = await verifyLicense(token);
    if (valid) { message.textContent = 'License verified. The space pack is now active.'; setTimeout(render, 500); }
    else { localStorage.removeItem(LICENSE_KEY); message.textContent = 'This license is not active. Check the token or buy the pack.'; }
  } catch {
    message.textContent = 'The license could not be checked. Reconnect and try again.';
  }
}

function captureReturnedLicense(): void {
  const params = new URLSearchParams(location.search);
  const token = params.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  params.delete('license');
  const clean = `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`;
  history.replaceState({}, '', clean);
  if (currentPath() !== '/demo') void verifyLicense(token).then(render).catch(() => undefined);
}

function refreshStoredLicense(): void {
  if (currentPath() === '/demo') return;
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return;
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as LicenseVerdict | null;
    if (verdict && Date.now() - verdict.checkedAt < 86_400_000) return;
  } catch { /* A broken cache should be replaced by a fresh check. */ }
  void verifyLicense(token).then((valid) => {
    if (!valid) localStorage.removeItem(LICENSE_KEY);
    render();
  }).catch(() => undefined);
}

function initPractice(isDemo: boolean): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-canvas]') as HTMLCanvasElement;
  if (!canvas) return;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  if (!context) {
    const frame = canvas.closest('.canvas-frame');
    if (frame) frame.innerHTML = '<p class="canvas-error">The drawing area could not start. Reload this page or update your browser.</p>';
    return;
  }
  let drillIndex = isDemo ? 2 : 0;
  let strokes: Stroke[] = [];
  let activePoints: Point[] = [];
  let pointerDown = false;
  let keyboardDown = false;
  let keyboardPoint: Point = { x: 60, y: 80 };
  let completed = isDemo ? 2 : 0;
  const sampleScores = isDemo ? [82, 76] : [];
  let elapsed = 0;
  const scoreNode = document.querySelector<HTMLElement>('[data-score]')!;
  const feedback = document.querySelector<HTMLElement>('[data-feedback]')!;
  const progress = document.querySelector<HTMLElement>('[data-progress]')!;
  const finishButton = document.querySelector<HTMLButtonElement>('[data-finish]')!;
  const undoButton = document.querySelector<HTMLButtonElement>('[data-undo]')!;
  const needle = document.querySelector<HTMLElement>('[data-needle]')!;

  const currentDrill = () => drills[drillIndex];
  const cssSize = () => ({ width: canvas.clientWidth, height: canvas.clientHeight });
  const allTargets = () => { const { width, height } = cssSize(); return targetsFor(currentDrill().id, width, height); };

  function resizeCanvas(): void {
    const { width, height } = cssSize();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    keyboardPoint = { x: Math.min(keyboardPoint.x, width - 12), y: Math.min(keyboardPoint.y, height - 12) };
    draw();
  }

  function draw(): void {
    const { width, height } = cssSize();
    context.clearRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const targets = allTargets();
    context.strokeStyle = 'rgba(237, 174, 73, .22)';
    context.lineWidth = 16;
    context.setLineDash([]);
    for (const [a, b] of targets) { context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); }
    context.strokeStyle = '#8c5c0b';
    context.lineWidth = 2;
    context.setLineDash([8, 8]);
    for (const [a, b] of targets) { context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); }
    context.setLineDash([]);
    for (const stroke of strokes) drawStroke(stroke.points, stroke.score >= 68 ? '#246a5c' : '#b44937');
    if (activePoints.length) drawStroke(activePoints, '#172b2d');
    context.strokeStyle = keyboardDown ? '#b44937' : '#172b2d';
    context.lineWidth = 1;
    context.beginPath(); context.moveTo(keyboardPoint.x - 8, keyboardPoint.y); context.lineTo(keyboardPoint.x + 8, keyboardPoint.y); context.moveTo(keyboardPoint.x, keyboardPoint.y - 8); context.lineTo(keyboardPoint.x, keyboardPoint.y + 8); context.stroke();
  }

  function drawStroke(points: Point[], color: string): void {
    if (points.length < 2) return;
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath(); context.moveTo(points[0].x, points[0].y);
    for (const item of points.slice(1)) context.lineTo(item.x, item.y);
    context.stroke();
  }

  function canvasPoint(event: PointerEvent): Point {
    const box = canvas.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  function startStroke(item: Point): void {
    pointerDown = true;
    activePoints = [item];
    keyboardPoint = item;
    draw();
  }

  function addPoint(item: Point): void {
    if (!pointerDown) return;
    activePoints.push(item);
    keyboardPoint = item;
    draw();
  }

  function endStroke(): void {
    if (!pointerDown) return;
    pointerDown = false;
    if (activePoints.length > 1) {
      const result = scoreStroke(activePoints, allTargets());
      strokes.push({ points: [...activePoints], score: result.score });
      showFeedback(result.score, result.deviation);
    }
    activePoints = [];
    updateControls();
    draw();
  }

  function showFeedback(score: number, deviation: number): void {
    scoreNode.textContent = `${score}/100`;
    const band = score >= 84 ? 'excellent' : score >= 68 ? 'good' : score >= 45 ? 'fair' : 'wide';
    needle.className = band;
    feedback.textContent = score >= 84 ? `On target: ${deviation} px average deviation.` : score >= 68 ? `Close: ${deviation} px average deviation.` : `${deviation} px away. Slow down and aim at the end marker.`;
  }

  function updateControls(): void {
    const needed = currentDrill().minStrokes;
    const count = strokes.length;
    progress.textContent = count === 0 ? 'No target lines covered yet.' : `${Math.min(count, needed)} of ${needed} target ${needed === 1 ? 'stroke' : 'strokes'} drawn.`;
    undoButton.disabled = count === 0;
    finishButton.disabled = count === 0;
  }

  function resetDrill(): void {
    strokes = [];
    activePoints = [];
    scoreNode.textContent = '—';
    feedback.textContent = 'Make one stroke to get a reading.';
    needle.className = '';
    document.querySelector<HTMLElement>('[data-session-summary]')!.hidden = true;
    document.querySelector<HTMLElement>('.desk')!.hidden = false;
    updateControls();
    draw();
  }

  function selectDrill(id: string): void {
    const nextIndex = drills.findIndex((drill) => drill.id === id);
    if (nextIndex < 0 || (drills[nextIndex].paid && !hasValidCachedLicense())) return;
    drillIndex = nextIndex;
    document.querySelectorAll<HTMLButtonElement>('[data-drill]').forEach((button) => { const active = button.dataset.drill === id; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    const drill = currentDrill();
    document.querySelector<HTMLElement>('[data-drill-number]')!.textContent = String(drillIndex + 1).padStart(2, '0');
    document.querySelector<HTMLElement>('[data-drill-name]')!.textContent = drill.name;
    document.querySelector<HTMLElement>('[data-drill-instruction]')!.textContent = drill.instruction;
    document.querySelector<HTMLElement>('[data-cue]')!.textContent = `Coach cue: ${drill.cue}`;
    resetDrill();
  }

  canvas.addEventListener('pointerdown', (event) => { event.preventDefault(); canvas.setPointerCapture(event.pointerId); canvas.focus(); startStroke(canvasPoint(event)); });
  canvas.addEventListener('pointermove', (event) => { if (pointerDown) { event.preventDefault(); addPoint(canvasPoint(event)); } });
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
  canvas.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 10 : 3;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'r', 'R', 'n', 'N'].includes(event.key)) event.preventDefault();
    if (event.key === ' ') {
      keyboardDown = !keyboardDown;
      if (keyboardDown) startStroke(keyboardPoint); else endStroke();
      return;
    }
    if (event.key.toLowerCase() === 'r') { resetDrill(); return; }
    if (event.key.toLowerCase() === 'n') { selectDrill(drills[(drillIndex + 1) % drills.length].id); return; }
    if (event.key === 'ArrowLeft') keyboardPoint.x = Math.max(4, keyboardPoint.x - step);
    if (event.key === 'ArrowRight') keyboardPoint.x = Math.min(canvas.clientWidth - 4, keyboardPoint.x + step);
    if (event.key === 'ArrowUp') keyboardPoint.y = Math.max(4, keyboardPoint.y - step);
    if (event.key === 'ArrowDown') keyboardPoint.y = Math.min(canvas.clientHeight - 4, keyboardPoint.y + step);
    if (keyboardDown) addPoint({ ...keyboardPoint }); else draw();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-drill]').forEach((button) => button.addEventListener('click', () => selectDrill(button.dataset.drill ?? 'line')));
  document.querySelector<HTMLButtonElement>('[data-help]')!.addEventListener('click', (event) => { const button = event.currentTarget as HTMLButtonElement; const help = document.querySelector<HTMLElement>('[data-keyboard-help]')!; help.hidden = !help.hidden; button.setAttribute('aria-expanded', String(!help.hidden)); });
  document.querySelector<HTMLButtonElement>('[data-undo]')!.addEventListener('click', () => { strokes.pop(); updateControls(); draw(); if (!strokes.length) { scoreNode.textContent = '—'; feedback.textContent = 'Make one stroke to get a reading.'; } });
  document.querySelector<HTMLButtonElement>('[data-reset]')!.addEventListener('click', resetDrill);
  document.querySelector<HTMLButtonElement>('[data-finish]')!.addEventListener('click', () => {
    const score = Math.round(strokes.reduce((sum, stroke) => sum + stroke.score, 0) / strokes.length);
    completed += 1;
    sampleScores.push(score);
    document.querySelector<HTMLElement>('[data-completed]')!.textContent = `${completed} ${isDemo ? 'sample ' : ''}drills complete`;
    document.querySelector<HTMLElement>('[data-summary-copy]')!.textContent = `You finished ${currentDrill().name.toLowerCase()} with an average score of ${score}. Your ${score >= 68 ? 'control stayed near the target' : 'next pass should use a slower, single motion'}.`;
    document.querySelector<HTMLElement>('.desk')!.hidden = true;
    document.querySelector<HTMLElement>('[data-session-summary]')!.hidden = false;
    document.querySelector<HTMLButtonElement>('[data-next]')!.focus();
  });
  document.querySelector<HTMLButtonElement>('[data-next]')!.addEventListener('click', () => { let next = (drillIndex + 1) % drills.length; if (drills[next].paid && !hasValidCachedLicense()) next = 0; selectDrill(drills[next].id); document.querySelector<HTMLElement>('.desk')!.hidden = false; });
  document.querySelector<HTMLButtonElement>('[data-redo]')!.addEventListener('click', resetDrill);
  document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.addEventListener('click', () => { drillIndex = 2; completed = 2; sampleScores.splice(0, sampleScores.length, 82, 76); document.querySelector<HTMLElement>('[data-completed]')!.textContent = '2 sample drills complete'; selectDrill('box'); });
  new ResizeObserver(resizeCanvas).observe(canvas);
  selectDrill(currentDrill().id);
  const timer = window.setInterval(() => {
    if (document.querySelector('[data-canvas]') !== canvas) { clearInterval(timer); return; }
    elapsed += 1;
    const remaining = Math.max(0, 300 - elapsed);
    document.querySelector<HTMLElement>('[data-timer]')!.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    if (remaining === 0) { clearInterval(timer); document.querySelector<HTMLElement>('[data-timer]')!.textContent = 'Time'; }
  }, 1000);
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then((registration) => {
    const showUpdate = () => { const toast = document.querySelector<HTMLElement>('[data-update-toast]'); if (toast) toast.hidden = false; };
    if (registration.waiting) showUpdate();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => { if (registration.waiting && navigator.serviceWorker.controller) showUpdate(); }));
    void navigator.serviceWorker.ready.then((ready) => {
      const urls = performance.getEntriesByType('resource').map((entry) => entry.name).filter((url) => new URL(url).origin === location.origin);
      ready.active?.postMessage({ type: 'CACHE_URLS', urls });
    });
  }).catch(() => undefined));
}

window.addEventListener('popstate', render);
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-link]');
  if (!link || link.hash === '') return;
  const target = document.querySelector<HTMLElement>(link.hash);
  if (target) { event.preventDefault(); target.scrollIntoView(); target.focus({ preventScroll: true }); }
});
captureReturnedLicense();
render();
refreshStoredLicense();
registerServiceWorker();
