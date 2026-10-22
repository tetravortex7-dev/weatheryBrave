import { THEME_REGISTRY, type ThemeId, type ThemeMeta } from '../../core/models/Theme';
import { STORAGE_KEYS } from '../../infra/storage/LocalStorageAdapter';

export class ThemeManager {
  public applyTheme(themeId: ThemeId): void {
    document.documentElement.dataset.theme = themeId;
    try {
      window.localStorage.setItem(STORAGE_KEYS.THEME, themeId);
    } catch {
      // Ignore storage failures
    }
  }

  public getAvailableThemes(): readonly ThemeMeta[] {
    return THEME_REGISTRY;
  }
}
