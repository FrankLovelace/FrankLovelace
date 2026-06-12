export default {
  meta: {
    title: 'Frank Lovelace — Nanotechnology & Scientific Computing',
    description:
      'A microscope journey through the work of Frank Lovelace: software engineering, nanotechnology, crystallography and scientific computing.',
  },
  nav: {
    levels: ['Naked eye', 'Optical', 'SEM', 'TEM', 'Diffraction'],
    skip: 'Skip to content',
  },
  hud: {
    magnification: 'MAG',
    mode: 'MODE',
    detector: 'DET',
  },
  chrome: {
    modeToggle: 'Toggle color mode',
    modePro: 'professional',
    modePop: 'color pop',
    langSwitch: 'Cambiar a español',
    langLabel: 'ES',
  },
  hero: {
    name: 'Frank Lovelace',
    role: 'software developer → nanotechnology & scientific computing',
    quote:
      'We are shaped by our material conditions and social context, the rest is luck and a pinch of sugar.',
    scrollHint: 'scroll to increase magnification',
    focalLabel: 'specimen',
  },
  about: {
    lensTag: 'optical microscope · ~400×',
    title: 'About me',
    p1: 'I spent my time as a software developer building software end to end — interfaces, servers, pipelines, deployments. At some point I aimed the same curiosity at matter itself, and now I work in nanotechnology and scientific computing.',
    p2: 'My home turf is crystallography: how atoms arrange, how order leaves fingerprints in diffraction data, and how code can read them. I am currently writing my first paper and not afraid of going deeper into any branch of the nanoworld.',
    p3: 'This site is both things at once — the engineering background is the instrument, the science is the specimen.',
    focalLabel: '',
  },
  projects: {
    lensTag: 'scanning electron microscope · ~50,000×',
    title: 'Projects',
    subtitle: 'Electrons carry no color. From here on, everything is grayscale.',
    filterAll: 'all',
    filterNano: 'nano',
    filterDev: 'dev',
    code: 'code',
    demo: 'live',
    structure: 'structure',
    focalLabel: 'increase magnification',
  },
  videos: {
    lensTag: 'in-situ TEM · ~500,000×',
    title: 'Recordings',
    subtitle: 'Short videos about the nanoworld, recorded in the wild.This section isnt done yet, but you can check my Instagram.',
    watchOn: 'watch on',
    rec: 'REC',
    focalLabel: 'go atomic',
  },//these are just placeholders to show how the UI would look with real data.
  pubs: {
    lensTag: 'electron diffraction · ~10,000,000×',
    title: 'Publications',
    subtitle: 'Diffraction data of an ongoing scientific life.',
    statusInProgress: 'in progress',
    statusPreprint: 'preprint',
    statusPublished: 'published',
    read: 'read',
  },
  worlds: {
    title: 'Other worlds',
    blurb: 'Same person, different lattices.',
    artTitle: 'Art',
    artDesc: 'My book-related publications',
    personalTitle: 'Personal',
    personalDesc: 'My blog',
    visit: 'visit',
  },
  contact: {
    title: 'Contact',
    blurb: 'No forms, no tracking. Find me where you already are.',
  },
  footer: {
    line: 'Built atom by atom with Astro, GSAP and Three.js.',
  },
  lattice: {
    hint: 'drag to rotate the unit cell',
    fallback: 'A face-centered cubic unit cell (your browser has WebGL disabled).',
  },
  cif: {
    load: 'load 3D structure',
    loading: 'solving structure…',
  },
} as const;

export type Dictionary = typeof import('./en').default;
