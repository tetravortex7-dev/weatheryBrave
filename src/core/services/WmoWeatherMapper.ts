import { type WeatherIconKind } from '../models/Weather';

export interface WmoWeatherDescriptor {
  readonly label: string;
  readonly icon: WeatherIconKind;
}

export function describeWmoCode(
  code: number,
  isDay: boolean = true
): WmoWeatherDescriptor {
  switch (code) {
    case 0:
      return {
        label: 'Clear sky',
        icon: isDay ? 'clear-day' : 'clear-night',
      };
    case 1:
      return {
        label: 'Mainly clear',
        icon: isDay ? 'clear-day' : 'clear-night',
      };
    case 2:
      return { label: 'Partly cloudy', icon: 'partly-cloudy' };
    case 3:
      return { label: 'Overcast', icon: 'cloudy' };
    case 45:
    case 48:
      return { label: 'Foggy', icon: 'fog' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Drizzle', icon: 'drizzle' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { label: 'Rain', icon: 'rain' };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: 'Snow', icon: 'snow' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: 'thunderstorm' };
    default:
      return { label: 'Cloudy', icon: 'cloudy' };
  }
}
