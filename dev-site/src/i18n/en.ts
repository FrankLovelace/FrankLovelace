export default {
  meta: {
    title: 'Frank Lovelace — Nanotechnology & Scientific Computing',
    description:
      'Portfolio of Frank Lovelace: crystallography, nanomaterials and scientific software, presented as a journey from 1× to electron diffraction.',
  },
  nav: {
    // add 'TEM' after 'SEM' when the Recordings scene is re-enabled
    levels: ['Naked eye', 'Optical', 'SEM', 'Diffraction'],
    skip: 'Skip to content',
  },
  hud: {
    magnification: 'MAG',
    mode: 'MODE',
    detector: 'DET',
  },
  ruler: {
    label: 'Page position',
    jump: 'Jump to',
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
      'We are shaped by our material conditions and social context; the rest is luck and a pinch of sugar.',
    scrollHint: 'scroll to increase magnification',
    focalLabel: 'about me',
  },
  about: {
    lensTag: 'optical microscope · ~400×',
    title: 'About me',
    p1: 'I come from software development, where I built complete systems, from the interface to the server, data pipelines and deployment. Today I bring that experience to nanotechnology and scientific computing.',
    p2: 'My focus is crystallography, especially the software that turns diffraction data back into atomic structures. I am currently writing my first paper, a review on fullerenes, and I am interested in contributing to other areas of nanoscience.',
    p3: 'This site works like a microscope: each section is a step up in magnification, from the naked eye down to electron diffraction.',
    focalLabel: 'projects',
  },
  projects: {
    lensTag: 'scanning electron microscope · ~50,000×',
    title: 'Projects',
    subtitle: 'Electron imaging carries no color information, so from here on the page is in grayscale.',
    filterAll: 'all',
    filterNano: 'nano',
    filterDev: 'dev',
    code: 'code',
    demo: 'live demo',
    structure: 'structure',
    // next scene; set to 'recordings' when the Recordings scene is re-enabled
    focalLabel: 'publications',
  },
  videos: {
    lensTag: 'in-situ TEM · ~500,000×',
    title: 'Recordings',
    subtitle: 'Short videos explaining topics in nanoscience.',
    watchOn: 'watch on',
    rec: 'REC',
    focalLabel: 'publications',
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
    artDesc: 'Characters, lore and art from the world of my book.',
    personalTitle: 'Personal',
    personalDesc: 'Personal blog.',
    visit: 'visit',
  },
  contact: {
    title: 'Contact',
    blurb: 'You can reach me directly through any of these profiles.',
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
