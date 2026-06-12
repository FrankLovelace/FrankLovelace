import type { Locale } from '../i18n';

export interface Video {
  id: string;
  platform: 'instagram' | 'tiktok';
  url: string;
  title: Record<Locale, string>;
  timecode: string;
}

export const videos: Video[] = [
  {
    id: 'rec-001',
    platform: 'instagram',
    url: 'https://instagram.com/TODO',
    title: {
      en: 'What even is a crystal?',
      es: '¿Qué es exactamente un cristal?',
    },
    timecode: '00:00:58',
  },
  {
    id: 'rec-002',
    platform: 'tiktok',
    url: 'https://tiktok.com/@TODO',
    title: {
      en: 'Seeing atoms with electrons',
      es: 'Ver átomos con electrones',
    },
    timecode: '00:01:24',
  },
  {
    id: 'rec-003',
    platform: 'instagram',
    url: 'https://instagram.com/TODO',
    title: {
      en: 'Why diffraction patterns are beautiful',
      es: 'Por qué los patrones de difracción son bellos',
    },
    timecode: '00:00:47',
  },
];
