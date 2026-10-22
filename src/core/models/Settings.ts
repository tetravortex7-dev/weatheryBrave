import { DEFAULT_LOCATION, type LocationConfig } from './Location';
import { type ThemeId } from './Theme';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'ms' | 'mph';
export type TimeFormat = '24h' | '12h';

export interface UserSettings {
  readonly theme: ThemeId;
  readonly location: LocationConfig;
  readonly temperatureUnit: TemperatureUnit;
  readonly windSpeedUnit: WindSpeedUnit;
  readonly timeFormat: TimeFormat;
  readonly showSeconds: boolean;
  readonly showGreeting: boolean;
  readonly customName: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'brave-dark',
  location: DEFAULT_LOCATION,
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  timeFormat: '24h',
  showSeconds: false,
  showGreeting: true,
  customName: '',
};
