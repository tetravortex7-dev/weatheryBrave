import { type LocationConfig } from '../models/Location';
import { type Result } from '../models/Result';
import { type WeatherData } from '../models/Weather';

export interface IWeatherProvider {
  fetchWeather(location: LocationConfig): Promise<Result<WeatherData, string>>;
}
