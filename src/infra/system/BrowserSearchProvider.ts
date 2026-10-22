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

/**
 * Resolves whether a user query is a direct URL / domain so pressing Enter on
 * "github.com" or "https://brave.com" navigates directly, while all other text
 * is delegated to the browser's default search engine via `chrome.search.query`.
 */
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

export class BrowserSearchProvider implements ISearchProvider {
  public search(
    query: string,
    disposition: SearchDisposition = 'CURRENT_TAB'
  ): void {
    const trimmed = query.trim();
    if (!trimmed) {
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

    // Fallback when running in local Vite dev server outside the extension context
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
