
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ZMAX = 22; 
const LN_ZMAX = Math.log(ZMAX);
const SEG_VH = 160; 
const DWELL = 0.3; 

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

interface SceneInfo {
  el: HTMLElement;
  inner: HTMLElement | null;
  ring: HTMLElement | null;
  mag: number;
  zone: 'light' | 'gray';
  fx: number;
  fy: number;
  r0: number;
}

interface JourneyOptions {
  onLevel?: (level: number) => void;
}

export function initJourney(opts: JourneyOptions = {}): void {
  const html = document.documentElement;
  const root = document.querySelector<HTMLElement>('[data-journey-root]');
  if (!root) return;

  const sceneEls = [...root.querySelectorAll<HTMLElement>('[data-scene]')];
  if (sceneEls.length < 2) return;

  const hud = {
    mag: document.querySelector<HTMLElement>('[data-mag-readout]'),
    bar: document.querySelector<HTMLElement>('[data-bar-label]'),
    lens: document.querySelector<HTMLElement>('[data-lens-label]'),
    links: [...document.querySelectorAll<HTMLAnchorElement>('[data-level-link]')],
  };
  const lensNames = hud.links.map((a) => a.querySelector('.label')?.textContent ?? '');
  const lang = html.lang || 'en';

  const compactFmt = new Intl.NumberFormat(lang, { notation: 'compact', maximumFractionDigits: 0 });
  const plainFmt = new Intl.NumberFormat(lang, { maximumSignificantDigits: 3 });

  const formatMag = (mag: number) =>
    (mag >= 10000 ? compactFmt.format(Math.round(mag)) : plainFmt.format(Math.round(mag))) + '×';

  const formatBar = (mag: number) => {
    const meters = 0.1 / mag; 
    let value: number;
    let unit: string;
    if (meters >= 1e-2) [value, unit] = [meters * 1e2, 'cm'];
    else if (meters >= 1e-3) [value, unit] = [meters * 1e3, 'mm'];
    else if (meters >= 1e-6) [value, unit] = [meters * 1e6, 'µm'];
    else if (meters >= 1e-9) [value, unit] = [meters * 1e9, 'nm'];
    else [value, unit] = [meters * 1e10, 'Å'];
    return `${Number(value.toPrecision(2))} ${unit}`;
  };

  let lastLevel = -1;
  const setLevelUi = (level: number, mag: number, grayness: number) => {
    if (hud.mag) hud.mag.textContent = formatMag(mag);
    if (hud.bar) hud.bar.textContent = formatBar(mag);
    if (hud.lens) hud.lens.textContent = lensNames[level] ?? '';
    html.style.setProperty('--grayness', String(grayness));
    html.dataset.zone = grayness > 0.5 ? 'gray' : 'light';
    hud.links.forEach((a, i) =>
      i === level ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'),
    );
    if (level !== lastLevel) {
      lastLevel = level;
      opts.onLevel?.(level);
    }
  };

  if (html.dataset.journey === 'zoom') {
    initZoom(root, sceneEls, setLevelUi, formatMag, formatBar, hud, lensNames, html);
  } else {
    initStatic(sceneEls, setLevelUi);
  }
}

function initStatic(
  sceneEls: HTMLElement[],
  setLevelUi: (level: number, mag: number, grayness: number) => void,
): void {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('in-view');
        const level = Number(el.dataset.level ?? 0);
        const mag = Number(el.dataset.mag ?? 1);
        setLevelUi(level, mag, el.dataset.zone === 'gray' ? 1 : 0);
      });
    },
    { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
  );
  sceneEls.forEach((el) => io.observe(el));
}

