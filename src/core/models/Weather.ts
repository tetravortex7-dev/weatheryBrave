export type WeatherIconKind =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface DailyForecastItem {
  readonly dateIso: string;
  readonly weatherCode: number;
  readonly tempMaxCelsius: number;
  readonly tempMinCelsius: number;
  readonly precipitationProbabilityMax: number;
}

export interface CurrentWeather {
  readonly temperatureCelsius: number;
  readonly apparentTemperatureCelsius: number;
  readonly weatherCode: number;
  readonly windSpeedKmh: number;
  readonly relativeHumidityPercent: number;
  readonly isDay: boolean;
}

export interface WeatherData {
  readonly locationName: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly fetchedAtEpochMs: number;
  readonly current: CurrentWeather;
  readonly daily: readonly DailyForecastItem[];
}
