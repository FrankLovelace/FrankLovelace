import en from './en';
import es from './es';
import type { Dictionary } from './en';

export type Locale = 'en' | 'es';

const dictionaries: Record<Locale, Dictionary> = { en, es };

export const locales: Locale[] = ['en', 'es'];
export const defaultLocale: Locale = 'en';

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

export function altLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}
