import { initMode } from './theme';
import { initCursor } from './cursor';
import { initChips, initCifSlots, autoLoadCifs } from './interactions';
import { initJourney } from './zoom-journey';

initMode();
initCursor();
initChips();
initCifSlots();

const isZoom = document.documentElement.dataset.journey === 'zoom';
const langLink = document.querySelector<HTMLAnchorElement>('[data-lang-link]');
let cifsRequested = false;
let latticeRequested = false;

initJourney({
  onLevel(level) {
    if (langLink) langLink.hash = level > 0 ? `#level-${level}` : '';
    if (isZoom && level >= 1 && !cifsRequested) {
      cifsRequested = true;
      autoLoadCifs();
    }
    if (level >= 3 && !latticeRequested) {
      latticeRequested = true;
      const el = document.querySelector<HTMLElement>('[data-lattice]');
      if (el) import('./crystal-scene').then((m) => m.mountLattice(el));
    }
  },
});
