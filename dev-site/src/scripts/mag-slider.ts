// Magnification slider in the HUD, after FilmCraft's Lumetri / Essential Sound sliders:
// a thin spectrum track, a hollow ring knob, and a "hot" value on the right that scrubs
// when dragged sideways. Double-click the value to return to 1×.
//
// Position is the journey coordinate T ∈ [0, levels − 1]: integers are the scenes, and the
// magnification between two of them is interpolated logarithmically by the journey itself.

export interface JourneyNav {
  /** Move the page to journey position T. */
  seek(T: number, smooth: boolean): void;
  /** Suspend scroll snapping while the slider is held. */
  setScrubbing?(on: boolean): void;
  /** true: the page follows the knob while dragging; false: it moves once on release. */
  live: boolean;
}

export interface MagSlider {
  update(T: number, valueText: string): void;
}

/** px of horizontal drag on the value to cross the whole range */
const SCRUB_PX = 260;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function initMagSlider(count: number, grayFrom: number, nav: JourneyNav): MagSlider | null {
  const root = document.querySelector<HTMLElement>('[data-mag-slider]');
  const track = root?.querySelector<HTMLElement>('[data-mag-track]');
  const value = root?.querySelector<HTMLElement>('[data-mag-readout]');
  if (!root || !track || !value || count < 2) return null;

  const max = count - 1;
  if (grayFrom > 0) track.style.setProperty('--sem', String(grayFrom / max));

  let T = 0;
  let held = false;

  const place = (v: number) => {
    track.style.setProperty('--pos', String(v / max));
    track.setAttribute('aria-valuenow', v.toFixed(2));
  };

  const scrubTo = (v: number) => {
    T = clamp(v, 0, max);
    place(T);
    if (nav.live) nav.seek(T, false);
  };

  const begin = (e: PointerEvent, el: HTMLElement) => {
    el.setPointerCapture(e.pointerId);
    held = true;
    root.classList.add('is-scrubbing');
    nav.setScrubbing?.(true);
  };

  // on release the page settles on the nearest scene, as scroll snapping does
  const end = () => {
    if (!held) return;
    held = false;
    root.classList.remove('is-scrubbing');
    nav.setScrubbing?.(false);
    nav.seek(Math.round(T), true);
  };

  // ---- track: click to jump, drag to scrub
  const fromX = (x: number) => {
    const r = track.getBoundingClientRect();
    return ((x - r.left) / r.width) * max;
  };
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    track.focus({ preventScroll: true });
    begin(e, track);
    scrubTo(fromX(e.clientX));
  });
  track.addEventListener('pointermove', (e) => {
    if (held) scrubTo(fromX(e.clientX));
  });
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);

  // ---- value: hot text, drag sideways to scrub
  let grabX = 0;
  let grabT = 0;
  value.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    grabX = e.clientX;
    grabT = T;
    begin(e, value);
  });
  value.addEventListener('pointermove', (e) => {
    if (held) scrubTo(grabT + ((e.clientX - grabX) / SCRUB_PX) * max);
  });
  value.addEventListener('pointerup', end);
  value.addEventListener('pointercancel', end);
  value.addEventListener('dblclick', () => nav.seek(0, true));

  // ---- keyboard: one scene per step
  track.addEventListener('keydown', (e) => {
    const next = Math.min(max, Math.floor(T + 1e-3) + 1);
    const prev = Math.max(0, Math.ceil(T - 1e-3) - 1);
    const target =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageUp'
        ? next
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageDown'
          ? prev
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? max
              : null;
    if (target === null) return;
    e.preventDefault();
    nav.seek(target, true);
  });

  place(0);

  return {
    update(v, valueText) {
      track.setAttribute('aria-valuetext', valueText);
      if (held) return;
      T = clamp(v, 0, max);
      place(T);
    },
  };
}
