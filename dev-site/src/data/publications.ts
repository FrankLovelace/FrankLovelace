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
      en: 'First paper, crystallography. Currently growing, like any good crystal: slowly and under controlled conditions.',
      es: 'Primer artículo, cristalografía. Creciendo como cualquier buen cristal: despacio y en condiciones controladas.',
    },
  },
];