function initZoom(
  root: HTMLElement,
  sceneEls: HTMLElement[],
  setLevelUi: (level: number, mag: number, grayness: number) => void,
  formatMag: (mag: number) => string,
  formatBar: (mag: number) => string,
  hud: { mag: HTMLElement | null; bar: HTMLElement | null; lens: HTMLElement | null; links: HTMLAnchorElement[] },
  lensNames: string[],
  html: HTMLElement,
): void {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-depth]');

  const scenes: SceneInfo[] = sceneEls.map((el) => ({
    el,
    inner: el.querySelector<HTMLElement>('.scene__inner'),
    ring: el.querySelector<HTMLElement>('.focal__ring'),
    mag: Number(el.dataset.mag ?? 1),
    zone: el.dataset.zone === 'gray' ? 'gray' : 'light',
    fx: 0,
    fy: 0,
    r0: 13,
  }));
  const N = scenes.length;

  track.style.height = `calc(100vh + ${(N - 1) * SEG_VH}vh)`;

  let W = innerWidth;
  let H = innerHeight;

  const measure = () => {
    const stageRect = stage.getBoundingClientRect();
    W = stageRect.width;
    H = stageRect.height;
    scenes.forEach((scene) => {
      scene.el.style.transform = '';
      scene.el.style.clipPath = '';
      scene.el.style.opacity = '';
      scene.el.style.visibility = '';
      if (scene.inner) {
        scene.inner.style.scale = '';
        const h = scene.inner.offsetHeight;
        const avail = H * 0.84;
        if (h > avail) scene.inner.style.scale = String(avail / h);
      }
      if (scene.ring) {
        const r = scene.ring.getBoundingClientRect();
        scene.fx = r.left + r.width / 2 - stageRect.left;
        scene.fy = r.top + r.height / 2 - stageRect.top;
        scene.r0 = Math.max(r.width / 2, 8);
      } else {
        scene.fx = W / 2;
        scene.fy = H / 2;
      }
    });
  };

  type Mote = { ux: number; uy: number; d: number; base: number };
  const motes: Mote[] = Array.from({ length: 70 }, () => ({
    ux: (Math.random() - 0.5) * 1.3,
    uy: (Math.random() - 0.5) * 1.3,
    d: Math.exp(Math.random() * LN_ZMAX * (N + 2)) / ZMAX,
    base: 1.2 + Math.random() * 2.4,
  }));
  const ctx = canvas?.getContext('2d') ?? null;

  const drawDepth = (T: number, grayness: number) => {
    if (!ctx || !canvas) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    if (canvas.width !== Math.round(W * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const G = Math.exp(T * LN_ZMAX);
    const r = Math.round(lerp(29, 190, grayness));
    const g = Math.round(lerp(78, 192, grayness));
    const b = Math.round(lerp(216, 200, grayness));
    for (const m of motes) {
      let s = G / m.d;
      while (s > 40) {
        m.d *= 2.5e4;
        s = G / m.d;
      }
      while (s < 0.015) {
        m.d /= 2.5e4;
        s = G / m.d;
      }
      const alpha = 0.22 * clamp((s - 0.015) / 0.12, 0, 1) * clamp((40 - s) / 32, 0, 1);
      if (alpha <= 0.004) continue;
      ctx.beginPath();
      ctx.arc(W / 2 + m.ux * W * s, H / 2 + m.uy * H * s, m.base * Math.min(s, 14), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }
  };

  const apply = (T: number) => {
    const seg = clamp(Math.floor(T), 0, N - 2);
    const t = T - seg;
    const p = clamp((t - DWELL) / (1 - DWELL), 0, 1);

    scenes.forEach((scene, i) => {
      const active = i === seg || i === seg + 1;
      scene.el.classList.toggle('is-active', active);
      if (!active) {
        scene.el.style.transform = '';
        scene.el.style.clipPath = '';
        scene.el.style.opacity = '';
        scene.el.style.zIndex = '';
        scene.el.style.visibility = '';
      }
    });

    const cur = scenes[seg];
    const next = scenes[seg + 1];
    const Z = Math.exp(p * LN_ZMAX);
    const drift = smooth(p);
    const Fx = lerp(cur.fx, W / 2, drift);
    const Fy = lerp(cur.fy, H / 2, drift);

    // Fade the outgoing scene to 0 by p=0.97 and stop painting it past that point:
    // re-entering a boundary backwards would otherwise rasterize a near-invisible
    // full-viewport layer at ~22× scale in a single frame.
    const fade = p > 0.85 ? clamp(1 - (p - 0.85) / 0.12, 0, 1) : 1;
    if (fade <= 0) {
      cur.el.style.visibility = 'hidden';
      cur.el.style.opacity = '0';
    } else {
      cur.el.style.visibility = '';
      cur.el.style.transformOrigin = `${cur.fx}px ${cur.fy}px`;
      cur.el.style.transform = `translate3d(${Fx - cur.fx}px, ${Fy - cur.fy}px, 0) scale(${Z})`;
      cur.el.style.opacity = String(fade);
      cur.el.style.clipPath = 'none';
    }
    cur.el.style.zIndex = '1';

    const s = Z / ZMAX;
    const cover = Math.hypot(W, H) * 0.62;
    const capR = Math.min(W, H) * 0.485;
    const rLocal =
      p < 0.86
        ? lerp(cur.r0 * ZMAX, capR, smooth(p / 0.86))
        : lerp(capR, cover * 1.25, smooth((p - 0.86) / 0.14));
    next.el.style.transformOrigin = '50% 50%';
    next.el.style.transform = `translate3d(${Fx - W / 2}px, ${Fy - H / 2}px, 0) scale(${s})`;
    next.el.style.clipPath = p > 0.97 ? 'none' : `circle(${rLocal}px at 50% 50%)`;
    next.el.style.opacity = '1';
    next.el.style.zIndex = '2';

    const graySeg = scenes.findIndex((sc) => sc.zone === 'gray') - 1;
    const grayness = seg < graySeg ? 0 : seg === graySeg ? p : 1;

    const mag = Math.exp(lerp(Math.log(cur.mag), Math.log(next.mag), p));
    const level = Math.round(T);
    setLevelUi(level, mag, grayness);
    if (hud.lens) hud.lens.textContent = lensNames[p > 0.5 ? seg + 1 : seg] ?? '';

    drawDepth(T, grayness);
  };

  measure();

  const trigger = ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    snap: {
      snapTo: scenes.map((_, i) => i / (N - 1)),
      duration: { min: 0.25, max: 0.7 },
      delay: 0.12,
      ease: 'power2.inOut',
    },
    onUpdate: (self) => apply(self.progress * (N - 1)),
    onRefresh: (self) => {
      measure();
      apply(self.progress * (N - 1));
    },
  });

  apply(0);
  setTimeout(() => {
    measure();
    apply(trigger.progress * (N - 1));
  }, 1300);

  const hashLevel = location.hash.match(/^#level-(\d+)$/)?.[1];
  if (hashLevel) {
    requestAnimationFrame(() => {
      const trackTop = track.getBoundingClientRect().top + scrollY;
      const segPx = (track.offsetHeight - innerHeight) / (N - 1);
      scrollTo({ top: trackTop + segPx * Math.min(Number(hashLevel), N - 1), behavior: 'instant' });
    });
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
  });

  const scrollToLevel = (level: number) => {
    const trackTop = track.getBoundingClientRect().top + scrollY;
    const segPx = (track.offsetHeight - innerHeight) / (N - 1);
    scrollTo({ top: trackTop + segPx * level, behavior: 'smooth' });
  };
  hud.links.forEach((a, i) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToLevel(i);
    }),
  );
  sceneEls.forEach((el, i) =>
    el.querySelectorAll<HTMLButtonElement>('[data-focal]').forEach((btn) =>
      btn.addEventListener('click', () => scrollToLevel(Math.min(i + 1, N - 1))),
    ),
  );
}
