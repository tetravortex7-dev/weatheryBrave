import { describe, expect, it } from 'vitest';
import {
  BRAVE_WALLPAPERS,
  buildWallpaperPool,
  pickNextWallpaperFromPool,
  type BraveWallpaper,
} from '../src/core/models/Wallpaper';

describe('Wallpaper Pool & Selection Domain Logic', () => {
  const customMock: readonly BraveWallpaper[] = [
    {
      id: 'custom-1',
      filename: 'blob:test-1',
      author: 'Custom Author',
      creditUrl: '',
      isCustom: true,
    },
  ];

  it('builds custom-only pool correctly', () => {
    const pool = buildWallpaperPool('custom-only', customMock);
    expect(pool).toHaveLength(1);
    expect(pool[0]?.id).toBe('custom-1');
  });

  it('builds builtin-only pool correctly', () => {
    const pool = buildWallpaperPool('builtin-only', customMock);
    expect(pool).toHaveLength(BRAVE_WALLPAPERS.length);
    expect(pool[0]?.id).toBe(BRAVE_WALLPAPERS[0]?.id);
  });

  it('builds combined pool (both) placing custom wallpapers first', () => {
    const pool = buildWallpaperPool('both', customMock);
    expect(pool).toHaveLength(BRAVE_WALLPAPERS.length + 1);
    expect(pool[0]?.id).toBe('custom-1');
    expect(pool[1]?.id).toBe(BRAVE_WALLPAPERS[0]?.id);
  });

  it('picks next sequential wallpaper when currentIndex is given', () => {
    const pool = customMock;
    const result = pickNextWallpaperFromPool(pool, 0);
    expect(result.index).toBe(0);
    expect(result.wallpaper?.id).toBe('custom-1');
  });

  it('handles empty pool safely without throwing', () => {
    const result = pickNextWallpaperFromPool([], 0);
    expect(result.index).toBe(0);
    expect(result.wallpaper).toBeNull();
  });
});
