import { initMode } from './theme';
import { initCursor } from './cursor';
import { initChips, initCifSlots, autoLoadCifs, setCifsSpinning } from './interactions';
import { initJourney } from './zoom-journey';
import type { LatticeHandle } from './crystal-scene';

initMode();
initCursor();
initChips();
initCifSlots();

const isZoom = document.documentElement.dataset.journey === 'zoom';
const langLink = document.querySelector<HTMLAnchorElement>('[data-lang-link]');
let cifsRequested = false;
let latticeRequested = false;
let lattice: LatticeHandle | null = null;
let currentLevel = 0;

// scene indexes: 0 hero · 1 about · 2 projects (CIF viewers) · 3 videos · 4 atomic end (lattice)
const cifsNearby = (level: number) => level >= 1 && level <= 3;
const latticeNearby = (level: number) => level >= 3;

initJourney({
  onLevel(level) {
    currentLevel = level;
    if (langLink) langLink.hash = level > 0 ? `#level-${level}` : '';
    if (isZoom && level >= 1 && !cifsRequested) {
      cifsRequested = true;
      autoLoadCifs();
    }
    if (latticeNearby(level) && !latticeRequested) {
      latticeRequested = true;
      const el = document.querySelector<HTMLElement>('[data-lattice]');
      if (el)
        import('./crystal-scene').then((m) => {
          lattice = m.mountLattice(el);
          lattice.setActive(latticeNearby(currentLevel));
        });
    }
    setCifsSpinning(cifsNearby(level));
    lattice?.setActive(latticeNearby(level));
  },
});
