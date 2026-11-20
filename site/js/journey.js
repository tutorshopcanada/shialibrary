// "The Ark of Salvation: From the Kaaba to Khorasan": a scroll-driven holographic map that visits the shrines one by
// one and ends in Toronto, where the catalog "comes to you". Decorative and navigational only: it draws
// a map and photographs, and links into the catalog. It never writes text at run time.
//
// How it works
//   * One pinned stage. Scroll position is the story clock (q): 0 is the first stop, 1 the second, and so on.
//   * A canvas draws the map in perspective (country outlines from Natural Earth, a dot matrix for land).
//   * Each stop opens a card; the card's photo then grows to fill the screen and slowly zooms toward the shrine.
//   * Autoplay moves the page itself along the same clock, so scrolling, pausing and scrubbing all agree.
//   * Everything is loaded when the section is near the screen: the map data and each photo on demand.
//
// Photographs come from the Al-Kafeel photo archive and Wikimedia Commons; credits are shown on the page and
// listed in journey/CREDITS.md.

const U = (p) => new URL('../journey/' + p, import.meta.url).href;

// Links are resolved by the page (app.js) so they always match the site's own routes.
// spec: { q } search, { path } learning path, { page } named page, { ask } focus the search box.
const STOPS = [
  { k: 'mecca', n: 'Mecca', c: 'Saudi Arabia', lat: 21.4225, lon: 39.8262, z: 3.3, iw: 1200, ih: 803, pos: [.5, .45], mpos: [.56, .5], fx: .59, fy: .52,
    sh: 'Masjid al-Haram and the Kaaba', alt: 'The Kaaba at the centre of the Great Mosque of Mecca, seen from above', cr: 'Photo: Al-Kafeel photo archive',
    bl: 'Buried in Mecca', bt: 'Lady Khadijah, the Prophet’s first wife, and Abu Talib, his uncle',
    t: 'The Kaaba is the direction Muslims face in prayer and the centre of the Hajj. The Prophet Muhammad was born in this city.',
    b1: { t: 'Read about the Prophet’s life', path: 'path-the-prophet-and-the-quran' }, b2: { t: 'Abu Talib and Lady Khadijah', q: 'Abu Talib' } },
  { k: 'medina', n: 'Medina', c: 'Saudi Arabia', lat: 24.4672, lon: 39.6111, z: 3.3, iw: 1440, ih: 1080, pos: [.5, .4], mpos: [.62, .4], fx: .63, fy: .42,
    sh: 'The Prophet’s Mosque and Al-Baqi’', alt: 'The green dome and minarets of the Prophet’s Mosque in Medina on a clear day', cr: 'Photo: سامر الحسيني · Al-Kafeel photo archive',
    bl: 'Buried in Medina', bt: 'The Prophet Muhammad, and four of the Imams at Al-Baqi’',
    t: 'The Prophet’s city after his move here in 622. His mosque and grave are here.',
    b1: { t: 'Read about the Prophet Muhammad', q: 'Prophet Muhammad' }, b2: { t: 'The four Imams of Al-Baqi’', q: 'Al-Baqi' } },
  { k: 'najaf', n: 'Najaf', c: 'Iraq', lat: 31.9961, lon: 44.3149, z: 4.0, iw: 1500, ih: 974, pos: [.5, .4], fx: .5, fy: .33,
    sh: 'Shrine of Imam Ali', alt: 'The golden dome and minarets of the Shrine of Imam Ali in Najaf, decorated with lights at night', cr: 'Photo: اسعد زوين · Al-Kafeel photo archive',
    bl: 'Buried in Najaf', bt: 'Imam Ali, the first Imam',
    t: 'Najaf is also one of the main centres of Shia scholarship.',
    b1: { t: 'Read about Imam Ali', q: 'Imam Ali' } },
  { k: 'karbala', n: 'Karbala', c: 'Iraq', lat: 32.6163, lon: 44.0339, z: 4.0, iw: 1635, ih: 1080, pos: [.55, .5], mpos: [.88, .5], fx: .72, fy: .58,
    sh: 'Shrine of Imam Husayn', alt: 'The twin golden minarets and the golden dome of the Shrine of Imam Husayn in Karbala at dusk, with a full moon beside a red flag', cr: 'Photo: سامر الحسيني · Al-Kafeel photo archive',
    bl: 'Buried in Karbala', bt: 'Imam Husayn, the third Imam, and his brother Abbas',
    t: 'Where Imam Husayn was killed in 680. Millions of pilgrims walk here each year for Arbaeen, forty days after Ashura.',
    b1: { t: 'Read about Imam Husayn', q: 'Imam Husayn' }, b2: { t: 'Karbala and Ashura', path: 'path-karbala-and-ashura' } },
  { k: 'kadhimiya', n: 'Baghdad', c: 'Iraq', lat: 33.3797, lon: 44.3394, z: 4.0, iw: 1500, ih: 793, pos: [.5, .5], fx: .5, fy: .62,
    sh: 'Kadhimiya: Shrine of Imam al-Kadhim and Imam al-Jawad', alt: 'The two golden domes and four minarets of the Kadhimiya shrine in Baghdad at dusk', cr: 'Photo: علي ورد الغبان · Al-Kafeel photo archive',
    bl: 'Buried in Kadhimiya', bt: 'Imam al-Kadhim, the seventh Imam, and Imam al-Jawad, the ninth',
    t: 'Two golden domes mark the shrine in the north of Baghdad.',
    b1: { t: 'Read about Imam al-Kadhim', q: 'Imam al-Kadhim' }, b2: { t: 'Read about Imam al-Jawad', q: 'Imam al-Jawad' } },
  { k: 'mashhad', n: 'Mashhad', c: 'Iran', lat: 36.288, lon: 59.6168, z: 3.0, iw: 1416, ih: 1080, pos: [.4, .55], mpos: [.36, .5], fx: .36, fy: .5,
    sh: 'Shrine of Imam al-Ridha', alt: 'The golden dome and gold minaret of the Shrine of Imam al-Ridha in Mashhad under a blue sky', cr: 'Photo: Al-Kafeel photo archive',
    bl: 'Buried in Mashhad', bt: 'Imam al-Ridha, the eighth Imam',
    t: 'It is the only burial place of an Imam in Iran.',
    b1: { t: 'Read about Imam al-Ridha', q: 'Imam al-Ridha' } },
  { k: 'qom', n: 'Qom', c: 'Iran', lat: 34.6393, lon: 50.8764, z: 3.2, iw: 1440, ih: 1080, pos: [.5, .5], fx: .56, fy: .45,
    sh: 'Shrine of Fatima Masumah', alt: 'The golden dome and four minarets of the shrine of Fatima Masumah in Qom at dusk', cr: 'Photo: Al-Kafeel photo archive',
    bl: 'Buried in Qom', bt: 'Lady Fatima Masumah, sister of the eighth Imam',
    t: 'Qom is also a major city of religious study, with many seminaries.',
    b1: { t: 'Read about Lady Masumah', q: 'Masooma' } },
  { k: 'samarra', n: 'Samarra', c: 'Iraq', lat: 34.1987, lon: 43.8729, z: 4.0, iw: 1500, ih: 1000, pos: [.5, .5], fx: .55, fy: .5,
    sh: 'Al-Askari Shrine', alt: 'The golden dome and minarets of the Al-Askari Shrine in Samarra under a blue sky', cr: 'Photo: أكرم الفيحان · Al-Kafeel photo archive',
    bl: 'Buried in Samarra', bt: 'Imam al-Hadi, the tenth Imam, and Imam al-Askari, the eleventh',
    t: 'Shias also link the city to the hiding of the twelfth Imam.',
    b1: { t: 'Read about Imam al-Hadi', q: 'Imam al-Hadi' }, b2: { t: 'Read about Imam al-Askari', q: 'Imam al-Askari' } },
  { k: 'toronto', n: 'Toronto', c: 'Canada', lat: 43.6532, lon: -79.3832, z: 3.0, iw: 2000, ih: 1333, pos: [.5, .4], fx: .5, fy: .38,
    sh: 'Ontario · Where it comes to you', alt: 'The Toronto skyline and the CN Tower across the water at dusk', cr: 'Photo: Jchmrt · CC BY-SA 4.0 · Wikimedia Commons, cropped',
    bl: 'You are here', bt: 'every place on this journey is now a link away',
    t: 'The journey ends where you are. ShiaLib brings these places, and the people buried in them, to your screen, with links to where each can be read.',
    b1: { t: 'Ask a question', ask: true }, b2: { t: 'Start with the beginner pages', page: 'beginners' } },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sm = (t) => { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
const cl = (x, a, b) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;

export function mountJourney(root, opts = {}) {
  const N = STOPS.length, QMIN = -.85, QMAX = N - 1 + .35;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const calm = reduce || saveData;           // a still map and a plain list, no scroll-driven motion
  const link = opts.link || (() => '#');
  const onAsk = opts.onAsk || (() => {});

  // ---- markup -------------------------------------------------------------------------------------
  const cardHtml = (s, i) => {
    const btn = (b, cls) => {
      if (!b) return '';
      return b.ask ? `<a class="j-btn ${cls}" href="#" data-ask="1">${esc(b.t)}</a>` : `<a class="j-btn ${cls}" href="${esc(link(b))}">${esc(b.t)}</a>`;
    };
    return `<article class="j-card" data-i="${i}">
      <figure class="j-ph"><img alt="${esc(s.alt)}" data-src="${U('img/' + s.k + '.jpg')}" width="${s.iw}" height="${s.ih}" decoding="async" style="object-position:${s.pos[0] * 100}% ${s.pos[1] * 100}%"><figcaption>${esc(s.cr)}</figcaption></figure>
      <div class="j-body"><p class="j-eyebrow">Stop ${i + 1} of ${N} · ${esc(s.c)}</p><h2>${esc(s.n)}</h2><p class="j-sh">${esc(s.sh)}</p>
        <p class="j-bur"><i></i><span><b>${esc(s.bl)}</b> ${esc(s.bt)}</span></p><p class="j-t">${esc(s.t)}</p>
        <div class="j-links">${btn(s.b1, '')}${btn(s.b2, 'ghost')}</div></div></article>`;
  };
  root.classList.add('jrn');
  root.style.setProperty('--j-units', String(N + .2));
  root.setAttribute('aria-label', 'The Ark of Salvation: From the Kaaba to Khorasan. A journey through the shrines of the Prophet and the Imams, from Mecca to Samarra and on to Toronto');
  root.innerHTML = `<button class="j-cue" type="button" aria-label="Play the journey">Legacy of Islam <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
    <div class="j-stage" id="jStage">
      <canvas class="j-map" aria-hidden="true"></canvas><div class="j-vig" aria-hidden="true"></div><div class="j-scan" aria-hidden="true"></div>
      <div class="j-labels" aria-hidden="true"></div>
      <div class="j-hud"><p class="j-k" aria-hidden="true">The Ark of Salvation: From the Kaaba to Khorasan</p><p class="j-c" aria-hidden="true">21.42° N · 39.83° E</p>
</div>
      <button class="j-play" type="button" aria-label="Play the journey"><svg class="i-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg><svg class="i-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4.5h4.2v15H6zM13.8 4.5H18v15h-4.2z"/></svg><span>Play</span></button>
      <button class="j-ask" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>Ask a question</button>
      <div class="j-imms" aria-hidden="true"></div>
      <div class="j-cards">${STOPS.map(cardHtml).join('')}</div>
      <div class="j-tl"><div class="j-track"><i class="j-fill"></i><i class="j-dot"></i></div><div class="j-stops"></div></div>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const stage = $('.j-stage'), cv = $('.j-map'), ctx = cv.getContext('2d'), labelsEl = $('.j-labels'), immsEl = $('.j-imms'), stopsEl = $('.j-stops');
  const cardsEl = $('.j-cards'), cards = [].slice.call(root.querySelectorAll('.j-card')), playBtn = $('.j-play'), coords = $('.j-c');

  // ---- state ---------------------------------------------------------------------------------------
  let GEO = null, VW = 0, VH = 0, DPR = 1, MOBILE = false, destroyed = false;
  const F = 1500;
  let cHi, cLo, wDots, naMid, fHi = {}, fLo = {}, naFine = {}, STEPF = 13, halo = null;
  const routePts = [], ARC = 40, lbls = [], tlBtns = [], imms = [];
  const cam = { cx: 0, cy: 0, zoom: 1, tilt: 40, yaw: 0, ax: .5, ay: .5, rp: 0, w: 0 };
  let px = 0, py = 0, pk = 1, CT = .5, ST = .8, CY = 1, SY = 0, SX0 = 0, SY0 = 0, ZM = 1;

  function zf() { return Math.max(.5, Math.pow(VW / 1360, .6)); }
  function setCam(c) { const tr = c.tilt * Math.PI / 180, yw = c.yaw * Math.PI / 180; CT = Math.cos(tr); ST = Math.sin(tr); CY = Math.cos(yw); SY = Math.sin(yw); SX0 = VW * c.ax; SY0 = VH * c.ay; ZM = c.zoom; }
  // Perspective projection of a map point (x, y in map units, z above the plane) to screen pixels.
  function P(x, y, z) {
    const dx = x - cam.cx, dy = y - cam.cy, rx = dx * CY - dy * SY, ry = dx * SY + dy * CY, wy = -ry;
    const v = wy * CT + z * ST, w = (wy * ST - z * CT) * ZM, den = F + w;
    if (den < 260) return false;
    const k = F / den; px = SX0 + rx * ZM * k; py = SY0 - v * ZM * k; pk = k; return true;
  }
  const plat = (f) => (f < .34 ? 0 : f > .66 ? 1 : sm((f - .34) / .32));
  function camAt(q) {
    const c = cam, ovz = cl(VW * .66 / 2150, .1, .5), s0 = STOPS[0];
    if (q < 0) {
      const t = (q - QMIN) / (0 - QMIN), e = sm(cl((t - .18) / .82, 0, 1));
      c.cx = lerp(1765, s0.x, e); c.cy = lerp(1760, s0.y, e);
      c.zoom = Math.exp(lerp(Math.log(ovz), Math.log(s0.z * zf()), e)); c.tilt = lerp(30, 58, e); c.yaw = lerp(0, -4, e); c.rp = 0;
      c.w = sm(cl((q + .3) / .3, 0, 1));
    } else {
      const i = Math.min(Math.floor(q), N - 1), f = i >= N - 1 ? 0 : q - i, e2 = plat(f), a = STOPS[i], b = STOPS[Math.min(i + 1, N - 1)];
      c.cx = lerp(a.x, b.x, e2); c.cy = lerp(a.y, b.y, e2);
      const zin = Math.exp(lerp(Math.log(a.z), Math.log(b.z), e2)) * zf(), dist = Math.hypot(b.x - a.x, b.y - a.y), dip = Math.pow(Math.sin(Math.PI * e2), 1.2), zb = Math.min(zin, .7 * VW / (dist + 300));
      c.zoom = Math.exp(lerp(Math.log(zin), Math.log(zb), dip)); c.tilt = lerp(58, i === N - 2 ? 30 : 40, dip); c.yaw = -4 + 6 * Math.sin(q * .9); c.rp = i + e2;
      const d = Math.abs(q - Math.round(q)); c.w = q <= N - 1 ? sm(cl(1 - (d - .12) / .22, 0, 1)) : 1;
    }
    c.ax = MOBILE ? .5 : lerp(.5, .67, c.w); c.ay = MOBILE ? lerp(.5, .28, c.w) : .52;
    return c;
  }

  // ---- drawing -------------------------------------------------------------------------------------
  function poly(arr, z) {
    let pen = false;
    for (let i = 0; i < arr.length; i += 2) { if (P(arr[i], arr[i + 1], z)) { if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; } } else pen = false; }
  }
  function line(x0, y0, x1, y1, n) {
    let pen = false;
    for (let k = 0; k <= n; k++) { const t = k / n; if (P(lerp(x0, x1, t), lerp(y0, y1, t), 0)) { if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; } } else pen = false; }
  }
  function drawGrat() {
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(111,224,210,.075)'; ctx.beginPath();
    let x, y, lon, lat;
    for (lon = GEO.LON0; lon <= 66; lon += 2) { x = (lon - GEO.LON0) * GEO.U; line(x, 0, x, GEO.H, 28); }
    for (lat = 10; lat <= 42; lat += 2) { y = (GEO.MT - merc(lat)) * GEO.U; line(0, y, GEO.W, y, 26); }
    ctx.stroke();
    if (ZM < .35) {
      const a = cl((.35 - ZM) / .2, 0, 1) * .1, y0 = (GEO.MT - merc(78)) * GEO.U, y1 = (GEO.MT - merc(-52)) * GEO.U;
      ctx.strokeStyle = 'rgba(111,224,210,' + a + ')'; ctx.beginPath();
      for (lon = -180; lon <= 180; lon += 20) { x = (lon - GEO.LON0) * GEO.U; line(x, y0, x, y1, 60); }
      for (lat = -40; lat <= 80; lat += 20) { y = (GEO.MT - merc(lat)) * GEO.U; line(-21200, y, 15000, y, 90); }
      ctx.stroke();
    }
    if (ZM > 1.2) {
      const Rw = VW * .8 / ZM + 200, gs = ZM > 2.4 ? 50 : 100, a2 = cl((ZM - 1.2) / 1, 0, 1) * .1, x0 = Math.floor((cam.cx - Rw) / gs) * gs, y0 = Math.floor((cam.cy - Rw) / gs) * gs, x1 = cam.cx + Rw, y1 = cam.cy + Rw;
      ctx.strokeStyle = 'rgba(111,224,210,' + a2 + ')'; ctx.beginPath();
      for (x = x0; x <= x1; x += gs) line(x, y0, x, y1, 4);
      for (y = y0; y <= y1; y += gs) line(x0, y, x1, y, 4);
      ctx.stroke();
    }
  }
  function drawCountries() {
    const cs = GEO.c;
    let i, j, r;
    ctx.lineJoin = 'round';
    ctx.beginPath(); for (i = 0; i < cs.length; i++) if (!cs[i].hi) for (j = 0; j < cs[i].r.length; j++) poly(cs[i].r[j], 0);
    if (ZM < 1.3) { ctx.fillStyle = 'rgba(31,61,130,.10)'; ctx.fill(); } ctx.strokeStyle = 'rgba(95,150,225,.4)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); for (i = 0; i < cs.length; i++) if (cs[i].hi) for (j = 0; j < cs[i].r.length; j++) poly(cs[i].r[j], 0);
    if (ZM < 1.3) { ctx.fillStyle = 'rgba(14,124,128,.20)'; ctx.fill(); }
    const zs = [[30, .14, 1], [15, .28, 1], [0, .12, 7], [0, .95, 1.6]];
    for (let k = 0; k < zs.length; k++) { ctx.beginPath(); for (i = 0; i < cs.length; i++) if (cs[i].hi) for (j = 0; j < cs[i].r.length; j++) poly(cs[i].r[j], zs[k][0]); ctx.strokeStyle = 'rgba(111,224,210,' + zs[k][1] + ')'; ctx.lineWidth = zs[k][2]; ctx.stroke(); }
    const wo = cl((.6 - ZM) / .3, 0, 1);
    if (wo > .02) { ctx.beginPath(); for (i = 0; i < GEO.w110.length; i++) { const wc = GEO.w110[i]; if (wc.skip) continue; for (j = 0; j < wc.r.length; j++) poly(wc.r[j], 0); } ctx.strokeStyle = 'rgba(95,150,225,' + (.42 * wo) + ')'; ctx.lineWidth = 1; ctx.stroke(); }
    if (cam.cx < -3000 || ZM < .2) {
      ctx.beginPath(); for (i = 0; i < GEO.na.length; i++) for (j = 0; j < GEO.na[i].r.length; j++) poly(GEO.na[i].r[j], 0);
      ctx.strokeStyle = 'rgba(111,224,210,.16)'; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = 'rgba(111,224,210,.9)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); for (i = 0; i < GEO.lk.length; i++) poly(GEO.lk[i], 0);
      ctx.strokeStyle = 'rgba(143,200,255,.8)'; ctx.lineWidth = 1.2; ctx.stroke();
    }
  }
  const boost = []; let WR = 0;
  function dot(x, y, sz) {
    const dx = x - cam.cx, dy = y - cam.cy; let z = 0, b = 0;
    if (dx < 1500 && dx > -1500 && dy < 1500 && dy > -1500) { const d = Math.sqrt(dx * dx + dy * dy), df = d - WR; if (df * df < 9000) { b = Math.exp(-df * df / 4500); z = b * 16; } }
    if (!P(x, y, z)) return;
    if (px < -6 || px > VW + 6 || py < -6 || py > VH + 6) return;
    const s = Math.min(3.4, sz * (.75 + .4 * pk));
    if (b > .12) boost.push(px, py, b); else ctx.fillRect(px - s / 2, py - s / 2, s, s);
  }
  function layerArr(L, alpha, col, sz) { ctx.fillStyle = col; ctx.globalAlpha = alpha; const xs = L.xs, ys = L.ys, n = xs.length; for (let i = 0; i < n; i++) dot(xs[i], ys[i], sz); }
  function layerRows(map, step, alpha, col, sz) {
    ctx.fillStyle = col; ctx.globalAlpha = alpha;
    const Rw = VW * .75 / ZM + 160, cx = cam.cx, cy = cam.cy, j0 = Math.floor((cy - Rw) / step), j1 = Math.ceil((cy + Rw) / step), ia = Math.floor((cx - Rw) / step), ib = Math.ceil((cx + Rw) / step);
    for (let j = j0; j <= j1; j++) { const rr = map[j]; if (!rr) continue; const y = j * step; for (let k = 0; k < rr.length; k += 2) { const a0 = Math.max(rr[k], ia), a1 = Math.min(rr[k + 1], ib); for (let i = a0; i <= a1; i++) dot(i * step, y, sz); } }
  }
  function drawDots(t) {
    WR = ((t * .16) % 1) * 1100; boost.length = 0;
    const sizeC = Math.min(2.4, .95 + .4 * ZM), sizeF = Math.min(2.2, .85 + .3 * ZM);
    const wa = cl(1 - (ZM - .1) / .22, 0, 1);
    if (wa > .01) layerArr(wDots, .22 * wa, '#5f96e1', 1.15 + .3 * ZM);
    if (cam.cx > -2500) {
      const ca = (ZM < .8 ? 1 : ZM > 1.1 ? 0 : 1 - (ZM - .8) / .3) * cl((ZM - .1) / .15, 0, 1), fa = ZM < .8 ? 0 : ZM > 1.1 ? 1 : (ZM - .8) / .3;
      if (ca > .01) { layerArr(cHi, .62 * ca, '#6fe0d2', sizeC); layerArr(cLo, .22 * ca, '#5f96e1', sizeC); }
      if (fa > .01) { layerRows(fHi, STEPF, .6 * fa, '#6fe0d2', sizeF); layerRows(fLo, STEPF, .24 * fa, '#5f96e1', sizeF); }
    }
    if (cam.cx < -4500) {
      const nm = cl((ZM - .14) / .14, 0, 1) * (1 - cl((ZM - .9) / .3, 0, 1)), nf = cl((ZM - .9) / .3, 0, 1);
      if (nm > .01) layerArr(naMid, .6 * nm, '#6fe0d2', sizeC);
      if (nf > .01) layerRows(naFine, STEPF, .62 * nf, '#6fe0d2', sizeF);
    }
    ctx.globalAlpha = 1;
    if (boost.length) { ctx.fillStyle = '#fff2cf'; for (let i = 0; i < boost.length; i += 3) { ctx.globalAlpha = .35 + .65 * boost[i + 2]; const s = sizeC * 1.5; ctx.fillRect(boost[i] - s / 2, boost[i + 1] - s / 2, s, s); } ctx.globalAlpha = 1; }
  }
  const hp = [0, 0, 0];
  function routeAt(idxF, out) { const i = Math.min(Math.floor(idxF), routePts.length / 3 - 2), f = idxF - i, a = i * 3, b = a + 3; out[0] = lerp(routePts[a], routePts[b], f); out[1] = lerp(routePts[a + 1], routePts[b + 1], f); out[2] = lerp(routePts[a + 2], routePts[b + 2], f); }
  function drawRoute(rp, t) {
    const total = routePts.length / 3, idxF = cl(rp * ARC, 0, total - 1.001);
    let pen = false;
    ctx.setLineDash([3, 8]); ctx.strokeStyle = 'rgba(230,189,106,.3)'; ctx.lineWidth = 1.4; ctx.beginPath();
    for (let i = 0; i < total; i++) { if (P(routePts[i * 3], routePts[i * 3 + 1], routePts[i * 3 + 2])) { if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; } } else pen = false; }
    ctx.stroke(); ctx.setLineDash([]);
    const prog = () => { let p = false; for (let k = 0; k <= Math.floor(idxF); k++) { if (P(routePts[k * 3], routePts[k * 3 + 1], routePts[k * 3 + 2])) { if (p) ctx.lineTo(px, py); else { ctx.moveTo(px, py); p = true; } } else p = false; } routeAt(idxF, hp); if (P(hp[0], hp[1], hp[2])) { if (p) ctx.lineTo(px, py); else ctx.moveTo(px, py); } };
    ctx.lineCap = 'round'; ctx.beginPath(); prog(); ctx.strokeStyle = 'rgba(230,189,106,.14)'; ctx.lineWidth = 10; ctx.stroke();
    ctx.beginPath(); prog(); ctx.strokeStyle = '#f3d48a'; ctx.lineWidth = 2.4; ctx.stroke();
    routeAt(idxF, hp);
    if (P(hp[0], hp[1], hp[2])) {
      const hx = px, hy = py, hk = pk;
      if (P(hp[0], hp[1], 0)) { ctx.strokeStyle = 'rgba(243,212,138,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(px, py); ctx.stroke(); }
      const sz = Math.max(34, 58 * hk) * (1 + .08 * Math.sin(t * 5)); ctx.drawImage(halo, hx - sz / 2, hy - sz / 2, sz, sz);
    }
  }
  function drawMarkers(q, rp, t) {
    const CTf = Math.max(.35, CT);
    for (let i = 0; i < N; i++) {
      const s = STOPS[i], L = lbls[i];
      if (!P(s.x, s.y, 0)) { L.style.opacity = 0; continue; }
      const gx = px, gy = py, act = sm(cl(1 - Math.abs(q - i) / .34, 0, 1)), vis = rp >= i - .02, col = vis ? '230,189,106' : '111,224,210', h = 22 + 58 * act;
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(' + col + ',' + (.55 + .4 * act) + ')'; ctx.beginPath(); ctx.ellipse(gx, gy, 7 + 7 * act, (7 + 7 * act) * CTf, 0, 0, Math.PI * 2); ctx.stroke();
      if (act > .05) {
        for (let rr2 = 0; rr2 < 3; rr2++) {
          const wr2 = 28 + rr2 * 30; let pen2 = false; ctx.strokeStyle = 'rgba(' + col + ',' + (.2 * act * (1 - rr2 * .22)) + ')'; ctx.lineWidth = 1.2; ctx.beginPath();
          for (let a2 = 0; a2 <= 48; a2++) { const an = a2 / 48 * Math.PI * 2 + t * .15 * (rr2 % 2 ? 1 : -1); if (P(s.x + Math.cos(an) * wr2, s.y + Math.sin(an) * wr2, 0)) { if (pen2) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen2 = true; } } else pen2 = false; }
          ctx.stroke();
        }
        const pr = ((t * .6 + i * .37) % 1), rr = 10 + pr * 52 * act; ctx.strokeStyle = 'rgba(' + col + ',' + ((1 - pr) * .6 * act) + ')'; ctx.beginPath(); ctx.ellipse(gx, gy, rr, rr * CTf, 0, 0, Math.PI * 2); ctx.stroke();
      }
      const g = ctx.createLinearGradient(0, gy, 0, gy - h); g.addColorStop(0, 'rgba(' + col + ',.9)'); g.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy - h); ctx.stroke();
      const ds = 4 + 4 * act; ctx.fillStyle = 'rgb(' + col + ')'; ctx.beginPath(); ctx.moveTo(gx, gy - h - ds); ctx.lineTo(gx + ds, gy - h); ctx.lineTo(gx, gy - h + ds); ctx.lineTo(gx - ds, gy - h); ctx.closePath(); ctx.fill();
      const off = gx < -40 || gx > VW + 40 || gy < -40 || gy > VH + 40;
      L.style.opacity = off ? 0 : 1; L.style.transform = 'translate3d(' + (gx - 12).toFixed(1) + 'px,' + (gy - h - 36 - 4 * act).toFixed(1) + 'px,0)';
      L.classList.toggle('on', act > .5); L.classList.toggle('names', ZM > 1.9 && act <= .5);
    }
  }
  const CL = [['Saudi Arabia', 46, 24.2], ['Iraq', 41.7, 32.9], ['Iran', 54.2, 32.4]];
  function drawCountryNames() {
    const a = cl(1 - (ZM - .45) / .9, 0, 1); if (a < .03 || ZM < .2) return;
    ctx.fillStyle = 'rgba(111,224,210,' + (.32 * a) + ')'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < CL.length; i++) { const x = (CL[i][1] - GEO.LON0) * GEO.U, y = (GEO.MT - merc(CL[i][2])) * GEO.U; if (!P(x, y, 0)) continue; ctx.font = '500 ' + Math.max(12, Math.min(30, 44 * ZM * pk)) + 'px Inter,system-ui,sans-serif'; ctx.fillText(CL[i][0], px, py); }
  }

  // ---- the photo: grows out of the card, fills the screen, then zooms toward the shrine --------------
  // Both the card photo and the full-screen photo are "cover" crops of the same picture. The full-screen
  // image is placed by the same maths as the card, then eased to its own crop, so the two always match and
  // no aspect ratio can make the picture jump or stretch.
  const posOf = (s) => (MOBILE && s.mpos ? s.mpos : s.pos);
  function cover(bw, bh, s) {
    const sc = Math.max(bw / s.iw, bh / s.ih), p = posOf(s);
    return { sc, x: (bw - s.iw * sc) * p[0], y: (bh - s.ih * sc) * p[1] };
  }
  // The card photo uses the same crop as the full-screen photo, so the two always agree.
  function applyPos() { cards.forEach((cd, i) => { const p = posOf(STOPS[i]); cd.querySelector('.j-ph img').style.objectPosition = (p[0] * 100) + '% ' + (p[1] * 100) + '%'; }); }
  function buildImms() {
    cards.forEach((cd, i) => {
      const s = STOPS[i], d = document.createElement('div');
      d.className = 'j-imm';
      d.innerHTML = `<img alt="" width="${s.iw}" height="${s.ih}" decoding="async"><i class="j-shade"></i><p class="j-cr">${esc(s.cr)}</p>`;
      immsEl.appendChild(d);
      imms.push({ el: d, img: d.querySelector('img'), sh: d.querySelector('.j-shade'), cr: d.querySelector('.j-cr'), on: false });
    });
  }
  function updateImm(i, q) {
    const d = q - i, ad = Math.abs(d), e = sm(cl((.30 - ad) / .16, 0, 1)), im = imms[i], cd = cards[i];
    if (e <= .001) { if (im.on) { im.on = false; im.el.style.display = 'none'; cd.classList.remove('exp'); } return 0; }
    const s = STOPS[i];
    if (!im.on) { im.on = true; im.el.style.display = 'block'; cd.classList.add('exp'); }
    const sr = stage.getBoundingClientRect(), r = cd.querySelector('.j-ph').getBoundingClientRect(), rx = r.left - sr.left, ry = r.top - sr.top, rw = r.width, rh = r.height;
    const c0 = cover(rw, rh, s), c1 = cover(VW, VH, s);
    const sc = lerp(c0.sc, c1.sc, e), ax = lerp(rx + c0.x, c1.x, e), ay = lerp(ry + c0.y, c1.y, e);
    const zp = cl((d + .14) / .28, 0, 1), z = 1 + .2 * zp * e;       // slow push-in once the photo fills the screen
    const fpx = ax + s.fx * s.iw * sc, fpy = ay + s.fy * s.ih * sc;  // the shrine, in screen pixels: scale about it
    im.img.style.transform = 'translate3d(' + (fpx - (fpx - ax) * z).toFixed(2) + 'px,' + (fpy - (fpy - ay) * z).toFixed(2) + 'px,0) scale(' + (sc * z).toFixed(5) + ')';
    im.el.style.clipPath = 'inset(' + lerp(ry, 0, e).toFixed(1) + 'px ' + lerp(VW - rx - rw, 0, e).toFixed(1) + 'px ' + lerp(VH - ry - rh, 0, e).toFixed(1) + 'px ' + lerp(rx, 0, e).toFixed(1) + 'px round ' + lerp(20, 0, e).toFixed(1) + 'px)';
    im.sh.style.opacity = e.toFixed(3); im.cr.style.opacity = e.toFixed(3);
    return e;
  }
  // Photographs are fetched only when a stop is close to being reached.
  function wantImages(q) {
    for (let i = 0; i < N; i++) {
      if (Math.abs(q - i) > 1.6) continue;
      const img = cards[i].querySelector('.j-ph img');
      if (!img.getAttribute('src')) { img.src = img.dataset.src; if (imms[i]) imms[i].img.src = img.dataset.src; }
    }
  }

  let lastIdx = -1;
  function draw(q, t) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, VW, VH);
    const c = camAt(q); setCam(c);
    drawGrat(); drawCountries(); drawDots(t); drawCountryNames(); drawRoute(c.rp, t); drawMarkers(q, c.rp, t);
    const near = cl(Math.round(q), 0, N - 1); let maxE = 0, mv = 0;
    if (near !== lastIdx) { lastIdx = near; const s = STOPS[near]; coords.textContent = s.lat.toFixed(2) + '° N · ' + Math.abs(s.lon).toFixed(2) + '° ' + (s.lon < 0 ? 'W' : 'E'); tlBtns.forEach((b, k) => { b.classList.toggle('on', k === near); if (k === near) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }); }
    for (let i = 0; i < N; i++) {
      const v = sm(cl((.42 - Math.abs(q - i)) / .14, 0, 1)), cd = cards[i]; if (v > mv) mv = v;
      cd.style.setProperty('--v', v.toFixed(3));
      const on = v > .6; if (cd._on !== on) { cd._on = on; cd.classList.toggle('on', on); }
      const hid = v < .05; if (cd._hid !== hid) { cd._hid = hid; if (hid) { cd.setAttribute('inert', ''); cd.setAttribute('aria-hidden', 'true'); } else { cd.removeAttribute('inert'); cd.removeAttribute('aria-hidden'); } }
      const e = imms.length ? updateImm(i, q) : 0; if (e > maxE) maxE = e;
    }
    cardsEl.style.setProperty('--sheet', mv.toFixed(3)); stage.style.setProperty('--imm', maxE.toFixed(3));
    const pr = cl(c.rp / (N - 1), 0, 1) * 100; fillEl.style.width = pr + '%'; dotEl.style.left = pr + '%';
    wantImages(q);
  }
  const fillEl = $('.j-fill'), dotEl = $('.j-dot');

  // ---- loading the map data and sizing ------------------------------------------------------------------
  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5); VW = cv.clientWidth || stage.clientWidth; VH = cv.clientHeight || stage.clientHeight; MOBILE = VW < 860;
    cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
    applyPos();
  }
  function expand(rows, step) { const xs = [], ys = []; rows.forEach((r) => { const j = r[0], v = r[1]; for (let k = 0; k < v.length; k += 2) for (let i = v[k]; i <= v[k + 1]; i++) { xs.push(i * step); ys.push(j * step); } }); return { xs: new Float32Array(xs), ys: new Float32Array(ys) }; }
  function byRow(rows) { const m = {}; rows.forEach((r) => { m[r[0]] = r[1]; }); return m; }
  // The map is set up in small steps, handing the page back between them, so a slow device never freezes for long.
  const tick = () => new Promise((ok) => (window.requestIdleCallback ? requestIdleCallback(() => ok(), { timeout: 250 }) : setTimeout(ok, 30)));
  async function buildGeo(g) {
    GEO = g;
    STOPS.forEach((s) => { const c = g.cities[s.k]; s.x = c[0]; s.y = c[1]; });
    cHi = expand(g.hi, g.step); await tick(); cLo = expand(g.lo, g.step); await tick();
    STEPF = g.stepF; fHi = byRow(g.hiF); fLo = byRow(g.loF); await tick();
    wDots = expand(g.wd, g.wstep); await tick(); naMid = expand(g.nam, g.nastep); naFine = byRow(g.naf); await tick();
    for (let i = 0; i < N - 1; i++) { const a = STOPS[i], b = STOPS[i + 1], dist = Math.hypot(b.x - a.x, b.y - a.y), lift = i === N - 2 ? dist * .09 : cl(dist * .18, 18, 120); for (let s = 0; s < ARC; s++) { const t = s / ARC; routePts.push(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lift * Math.sin(Math.PI * t)); } }
    const e = STOPS[N - 1]; routePts.push(e.x, e.y, 0);
    halo = document.createElement('canvas'); halo.width = halo.height = 64; const hc = halo.getContext('2d'), gr = hc.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,246,220,1)'); gr.addColorStop(.25, 'rgba(243,212,138,.85)'); gr.addColorStop(1, 'rgba(243,212,138,0)'); hc.fillStyle = gr; hc.fillRect(0, 0, 64, 64);
    STOPS.forEach((s, i) => {
      const L = document.createElement('div'); L.className = 'j-lbl'; L.innerHTML = '<b>' + (i + 1) + '</b><span>' + esc(s.n) + '</span>'; labelsEl.appendChild(L); lbls.push(L);
      const b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<b>' + esc(s.n) + '</b><span>' + esc(s.c) + '</span>'; b.setAttribute('aria-label', 'Go to ' + s.n);
      b.addEventListener('click', () => { pauseAuto('user'); jumpTo(i); }); stopsEl.appendChild(b); tlBtns.push(b);
    });
  }

  // ---- the clock: scroll position <-> story time ----------------------------------------------------------
  const storyTop = () => root.getBoundingClientRect().top + window.scrollY;
  const storyTotal = () => root.offsetHeight - window.innerHeight;
  const yForQ = (q) => storyTop() + storyTotal() * ((q - QMIN) / (QMAX - QMIN));
  function scrollQ(r0) { const r = r0 || root.getBoundingClientRect(); stage.style.setProperty('--bl', cl(r.top / 70, 0, 1).toFixed(3)); return QMIN + cl(-r.top / storyTotal(), 0, 1) * (QMAX - QMIN); }
  function jumpTo(i) { window.scrollTo({ top: yForQ(i) + 1, behavior: reduce ? 'auto' : 'smooth' }); }

  // ---- autoplay -----------------------------------------------------------------------------------------------
  // Starts by itself once the visitor arrives at the journey and stops scrolling. Any wheel, touch, key press or
  // manual scroll pauses it at once; the Play button (or the "Legacy of Islam" tab) starts it again.
  const auto = { on: false, started: false, done: false, q: QMIN, expectY: -1, idleTimer: 0 };
  const speedAt = (q) => {
    // Units: stops per second. About 6 s on each photograph and 2 s of travel, so roughly 8 to 9 s per stop.
    if (q < 0) return .22;
    const d = Math.abs(q - Math.round(q)), last = q > N - 2.5;
    if (d < .3) return .1;            // the photograph fills the screen: time to look and read the card
    if (d < .34) return .15;
    return last ? .14 : .2;           // the camera travelling to the next stop
  };
  function setPlayUi() {
    const playing = auto.on, label = playing ? 'Pause' : (auto.done ? 'Replay' : (auto.started ? 'Resume' : 'Play'));
    playBtn.classList.toggle('playing', playing); playBtn.querySelector('span').textContent = label;
    playBtn.setAttribute('aria-label', label + ' the journey');
  }
  function startAuto(fromStart) {
    if (calm || destroyed) return;
    if (fromStart || auto.done) { auto.done = false; auto.q = QMIN; } else auto.q = Math.max(QMIN, scrollQ());
    auto.on = true; auto.started = true; auto.expectY = -1; setPlayUi(); kick();
  }
  function pauseAuto() { if (!auto.on) return; auto.on = false; setPlayUi(); }
  function autoStep(dt) {
    if (!auto.on) return;
    const top = storyTop();
    if (window.scrollY < top - 2 && auto.q <= QMIN + .001) {          // glide down to the start of the journey first
      const y = window.scrollY, dy = top + 1 - y, step = Math.sign(dy) * Math.max(Math.min(Math.abs(dy), 12), Math.abs(dy) * .14);
      window.scrollTo({ top: y + step, behavior: 'instant' }); auto.expectY = window.scrollY; return;
    }
    auto.q = Math.min(QMAX, auto.q + speedAt(auto.q) * dt);
    if (auto.q >= N - 1 + .12) { auto.q = N - 1 + .12; window.scrollTo({ top: yForQ(auto.q), behavior: 'instant' }); auto.on = false; auto.done = true; setPlayUi(); return; }
    window.scrollTo({ top: yForQ(auto.q), behavior: 'instant' }); auto.expectY = window.scrollY;
  }
  function onUserInput() { if (auto.on) pauseAuto(); }
  function onScroll() {
    peekDrawn = false; kick();
    if (auto.on && auto.expectY >= 0 && Math.abs(window.scrollY - auto.expectY) > 3) pauseAuto();   // the visitor moved the page
    clearTimeout(auto.idleTimer);
    if (!auto.started && !calm) auto.idleTimer = setTimeout(maybeAutoStart, 350);
  }
  function maybeAutoStart() {
    if (auto.started || calm || destroyed || document.hidden || !vis) return;
    const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    const r = root.getBoundingClientRect();
    // As soon as the panel has risen into the screen and the visitor pauses, the page glides down to the map and plays.
    if (r.top < window.innerHeight * .62 && r.bottom > window.innerHeight * .8 && scrollQ() < N - 1.05) startAuto(false);
  }

  // ---- loop -----------------------------------------------------------------------------------------------------
  let target = QMIN, qCur = QMIN, vis = false, raf = 0, lastT = 0, peekDrawn = false, t0 = performance.now();
  function loop(now) {
    raf = 0; if (!vis || !GEO || destroyed) return;
    const r = root.getBoundingClientRect();
    // While only the top edge of the panel shows under the hero, draw the map once and then rest completely.
    // Scrolling, resizing or Play wakes it again (kick).
    const peek = r.top > window.innerHeight * .25 && !auto.on;
    if (peek && peekDrawn) return;
    const dt = Math.min(.05, (now - lastT) / 1000 || .016); lastT = now;
    autoStep(dt);
    target = scrollQ(auto.on ? null : r); qCur += (target - qCur) * (1 - Math.exp(-dt * 8)); if (Math.abs(target - qCur) < .0004) qCur = target;
    draw(qCur, (now - t0) / 1000);
    peekDrawn = peek && qCur === target;
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && vis && GEO && !destroyed) { lastT = performance.now(); raf = requestAnimationFrame(loop); } }

  // ---- controls -----------------------------------------------------------------------------------------------------
  playBtn.addEventListener('click', () => { if (auto.on) pauseAuto(); else startAuto(auto.done); });
  $('.j-cue').addEventListener('click', () => { if (calm) { root.scrollIntoView({ behavior: 'smooth' }); return; } startAuto(true); });
  $('.j-ask').addEventListener('click', () => { pauseAuto(); onAsk(); });
  root.addEventListener('click', (e) => { const a = e.target.closest('a[data-ask]'); if (a) { e.preventDefault(); pauseAuto(); onAsk(); } });
  const onResize = () => { if (!GEO) return; size(); peekDrawn = false; if (calm) draw(QMIN, 0); else kick(); };
  const onVis = () => { if (document.hidden) pauseAuto(); };
  const onKey = (e) => { if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) onUserInput(); };
  const onFocusIn = (e) => { if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) pauseAuto(); };

  let io = null;
  function activate() {
    window.addEventListener('wheel', onUserInput, { passive: true }); window.addEventListener('touchstart', onUserInput, { passive: true });
    window.addEventListener('keydown', onKey); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis); document.addEventListener('focusin', onFocusIn);
    io = new IntersectionObserver((en) => { vis = en[0].isIntersecting; if (!vis) pauseAuto(); kick(); }, { rootMargin: '100px' }); io.observe(root);
  }

  fetch(U('geo.json')).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(async (g) => {
    if (destroyed) return;
    await buildGeo(g); if (destroyed) return; size();
    if (calm) {
      root.classList.add('j-calm'); size(); draw(QMIN, 0);
      cards.forEach((c) => { c.style.setProperty('--v', 1); const img = c.querySelector('.j-ph img'); img.loading = 'lazy'; img.src = img.dataset.src; });
      window.addEventListener('resize', onResize); return;
    }
    buildImms(); qCur = target = scrollQ(); draw(qCur, 0); setPlayUi(); activate();
    auto.idleTimer = setTimeout(maybeAutoStart, 450);   // the visitor may already be waiting at the panel
  }).catch((err) => { console.error('The journey could not be loaded.', err); root.classList.add('j-failed'); });
  if (calm) root.classList.add('j-calm');
  setPlayUi();

  return {
    destroy() {
      destroyed = true; cancelAnimationFrame(raf); if (io) io.disconnect();
      window.removeEventListener('wheel', onUserInput); window.removeEventListener('touchstart', onUserInput); window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); document.removeEventListener('focusin', onFocusIn);
    },
    pause: pauseAuto,
  };
}
