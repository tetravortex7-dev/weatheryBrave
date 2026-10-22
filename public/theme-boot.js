// Immediate synchronous theme boot before first paint (Zero-FOUC).
// Externalized so Manifest V3 CSP `script-src 'self'` remains strict without unsafe-inline.
(function applyInitialTheme(): void {
  try {
    const raw = localStorage.getItem('wb_theme');
    const validThemes = new Set([
      'brave-dark',
      'midnight-oled',
      'nordic-frost',
      'solar-warm',
      'clean-light',
      'auto-system',
    ]);
    const theme = raw && validThemes.has(raw) ? raw : 'brave-dark';
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = 'brave-dark';
  }
})();
