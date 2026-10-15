import type { Locale } from '../i18n';

export interface Publication {
  id: string;
  status: 'in-progress' | 'preprint' | 'published';
  year: number;
  title: Record<Locale, string>;
  blurb: Record<Locale, string>;
  venue?: string;
  links?: { doi?: string; arxiv?: string; pdf?: string };
}

export const publications: Publication[] = [
  {
    id: 'paper-2026',
    status: 'in-progress',
    year: 2026,
    title: {
      en: 'A Review on Fullerenes',
      es: 'Una revisión sobre fullerenos',
    },
    blurb: {
      en: 'Review of the structure and crystallography of fullerenes. First paper; manuscript in preparation.',
      es: 'Revisión sobre la estructura y la cristalografía de los fullerenos. Primer artículo; manuscrito en preparación.',
    },
  },
];
