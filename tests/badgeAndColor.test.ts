import { describe, expect, it, vi } from 'vitest';
import { type WeatherData } from '../src/core/models/Weather';
import { extractDominantColor } from '../src/core/services/ColorExtractor';
import { updateBrowserBadge } from '../src/infra/system/BrowserBadgeService';

describe('BrowserBadgeService', () => {
  const mockWeather: WeatherData = {
    locationName: 'Tokyo',
    latitude: 35.68,
    longitude: 139.76,
    fetchedAtEpochMs: Date.now(),
    current: {
      temperatureCelsius: 18.4,
      apparentTemperatureCelsius: 17.5,
      relativeHumidityPercent: 60,
      windSpeedKmh: 12,
      weatherCode: 0,
      isDay: true,
    },
    daily: [],
  };

  it('updates chrome action badge text and background color when enabled', () => {
    const setBadgeText = vi.fn();
    const setBadgeBackgroundColor = vi.fn();

    const originalChrome = (globalThis as Record<string, unknown>)['chrome'];
    try {
      (globalThis as Record<string, unknown>)['chrome'] = {
        action: {
          setBadgeText,
          setBadgeBackgroundColor,
        },
      };

      updateBrowserBadge(mockWeather, 'celsius', true);
      expect(setBadgeText).toHaveBeenCalledWith({ text: '18°' });
      expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#ff793f' });
    } finally {
      (globalThis as Record<string, unknown>)['chrome'] = originalChrome;
    }
  });

  it('clears badge text when disabled', () => {
    const setBadgeText = vi.fn();
    const originalChrome = (globalThis as Record<string, unknown>)['chrome'];
    try {
      (globalThis as Record<string, unknown>)['chrome'] = {
        action: { setBadgeText },
      };

      updateBrowserBadge(mockWeather, 'celsius', false);
      expect(setBadgeText).toHaveBeenCalledWith({ text: '' });
    } finally {
      (globalThis as Record<string, unknown>)['chrome'] = originalChrome;
    }
  });

  it('formats fahrenheit correctly', () => {
    const setBadgeText = vi.fn();
    const originalChrome = (globalThis as Record<string, unknown>)['chrome'];
    try {
      (globalThis as Record<string, unknown>)['chrome'] = {
        action: { setBadgeText },
      };

      updateBrowserBadge(mockWeather, 'fahrenheit', true);
      expect(setBadgeText).toHaveBeenCalledWith({ text: '65°' });
    } finally {
      (globalThis as Record<string, unknown>)['chrome'] = originalChrome;
    }
  });
});

describe('ColorExtractor', () => {
  it('returns null safely in non-browser or failed load environments', async () => {
    const result = await extractDominantColor('data:image/png;base64,invalid');
    expect(result).toBeNull();
  });
});
