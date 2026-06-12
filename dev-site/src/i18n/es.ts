import type { Dictionary } from './en';

const es: Dictionary = {
  meta: {
    title: 'Frank Lovelace — Nanotecnología y Computación Científica',
    description:
      'Un viaje al microscopio por el trabajo de Frank Lovelace: ingeniería de software, nanotecnología, cristalografía y computación científica.',
  },
  nav: {
    levels: ['Ojo desnudo', 'Óptico', 'SEM', 'TEM', 'Difracción'],
    skip: 'Saltar al contenido',
  },
  hud: {
    magnification: 'MAG',
    mode: 'MODO',
    detector: 'DET',
  },
  chrome: {
    modeToggle: 'Cambiar modo de color',
    modePro: 'profesional',
    modePop: 'color pop',
    langSwitch: 'Switch to English',
    langLabel: 'EN',
  },
  hero: {
    name: 'Frank Lovelace',
    role: 'desarrollador de software → nanotecnología y computación científica',
    quote:
      'Nos moldean nuestras condiciones materiales y nuestro contexto social; el resto es suerte y una pizca de azúcar.',
    scrollHint: 'haz scroll para aumentar la magnificación',
    focalLabel: 'muestra',
  },
  about: {
    lensTag: 'microscopio óptico · ~400×',
    title: 'Sobre la muestra',
    p1: 'Siendo programador construí software de punta a punta: interfaces, servidores, pipelines, despliegues. En algún momento apunté esa misma curiosidad hacia la materia, y ahora trabajo en nanotecnología y computación científica.',
    p2: 'Mi terreno es la cristalografía: cómo se ordenan los átomos, cómo ese orden deja huellas en los datos de difracción y cómo el código puede leerlas. Ahora mismo escribo mi primer artículo, y no tengo miedo a aprender de cualquier rama del nanomundo.',
    p3: 'Este sitio es las dos cosas a la vez: la ingeniería es el instrumento, la ciencia es la muestra.',
    focalLabel: 'acércate a la muestra',
  },
  projects: {
    lensTag: 'microscopio electrónico de barrido · ~50.000×',
    title: 'Proyectos',
    subtitle: 'Los electrones no llevan color. A partir de aquí, todo es escala de grises.',
    filterAll: 'todo',
    filterNano: 'nano',
    filterDev: 'dev',
    code: 'código',
    demo: 'demo',
    structure: 'estructura',
    focalLabel: 'aumenta la magnificación',
  },
  videos: {
    lensTag: 'TEM in situ · ~500.000×',
    title: 'Grabaciones',
    subtitle: 'Vídeos cortos sobre el nanomundo, grabados en libertad. Esta sección aún no está lista, pero puedes revisar mi Instagram. donde subire cualquier actualizacion',
    watchOn: 'ver en',
    rec: 'REC',
    focalLabel: 'a lo atómico',
  },//placeholders para mostrar cómo se vería la UI con datos reales.',
  pubs: {
    lensTag: 'difracción de electrones · ~10.000.000×',
    title: 'Publicaciones',
    subtitle: 'Datos de difracción de una vida científica en curso.',
    statusInProgress: 'en curso',
    statusPreprint: 'preprint',
    statusPublished: 'publicado',
    read: 'leer',
  },
  worlds: {
    title: 'Otros mundos',
    blurb: 'La misma persona, distintas redes cristalinas.',
    artTitle: 'Arte',
    artDesc: 'publicaciones sobre mi libro',
    personalTitle: 'Personal',
    personalDesc: 'Mi blog',
    visit: 'visitar',
  },
  contact: {
    title: 'Contacto',
    blurb: 'Sin formularios, sin rastreo. Encuéntrame donde ya estás.',
  },
  footer: {
    line: 'Construido átomo a átomo con Astro, GSAP y Three.js.',
  },
  lattice: {
    hint: 'arrastra para rotar la celda unidad',
    fallback: 'Una celda unidad cúbica centrada en las caras (tu navegador tiene WebGL desactivado).',
  },
  cif: {
    load: 'cargar estructura 3D',
    loading: 'resolviendo estructura…',
  },
};

export default es;
