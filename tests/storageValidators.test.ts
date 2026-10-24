import { describe, expect, it } from 'vitest';
import {
  isAppLanguage,
  isLinkTargetMode,
  isTempUnit,
  isTimeFormat,
  isWallpaperSource,
  isWeatherViewMode,
  isWindUnit,
  parseQuickLinks,
} from '../src/infra/storage/LocalStorageAdapter';

describe('Storage Validators & Parsers', () => {
  it('validates supported app languages', () => {
    expect(isAppLanguage('en')).toBe(true);
    expect(isAppLanguage('ru')).toBe(true);
    expect(isAppLanguage('es')).toBe(true);
    expect(isAppLanguage('unknown_lang')).toBe(false);
    expect(isAppLanguage(123)).toBe(false);
  });

  it('validates temperature and wind speed units', () => {
    expect(isTempUnit('celsius')).toBe(true);
    expect(isTempUnit('fahrenheit')).toBe(true);
    expect(isTempUnit('kelvin')).toBe(false);

    expect(isWindUnit('kmh')).toBe(true);
    expect(isWindUnit('ms')).toBe(true);
    expect(isWindUnit('mph')).toBe(true);
    expect(isWindUnit('knots')).toBe(false);
  });

  it('validates time formats and wallpaper sources', () => {
    expect(isTimeFormat('24h')).toBe(true);
    expect(isTimeFormat('12h')).toBe(true);
    expect(isTimeFormat('auto')).toBe(false);

    expect(isWallpaperSource('both')).toBe(true);
    expect(isWallpaperSource('custom-only')).toBe(true);
    expect(isWallpaperSource('builtin-only')).toBe(true);
    expect(isWallpaperSource('invalid')).toBe(false);
  });

  it('validates weather view and link target modes', () => {
    expect(isWeatherViewMode('full')).toBe(true);
    expect(isWeatherViewMode('compact')).toBe(true);
    expect(isWeatherViewMode('mini')).toBe(false);

    expect(isLinkTargetMode('current')).toBe(true);
    expect(isLinkTargetMode('new-tab')).toBe(true);
    expect(isLinkTargetMode('blank')).toBe(false);
  });

  it('parses quick links array safely', () => {
    const raw = [
      { id: '1', title: 'GitHub', url: 'https://github.com' },
      { invalid: true },
    ];
    const parsed = parseQuickLinks(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.title).toBe('GitHub');
  });

  it('falls back to default quick links on non-array input', () => {
    const parsed = parseQuickLinks(null);
    expect(parsed.length).toBeGreaterThan(0);
  });
});
