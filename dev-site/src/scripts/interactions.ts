/** Project filter chips + lazy CIF structure viewers. */
import { buildModel, toXyz } from './bravais';

export function initChips(): void {
  const chips = [...document.querySelectorAll<HTMLButtonElement>('.chip[data-filter]')];
  const cards = [...document.querySelectorAll<HTMLElement>('.card[data-kind]')];
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      cards.forEach((card) => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.kind !== filter);
      });
    });
  });
}

const loaded = new WeakSet<HTMLElement>();

interface SpinnableViewer {
  spin(axis: string | boolean, speed?: number): void;
}
const viewers: SpinnableViewer[] = [];
let spinning = true;

/** Pause/resume the continuous re-render of every CIF viewer (they are expensive while offscreen). */
export function setCifsSpinning(active: boolean): void {
  if (active === spinning) return;
  spinning = active;
  viewers.forEach((v) => (active ? v.spin('y', 0.4) : v.spin(false)));
}

/** Load 3Dmol.js and render the CIF structure inside a .cif-slot. */
export async function loadCif(slot: HTMLElement): Promise<void> {
  if (loaded.has(slot)) return;
  loaded.add(slot);

  const src = slot.dataset.cif;
  const button = slot.querySelector<HTMLButtonElement>('.cif-load');
  if (!src) return;
  if (button) button.textContent = slot.dataset.loadingLabel ?? '…';

  try {
    const [$3Dmol, cifText] = await Promise.all([
      import('3dmol'),
      fetch(src).then((r) => {
        if (!r.ok) throw new Error(`fetch ${src}: ${r.status}`);
        return r.text();
      }),
    ]);

    button?.remove();
    const viewer = $3Dmol.createViewer(slot, {
      backgroundColor: '#1b1d21',
      antialias: false,
    });

    const cell = buildModel(cifText);
    viewer.addModel(toXyz(cell.atoms), 'xyz');

    const grays: Record<string, number> = {
      Na: 0xe9e9ec,
      Cl: 0x9b9ea6,
      Si: 0x8e9197,
      O: 0xe9e9ec,
      C: 0xc6c7cc,
    };
    viewer.setStyle(
      {},
      {
        sphere: { scale: 0.32, colorfunc: (atom: { elem?: string }) => grays[atom.elem ?? ''] ?? 0xb4b6bd },
        stick: { radius: 0.08, color: 0x6b6e76 },
      },
    );
    cell.edges.forEach(([s, e]) => {
      viewer.addCylinder({
        start: { x: s.x, y: s.y, z: s.z },
        end: { x: e.x, y: e.y, z: e.z },
        radius: 0.025,
        color: 0x6b6e76,
        fromCap: 1,
        toCap: 1,
      });
    });
    viewer.zoomTo();
    viewer.render();
    viewers.push(viewer);
    if (spinning) viewer.spin('y', 0.4);
  } catch (err) {
    if (button) button.textContent = 'unavailable';
    console.error('CIF viewer failed:', err);
  }
}

export function initCifSlots(): void {
  document.querySelectorAll<HTMLElement>('.cif-slot[data-cif]').forEach((slot) => {
    slot.querySelector('.cif-load')?.addEventListener('click', () => loadCif(slot));
  });
}

export function autoLoadCifs(): void {
  document.querySelectorAll<HTMLElement>('.cif-slot[data-cif]').forEach((slot) => loadCif(slot));
}
