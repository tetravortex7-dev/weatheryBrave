import { type TemperatureUnit, type WindSpeedUnit } from '../models/Settings';

export function convertTemperature(
  celsius: number,
  unit: TemperatureUnit
): number {
  if (unit === 'fahrenheit') {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit
): string {
  const value = Math.round(convertTemperature(celsius, unit));
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';
  return `${value}${symbol}`;
}

export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  switch (unit) {
    case 'ms':
      return kmh / 3.6;
    case 'mph':
      return kmh * 0.621371;
    case 'kmh':
      return kmh;
  }
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const converted = convertWindSpeed(kmh, unit);
  const rounded = unit === 'ms' ? converted.toFixed(1) : `${Math.round(converted)}`;
  const suffix = unit === 'ms' ? 'm/s' : unit === 'mph' ? 'mph' : 'km/h';
  return `${rounded} ${suffix}`;
}
