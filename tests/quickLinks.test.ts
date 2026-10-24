import { describe, expect, it } from 'vitest';
import {
  extractMonogram,
  getFaviconUrl,
  normalizeQuickLinkUrl,
} from '../src/core/models/QuickLink';

describe('QuickLink & Favicon utilities', () => {
  it('normalizes valid URLs with and without protocols', () => {
    expect(normalizeQuickLinkUrl('github.com')).toBe('https://github.com/');
    expect(normalizeQuickLinkUrl('https://brave.com')).toBe('https://brave.com/');
    expect(normalizeQuickLinkUrl('http://localhost:3000')).toBe('http://localhost:3000/');
    expect(normalizeQuickLinkUrl('   ')).toBeNull();
    expect(normalizeQuickLinkUrl('ftp://invalid')).toBeNull();
  });

  it('extracts two-letter monograms from title and domain', () => {
    expect(extractMonogram('GitHub', 'https://github.com')).toBe('GI');
    expect(extractMonogram('', 'https://www.youtube.com')).toBe('YO');
    expect(extractMonogram('', 'invalid')).toBe('WB');
  });

  it('generates non-invasive chrome extension favicon URL when chrome runtime is present', () => {
    const originalChrome = (globalThis as Record<string, unknown>)['chrome'];
    try {
      (globalThis as Record<string, unknown>)['chrome'] = {
        runtime: {
          getURL: (path: string) => `chrome-extension://mock-id${path}`,
        },
      };
      const url = getFaviconUrl('https://github.com');
      expect(url).toContain('chrome-extension://mock-id/_favicon/');
      expect(url).toContain('pageUrl=https%3A%2F%2Fgithub.com');
      expect(url).toContain('size=32');
    } finally {
      (globalThis as Record<string, unknown>)['chrome'] = originalChrome;
    }
  });

  it('returns null safely when chrome runtime is not available', () => {
    const originalChrome = (globalThis as Record<string, unknown>)['chrome'];
    try {
      delete (globalThis as Record<string, unknown>)['chrome'];
      expect(getFaviconUrl('https://github.com')).toBeNull();
    } finally {
      (globalThis as Record<string, unknown>)['chrome'] = originalChrome;
    }
  });
});
