export interface QuickLink {
  readonly id: string;
  readonly title: string;
  readonly url: string;
}

export const MAX_QUICK_LINKS = 8;

export const DEFAULT_QUICK_LINKS: readonly QuickLink[] = [
  { id: 'pin-github', title: 'GitHub', url: 'https://github.com' },
  { id: 'pin-youtube', title: 'YouTube', url: 'https://www.youtube.com' },
  { id: 'pin-reddit', title: 'Reddit', url: 'https://www.reddit.com' },
  { id: 'pin-hn', title: 'Hacker News', url: 'https://news.ycombinator.com' },
] as const;

export function normalizeQuickLinkUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
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
