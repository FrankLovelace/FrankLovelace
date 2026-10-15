// Color mode toggle, styled as a filter selector: the swatch swaps a solid accent for an
// emission spectrum, and the label rolls over letter by letter like a split-flap display.

const ROLL_STAGGER_MS = 28;
const ROLL_MS = 320;

export function initMode(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.mode-toggle');
  if (!toggle) return;
  const label = toggle.querySelector<HTMLElement>('.mode-label');
  const text = (mode: 'pro' | 'pop') =>
    mode === 'pop' ? toggle.dataset.labelPop ?? 'pop' : toggle.dataset.labelPro ?? 'pro';
  const fit = (s: string) => {
    if (label) label.style.width = `calc(${s.length} * (1ch + 0.08em))`;
  };

  let rollTimer = 0;
  const roll = (from: string, to: string) => {
    if (!label) return;
    clearTimeout(rollTimer);
    const n = Math.max(from.length, to.length);
    label.classList.remove('is-rolling');
    label.textContent = '';
    for (let i = 0; i < n; i++) {
      const col = document.createElement('span');
      col.className = 'flap';
      col.style.setProperty('--d', `${i * ROLL_STAGGER_MS}ms`);
      for (const ch of [from[i] ?? ' ', to[i] ?? ' ']) {
        const cell = document.createElement('span');
        cell.textContent = ch;
        col.appendChild(cell);
      }
      label.appendChild(col);
    }
    fit(to);
    void label.offsetWidth; // start the roll from the old letters
    label.classList.add('is-rolling');
    rollTimer = window.setTimeout(() => {
      label.classList.remove('is-rolling');
      label.textContent = to;
    }, n * ROLL_STAGGER_MS + ROLL_MS + 40);
  };

  const apply = (mode: 'pro' | 'pop', animate: boolean) => {
    const prev = document.documentElement.dataset.mode === 'pop' ? 'pop' : 'pro';
    document.documentElement.dataset.mode = mode;
    toggle.setAttribute('aria-pressed', String(mode === 'pop'));
    if (animate && prev !== mode) roll(text(prev), text(mode));
    else if (label) {
      label.textContent = text(mode);
      fit(text(mode));
    }
    try {
      localStorage.setItem('fl-mode', mode);
    } catch {
    }
  };

  apply(document.documentElement.dataset.mode === 'pop' ? 'pop' : 'pro', false);
  toggle.addEventListener('click', () => {
    apply(document.documentElement.dataset.mode === 'pop' ? 'pro' : 'pop', true);
  });
}
