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
      en: 'Classifies the bond between two elements as ionic, covalent or metallic by placing it on the Van Arkel–Ketelaar triangle, using the electronegativity difference and mean of the pair. Compiled to WebAssembly and runs entirely in the browser.',
      es: 'Clasifica el enlace entre dos elementos como iónico, covalente o metálico ubicándolo en el triángulo de Van Arkel–Ketelaar, a partir de la diferencia y el promedio de sus electronegatividades. Compilado a WebAssembly; se ejecuta por completo en el navegador.',
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
      en: 'Containerized service stack on ARM64 (Ampere) hosts, orchestrated with Docker and a control daemon. Three tiers: an edge proxy (Velocity), isolated PaperMC compute nodes and a MariaDB data layer. Compute nodes sit on an internal Docker bridge network with no external exposure, and administration goes through Cloudflare Tunnels instead of open ports. JVM heap sizes are kept below the container memory limits, and Java 21 Generational ZGC holds garbage-collection pauses under 1 ms. State lives on bind mounts with automated off-site backups via Rclone.',
      es: 'Stack de servicios en contenedores sobre servidores ARM64 (Ampere), orquestado con Docker y un daemon de control. Tres capas: un proxy de borde (Velocity), nodos de cómputo PaperMC aislados y una capa de datos en MariaDB. Los nodos de cómputo están en una red bridge interna de Docker sin exposición externa, y la administración pasa por Cloudflare Tunnels en lugar de puertos abiertos. El heap de la JVM se mantiene por debajo del límite de memoria de cada contenedor, y el Generational ZGC de Java 21 mantiene las pausas de recolección de basura por debajo de 1 ms. El estado vive en bind mounts con respaldos automáticos fuera del sitio mediante Rclone.',
    },
    tags: ['typescript', 'fullstack', 'docker', 'cloudflare', 'arm64', 'performance optimization'],
  },
  {
    id: 'dev-project-2',
    kind: 'dev',
    title: 'Data Science & Predictive Modeling',
    desc: {
      en: 'Complete data-mining workflow on performance data for online video. ETL with null imputation and timestamp normalization, followed by feature engineering. Shapiro–Wilk tests rejected normality, so categories were compared with Kruskal–Wallis (p < 0.001), with Music ranking highest. Models: linear regression for engagement (R² = 0.66), a KNN category classifier, and K-means (k = 4, chosen by the elbow method) to group videos by virality. Results presented with Seaborn.',
      es: 'Flujo completo de minería de datos sobre métricas de rendimiento de video en línea. ETL con imputación de nulos y normalización de fechas, seguido de ingeniería de características. Las pruebas de Shapiro–Wilk rechazaron la normalidad, por lo que las categorías se compararon con Kruskal–Wallis (p < 0.001); la categoría Música obtuvo el mejor rendimiento. Modelos: regresión lineal para engagement (R² = 0.66), un clasificador KNN por categoría y K-means (k = 4, elegido con el método del codo) para agrupar los videos por viralidad. Resultados presentados con Seaborn.',
    },
    tags: ['python', "Pandas", 'scikit-learn', 'jupyter notebook', 'statistical analysis', "matplotlib", "seaborn"],
    github: 'https://github.com/FrankLovelace/Data-mining', 
  },
];
