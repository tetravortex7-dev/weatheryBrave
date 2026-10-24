import {
  DEFAULT_QUICK_LINKS,
  MAX_QUICK_LINKS,
  type QuickLink,
} from '../../core/models/QuickLink';
import { type AppLanguage, SUPPORTED_LANGUAGES } from '../../core/i18n';
import {
  DEFAULT_SETTINGS,
  type LinkTargetMode,
  type TemperatureUnit,
  type TimeFormat,
  type UserSettings,
  type WeatherViewMode,
  type WindSpeedUnit,
} from '../../core/models/Settings';
import { isValidThemeId } from '../../core/models/Theme';
import { type WallpaperSourceMode } from '../../core/models/Wallpaper';
import { type WeatherData } from '../../core/models/Weather';
import {
  type ISettingsStore,
  type IWeatherCacheStore,
} from '../../core/ports/IStorageAdapter';

export const STORAGE_KEYS = {
  THEME: 'wb_theme',
  SETTINGS: 'wb_settings',
  WEATHER_CACHE: 'wb_weather_cache',
} as const;

export function isAppLanguage(val: unknown): val is AppLanguage {
  return (
    typeof val === 'string' &&
    SUPPORTED_LANGUAGES.some((lang) => lang.id === val)
  );
}

export function isTempUnit(val: unknown): val is TemperatureUnit {
  return val === 'celsius' || val === 'fahrenheit';
}

export function isWindUnit(val: unknown): val is WindSpeedUnit {
  return val === 'kmh' || val === 'ms' || val === 'mph';
}

export function isTimeFormat(val: unknown): val is TimeFormat {
  return val === '24h' || val === '12h';
}

export function isWallpaperSource(val: unknown): val is WallpaperSourceMode {
  return val === 'both' || val === 'custom-only' || val === 'builtin-only';
}

export function isWeatherViewMode(val: unknown): val is WeatherViewMode {
  return val === 'full' || val === 'compact';
}

export function isLinkTargetMode(val: unknown): val is LinkTargetMode {
  return val === 'current' || val === 'new-tab';
}

const LEGACY_DEFAULT_LINK_IDS: readonly string[] = [
  'pin-github',
  'pin-youtube',
  'pin-reddit',
  'pin-hn',
];

const PREVIOUS_WITH_GOOGLE_IDS: readonly string[] = [
  'pin-google',
  'pin-youtube',
  'pin-facebook',
  'pin-instagram',
  'pin-chatgpt',
];

export function parseQuickLinks(raw: unknown): readonly QuickLink[] {
  if (!Array.isArray(raw)) {
    return DEFAULT_QUICK_LINKS;
  }
  const valid: QuickLink[] = [];
  for (const item of raw) {
    if (
      item &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>)['id'] === 'string' &&
      typeof (item as Record<string, unknown>)['title'] === 'string' &&
      typeof (item as Record<string, unknown>)['url'] === 'string'
    ) {
      const rec = item as Record<string, string>;
      valid.push({
        id: rec['id'] ?? '',
        title: rec['title'] ?? '',
        url: rec['url'] ?? '',
      });
    }
    if (valid.length >= MAX_QUICK_LINKS) {
      break;
    }
  }
  const isLegacyOld =
    valid.length === LEGACY_DEFAULT_LINK_IDS.length &&
    valid.every((link, idx) => link.id === LEGACY_DEFAULT_LINK_IDS[idx]);

  const isPreviousWithGoogle =
    valid.length === PREVIOUS_WITH_GOOGLE_IDS.length &&
    valid.every((link, idx) => link.id === PREVIOUS_WITH_GOOGLE_IDS[idx]);

  if (isLegacyOld || isPreviousWithGoogle) {
    return DEFAULT_QUICK_LINKS;
  }
  return valid;
}

