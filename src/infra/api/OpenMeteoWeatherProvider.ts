import { type LocationConfig } from '../../core/models/Location';
import { err, ok, type Result } from '../../core/models/Result';
import {
  type DailyForecastItem,
  type HourlyForecastItem,
  type WeatherData,
} from '../../core/models/Weather';
import { type IClock } from '../../core/ports/IClock';
import { type IWeatherProvider } from '../../core/ports/IWeatherProvider';

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;

interface OpenMeteoForecastResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    relative_humidity_2m?: number;
    is_day?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    sunrise?: string[];
    sunset?: string[];
    uv_index_max?: number[];
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
    precipitation_probability?: number[];
    is_day?: number[];
  };
}

export class OpenMeteoWeatherProvider implements IWeatherProvider {
  constructor(
    private readonly clock: IClock,
    private readonly fetchFn: typeof fetch = globalThis.fetch.bind(globalThis)
  ) {}

  public async fetchWeather(
    location: LocationConfig
  ): Promise<Result<WeatherData, string>> {
    const params = new URLSearchParams({
      latitude: location.latitude.toFixed(4),
      longitude: location.longitude.toFixed(4),
      current:
        'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,is_day',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max',
      hourly:
        'temperature_2m,weather_code,precipitation_probability,is_day',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timezone: 'auto',
      forecast_days: `${FORECAST_DAYS}`,
    });

    try {
      const response = await this.fetchFn(
        `${OPEN_METEO_FORECAST_URL}?${params.toString()}`
      );
      if (!response.ok) {
        return err(`Weather API HTTP ${response.status}`);
      }

      const json = (await response.json()) as OpenMeteoForecastResponse;
      const current = json.current;
      const daily = json.daily;

      if (
        !current ||
        typeof current.temperature_2m !== 'number' ||
        typeof current.weather_code !== 'number' ||
        !daily ||
        !Array.isArray(daily.time)
      ) {
        return err('Invalid weather payload from Open-Meteo');
      }

      const dailyItems: DailyForecastItem[] = daily.time.map((dateIso, idx) => {
        const sunriseIso = daily.sunrise?.[idx];
        const sunsetIso = daily.sunset?.[idx];
        const uvIndexMax = daily.uv_index_max?.[idx];

        return {
          dateIso,
          weatherCode: daily.weather_code?.[idx] ?? 0,
          tempMaxCelsius: daily.temperature_2m_max?.[idx] ?? 0,
          tempMinCelsius: daily.temperature_2m_min?.[idx] ?? 0,
          precipitationProbabilityMax:
            daily.precipitation_probability_max?.[idx] ?? 0,
          ...(typeof sunriseIso === 'string' ? { sunriseIso } : {}),
          ...(typeof sunsetIso === 'string' ? { sunsetIso } : {}),
          ...(typeof uvIndexMax === 'number' ? { uvIndexMax } : {}),
        };
      });

      const hourlyItems: HourlyForecastItem[] = Array.isArray(json.hourly?.time)
        ? json.hourly.time.map((timeIso, idx) => ({
            timeIso,
            temperatureCelsius: json.hourly?.temperature_2m?.[idx] ?? 0,
            weatherCode: json.hourly?.weather_code?.[idx] ?? 0,
            precipitationProbability:
              json.hourly?.precipitation_probability?.[idx] ?? 0,
            isDay: (json.hourly?.is_day?.[idx] ?? 1) !== 0,
          }))
        : [];

      return ok({
        locationName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        fetchedAtEpochMs: this.clock.epochMs(),
        current: {
          temperatureCelsius: current.temperature_2m,
          apparentTemperatureCelsius:
            current.apparent_temperature ?? current.temperature_2m,
          weatherCode: current.weather_code,
          windSpeedKmh: current.wind_speed_10m ?? 0,
          relativeHumidityPercent: current.relative_humidity_2m ?? 0,
          isDay: current.is_day !== 0,
        },
        daily: dailyItems,
        hourly: hourlyItems,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Network error';
      return err(message);
    }
  }
}
