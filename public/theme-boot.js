(function applyInitialBoot() {
  try {
    const rawTheme = localStorage.getItem('wb_theme');
    const validThemes = new Set([
      'brave-dark',
      'midnight-oled',
      'nordic-frost',
      'solar-warm',
      'clean-light',
      'auto-system',
    ]);
    const theme = rawTheme && validThemes.has(rawTheme) ? rawTheme : 'brave-dark';
    document.documentElement.dataset.theme = theme;

    const titles = {
      ru: 'Новая вкладка',
      es: 'Nueva pestaña',
      zh: '新标签页',
      hi: 'नया टैब',
      ar: 'علامة تبويب جديدة',
      pt: 'Nova guia',
      ja: '新しいタブ',
      de: 'Neuer Tab',
      fr: 'Nouvel onglet',
      ko: '새 탭',
      tr: 'Yeni Sekme',
      en: 'New Tab',
    };

    let lang = 'en';
    const rawSettings = localStorage.getItem('wb_settings');
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings);
        if (
          parsed &&
          typeof parsed.language === 'string' &&
          parsed.language !== 'auto'
        ) {
          lang = parsed.language;
        }
      } catch {}
    }
    if (lang === 'en' || !titles[lang]) {
      const navLang = (navigator.language || 'en').toLowerCase().split('-')[0];
      if (navLang && titles[navLang]) {
        lang = navLang;
      }
    }
    if (titles[lang]) {
      document.title = titles[lang];
    }
  } catch {
    document.documentElement.dataset.theme = 'brave-dark';
  }
})();
