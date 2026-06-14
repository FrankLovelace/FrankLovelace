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
      en: 'A calculator that allows you to find the bond formed by two atoms from their symbol and number of electrons, programmed in WebAssembly for speed and efficiency.',
      es: 'Una calculadora que permite conocer el enlace formado por dos átomos a partir de su símbolo y su número de electrones, programado en Webassembly para que sea rápido y eficiente.',
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
      en: 'BraggSpect is a high-performance analytical platform for crystallographic phase identification and structural refinement of X-ray diffraction (XRD) data. Leveraging a hybrid microservices architecture (.NET 8 and Python HPC), the system distills the 100 GB COD database into an ultra-optimized local index, enabling real-time Hanawalt searches and Rietveld refinements with scientific-grade accuracy.',
      es: 'BraggSpect es una plataforma analítica de alto rendimiento para la identificación de fases cristalográficas y refinamiento estructural de datos de difracción de rayos X (DRX). Utilizando una arquitectura híbrida de microservicios (.NET 8 y Python HPC), el sistema destila los 100 GB de la base de datos COD en un índice local ultra-optimizado, permitiendo realizar búsquedas de Hanawalt y refinamientos de Rietveld en tiempo real con precisión de grado científico.',
    },
    tags: ['BraggSpect', 'Crystalography opensource Database', 'XRD analysis', 'Rietveld refinement'],
    github: 'https://github.com/FrankLovelace/BraggSpect',
    cif: '/structures/Silicon-Dioxide.cif',
  },
  {
    id: 'dev-ARM64 INFRASTRUCTURE',
    kind: 'dev',
    title: 'Cluster of ARM64 servers',
    desc: {
      en: 'Design and implementation of an isolated microservices architecture for real-time processing on ARM64 architecture. The system is orchestrated using Docker and a control Daemon, divided into three functional layers: Edge (Proxy Velocity), Compute (isolated PaperMC Nodes) and Data (MariaDB). A "Security-by-Design" strategy was applied using Docker network micro-segmentation (Bridge Network) where compute nodes are invisible to the outside. The management plane is protected through Cloudflare Tunnels (Zero Trust Ingress), eliminating the exposure of administration ports. At the performance level, a cascading memory limits strategy was implemented (JVM Heap vs Container Hard Limit) and Java 21 Generational ZGC was used to achieve sub-millisecond garbage collection pauses on Ampere processors. Persistence is guaranteed through Bind Mounts and an automated off-site Disaster Recovery (DRP) system via Rclone.',
      es: 'Diseño e implementación de una arquitectura de microservicios aislados para procesamiento de tiempo real en arquitectura ARM64. El sistema se orquesta mediante Docker y un Daemon de control, dividiéndose en tres capas funcionales: Edge (Proxy Velocity), Cómputo (Nodos PaperMC aislados) y Datos (MariaDB). Se aplicó una estrategia de seguridad "Security-by-Design" utilizando micro-segmentación de redes Docker (Bridge Network) donde los nodos de cómputo son invisibles al exterior. El plano de gestión está protegido mediante Cloudflare Tunnels (Zero Trust Ingress), eliminando la exposición de puertos de administración. A nivel de rendimiento, se implementó una estrategia de límites de memoria en cascada (JVM Heap vs Container Hard Limit) y se utilizó el Generational ZGC de Java 21 para lograr pausas de recolección de basura sub-milisegundo en procesadores Ampere. La persistencia se garantiza mediante Bind Mounts y un sistema automatizado de Disaster Recovery (DRP) off-site vía Rclone.',
    },
    tags: ['typescript', 'fullstack', 'docker', 'cloudflare', 'arm64', 'performance optimization'],
  },
  {
    id: 'dev-project-2',
    kind: 'dev',
    title: 'Data Science & Predictive Modeling',
    desc: {
      en: 'Execution of a full Data Mining cycle focused on performance analysis of digital content. The process started with rigorous ETL (null imputation, temporal standardization) and Feature Engineering to enrich the dataset. Mathematical rigor was applied through statistical tests (Shapiro-Wilk, Kruskal-Wallis) confirming with p < 0.001 the dominance of the "Music" category. In the modeling phase, I developed a Linear Regression (R² 0.66) for engagement prediction, a KNN classifier for category pattern detection, and used K-Means (optimized with the Elbow Method) to segment videos into 4 virality clusters. Findings were communicated through advanced visualizations in Seaborn.',
      es: 'Ejecución de un ciclo completo de Minería de Datos enfocado en el análisis de rendimiento de contenido digital. El proceso inició con un ETL riguroso (imputación de nulos, estandarización temporal) e Ingeniería de Características para enriquecer el dataset. Se aplicó rigor matemático mediante pruebas estadísticas (Shapiro-Wilk, Kruskal-Wallis) confirmando con p < 0.001 la dominancia de la categoría "Música". En la fase de modelado, desarrollé una Regresión Lineal (R² 0.66) para predicción de engagement, un clasificador KNN para detección de patrones de categoría y utilicé K-Means (optimizado con el Método del Codo) para segmentar videos en 4 clusters de viralidad. Los hallazgos se comunicaron mediante visualizaciones avanzadas en Seaborn.',
    },
    tags: ['python', "Pandas", 'scikit-learn', 'jupyter notebook', 'statistical analysis', "matplotlib", "seaborn"],
    github: 'https://github.com/FrankLovelace/Data-mining', 
  },
];
