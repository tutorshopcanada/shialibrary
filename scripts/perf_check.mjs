// Loading-performance check. Serves site/ with on-the-fly brotli (like Cloudflare),
// loads pages on an emulated phone with Slow 4G + 4x CPU, cold cache, and reports medians.
// Usage: node scripts/perf_check.mjs [runs=3] [--shots=DIR]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node-tools/node_modules/playwright'); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const runs = Number(process.argv.find((a) => /^\d+$/.test(a)) || 3);
const shots = (process.argv.find((a) => a.startsWith('--shots=')) || '').slice(8);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.yaml': 'text/yaml', '.txt': 'text/plain', '.bin': 'application/octet-stream' };
const TEXT = /html|javascript|css|json|svg|yaml|text/;

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  const type = TYPES[path.extname(f)] || 'application/octet-stream';
  const headers = { 'content-type': type, vary: 'accept-encoding' };
  let body = fs.readFileSync(f);
  if (TEXT.test(type) && /\bbr\b/.test(req.headers['accept-encoding'] || '')) {
    body = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }); // ~ Cloudflare level
    headers['content-encoding'] = 'br';
  }
  headers['content-length'] = body.length;
  res.writeHead(200, headers); res.end(body);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

async function once(browser, url, name, i) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0, reqs = 0; const errors = [];
  cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
  cdp.on('Network.requestWillBeSent', () => { reqs++; });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(() => {
    window.__m = { lcp: 0, fcp: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    const mark = (k, test) => { const t = () => { if (test()) { window.__m[k] = performance.now(); return true; } }; const iv = setInterval(() => { if (t()) clearInterval(iv); }, 20); };
    document.addEventListener('DOMContentLoaded', () => {
      mark('ready', () => (document.getElementById('n')?.textContent || '').trim() !== '');
      mark('list', () => { const c = document.querySelector('#view li.card'); return c ? c.getBoundingClientRect().height > 0 : !document.querySelector('#view .loading') && document.getElementById('n')?.textContent.trim() !== ''; });
    });
  });
  await page.goto(base + url, { waitUntil: 'commit' });
  await page.waitForFunction(() => window.__m && window.__m.list, null, { timeout: 120000 });
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500); // let LCP/late requests settle
  const m = await page.evaluate(() => window.__m);
  if (shots && i === 0) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, `${name}.png`) }); }
  await ctx.close();
  return { fcp: m.fcp, lcp: m.lcp, ready: m.ready, list: m.list, kb: bytes / 1024, reqs, errors };
}

const browser = await playwright.chromium.launch();
const out = {};
for (const [name, url] of [['home', '/'], ['results', '/?q=prayer']]) {
  const rs = [];
  for (let i = 0; i < runs; i++) rs.push(await once(browser, url, name, i));
  out[name] = {
    FCP_ms: Math.round(median(rs.map((r) => r.fcp))), LCP_ms: Math.round(median(rs.map((r) => r.lcp))),
    engine_ready_ms: Math.round(median(rs.map((r) => r.ready))), results_visible_ms: Math.round(median(rs.map((r) => r.list))),
    transferred_KB: Math.round(median(rs.map((r) => r.kb))), requests: median(rs.map((r) => r.reqs)),
    console_errors: [...new Set(rs.flatMap((r) => r.errors))],
  };
}
await browser.close(); server.close();
console.table(out);
console.log(JSON.stringify(out, null, 1));
