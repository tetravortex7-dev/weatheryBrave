import { type LocationConfig } from '../../core/models/Location';
import { err, ok, type Result } from '../../core/models/Result';
import { type IGeocodingProvider } from '../../core/ports/IGeocodingProvider';

const OPEN_METEO_GEOCODING_URL =
  'https://geocoding-api.open-meteo.com/v1/search';

interface OpenMeteoGeocodingItem {
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingItem[];
}

export class OpenMeteoGeocodingProvider implements IGeocodingProvider {
  constructor(
    private readonly fetchFn: typeof fetch = globalThis.fetch.bind(globalThis)
  ) {}

  public async searchCity(
    query: string
  ): Promise<Result<readonly LocationConfig[], string>> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return ok([]);
    }

    const params = new URLSearchParams({
      name: trimmed,
      count: '6',
      language: 'en',
      format: 'json',
    });

    try {
      const response = await this.fetchFn(
        `${OPEN_METEO_GEOCODING_URL}?${params.toString()}`
      );
      if (!response.ok) {
        return err(`Geocoding HTTP ${response.status}`);
      }

      const json = (await response.json()) as OpenMeteoGeocodingResponse;
      if (!Array.isArray(json.results)) {
        return ok([]);
      }

      const locations: LocationConfig[] = [];
      for (const item of json.results) {
        if (
          typeof item.name === 'string' &&
          typeof item.latitude === 'number' &&
          typeof item.longitude === 'number'
        ) {
          locations.push({
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
            ...(typeof item.country === 'string'
              ? { country: item.country }
              : {}),
            ...(typeof item.admin1 === 'string' ? { admin1: item.admin1 } : {}),
            ...(typeof item.timezone === 'string'
              ? { timezone: item.timezone }
              : {}),
          });
        }
      }

      return ok(locations);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Geocoding network error';
      return err(message);
    }
  }
}
