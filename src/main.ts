import { WeatherSyncService } from './core/services/WeatherSyncService';
import { OpenMeteoGeocodingProvider } from './infra/api/OpenMeteoGeocodingProvider';
import { OpenMeteoWeatherProvider } from './infra/api/OpenMeteoWeatherProvider';
import { LocalStorageAdapter } from './infra/storage/LocalStorageAdapter';
import { BrowserSearchProvider } from './infra/system/BrowserSearchProvider';
import { SystemClock } from './infra/system/SystemClock';
import { ClockWidget } from './ui/components/ClockWidget';
import { LocationModal } from './ui/components/LocationModal';
import { SearchWidget } from './ui/components/SearchWidget';
import { SettingsDrawer } from './ui/components/SettingsDrawer';
import { WeatherWidget } from './ui/components/WeatherWidget';
import { createEl } from './ui/dom/domHelpers';
import { createUiIconSvg } from './ui/dom/svgIcons';
import { ThemeManager } from './ui/themes/ThemeManager';

function bootstrap(): void {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  // 1. Instantiate Infrastructure & Core Services
  const clock = new SystemClock();
  const storage = new LocalStorageAdapter();
  const weatherProvider = new OpenMeteoWeatherProvider(clock);
  const geocodingProvider = new OpenMeteoGeocodingProvider();
  const searchProvider = new BrowserSearchProvider();
  const weatherSync = new WeatherSyncService(weatherProvider, storage, clock);
  const themeManager = new ThemeManager();

  // 2. Load Synchronous Persisted Settings & Apply Theme
  let currentSettings = storage.loadSettings();
  themeManager.applyTheme(currentSettings.theme);

  // 3. Instantiate UI Components
  const clockWidget = new ClockWidget(clock, currentSettings);
  const searchWidget = new SearchWidget(searchProvider);

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

  const settingsDrawer = new SettingsDrawer(currentSettings, (updated) => {
    const themeChanged = updated.theme !== currentSettings.theme;
    currentSettings = updated;
    storage.saveSettings(currentSettings);

    if (themeChanged) {
      themeManager.applyTheme(currentSettings.theme);
    }

    clockWidget.updateSettings(currentSettings);
    weatherWidget.updateSettings(currentSettings);
  });

  // 4. Top-Right Minimal Controls
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

  const topBar = createEl('nav', { className: 'top-bar' }, [settingsBtn]);

  // 5. Mount DOM & Trigger Stale-While-Revalidate Sync
  appRoot.append(
    topBar,
    clockWidget.getElement(),
    searchWidget.getElement(),
    weatherWidget.getElement(),
    locationModal.getElement(),
    settingsDrawer.getElement()
  );

  runWeatherSync(false);
}

bootstrap();
