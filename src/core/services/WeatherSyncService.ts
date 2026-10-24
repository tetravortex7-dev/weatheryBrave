import { type LocationConfig } from '../models/Location';
import { type WeatherData } from '../models/Weather';
import { type IClock } from '../ports/IClock';
import { type IWeatherCacheStore } from '../ports/IStorageAdapter';
import { type IWeatherProvider } from '../ports/IWeatherProvider';

export const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000;

export interface WeatherSyncCallbacks {
  onWeatherState(data: WeatherData, isStale: boolean): void;
  onSyncError(errorMessage: string, fallbackCache: WeatherData | null): void;
}

function isSameCoordinates(a: WeatherData, b: LocationConfig): boolean {
  const epsilon = 0.01;
  return (
    Math.abs(a.latitude - b.latitude) < epsilon &&
    Math.abs(a.longitude - b.longitude) < epsilon
  );
}

export class WeatherSyncService {
  constructor(
    private readonly weatherProvider: IWeatherProvider,
    private readonly cacheStore: IWeatherCacheStore,
    private readonly clock: IClock,
    private readonly ttlMs: number = WEATHER_CACHE_TTL_MS
  ) {}

  public isCacheFresh(cache: WeatherData, location: LocationConfig): boolean {
    if (!isSameCoordinates(cache, location)) {
      return false;
    }
    const ageMs = this.clock.epochMs() - cache.fetchedAtEpochMs;
    return ageMs >= 0 && ageMs < this.ttlMs;
  }

  public async sync(
    location: LocationConfig,
    callbacks: WeatherSyncCallbacks,
    forceRefresh: boolean = false
  ): Promise<void> {
    const cached = this.cacheStore.loadWeatherCache();
    const matchingCache =
      cached && isSameCoordinates(cached, location) ? cached : null;

    if (matchingCache) {
      const fresh = this.isCacheFresh(matchingCache, location);
      callbacks.onWeatherState(matchingCache, !fresh);
      if (fresh && !forceRefresh) {
        return;
      }
    }

    const result = await this.weatherProvider.fetchWeather(location);
    if (result.ok) {
      this.cacheStore.saveWeatherCache(result.value);
      callbacks.onWeatherState(result.value, false);
    } else {
      callbacks.onSyncError(result.error, matchingCache);
    }
  }
}
