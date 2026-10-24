import { describe, expect, it } from 'vitest';
import {
  extractMonogram,
  normalizeQuickLinkUrl,
} from '../src/core/models/QuickLink';
import {
  buildWallpaperPool,
  type BraveWallpaper,
} from '../src/core/models/Wallpaper';
import { getGreetingText } from '../src/core/services/GreetingService';
import {
  formatClock,
  formatIsoClockTime,
  formatRelativeAge,
  formatShortWeekday,
} from '../src/core/services/TimeFormatter';
import {
  describeUvIndex,
  formatTemperature,
  formatWindSpeed,
} from '../src/core/services/WeatherFormatter';
import { describeWmoCode } from '../src/core/services/WmoWeatherMapper';
import { resolveDirectUrl } from '../src/infra/system/BrowserSearchProvider';

describe('WeatherFormatter', () => {
  it('formats Celsius and Fahrenheit accurately', () => {
    expect(formatTemperature(0, 'celsius')).toBe('0°C');
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°F');
    expect(formatTemperature(20, 'fahrenheit')).toBe('68°F');
  });

  it('formats wind speed in km/h, m/s, and mph', () => {
    expect(formatWindSpeed(36, 'kmh')).toBe('36 km/h');
    expect(formatWindSpeed(36, 'ms')).toBe('10.0 m/s');
    expect(formatWindSpeed(16.0934, 'mph')).toBe('10 mph');
  });
});

describe('TimeFormatter & GreetingService', () => {
  it('formats 24h and 12h clocks', () => {
    const sample = new Date(2026, 9, 22, 14, 5, 9);
    expect(formatClock(sample, '24h', false)).toEqual({
      timeText: '14:05',
      periodText: '',
      dateText: 'Thursday, October 22',
    });

    expect(formatClock(sample, '12h', true)).toEqual({
      timeText: '2:05:09',
      periodText: 'PM',
      dateText: 'Thursday, October 22',
    });
  });

  it('formats relative age and short weekday', () => {
    expect(formatRelativeAge(1000, 15_000)).toBe('Updated just now');
    expect(formatRelativeAge(0, 15 * 60_000)).toBe('Updated 15m ago');
    expect(formatRelativeAge(0, 120 * 60_000)).toBe('Updated 2h ago');
    expect(formatShortWeekday('2026-10-22')).toBe('Thu');
  });

  it('returns time-appropriate greetings with optional custom name', () => {
    expect(getGreetingText(new Date(2026, 9, 22, 8, 0), 'Almas')).toBe(
      'Good morning, Almas'
    );
    expect(getGreetingText(new Date(2026, 9, 22, 19, 30), '')).toBe(
      'Good evening'
    );
  });
});

describe('WmoWeatherMapper', () => {
  it('maps WMO codes to labels and day/night icons', () => {
    expect(describeWmoCode(0, true)).toEqual({
      label: 'Clear sky',
      icon: 'clear-day',
    });
    expect(describeWmoCode(0, false)).toEqual({
      label: 'Clear sky',
      icon: 'clear-night',
    });
    expect(describeWmoCode(61, true)).toEqual({
      label: 'Rain',
      icon: 'rain',
    });
    expect(describeWmoCode(95, true)).toEqual({
      label: 'Thunderstorm',
      icon: 'thunderstorm',
    });
  });
});

describe('BrowserSearchProvider URL vs Search resolution', () => {
  it('recognizes direct domains and URLs while treating phrases as search queries', () => {
    expect(resolveDirectUrl('github.com')).toBe('https://github.com');
    expect(resolveDirectUrl('https://brave.com/privacy')).toBe(
      'https://brave.com/privacy'
    );
    expect(resolveDirectUrl('weather in almaty')).toBeNull();
    expect(resolveDirectUrl('how to use typescript')).toBeNull();
  });
});

describe('QuickLink, UV & Sunrise/Sunset formatters', () => {
  it('normalizes quick link URLs and generates 2-letter monograms', () => {
    expect(normalizeQuickLinkUrl('github.com')).toBe('https://github.com/');
    expect(normalizeQuickLinkUrl('javascript:alert(1)')).toBeNull();
    expect(extractMonogram('GitHub', 'https://github.com')).toBe('GI');
    expect(extractMonogram('', 'https://www.reddit.com')).toBe('RE');
  });

  it('formats sunrise/sunset ISO times and UV index descriptions', () => {
    expect(formatIsoClockTime('2026-10-23T06:42', '24h')).toBe('06:42');
    expect(formatIsoClockTime('2026-10-23T18:15', '12h')).toBe('6:15 PM');
    expect(describeUvIndex(1.8)).toBe('UV 2 (Low)');
    expect(describeUvIndex(6.2)).toBe('UV 6 (High)');
  });

  it('builds wallpaper pools for All, My Only, and Brave modes', () => {
    const sampleCustom: BraveWallpaper[] = [
      {
        id: 'custom-1',
        filename: 'data:image/png;base64,AAA',
        author: 'My Photo',
        creditUrl: '#',
        isCustom: true,
      },
    ];
    expect(buildWallpaperPool('custom-only', sampleCustom)).toHaveLength(1);
    expect(buildWallpaperPool('builtin-only', sampleCustom)).toHaveLength(40);
    expect(buildWallpaperPool('both', sampleCustom)).toHaveLength(41);
  });
});


