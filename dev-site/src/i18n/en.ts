export default {
  meta: {
    title: 'Frank Lovelace — Nanotechnology & Scientific Computing',
    description:
      'Frank Lovelace: crystallography, nanomaterials and scientific software, arranged as a magnification series from 1× to electron diffraction.',
  },
  nav: {
    levels: ['Naked eye', 'Optical', 'SEM', 'TEM', 'Diffraction'],
    skip: 'Skip to content',
  },
  hud: {
    magnification: 'MAG',
    mode: 'MODE',
    detector: 'DET',
    sliderLabel: 'Magnification',
    scrubHint: 'Drag sideways to change magnification · double-click to return to 1×',
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
    role: 'software development → nanotechnology & scientific computing',
    quote:
      'We are shaped by our material conditions and social context, the rest is luck and a pinch of sugar.',
    scrollHint: 'scroll to increase magnification',
    focalLabel: 'specimen',
  },
  about: {
    lensTag: 'optical microscope · ~400×',
    title: 'About me',
    p1: 'I started as a software developer, building systems end to end: interfaces, servers, data pipelines and deployment. I now apply that background to nanotechnology and scientific computing.',
    p2: 'My main area is crystallography: how atoms are arranged in solids, how that order is recorded in diffraction data, and the software used to recover it. I am writing my first paper, a review on fullerenes, and I am open to work in other areas of nanoscience.',
    p3: 'The site is laid out as a magnification series. Each section corresponds to an imaging regime, from the naked eye down to electron diffraction.',
    focalLabel: '',
  },
  projects: {
    lensTag: 'scanning electron microscope · ~50,000×',
    title: 'Projects',
    subtitle: 'Electron images carry no color information, so from this point on the page is grayscale.',
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
    subtitle: 'Short videos on nanoscience topics. This section is still in progress; recent uploads are on Instagram.',
    watchOn: 'watch on',
    rec: 'REC',
    focalLabel: 'atomic resolution',
  },
  pubs: {
    lensTag: 'electron diffraction · ~10,000,000×',
    title: 'Publications',
    subtitle: 'Manuscripts in preparation, preprints and published work.',
    statusInProgress: 'in progress',
    statusPreprint: 'preprint',
    statusPublished: 'published',
    read: 'read',
  },
  worlds: {
    title: 'Other work',
    blurb: 'Writing and personal projects outside science.',
    artTitle: 'Art',
    artDesc: 'Publications related to my book',
    personalTitle: 'Personal',
    personalDesc: 'Personal blog',
    visit: 'visit',
  },
  contact: {
    title: 'Contact',
    blurb: 'There is no contact form. Messages on any of these profiles reach me directly.',
  },
  footer: {
    line: 'Built with Astro, GSAP, Three.js and 3Dmol.js.',
  },
  lattice: {
    hint: 'drag to rotate the unit cell',
    fallback: 'Face-centered cubic unit cell. The 3D view needs WebGL, which is disabled in this browser.',
  },
  cif: {
    load: 'load 3D structure',
    loading: 'building unit cell…',
  },
} as const;

export type Dictionary = typeof import('./en').default;
