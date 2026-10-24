import { getI18n } from './core/i18n';
import { WeatherSyncService } from './core/services/WeatherSyncService';
import { OpenMeteoGeocodingProvider } from './infra/api/OpenMeteoGeocodingProvider';
import { OpenMeteoWeatherProvider } from './infra/api/OpenMeteoWeatherProvider';
import { IndexedDbWallpaperStore } from './infra/storage/IndexedDbWallpaperStore';
import { LocalStorageAdapter } from './infra/storage/LocalStorageAdapter';
import { BrowserSearchProvider } from './infra/system/BrowserSearchProvider';
import { SystemClock } from './infra/system/SystemClock';
import { ClockWidget } from './ui/components/ClockWidget';
import { LocationModal } from './ui/components/LocationModal';
import { QuickLinksWidget } from './ui/components/QuickLinksWidget';
import { ScratchpadWidget } from './ui/components/ScratchpadWidget';
import { SearchWidget } from './ui/components/SearchWidget';
import { SettingsDrawer } from './ui/components/SettingsDrawer';
import { WallpaperController } from './ui/components/WallpaperController';
import { WeatherWidget } from './ui/components/WeatherWidget';
import { ZenModeController } from './ui/components/ZenModeController';
import { createEl } from './ui/dom/domHelpers';
import { createUiIconSvg } from './ui/dom/svgIcons';
import { ThemeManager } from './ui/themes/ThemeManager';

function bootstrap(): void {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  const clock = new SystemClock();
  const storage = new LocalStorageAdapter();
  const customWallpaperStore = new IndexedDbWallpaperStore();
  const weatherProvider = new OpenMeteoWeatherProvider(clock);
  const geocodingProvider = new OpenMeteoGeocodingProvider();
  const searchProvider = new BrowserSearchProvider();
  const weatherSync = new WeatherSyncService(weatherProvider, storage, clock);
  const themeManager = new ThemeManager();

  let currentSettings = storage.loadSettings();
  themeManager.applyTheme(currentSettings.theme);
  document.title = getI18n(currentSettings.language).newTabTitle;

  let settingsDrawer: SettingsDrawer;

  const wallpaperController = new WallpaperController(currentSettings, {
    onToggleLock: (locked) => {
      currentSettings = { ...currentSettings, lockWallpaper: locked };
      storage.saveSettings(currentSettings);
      wallpaperController.updateSettings(currentSettings);
      settingsDrawer.updateSettings(currentSettings);
    },
  });

  const clockWidget = new ClockWidget(clock, currentSettings);
  const searchWidget = new SearchWidget(searchProvider);

  const quickLinksWidget = new QuickLinksWidget(currentSettings, (nextLinks) => {
    currentSettings = {
      ...currentSettings,
      quickLinks: nextLinks,
    };
    storage.saveSettings(currentSettings);
    quickLinksWidget.updateSettings(currentSettings);
  });

  const scratchpadWidget = new ScratchpadWidget(currentSettings, {
    onUpdateContent: (text) => {
      currentSettings = { ...currentSettings, scratchpadContent: text };
      storage.saveSettings(currentSettings);
    },
    onClose: () => {
      currentSettings = { ...currentSettings, showScratchpad: false };
      storage.saveSettings(currentSettings);
      scratchpadWidget.updateSettings(currentSettings);
      settingsDrawer.updateSettings(currentSettings);
    },
  });

  const runWeatherSync = (forceRefresh: boolean): void => {
    void weatherSync.sync(
      currentSettings.location,
      {
        onWeatherState: (data, isStale) => {
          weatherWidget.renderWeather(data, isStale);
        },
        onSyncError: (errorMessage, fallbackCache) => {
          weatherWidget.renderError(errorMessage, fallbackCache);
        },
      },
      forceRefresh
    );
  };

  const locationModal = new LocationModal(geocodingProvider, (newLocation) => {
    currentSettings = {
      ...currentSettings,
      location: newLocation,
    };
    storage.saveSettings(currentSettings);
    weatherWidget.updateSettings(currentSettings);
    runWeatherSync(true);
  });

  const weatherWidget = new WeatherWidget(clock, currentSettings, {
    onOpenLocationModal: () => locationModal.open(),
    onManualRefresh: () => runWeatherSync(true),
  });

  const refreshCustomWallpapers = async (
    selectNewest: boolean = false
  ): Promise<void> => {
    const customList = await customWallpaperStore.loadCustomWallpapers();
    wallpaperController.setCustomWallpapers(customList, selectNewest);
    settingsDrawer.setCustomWallpapers(customList);
  };

  settingsDrawer = new SettingsDrawer(currentSettings, {
    onChangeSettings: (updated) => {
      const themeChanged = updated.theme !== currentSettings.theme;
      currentSettings = updated;
      storage.saveSettings(currentSettings);

      if (themeChanged) {
        themeManager.applyTheme(currentSettings.theme);
      }

      document.title = getI18n(currentSettings.language).newTabTitle;

      clockWidget.updateSettings(currentSettings);
      quickLinksWidget.updateSettings(currentSettings);
      wallpaperController.updateSettings(currentSettings);
      weatherWidget.updateSettings(currentSettings);
      scratchpadWidget.updateSettings(currentSettings);
    },
    onUploadWallpapers: async (files) => {
      for (const file of Array.from(files)) {
        await customWallpaperStore.addCustomWallpaper(file);
      }
      await refreshCustomWallpapers(true);
    },
    onRemoveCustomWallpaper: async (id) => {
      await customWallpaperStore.removeCustomWallpaper(id);
      await refreshCustomWallpapers(false);
    },
  });

  const zenController = new ZenModeController(appRoot);

  const zenBtn = createEl(
    'button',
    {
      className: 'icon-btn',
      attrs: {
        type: 'button',
        title: 'Zen mode — hide widgets (Z)',
        'aria-label': 'Zen mode',
      },
    },
    [createUiIconSvg('eye', 18)]
  );
  zenBtn.addEventListener('click', () => zenController.toggle(true));

  const settingsBtn = createEl(
    'button',
    {
      className: 'icon-btn',
      attrs: {
        type: 'button',
        title: 'Settings & Themes',
        'aria-label': 'Settings & Themes',
      },
    },
    [createUiIconSvg('settings', 18)]
  );
  settingsBtn.addEventListener('click', () => settingsDrawer.open());

  const topBar = createEl('nav', { className: 'top-bar' }, [zenBtn, settingsBtn]);

  document.body.prepend(
    wallpaperController.getBackgroundElement(),
    zenController.getHintPill()
  );

  appRoot.append(
    topBar,
    clockWidget.getElement(),
    searchWidget.getElement(),
    quickLinksWidget.getElement(),
    weatherWidget.getElement(),
    scratchpadWidget.getElement(),
    wallpaperController.getCreditElement(),
    locationModal.getElement(),
    settingsDrawer.getElement()
  );

  void refreshCustomWallpapers(false);
  runWeatherSync(false);
}

bootstrap();
