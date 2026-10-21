import type { Dictionary } from './en';

const es: Dictionary = {
  meta: {
    title: 'Frank Lovelace — Nanotecnología y Computación Científica',
    description:
      'Portafolio de Frank Lovelace: cristalografía, nanomateriales y software científico, presentados como un recorrido desde 1× hasta la difracción de electrones.',
  },
  nav: {
    // añadir 'TEM' después de 'SEM' cuando se reactive la escena de Grabaciones
    levels: ['Ojo desnudo', 'Óptico', 'SEM', 'Difracción'],
    skip: 'Saltar al contenido',
  },
  hud: {
    magnification: 'AUM',
    mode: 'MODO',
    detector: 'DET',
  },
  ruler: {
    label: 'Posición en la página',
    jump: 'Ir a',
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
    role: 'desarrollo de software → nanotecnología y computación científica',
    quote:
      'Nos moldean nuestras condiciones materiales y nuestro contexto social; el resto es suerte y una pizca de azúcar.',
    scrollHint: 'desplázate para aumentar',
    focalLabel: 'sobre mí',
  },
  about: {
    lensTag: 'microscopio óptico · ~400×',
    title: 'Sobre mí',
    p1: 'Vengo del desarrollo de software, donde construí sistemas completos, desde la interfaz hasta el servidor, los pipelines de datos y el despliegue. Hoy llevo esa experiencia a la nanotecnología y la computación científica.',
    p2: 'Mi enfoque es la cristalografía, en particular el software que convierte los datos de difracción de vuelta en estructuras atómicas. Actualmente escribo mi primer artículo, una revisión sobre fullerenos, y me interesa contribuir en otras áreas de la nanociencia.',
    p3: 'Este sitio funciona como un microscopio: cada sección es un paso más de aumento, desde el ojo desnudo hasta la difracción de electrones.',
    focalLabel: 'proyectos',
  },
  projects: {
    lensTag: 'microscopio electrónico de barrido · ~50,000×',
    title: 'Proyectos',
    subtitle: 'Las imágenes de electrones no contienen información de color, así que a partir de aquí la página está en escala de grises.',
    filterAll: 'todo',
    filterNano: 'nano',
    filterDev: 'dev',
    code: 'código',
    demo: 'demo',
    structure: 'estructura',
    // siguiente escena; cambiar a 'grabaciones' cuando se reactive la escena de Grabaciones
    focalLabel: 'publicaciones',
  },
  videos: {
    lensTag: 'TEM in situ · ~500,000×',
    title: 'Grabaciones',
    subtitle: 'Videos cortos que explican temas de nanociencia.',
    watchOn: 'ver en',
    rec: 'REC',
    focalLabel: 'publicaciones',
  },
  pubs: {
    lensTag: 'difracción de electrones · ~10,000,000×',
    title: 'Publicaciones',
    subtitle: 'Manuscritos en preparación, preprints y trabajos publicados.',
    statusInProgress: 'en curso',
    statusPreprint: 'preprint',
    statusPublished: 'publicado',
    read: 'leer',
  },
  worlds: {
    title: 'Otros trabajos',
    blurb: 'Escritura y proyectos personales fuera de la ciencia.',
    artTitle: 'Arte',
    artDesc: 'Personajes, historia y arte del mundo de mi libro.',
    personalTitle: 'Personal',
    personalDesc: 'Blog personal.',
    visit: 'visitar',
  },
  contact: {
    title: 'Contacto',
    blurb: 'Puedes escribirme directamente en cualquiera de estos perfiles.',
  },
  footer: {
    line: 'Hecho con Astro, GSAP, Three.js y 3Dmol.js.',
  },
  lattice: {
    hint: 'arrastra para rotar la celda unitaria',
    fallback: 'Celda unitaria cúbica centrada en las caras. La vista 3D requiere WebGL, que está desactivado en este navegador.',
  },
  cif: {
    load: 'cargar estructura 3D',
    loading: 'construyendo la celda unitaria…',
  },
};

export default es;
