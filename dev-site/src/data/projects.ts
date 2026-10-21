import type { Locale } from '../i18n';

export interface Project {
  id: string;
  kind: 'nano' | 'dev';
  title: string;
  desc: Record<Locale, string>;
  tags: string[];
  github?: string;
  demo?: string;
  cif?: string;
}

export const projects: Project[] = [
  {
    id: 'nano-project-1',
    kind: 'nano',
    title: 'VAK Dashboard',
    desc: {
      en: 'Classifies the bond between any two elements as ionic, covalent or metallic by placing the pair on the Van Arkel–Ketelaar triangle, based on the difference and the mean of their electronegativities. Compiled to WebAssembly, it runs entirely in the browser.',
      es: 'Clasifica el enlace entre dos elementos cualesquiera como iónico, covalente o metálico al ubicar el par en el triángulo de Van Arkel–Ketelaar, a partir de la diferencia y el promedio de sus electronegatividades. Compilado a WebAssembly, se ejecuta por completo en el navegador.',
    },
    tags: ['Van Arkel Ketelaar', 'WebAssembly', 'crystallography'],
    github: 'https://github.com/FrankLovelace/EnlacesQuimicos',
    demo: 'https://enlacesquimicos.FrankLovelace.dev',
    cif: '/structures/nacl.cif',
  },
  {
    id: 'nano-project-2',
    kind: 'nano',
    title: 'BraggSpect',
    desc: {
      en: 'Phase identification and structural refinement for X-ray diffraction (XRD) data. A .NET 8 service and Python compute workers reduce the ~100 GB Crystallography Open Database (COD) to a compact local index, so Hanawalt search-match and Rietveld refinement run interactively on a single machine.',
      es: 'Identificación de fases y refinamiento estructural para datos de difracción de rayos X (DRX). Un servicio en .NET 8 y workers de cómputo en Python reducen la Crystallography Open Database (COD, ~100 GB) a un índice local compacto, de modo que la búsqueda Hanawalt y el refinamiento Rietveld se ejecutan de forma interactiva en una sola máquina.',
    },
    tags: ['BraggSpect', 'Crystallography Open Database', 'XRD analysis', 'Rietveld refinement'],
    github: 'https://github.com/FrankLovelace/BraggSpect',
    cif: '/structures/Silicon-Dioxide.cif',
  },
  {
    id: 'dev-ARM64 INFRASTRUCTURE',
    kind: 'dev',
    title: 'ARM64 container cluster',
    desc: {
      en: 'Containerized service stack on ARM64 (Ampere) servers, orchestrated with Docker and a control daemon. It has three tiers: a Velocity edge proxy, isolated PaperMC compute nodes and a MariaDB data layer. The compute nodes run on an internal Docker bridge network with no public exposure, and all administration goes through Cloudflare Tunnels instead of open ports. JVM heaps are sized below the memory limit of each container, and the Generational ZGC in Java 21 keeps garbage-collection pauses under 1 ms. Persistent state lives on bind mounts with automated off-site backups through Rclone.',
      es: 'Stack de servicios en contenedores sobre servidores ARM64 (Ampere), orquestado con Docker y un daemon de control. Consta de tres capas: un proxy de borde (Velocity), nodos de cómputo PaperMC aislados y una capa de datos en MariaDB. Los nodos de cómputo operan en una red bridge interna de Docker sin exposición pública, y toda la administración pasa por Cloudflare Tunnels en lugar de puertos abiertos. El heap de la JVM se mantiene por debajo del límite de memoria de cada contenedor, y el Generational ZGC de Java 21 mantiene las pausas de recolección de basura por debajo de 1 ms. El estado vive en bind mounts con respaldos automáticos fuera del sitio mediante Rclone.',
    },
    tags: ['docker', 'arm64', 'cloudflare', 'performance optimization', 'typescript'],
  },
  {
    id: 'dev-project-2',
    kind: 'dev',
    title: 'Data Science & Predictive Modeling',
    desc: {
      en: 'Full data-mining study of online video performance. The ETL stage imputes missing values and normalizes timestamps before feature engineering. Shapiro–Wilk tests rejected normality, so categories were compared with Kruskal–Wallis (p < 0.001), with Music ranking highest. Models include linear regression for engagement (R² = 0.66), a KNN category classifier and K-means clustering (k = 4, chosen by the elbow method) to group videos by virality. Results visualized with Seaborn.',
      es: 'Estudio completo de minería de datos sobre el rendimiento de videos en línea. La etapa de ETL imputa valores nulos y normaliza fechas antes de la ingeniería de características. Las pruebas de Shapiro–Wilk rechazaron la normalidad, por lo que las categorías se compararon con Kruskal–Wallis (p < 0.001); la categoría Música obtuvo el mejor rendimiento. Los modelos incluyen regresión lineal para engagement (R² = 0.66), un clasificador KNN por categoría y agrupamiento K-means (k = 4, elegido con el método del codo) para segmentar los videos por viralidad. Resultados visualizados con Seaborn.',
    },
    tags: ['python', "Pandas", 'scikit-learn', 'jupyter notebook', 'statistical analysis', "matplotlib", "seaborn"],
    github: 'https://github.com/FrankLovelace/Data-mining', 
  },
];
