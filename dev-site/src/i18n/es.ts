import type { Dictionary } from './en';

const es: Dictionary = {
  meta: {
    title: 'Frank Lovelace — Nanotecnología y Computación Científica',
    description:
      'Frank Lovelace: cristalografía, nanomateriales y software científico, ordenados como una serie de aumentos desde 1× hasta la difracción de electrones.',
  },
  nav: {
    levels: ['Ojo desnudo', 'Óptico', 'SEM', 'TEM', 'Difracción'],
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
    scrollHint: 'desplázate hacia abajo para aumentar',
    focalLabel: 'muestra',
  },
  about: {
    lensTag: 'microscopio óptico · ~400×',
    title: 'Sobre mí',
    p1: 'Empecé como desarrollador de software, construyendo sistemas completos: interfaces, servidores, pipelines de datos y despliegue. Hoy aplico esa formación a la nanotecnología y la computación científica.',
    p2: 'Mi área principal es la cristalografía: cómo se ordenan los átomos en los sólidos, cómo ese orden queda registrado en los datos de difracción y qué software permite recuperarlo. Estoy escribiendo mi primer artículo, una revisión sobre fullerenos, y estoy abierto a trabajar en otras áreas de la nanociencia.',
    p3: 'El sitio está organizado como una serie de aumentos. Cada sección corresponde a un régimen de observación, desde el ojo desnudo hasta la difracción de electrones.',
    focalLabel: 'acércate a la muestra',
  },
  projects: {
    lensTag: 'microscopio electrónico de barrido · ~50.000×',
    title: 'Proyectos',
    subtitle: 'Las imágenes de electrones no contienen información de color; a partir de aquí la página está en escala de grises.',
    filterAll: 'todo',
    filterNano: 'nano',
    filterDev: 'dev',
    code: 'código',
    demo: 'demo',
    structure: 'estructura',
    focalLabel: 'más aumento',
  },
  videos: {
    lensTag: 'TEM in situ · ~500.000×',
    title: 'Grabaciones',
    subtitle: 'Vídeos cortos sobre temas de nanociencia. Esta sección sigue en desarrollo; las publicaciones recientes están en Instagram.',
    watchOn: 'ver en',
    rec: 'REC',
    focalLabel: 'resolución atómica',
  },
  pubs: {
    lensTag: 'difracción de electrones · ~10.000.000×',
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
    artDesc: 'Publicaciones relacionadas con mi libro',
    personalTitle: 'Personal',
    personalDesc: 'Blog personal',
    visit: 'visitar',
  },
  contact: {
    title: 'Contacto',
    blurb: 'No hay formulario de contacto. Los mensajes en cualquiera de estos perfiles me llegan directamente.',
  },
  footer: {
    line: 'Hecho con Astro, GSAP, Three.js y 3Dmol.js.',
  },
  lattice: {
    hint: 'arrastra para rotar la celda unidad',
    fallback: 'Celda unidad cúbica centrada en las caras. La vista 3D requiere WebGL, que está desactivado en este navegador.',
  },
  cif: {
    load: 'cargar estructura 3D',
    loading: 'construyendo la celda unidad…',
  },
};

export default es;
