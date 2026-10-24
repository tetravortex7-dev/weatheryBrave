export type AppLanguage =
  | 'auto'
  | 'en'
  | 'es'
  | 'zh'
  | 'hi'
  | 'ar'
  | 'pt'
  | 'ru'
  | 'ja'
  | 'de'
  | 'fr'
  | 'ko'
  | 'tr';

export interface LanguageMeta {
  readonly id: AppLanguage;
  readonly label: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageMeta[] = [
  { id: 'auto', label: 'Auto (Browser)' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'zh', label: '中文 (Chinese)' },
  { id: 'hi', label: 'हिन्दी (Hindi)' },
  { id: 'ar', label: 'العربية (Arabic)' },
  { id: 'pt', label: 'Português' },
  { id: 'ru', label: 'Русский' },
  { id: 'ja', label: '日本語 (Japanese)' },
  { id: 'de', label: 'Deutsch' },
  { id: 'fr', label: 'Français' },
  { id: 'ko', label: '한국어 (Korean)' },
  { id: 'tr', label: 'Türkçe' },
] as const;

export interface TranslationDictionary {
  readonly newTabTitle: string;
  readonly goodMorning: string;
  readonly goodAfternoon: string;
  readonly goodEvening: string;
  readonly goodNight: string;
  readonly feels: string;
  readonly humidity: string;
  readonly wind: string;
  readonly today: string;
  readonly sunset: string;
  readonly sunrise: string;
  readonly updatedJustNow: string;
  readonly updatedAgoMinutes: (m: number) => string;
  readonly updatedAgoHours: (h: number) => string;
  readonly uvLow: string;
  readonly uvMod: string;
  readonly uvHigh: string;
  readonly uvVeryHigh: string;
  readonly searchPlaceholder: string;
  readonly searchCityPlaceholder: string;
  readonly chooseLocation: string;
  readonly selectLocation: string;
  readonly searchCityHint: string;
  readonly searching: string;
  readonly noCitiesFound: string;
  readonly quickNotesPlaceholder: string;
  readonly quickNotesTitle: string;
  readonly photoBy: string;
  readonly customPhoto: string;
  readonly exitZen: string;
  readonly wmoClearSky: string;
  readonly wmoMainlyClear: string;
  readonly wmoPartlyCloudy: string;
  readonly wmoOvercast: string;
  readonly wmoFoggy: string;
  readonly wmoDrizzle: string;
  readonly wmoRain: string;
  readonly wmoSnow: string;
  readonly wmoThunderstorm: string;
  readonly weekdays: readonly string[];
  readonly shortWeekdays: readonly string[];
  readonly months: readonly string[];
  readonly settingsTitle: string;
  readonly themeSubtitle: string;
  readonly wallpapersSubtitle: string;
  readonly weatherSubtitle: string;
  readonly clockLayoutSubtitle: string;
  readonly backgroundMode: string;
  readonly bgWallpapers: string;
  readonly bgSolidColor: string;
  readonly collection: string;
  readonly colAll: string;
  readonly colMyOnly: string;
  readonly colBrave: string;
  readonly lockWallpaper: string;
  readonly lockRotate: string;
  readonly lockLocked: string;
  readonly bgDim: string;
  readonly bgBlur: string;
  readonly myUploadedWallpapers: string;
  readonly uploadWallpapersBtn: string;
  readonly noCustomWallpapers: string;
  readonly savedCount: (n: number) => string;
  readonly languageLabel: string;
  readonly layoutStyle: string;
  readonly layoutDetailed: string;
  readonly layoutMinimal: string;
  readonly temperature: string;
  readonly windSpeed: string;
  readonly timeFormat: string;
  readonly seconds: string;
  readonly secHidden: string;
  readonly secVisible: string;
  readonly dualClock: string;
  readonly quickPinsBar: string;
  readonly openLinksIn: string;
  readonly linksCurrent: string;
  readonly linksNewTab: string;
  readonly quickNotesToggle: string;
  readonly greetingName: string;
  readonly greetingNamePlaceholder: string;
}
