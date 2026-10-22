export interface LocationConfig {
  readonly name: string;
  readonly country?: string;
  readonly admin1?: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly timezone?: string;
}

export const DEFAULT_LOCATION: LocationConfig = {
  name: 'San Francisco',
  country: 'United States',
  admin1: 'California',
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: 'auto',
};
