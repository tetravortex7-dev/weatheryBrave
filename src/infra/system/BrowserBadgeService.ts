import { type TemperatureUnit } from '../../core/models/Settings';
import { type WeatherData } from '../../core/models/Weather';

export function updateBrowserBadge(
  weather: WeatherData | null,
  unit: TemperatureUnit,
  enabled: boolean
): void {
  try {
    const chromeAction = (
      globalThis as {
        chrome?: {
          action?: {
            setBadgeText?: (details: { text: string }) => void;
            setBadgeBackgroundColor?: (details: { color: string }) => void;
          };
        };
      }
    )?.chrome?.action;

    if (!chromeAction || typeof chromeAction.setBadgeText !== 'function') {
      return;
    }

    if (!enabled || !weather) {
      chromeAction.setBadgeText({ text: '' });
      return;
    }

    const tempCelsius = weather.current.temperatureCelsius;
    const displayTemp =
      unit === 'fahrenheit' ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
    const text = `${Math.round(displayTemp)}°`;

    chromeAction.setBadgeText({ text });
    if (typeof chromeAction.setBadgeBackgroundColor === 'function') {
      chromeAction.setBadgeBackgroundColor({
        color: tempCelsius <= 0 ? '#3498db' : '#ff793f',
      });
    }
  } catch {
  }
}
