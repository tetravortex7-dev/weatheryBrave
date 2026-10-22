import { type UserSettings } from '../models/Settings';
import { type WeatherData } from '../models/Weather';

export interface ISettingsStore {
  loadSettings(): UserSettings;
  saveSettings(settings: UserSettings): void;
}

export interface IWeatherCacheStore {
  loadWeatherCache(): WeatherData | null;
  saveWeatherCache(data: WeatherData): void;
  clearWeatherCache(): void;
}
