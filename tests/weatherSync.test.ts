import { describe, expect, it, vi } from 'vitest';
import { type LocationConfig } from '../src/core/models/Location';
import { err, ok } from '../src/core/models/Result';
import { type WeatherData } from '../src/core/models/Weather';
import { type IClock } from '../src/core/ports/IClock';
import { type IWeatherCacheStore } from '../src/core/ports/IStorageAdapter';
import { type IWeatherProvider } from '../src/core/ports/IWeatherProvider';
import {
  WEATHER_CACHE_TTL_MS,
  WeatherSyncService,
} from '../src/core/services/WeatherSyncService';

const SAMPLE_LOCATION: LocationConfig = {
  name: 'Almaty',
  latitude: 43.2389,
  longitude: 76.8897,
};

function makeWeather(fetchedAtEpochMs: number): WeatherData {
  return {
    locationName: 'Almaty',
    latitude: 43.2389,
    longitude: 76.8897,
    fetchedAtEpochMs,
    current: {
      temperatureCelsius: 18,
      apparentTemperatureCelsius: 17,
      weatherCode: 0,
      windSpeedKmh: 10,
      relativeHumidityPercent: 45,
      isDay: true,
    },
    daily: [],
  };
}

describe('WeatherSyncService (Stale-While-Revalidate)', () => {
  it('renders fresh cache immediately and skips network call', async () => {
    const nowMs = 1_000_000;
    const cachedData = makeWeather(nowMs - 5 * 60_000);

    const fetchWeather = vi.fn();
    const provider: IWeatherProvider = { fetchWeather };
    const cacheStore: IWeatherCacheStore = {
      loadWeatherCache: () => cachedData,
      saveWeatherCache: vi.fn(),
      clearWeatherCache: vi.fn(),
    };
    const clock: IClock = {
      now: () => new Date(nowMs),
      epochMs: () => nowMs,
    };

    const service = new WeatherSyncService(provider, cacheStore, clock);
    const onWeatherState = vi.fn();
    const onSyncError = vi.fn();

    await service.sync(SAMPLE_LOCATION, { onWeatherState, onSyncError });

    expect(onWeatherState).toHaveBeenCalledTimes(1);
    expect(onWeatherState).toHaveBeenCalledWith(cachedData, false);
    expect(fetchWeather).not.toHaveBeenCalled();
  });

  it('renders stale cache immediately, then updates with fresh network data', async () => {
    const nowMs = 10_000_000;
    const staleCache = makeWeather(nowMs - WEATHER_CACHE_TTL_MS - 1000);
    const freshNetwork = makeWeather(nowMs);

    const fetchWeather = vi.fn().mockResolvedValue(ok(freshNetwork));
    const saveWeatherCache = vi.fn();
    const provider: IWeatherProvider = { fetchWeather };
    const cacheStore: IWeatherCacheStore = {
      loadWeatherCache: () => staleCache,
      saveWeatherCache,
      clearWeatherCache: vi.fn(),
    };
    const clock: IClock = {
      now: () => new Date(nowMs),
      epochMs: () => nowMs,
    };

    const service = new WeatherSyncService(provider, cacheStore, clock);
    const onWeatherState = vi.fn();
    const onSyncError = vi.fn();

    await service.sync(SAMPLE_LOCATION, { onWeatherState, onSyncError });

    expect(onWeatherState).toHaveBeenCalledTimes(2);
    expect(onWeatherState).toHaveBeenNthCalledWith(1, staleCache, true);
    expect(onWeatherState).toHaveBeenNthCalledWith(2, freshNetwork, false);
    expect(saveWeatherCache).toHaveBeenCalledWith(freshNetwork);
  });

  it('preserves stale cache when offline or network fails', async () => {
    const nowMs = 10_000_000;
    const staleCache = makeWeather(nowMs - WEATHER_CACHE_TTL_MS - 5000);

    const provider: IWeatherProvider = {
      fetchWeather: vi.fn().mockResolvedValue(err('Offline')),
    };
    const cacheStore: IWeatherCacheStore = {
      loadWeatherCache: () => staleCache,
      saveWeatherCache: vi.fn(),
      clearWeatherCache: vi.fn(),
    };
    const clock: IClock = {
      now: () => new Date(nowMs),
      epochMs: () => nowMs,
    };

    const service = new WeatherSyncService(provider, cacheStore, clock);
    const onWeatherState = vi.fn();
    const onSyncError = vi.fn();

    await service.sync(SAMPLE_LOCATION, { onWeatherState, onSyncError });

    expect(onWeatherState).toHaveBeenCalledWith(staleCache, true);
    expect(onSyncError).toHaveBeenCalledWith('Offline', staleCache);
  });
});
