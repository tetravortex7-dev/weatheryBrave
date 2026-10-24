import {
  type ISearchProvider,
  type SearchDisposition,
} from '../../core/ports/ISearchProvider';

interface ChromeSearchApi {
  query(
    queryInfo: { text: string; disposition?: SearchDisposition },
    callback?: () => void
  ): void;
}

function getChromeSearchApi(): ChromeSearchApi | undefined {
  const globalAny = globalThis as {
    chrome?: { search?: ChromeSearchApi };
  };
  return globalAny.chrome?.search;
}

export function resolveDirectUrl(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed || /\s/.test(trimmed)) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return null;
}

interface BangDefinition {
  readonly homeUrl: string;
  readonly searchUrl: (q: string) => string;
}

const SEARCH_BANGS: Record<string, BangDefinition> = {
  '!yt': {
    homeUrl: 'https://www.youtube.com',
    searchUrl: (q) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  },
  '!g': {
    homeUrl: 'https://www.google.com',
    searchUrl: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  },
  '!d': {
    homeUrl: 'https://duckduckgo.com',
    searchUrl: (q) =>
      `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  },
  '!ddg': {
    homeUrl: 'https://duckduckgo.com',
    searchUrl: (q) =>
      `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  },
  '!b': {
    homeUrl: 'https://search.brave.com',
    searchUrl: (q) =>
      `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
  },
  '!gh': {
    homeUrl: 'https://github.com',
    searchUrl: (q) =>
      `https://github.com/search?q=${encodeURIComponent(q)}`,
  },
  '!r': {
    homeUrl: 'https://www.reddit.com',
    searchUrl: (q) =>
      `https://www.reddit.com/search/?q=${encodeURIComponent(q)}`,
  },
  '!w': {
    homeUrl: 'https://en.wikipedia.org',
    searchUrl: (q) =>
      `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
  },
  '!k': {
    homeUrl: 'https://kaspi.kz',
    searchUrl: (q) =>
      `https://kaspi.kz/shop/search/?text=${encodeURIComponent(q)}`,
  },
  '!gpt': {
    homeUrl: 'https://chatgpt.com',
    searchUrl: (q) =>
      `https://chatgpt.com/?q=${encodeURIComponent(q)}`,
  },
  '!x': {
    homeUrl: 'https://x.com',
    searchUrl: (q) =>
      `https://x.com/search?q=${encodeURIComponent(q)}`,
  },
};

export function resolveSearchBang(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  const match = trimmed.match(/^(![a-z0-9]+)(?:\s+(.+))?$/i);
  if (!match) {
    return null;
  }
  const prefix = match[1]?.toLowerCase();
  const query = match[2]?.trim();
  if (prefix && prefix in SEARCH_BANGS) {
    const bang = SEARCH_BANGS[prefix];
    if (!bang) {
      return null;
    }
    if (query && query.length > 0) {
      return bang.searchUrl(query);
    }
    return bang.homeUrl;
  }
  return null;
}

export class BrowserSearchProvider implements ISearchProvider {
  public search(
    query: string,
    disposition: SearchDisposition = 'CURRENT_TAB'
  ): void {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const bangUrl = resolveSearchBang(trimmed);
    if (bangUrl) {
      if (disposition === 'NEW_TAB') {
        window.open(bangUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.assign(bangUrl);
      }
      return;
    }

    const directUrl = resolveDirectUrl(trimmed);
    if (directUrl) {
      if (disposition === 'NEW_TAB') {
        window.open(directUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.assign(directUrl);
      }
      return;
    }

    const searchApi = getChromeSearchApi();
    if (searchApi && typeof searchApi.query === 'function') {
      searchApi.query({ text: trimmed, disposition });
      return;
    }

    const fallbackUrl = `https://search.brave.com/search?q=${encodeURIComponent(
      trimmed
    )}`;
    if (disposition === 'NEW_TAB') {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.assign(fallbackUrl);
    }
  }
}
