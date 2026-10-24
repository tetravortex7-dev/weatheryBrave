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
import {
  resolveDirectUrl,
  resolveSearchBang,
} from '../src/infra/system/BrowserSearchProvider';

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
    expect(formatClock(sample, '24h', false, 'en')).toEqual({
      timeText: '14:05',
      periodText: '',
      dateText: 'Thursday, 22 October',
    });

    expect(formatClock(sample, '12h', true, 'en')).toEqual({
      timeText: '2:05:09',
      periodText: 'PM',
      dateText: 'Thursday, 22 October',
    });
  });

  it('formats relative age and short weekday', () => {
    expect(formatRelativeAge(1000, 15_000, 'en')).toBe('Updated just now');
    expect(formatRelativeAge(0, 15 * 60_000, 'en')).toBe('Updated 15m ago');
    expect(formatRelativeAge(0, 120 * 60_000, 'en')).toBe('Updated 2h ago');
    expect(formatShortWeekday('2026-10-22', 'en')).toBe('Thu');
  });

  it('returns time-appropriate greetings with optional custom name', () => {
    expect(getGreetingText(new Date(2026, 9, 22, 8, 0), 'Almas', 'en')).toBe(
      'Good morning, Almas'
    );
    expect(getGreetingText(new Date(2026, 9, 22, 19, 30), '', 'en')).toBe(
      'Good evening'
    );
    expect(getGreetingText(new Date(2026, 9, 22, 8, 0), 'Алмаз', 'ru')).toBe(
      'Доброе утро, Алмаз'
    );
  });
});

describe('WmoWeatherMapper', () => {
  it('maps WMO codes to labels and day/night icons', () => {
    expect(describeWmoCode(0, true, 'en')).toEqual({
      label: 'Clear sky',
      icon: 'clear-day',
    });
    expect(describeWmoCode(0, false, 'en')).toEqual({
      label: 'Clear sky',
      icon: 'clear-night',
    });
    expect(describeWmoCode(61, true, 'en')).toEqual({
      label: 'Rain',
      icon: 'rain',
    });
    expect(describeWmoCode(95, true, 'en')).toEqual({
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

  it('resolves search bangs correctly with and without query', () => {
    expect(resolveSearchBang('!yt interstellar trailer')).toBe(
      'https://www.youtube.com/results?search_query=interstellar%20trailer'
    );
    expect(resolveSearchBang('!yt')).toBe('https://www.youtube.com');
    expect(resolveSearchBang('!gh brave')).toBe(
      'https://github.com/search?q=brave'
    );
    expect(resolveSearchBang('!gh')).toBe('https://github.com');
    expect(resolveSearchBang('!r opensource')).toBe(
      'https://www.reddit.com/search/?q=opensource'
    );
    expect(resolveSearchBang('!r')).toBe('https://www.reddit.com');
    expect(resolveSearchBang('!gpt')).toBe('https://chatgpt.com');
    expect(resolveSearchBang('!gpt what is clean code')).toBe(
      'https://chatgpt.com/?q=what%20is%20clean%20code'
    );
    expect(resolveSearchBang('no bang here')).toBeNull();
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
    expect(describeUvIndex(1.8, 'en')).toBe('UV 2 (Low)');
    expect(describeUvIndex(6.2, 'en')).toBe('UV 6 (High)');
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


