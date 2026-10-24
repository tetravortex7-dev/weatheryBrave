export interface QuickLink {
  readonly id: string;
  readonly title: string;
  readonly url: string;
}

export const MAX_QUICK_LINKS = 16;

export const DEFAULT_QUICK_LINKS: readonly QuickLink[] = [
  { id: 'pin-youtube', title: 'YouTube', url: 'https://www.youtube.com' },
  { id: 'pin-facebook', title: 'Facebook', url: 'https://www.facebook.com' },
  { id: 'pin-instagram', title: 'Instagram', url: 'https://www.instagram.com' },
  { id: 'pin-chatgpt', title: 'ChatGPT', url: 'https://chatgpt.com' },
] as const;

export function normalizeQuickLinkUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  if (/^[a-z0-9+.-]+:\/\//i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    return null;
  }
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function extractMonogram(title: string, url: string): string {
  const cleanTitle = title.trim();
  if (cleanTitle.length > 0) {
    return cleanTitle.slice(0, 2).toUpperCase();
  }
  try {
    const host = new URL(url).hostname.replace(/^www\./i, '');
    return host.slice(0, 2).toUpperCase() || 'WB';
  } catch {
    return 'WB';
  }
}

export function getFaviconUrl(pageUrl: string, size: number = 32): string | null {
  try {
    const chromeApi = (
      globalThis as {
        chrome?: { runtime?: { getURL?: (path: string) => string } };
      }
    )?.chrome?.runtime;
    if (typeof chromeApi?.getURL === 'function') {
      const u = new URL(chromeApi.getURL('/_favicon/'));
      u.searchParams.set('pageUrl', pageUrl);
      u.searchParams.set('size', size.toString());
      return u.toString();
    }
    return null;
  } catch {
    return null;
  }
}
