import {
  DEFAULT_SETTINGS,
  type TemperatureUnit,
  type TimeFormat,
  type UserSettings,
  type WindSpeedUnit,
} from '../../core/models/Settings';
import { isValidThemeId } from '../../core/models/Theme';
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

function isTempUnit(val: unknown): val is TemperatureUnit {
  return val === 'celsius' || val === 'fahrenheit';
}

function isWindUnit(val: unknown): val is WindSpeedUnit {
  return val === 'kmh' || val === 'ms' || val === 'mph';
}

function isTimeFormat(val: unknown): val is TimeFormat {
  return val === '24h' || val === '12h';
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
      // Storage quota errors should never crash the New Tab UI
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
      // Ignore quota errors
    }
  }

  public clearWeatherCache(): void {
    try {
      this.storage.removeItem(STORAGE_KEYS.WEATHER_CACHE);
    } catch {
      // Ignore
    }
  }
}
