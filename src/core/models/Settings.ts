import {
  DEFAULT_LOCATION,
  type LocationConfig,
} from './Location';
import {
  DEFAULT_QUICK_LINKS,
  type QuickLink,
} from './QuickLink';
import { type ThemeId } from './Theme';
import { type WallpaperSourceMode } from './Wallpaper';

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
  readonly showQuickLinks: boolean;
  readonly quickLinks: readonly QuickLink[];
  readonly showWallpaper: boolean;
  readonly wallpaperSource: WallpaperSourceMode;
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
  showQuickLinks: true,
  quickLinks: DEFAULT_QUICK_LINKS,
  showWallpaper: true,
  wallpaperSource: 'both',
};
