import { type AppLanguage } from '../i18n';
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
export type WeatherViewMode = 'full' | 'compact';
export type LinkTargetMode = 'current' | 'new-tab';

export interface UserSettings {
  readonly language: AppLanguage;
  readonly theme: ThemeId;
  readonly location: LocationConfig;
  readonly temperatureUnit: TemperatureUnit;
  readonly windSpeedUnit: WindSpeedUnit;
  readonly timeFormat: TimeFormat;
  readonly showSeconds: boolean;
  readonly showGreeting: boolean;
  readonly customName: string;
  readonly secondaryTimezone: string;
  readonly showQuickLinks: boolean;
  readonly quickLinks: readonly QuickLink[];
  readonly showWallpaper: boolean;
  readonly wallpaperSource: WallpaperSourceMode;
  readonly lockWallpaper: boolean;
  readonly wallpaperDim: number;
  readonly wallpaperBlur: number;
  readonly weatherViewMode: WeatherViewMode;
  readonly showScratchpad: boolean;
  readonly scratchpadContent: string;
  readonly linkTarget: LinkTargetMode;
}

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'auto',
  theme: 'brave-dark',
  location: DEFAULT_LOCATION,
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  timeFormat: '24h',
  showSeconds: false,
  showGreeting: true,
  customName: '',
  secondaryTimezone: 'none',
  showQuickLinks: true,
  quickLinks: DEFAULT_QUICK_LINKS,
  showWallpaper: true,
  wallpaperSource: 'both',
  lockWallpaper: false,
  wallpaperDim: 35,
  wallpaperBlur: 0,
  weatherViewMode: 'full',
  showScratchpad: true,
  scratchpadContent: '',
  linkTarget: 'current',
};
