import { ar } from './locales/ar';
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { hi } from './locales/hi';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { tr } from './locales/tr';
import { zh } from './locales/zh';
import {
  type AppLanguage,
  type TranslationDictionary,
} from './types';

export * from './types';

export const TRANSLATIONS: Record<Exclude<AppLanguage, 'auto'>, TranslationDictionary> = {
  en,
  ru,
  es,
  zh,
  hi,
  ar,
  pt,
  ja,
  de,
  fr,
  ko,
  tr,
};

export function resolveLanguage(pref: AppLanguage): Exclude<AppLanguage, 'auto'> {
  if (pref !== 'auto') {
    return pref;
  }

  try {
    const chromeUiLang = (globalThis as { chrome?: { i18n?: { getUILanguage?: () => string } } })
      ?.chrome?.i18n?.getUILanguage?.();
    const raw = chromeUiLang || navigator.language || 'en';
    const code = raw.toLowerCase().split('-')[0];
    if (code && code in TRANSLATIONS) {
      return code as Exclude<AppLanguage, 'auto'>;
    }
  } catch {
  }

  return 'en';
}

export function getI18n(pref: AppLanguage): TranslationDictionary {
  const lang = resolveLanguage(pref);
  return TRANSLATIONS[lang] ?? TRANSLATIONS.en;
}
