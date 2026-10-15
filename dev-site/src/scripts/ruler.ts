// Scroll ruler on the right edge, after the one on getartcraft.com/apps/filmcraft.
//
// - The ticks are drawn at document scale: one per 1 % of the page height, so they scroll
//   past 1:1 with the content, while the needle travels slowly down the rail. The ticks
//   "drift" by exactly the amount that keeps the needle sitting on the tick of the current
//   percentage.
// - Hovering the rail (or dragging on it) zooms out: every tick slides onto a compressed map of
//   the whole page, a bracket marks the part that is on screen, and the level names fly letter
//   by letter from their vertical slot on the rail to horizontal labels beside it.
// - Fast scrolling stretches the ticks around the needle. Click jumps, drag scrubs.

import { gsap } from 'gsap';
import type { JourneyNav } from './zoom-journey';

const C = {
  railW: 60,
  edgePad: 12, // inset of the needle's travel from the topbar and the viewport bottom
  minorPct: 1,
  labelPct: 5,
  minorLen: 10,
  majorLen: 20,
  minorAlpha: 0.4,
  majorAlpha: 0.8,
  labelAlpha: 0.5,
  bracketAlpha: 0.1,
  ghostAlpha: 1,
  needleFadePct: 3,
  velRadius: 180, // document px around the needle that react to scroll speed
  velMax: 0.6,
  zoomInDelay: 150,
  zoomOutDelay: 150,
  zoomLerp: 10,
  dragLerp: 0.18,
  jumpDur: 1.25,
  introAt: 0.6,
  introDur: 1,
  introStagger: 0.01,
  fontPx: 34, // letters are laid out at this size and scaled down
  ridingPx: 18,
  mapPx: 14,
  textPad: 8,
  stagger: 0.16, // per-letter delay fraction in the zoom morph
  arc: 28, // how far each letter's path bows toward the page mid-flight
  ridingAlpha: 0.35,
  mapAlpha: 0.85,
  yieldPad: 24, // tick numbers fade out of a riding word's way within this distance
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

interface Metrics {
  adv: number[]; // advance of each letter, in em
  cum: number[]; // left edge of each letter, in em
  total: number;
}

interface Word {
  label: string;
  letters: HTMLSpanElement[];
  hit: HTMLAnchorElement;
  m: Metrics | null;
  docY: number; // document y the needle points at when this level is on screen
  scroll: number; // scroll position of the level
  hover: number;
  flashUntil: number;
}

interface Tick {
  pct: number;
  major: boolean;
  alpha: number;
  row: HTMLElement;
  line: HTMLElement;
  num: HTMLElement | null;
  lastScale: string;
}

function measure(labels: string[], font: string): Metrics[] {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre;font-family:${font};font-size:100px;line-height:1;`;
  document.body.appendChild(probe);
  const out = labels.map((label) => {
    probe.textContent = '';
    const adv = [...label].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      probe.appendChild(s);
      return s;
    }).map((s) => s.getBoundingClientRect().width / 100);
    const cum: number[] = [];
    let x = 0;
    for (const a of adv) {
      cum.push(x);
      x += a;
    }
    return { adv, cum, total: x };
  });
  probe.remove();
  return out;
}

export function initRuler(nav: JourneyNav | null): void {
  const html = document.documentElement;
  const rail = document.querySelector<HTMLElement>('[data-ruler-rail]');
  const wordsHost = document.querySelector<HTMLElement>('[data-ruler-words]');
  if (html.dataset.ruler !== 'on' || !rail || !wordsHost || !nav) return;

  const ticksLayer = rail.querySelector<HTMLElement>('[data-ruler-ticks]')!;
  const bracket = rail.querySelector<HTMLElement>('[data-ruler-bracket]')!;
  const needle = rail.querySelector<HTMLElement>('[data-ruler-needle]')!;
  const readout = rail.querySelector<HTMLElement>('[data-ruler-readout]')!;
  const ghost = rail.querySelector<HTMLElement>('[data-ruler-ghost]')!;
  const digitCols = [...rail.querySelectorAll<HTMLElement>('.ruler-digit-col')];

  html.style.setProperty('--ruler-rail', `${C.railW}px`);
  rail.hidden = false;
  wordsHost.hidden = false;

  const css = getComputedStyle(html);
  const navH = parseFloat(css.getPropertyValue('--topbar-h')) || 64;
  const font = css.getPropertyValue('--font-display') || 'sans-serif';

  // ---- ticks
  const ticks: Tick[] = [];
  for (let p = 0; p <= 100 + 1e-6; p += C.minorPct) {
    const pct = Math.round(p * 100) / 100;
    const major = Math.abs(pct % C.labelPct) < 1e-6;
    const row = document.createElement('div');
    row.className = 'ruler__row';
    row.style.top = `${pct}%`;
    const line = document.createElement('span');
    line.className = 'ruler__tick';
    line.style.width = `${major ? C.majorLen : C.minorLen}px`;
    line.style.opacity = '0';
    row.appendChild(line);
    let num: HTMLElement | null = null;
    if (major) {
      num = document.createElement('span');
      num.className = 'ruler__num';
      num.style.right = `${C.majorLen + 4}px`;
      num.style.opacity = String(C.labelAlpha);
      num.textContent = String(pct);
      row.appendChild(num);
    }
    ticksLayer.appendChild(row);
    ticks.push({ pct, major, alpha: major ? C.majorAlpha : C.minorAlpha, row, line, num, lastScale: '' });
  }

  // ---- level names
  const jumpLabel = rail.dataset.jumpLabel ?? '';
  const names = [...document.querySelectorAll('[data-level-link] .label')].map((el) => el.textContent?.trim() ?? '');
  const words: Word[] = names.map((label, i) => {
    const hit = document.createElement('a');
    hit.className = 'ruler-words__hit';
    hit.href = `#level-${i}`;
    hit.setAttribute('aria-label', `${jumpLabel} ${label}`);
    hit.dataset.interactive = '';
    wordsHost.appendChild(hit);
    const letters = [...label].map((ch) => {
      const s = document.createElement('span');
      s.className = 'ruler-words__letter';
      s.setAttribute('aria-hidden', 'true');
      s.style.fontSize = `${C.fontPx}px`;
      s.textContent = ch;
      wordsHost.appendChild(s);
      return s;
    });
    return { label, letters, hit, m: null, docY: 0, scroll: 0, hover: 0, flashUntil: 0 };
  });

  // ---- geometry
  const geom = { docH: 1, vh: 1, vw: 1, max: 1 };
  const refresh = () => {
    geom.docH = html.scrollHeight;
    geom.vh = innerHeight;
    geom.vw = innerWidth;
    geom.max = Math.max(1, geom.docH - geom.vh);
    ticksLayer.style.height = `${geom.docH}px`;
    const anchors = nav.anchors();
    words.forEach((w, i) => {
      w.scroll = Math.min(anchors[i] ?? 0, geom.max);
      w.docY = (w.scroll / geom.max) * geom.docH;
    });
  };
  const remeasure = () => {
    const ms = measure(names, font);
    words.forEach((w, i) => (w.m = ms[i]));
  };
  refresh();
  remeasure();
  new ResizeObserver(refresh).observe(document.body);
  addEventListener('resize', refresh);
  setTimeout(refresh, 1400); // after the journey's own delayed re-measure
  document.fonts?.ready.then(() => {
    remeasure();
    refresh();
  });

  // needle travel: base..base+span; drift keeps the needle on its own tick
  const travel = () => {
    const base = navH + C.edgePad;
    const span = Math.max(1, geom.vh - navH - 2 * C.edgePad);
    return { base, span, drift: (f: number) => base - f * (navH + 2 * C.edgePad) };
  };

  // ---- state
  const st = {
    lastY: scrollY,
    vel: 0,
    zoom: 0,
    zoomIntent: false,
    zoomTimer: 0,
    dragging: false,
    dragStartY: 0,
    dragMoved: 0,
    ghostActive: false,
    ghostY: 0,
    introDone: false,
    prevPct: -1,
    prevDigits: [-1, -1, -1],
    readoutAbove: false,
    chase: null as number | null, // drag: the page chases this scroll position
    tween: null as { from: number; to: number; t0: number; dur: number } | null,
    hovered: -1,
  };

  const setScrubbing = (on: boolean) => nav.setScrubbing(on);

  const jumpTo = (y: number) => {
    const to = Math.max(0, Math.min(geom.max, y));
    const dist = Math.abs(to - scrollY);
    st.chase = null;
    st.tween = { from: scrollY, to, t0: performance.now(), dur: C.jumpDur * (0.4 + 0.6 * Math.min(1, dist / (2.5 * geom.vh))) };
    setScrubbing(true);
  };

  // the journey snaps to its levels, so a click on the rail lands on the nearest one
  const nearestLevel = (y: number) =>
    words.reduce((best, w) => (Math.abs(w.scroll - y) < Math.abs(best - y) ? w.scroll : best), words[0]?.scroll ?? y);

  const cancelMotion = () => {
    if (st.dragging) return;
    if (st.tween || st.chase !== null) setScrubbing(false);
    st.tween = null;
    st.chase = null;
  };
  addEventListener('wheel', cancelMotion, { passive: true });
  addEventListener('touchstart', cancelMotion, { passive: true });
  addEventListener('keydown', cancelMotion);

  const setZoomIntent = (on: boolean) => {
    clearTimeout(st.zoomTimer);
    st.zoomTimer = window.setTimeout(() => (st.zoomIntent = on), on ? C.zoomInDelay : C.zoomOutDelay);
  };
  const railFraction = (clientY: number) => {
    const { base, span } = travel();
    return clamp01((clientY - base) / span);
  };

  rail.addEventListener('pointerenter', () => setZoomIntent(true));
  rail.addEventListener('pointerleave', () => {
    st.ghostActive = false;
    if (!st.dragging) setZoomIntent(false);
  });
  rail.addEventListener('pointermove', (e) => {
    const { base, span } = travel();
    st.ghostActive = true;
    st.ghostY = Math.max(base, Math.min(base + span, e.clientY));
    if (st.dragging) {
      st.dragMoved = Math.max(st.dragMoved, Math.abs(e.clientY - st.dragStartY));
      st.chase = railFraction(e.clientY) * geom.max;
    }
  });
  rail.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    st.dragStartY = e.clientY;
    st.dragMoved = 0;
    st.dragging = true;
    st.tween = null;
    setScrubbing(true);
    rail.setPointerCapture(e.pointerId);
  });
  const release = (e: PointerEvent) => {
    if (!st.dragging) return;
    st.dragging = false;
    // settle on the nearest level (the journey's own snap was held off during the drag)
    if (st.chase !== null) st.chase = nearestLevel(st.chase);
    const r = rail.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) {
      st.ghostActive = false;
      setZoomIntent(false);
    }
  };
  rail.addEventListener('pointerup', release);
  rail.addEventListener('pointercancel', release);
  rail.addEventListener('click', (e) => {
    if (st.dragMoved > 4) return;
    jumpTo(nearestLevel(railFraction(e.clientY) * geom.max));
    gsap.fromTo(ghost, { opacity: 1 }, { opacity: C.ghostAlpha, duration: 0.45 });
  });

  words.forEach((w, i) => {
    w.hit.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      w.flashUntil = performance.now() + 350;
      jumpTo(w.scroll);
    });
    w.hit.addEventListener('pointerenter', () => (st.hovered = i));
    w.hit.addEventListener('pointerleave', () => st.hovered === i && (st.hovered = -1));
  });

  // ---- intro: the ticks draw in top-down
  gsap.fromTo(
    ticks.map((t) => t.line),
    { scaleX: 0, opacity: 0 },
    {
      scaleX: 1,
      opacity: (i: number) => ticks[i].alpha,
      duration: C.introDur,
      stagger: C.introStagger,
      delay: C.introAt,
      ease: 'power3.out',
      onComplete: () => (st.introDone = true),
    },
  );

  // ---- frame
  let zoomWrote = false;
  const frame = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs / 1000, 0.1) || 0.016;
    const now = performance.now();

    // page motion driven from the ruler
    if (st.chase !== null) {
      const k = 1 - Math.pow(1 - C.dragLerp, dt * 60);
      const y = scrollY + (st.chase - scrollY) * k;
      scrollTo({ top: y, behavior: 'instant' });
      if (!st.dragging && Math.abs(st.chase - y) < 1) {
        st.chase = null;
        setScrubbing(false);
      }
    } else if (st.tween) {
      const tw = st.tween;
      const p = clamp01((now - tw.t0) / 1000 / tw.dur);
      scrollTo({ top: tw.from + (tw.to - tw.from) * easeOutExpo(p), behavior: 'instant' });
      if (p >= 1) {
        st.tween = null;
        setScrubbing(false);
      }
    }

    const y = scrollY;
    const f = clamp01(y / geom.max);
    st.vel += ((y - st.lastY) / dt - st.vel) * (1 - Math.exp(-6 * dt));
    st.lastY = y;

    const { base, span, drift } = travel();
    const g = drift(f);
    ticksLayer.style.transform = `translate3d(0, ${-y + g}px, 0)`;

    // needle + odometer
    const ny = base + f * span;
    needle.style.transform = `translate3d(0, ${ny}px, 0)`;
    needle.style.opacity = String(clamp01(f / Math.max(0.001, C.needleFadePct / 100)));
    const above = ny > geom.vh - 26;
    if (above !== st.readoutAbove) {
      st.readoutAbove = above;
      readout.style.top = above ? '-14px' : '4px';
    }
    const pct = Math.round(f * 100);
    if (pct !== st.prevPct) {
      st.prevPct = pct;
      rail.setAttribute('aria-valuenow', String(pct));
      const s = String(pct).padStart(3, '0');
      for (let i = 0; i < 3; i++) {
        const d = s.charCodeAt(i) - 48;
        if (d !== st.prevDigits[i]) {
          st.prevDigits[i] = d;
          digitCols[i].style.transform = `translateY(${-d}em)`;
        }
      }
    }

    // zoom
    const target = st.zoomIntent || st.dragging ? 1 : 0;
    st.zoom += (target - st.zoom) * (1 - Math.exp(-C.zoomLerp * dt));
    if (target === 0 && st.zoom < 5e-4) st.zoom = 0;
    if (target === 1 && st.zoom > 0.9995) st.zoom = 1;
    const Z = st.zoom;
    const W = easeInOutCubic(Z);

    bracket.style.transform = `translate3d(0, ${base + (y / geom.docH) * span}px, 0)`;
    bracket.style.height = `${(geom.vh / geom.docH) * span}px`;
    bracket.style.opacity = String(Z);
    if (st.ghostActive) {
      ghost.style.transform = `translate3d(0, ${st.ghostY}px, 0)`;
      ghost.style.opacity = String(C.ghostAlpha * (0.2 + 0.8 * Z));
    } else ghost.style.opacity = '0';

    // level names: riding the rail vertically ↔ horizontal labels on the zoomed map
    const spans: { top: number; bottom: number; k: number }[] = [];
    const railX = geom.vw - C.railW / 2;
    const rideScale = C.ridingPx / C.fontPx;
    const mapScale = C.mapPx / C.fontPx;
    const O = (n: number) => 1 + (n - 1) * C.stagger;
    words.forEach((w, i) => {
      const m = w.m;
      if (!m) return;
      const n = m.adv.length;
      const mapY = base + (w.docY / geom.docH) * span;
      const rideLen = m.total * C.ridingPx;
      // the word hangs from its tick like the needle from the rail: below it at the top of the
      // page, above it at the bottom, so the current level's name always stays on screen
      const top = w.docY - y + g - rideLen * (w.docY / geom.docH);
      if (Z < 1) spans.push({ top, bottom: top + rideLen, k: 1 - W });
      w.hover += ((st.hovered === i ? 1 : 0) - w.hover) * (1 - Math.exp(-dt / 0.08));
      const flash = clamp01((w.flashUntil - now) / 350);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, maxA = 0;
      for (let e = 0; e < n; e++) {
        // riding: rotated -90°, read bottom to top
        const hx = railX;
        const hy = top + (m.total - m.cum[e] - m.adv[e] / 2) * C.ridingPx;
        const ha = C.ridingAlpha * clamp01((hy - navH + 10) / 40); // fade under the topbar
        // map: right-aligned beside the rail, at the level's place in the page
        const s = (m.cum[e] + m.adv[e] / 2) * C.mapPx;
        const mx = geom.vw - (C.railW + C.textPad + m.total * C.mapPx - s);
        const my = mapY;
        const d = easeInOutCubic(clamp01(Z * O(n) - e * C.stagger));
        const cx = (hx + mx) / 2 - C.arc;
        const cy = (hy + my) / 2;
        const b = 1 - d;
        const px = b * b * hx + 2 * b * d * cx + d * d * mx;
        const py = b * b * hy + 2 * b * d * cy + d * d * my;
        const rot = -90 * b;
        const sc = rideScale + (mapScale - rideScale) * d;
        const a = ha + (C.mapAlpha - ha) * d;
        const el = w.letters[e];
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`;
        const j = a + (1 - a) * w.hover;
        const ink = j >= 0.995 ? 'var(--chrome-ink)' : `color-mix(in srgb, var(--chrome-ink) ${(100 * clamp01(j)).toFixed(1)}%, var(--chrome-bg))`;
        el.style.color = flash > 0.01 ? `color-mix(in srgb, var(--chrome-accent) ${(70 * flash).toFixed(0)}%, ${ink})` : ink;
        if (a > maxA) maxA = a;
        const hw = (m.adv[e] * C.fontPx * sc) / 2 + 2;
        const hh = (C.fontPx * sc) / 2 + 2;
        const [rx, ry] = Math.abs(rot) > 45 ? [hh, hw] : [hw, hh];
        x0 = Math.min(x0, px - rx);
        x1 = Math.max(x1, px + rx);
        y0 = Math.min(y0, py - ry);
        y1 = Math.max(y1, py + ry);
      }
      if (isFinite(x0)) {
        const h = w.hit.style;
        h.left = `${x0 - 2}px`;
        h.top = `${y0 - 2}px`;
        h.width = `${x1 - x0 + 4}px`;
        h.height = `${y1 - y0 + 4}px`;
        h.pointerEvents = maxA > 0.05 ? 'auto' : 'none';
      }
    });

    // ticks: slide onto the map while zoomed, stretch with scroll speed near the needle
    if (st.introDone) {
      const needleDoc = f * geom.docH;
      const speed = clamp01(Math.abs(st.vel) / 3000);
      const moveRows = Z > 0 || zoomWrote;
      for (const t of ticks) {
        const docY = (t.pct / 100) * geom.docH;
        const sy = docY - y + g;
        const my = base + (t.pct / 100) * span;
        if (moveRows) t.row.style.transform = Z > 0 ? `translate3d(0, ${Z * (my - sy)}px, 0)` : '';
        if (t.num) {
          const at = sy + Z * (my - sy);
          let yieldTo = 1;
          if (Z < 1)
            for (const r of spans) {
              const dd = at < r.top ? r.top - at : at > r.bottom ? at - r.bottom : 0;
              if (dd < C.yieldPad) yieldTo = Math.min(yieldTo, 1 - r.k * (1 - dd / C.yieldPad));
            }
          t.num.style.opacity = String(C.labelAlpha * (1 - (1 - yieldTo) * (1 - Z)));
        }
        const dist = Math.abs(docY - needleDoc);
        let scale = '1';
        let alpha = t.alpha;
        if (dist < C.velRadius) {
          const q = 1 - dist / C.velRadius;
          const r = speed * q * q;
          scale = (1 + C.velMax * r).toFixed(3);
          alpha = Math.min(1, t.alpha + 0.6 * r);
        }
        if (scale !== t.lastScale) {
          t.lastScale = scale;
          t.line.style.transform = `scaleX(${scale})`;
          t.line.style.opacity = String(alpha);
        }
      }
      zoomWrote = Z > 0;
    }
  };
  gsap.ticker.add(frame);
}