export class LocalStorageAdapter implements ISettingsStore, IWeatherCacheStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  public loadSettings(): UserSettings {
    try {
      const raw = this.storage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) {
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const loc = parsed['location'] as Record<string, unknown> | undefined;

      const location =
        loc &&
        typeof loc['name'] === 'string' &&
        typeof loc['latitude'] === 'number' &&
        typeof loc['longitude'] === 'number'
          ? {
              name: loc['name'],
              latitude: loc['latitude'],
              longitude: loc['longitude'],
              ...(typeof loc['country'] === 'string'
                ? { country: loc['country'] }
                : {}),
              ...(typeof loc['admin1'] === 'string'
                ? { admin1: loc['admin1'] }
                : {}),
            }
          : DEFAULT_SETTINGS.location;

      return {
        language: isAppLanguage(parsed['language'])
          ? parsed['language']
          : DEFAULT_SETTINGS.language,
        theme: isValidThemeId(parsed['theme'])
          ? parsed['theme']
          : DEFAULT_SETTINGS.theme,
        location,
        temperatureUnit: isTempUnit(parsed['temperatureUnit'])
          ? parsed['temperatureUnit']
          : DEFAULT_SETTINGS.temperatureUnit,
        windSpeedUnit: isWindUnit(parsed['windSpeedUnit'])
          ? parsed['windSpeedUnit']
          : DEFAULT_SETTINGS.windSpeedUnit,
        timeFormat: isTimeFormat(parsed['timeFormat'])
          ? parsed['timeFormat']
          : DEFAULT_SETTINGS.timeFormat,
        showSeconds:
          typeof parsed['showSeconds'] === 'boolean'
            ? parsed['showSeconds']
            : DEFAULT_SETTINGS.showSeconds,
        showGreeting:
          typeof parsed['showGreeting'] === 'boolean'
            ? parsed['showGreeting']
            : DEFAULT_SETTINGS.showGreeting,
        customName:
          typeof parsed['customName'] === 'string'
            ? parsed['customName']
            : DEFAULT_SETTINGS.customName,
        secondaryTimezone:
          typeof parsed['secondaryTimezone'] === 'string'
            ? parsed['secondaryTimezone']
            : DEFAULT_SETTINGS.secondaryTimezone,
        showQuickLinks:
          typeof parsed['showQuickLinks'] === 'boolean'
            ? parsed['showQuickLinks']
            : DEFAULT_SETTINGS.showQuickLinks,
        quickLinks: parseQuickLinks(parsed['quickLinks']),
        showWallpaper:
          typeof parsed['showWallpaper'] === 'boolean'
            ? parsed['showWallpaper']
            : DEFAULT_SETTINGS.showWallpaper,
        wallpaperSource: isWallpaperSource(parsed['wallpaperSource'])
          ? parsed['wallpaperSource']
          : DEFAULT_SETTINGS.wallpaperSource,
        lockWallpaper:
          typeof parsed['lockWallpaper'] === 'boolean'
            ? parsed['lockWallpaper']
            : DEFAULT_SETTINGS.lockWallpaper,
        wallpaperDim:
          typeof parsed['wallpaperDim'] === 'number' &&
          Number.isFinite(parsed['wallpaperDim'])
            ? Math.max(0, Math.min(80, parsed['wallpaperDim']))
            : DEFAULT_SETTINGS.wallpaperDim,
        wallpaperBlur:
          typeof parsed['wallpaperBlur'] === 'number' &&
          Number.isFinite(parsed['wallpaperBlur'])
            ? Math.max(0, Math.min(20, parsed['wallpaperBlur']))
            : DEFAULT_SETTINGS.wallpaperBlur,
        weatherViewMode: isWeatherViewMode(parsed['weatherViewMode'])
          ? parsed['weatherViewMode']
          : DEFAULT_SETTINGS.weatherViewMode,
        showScratchpad:
          typeof parsed['showScratchpad'] === 'boolean'
            ? parsed['showScratchpad']
            : DEFAULT_SETTINGS.showScratchpad,
        scratchpadContent:
          typeof parsed['scratchpadContent'] === 'string'
            ? parsed['scratchpadContent']
            : DEFAULT_SETTINGS.scratchpadContent,
        linkTarget: isLinkTargetMode(parsed['linkTarget'])
          ? parsed['linkTarget']
          : DEFAULT_SETTINGS.linkTarget,
        showTempBadge:
          typeof parsed['showTempBadge'] === 'boolean'
            ? parsed['showTempBadge']
            : DEFAULT_SETTINGS.showTempBadge,
        adaptiveAccent:
          typeof parsed['adaptiveAccent'] === 'boolean'
            ? parsed['adaptiveAccent']
            : DEFAULT_SETTINGS.adaptiveAccent,
        showSearch:
          typeof parsed['showSearch'] === 'boolean'
            ? parsed['showSearch']
            : DEFAULT_SETTINGS.showSearch,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: UserSettings): void {
    try {
      this.storage.setItem(STORAGE_KEYS.THEME, settings.theme);
      this.storage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
    }
  }

  public loadWeatherCache(): WeatherData | null {
    try {
      const raw = this.storage.getItem(STORAGE_KEYS.WEATHER_CACHE);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as WeatherData;
      if (
        typeof parsed?.locationName !== 'string' ||
        typeof parsed?.fetchedAtEpochMs !== 'number' ||
        typeof parsed?.current?.temperatureCelsius !== 'number' ||
        !Array.isArray(parsed?.daily)
      ) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  public saveWeatherCache(data: WeatherData): void {
    try {
      this.storage.setItem(STORAGE_KEYS.WEATHER_CACHE, JSON.stringify(data));
    } catch {
    }
  }

  public clearWeatherCache(): void {
    try {
      this.storage.removeItem(STORAGE_KEYS.WEATHER_CACHE);
    } catch {
    }
  }
}
