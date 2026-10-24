import { describe, expect, it } from 'vitest';
import { getI18n, SUPPORTED_LANGUAGES } from '../src/core/i18n';

describe('i18n Localization Dictionaries', () => {
  it('has localized newTabTitle for all supported languages', () => {
    for (const meta of SUPPORTED_LANGUAGES) {
      if (meta.id === 'auto') continue;
      const dict = getI18n(meta.id);
      expect(dict.newTabTitle).toBeDefined();
      expect(typeof dict.newTabTitle).toBe('string');
      expect(dict.newTabTitle.length).toBeGreaterThan(0);
    }
  });

  it('translates Russian newTabTitle to "Новая вкладка"', () => {
    const ruDict = getI18n('ru');
    expect(ruDict.newTabTitle).toBe('Новая вкладка');
    expect(ruDict.linksNewTab).toBe('Новая вкладка');
  });

  it('translates English newTabTitle to "New Tab"', () => {
    const enDict = getI18n('en');
    expect(enDict.newTabTitle).toBe('New Tab');
  });
});
