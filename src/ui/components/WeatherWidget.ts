import { type UserSettings } from '../../core/models/Settings';
import { type WeatherData } from '../../core/models/Weather';
import { type IClock } from '../../core/ports/IClock';
import {
  formatRelativeAge,
  formatShortWeekday,
} from '../../core/services/TimeFormatter';
import {
  formatTemperature,
  formatWindSpeed,
} from '../../core/services/WeatherFormatter';
import { describeWmoCode } from '../../core/services/WmoWeatherMapper';
import { clearChildren, createEl } from '../dom/domHelpers';
import { createUiIconSvg, createWeatherIconSvg } from '../dom/svgIcons';

export interface WeatherWidgetHandlers {
  onOpenLocationModal(): void;
  onManualRefresh(): void;
}

export class WeatherWidget {
  private readonly root: HTMLElement;
  private readonly locationBtnText: HTMLElement;
  private readonly statusBadge: HTMLElement;
  private readonly currentIconSlot: HTMLElement;
  private readonly currentTempEl: HTMLElement;
  private readonly currentDescEl: HTMLElement;
  private readonly feelsLikeEl: HTMLElement;
  private readonly humidityEl: HTMLElement;
  private readonly windEl: HTMLElement;
  private readonly dailyGridEl: HTMLElement;

  private currentData: WeatherData | null = null;
  private settings: UserSettings;

  constructor(
    private readonly clock: IClock,
    initialSettings: UserSettings,
    handlers: WeatherWidgetHandlers
  ) {
    this.settings = initialSettings;

    this.locationBtnText = createEl('span', {
      className: 'weather-card__location-name',
      textContent: initialSettings.location.name,
    });

    const locationBtn = createEl(
      'button',
      {
        className: 'weather-card__location-btn',
        attrs: {
          type: 'button',
          title: 'Change city',
          'aria-label': 'Change city',
        },
      },
      [createUiIconSvg('location', 16), this.locationBtnText]
    );
    locationBtn.addEventListener('click', () => handlers.onOpenLocationModal());

    this.statusBadge = createEl('span', {
      className: 'weather-card__status',
      textContent: 'Loading forecast…',
    });

    const refreshBtn = createEl(
      'button',
      {
        className: 'icon-btn',
        attrs: {
          type: 'button',
          title: 'Refresh weather',
          'aria-label': 'Refresh weather',
        },
      },
      [createUiIconSvg('refresh', 16)]
    );
    refreshBtn.addEventListener('click', () => handlers.onManualRefresh());

    const headerActions = createEl(
      'div',
      { className: 'weather-card__header-actions' },
      [this.statusBadge, refreshBtn]
    );

    const header = createEl('header', { className: 'weather-card__header' }, [
      locationBtn,
      headerActions,
    ]);

    this.currentIconSlot = createEl('div', {
      className: 'weather-card__icon-slot',
    });
    this.currentTempEl = createEl('div', {
      className: 'weather-card__temp',
      textContent: '--°',
    });
    this.currentDescEl = createEl('div', {
      className: 'weather-card__desc',
      textContent: 'Waiting for data',
    });

    const primaryLeft = createEl(
      'div',
      { className: 'weather-card__primary' },
      [
        this.currentIconSlot,
        createEl('div', { className: 'weather-card__primary-text' }, [
          this.currentTempEl,
          this.currentDescEl,
        ]),
      ]
    );

    this.feelsLikeEl = createEl('span', { textContent: 'Feels --' });
    this.humidityEl = createEl('span', { textContent: 'Humidity --%' });
    this.windEl = createEl('span', { textContent: 'Wind --' });

    const metricsCol = createEl('div', { className: 'weather-card__metrics' }, [
      this.feelsLikeEl,
      this.humidityEl,
      this.windEl,
    ]);

    const currentRow = createEl('div', { className: 'weather-card__current' }, [
      primaryLeft,
      metricsCol,
    ]);

    this.dailyGridEl = createEl('div', { className: 'weather-card__daily' });

    this.root = createEl(
      'section',
      {
        className: 'weather-card',
        attrs: { 'aria-label': 'Weather Forecast' },
      },
      [header, currentRow, this.dailyGridEl]
    );
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public updateSettings(settings: UserSettings): void {
    this.settings = settings;
    this.locationBtnText.textContent = settings.location.name;
    if (this.currentData) {
      this.renderWeather(this.currentData, false);
    }
  }

  public renderWeather(data: WeatherData, isStale: boolean): void {
    this.currentData = data;
    this.locationBtnText.textContent = data.locationName;

    const wmo = describeWmoCode(data.current.weatherCode, data.current.isDay);
    clearChildren(this.currentIconSlot);
    this.currentIconSlot.appendChild(createWeatherIconSvg(wmo.icon, 44));

    this.currentTempEl.textContent = formatTemperature(
      data.current.temperatureCelsius,
      this.settings.temperatureUnit
    );
    this.currentDescEl.textContent = wmo.label;

    const feels = formatTemperature(
      data.current.apparentTemperatureCelsius,
      this.settings.temperatureUnit
    );
    this.feelsLikeEl.textContent = `Feels ${feels}`;
    this.humidityEl.textContent = `Humidity ${Math.round(data.current.relativeHumidityPercent)}%`;
    this.windEl.textContent = `Wind ${formatWindSpeed(
      data.current.windSpeedKmh,
      this.settings.windSpeedUnit
    )}`;

    const ageText = formatRelativeAge(
      data.fetchedAtEpochMs,
      this.clock.epochMs()
    );
    this.statusBadge.textContent = isStale ? `${ageText} · syncing` : ageText;

    this.renderDaily(data);
  }

  public renderError(errorMessage: string, fallback: WeatherData | null): void {
    if (fallback) {
      this.renderWeather(fallback, false);
      const age = formatRelativeAge(
        fallback.fetchedAtEpochMs,
        this.clock.epochMs()
      );
      this.statusBadge.textContent = `Offline · ${age}`;
      return;
    }
    this.statusBadge.textContent = `Unavailable (${errorMessage})`;
  }

  private renderDaily(data: WeatherData): void {
    clearChildren(this.dailyGridEl);

    for (const [idx, day] of data.daily.slice(0, 5).entries()) {
      const dayLabel = idx === 0 ? 'Today' : formatShortWeekday(day.dateIso);
      const descriptor = describeWmoCode(day.weatherCode, true);
      const maxText = formatTemperature(
        day.tempMaxCelsius,
        this.settings.temperatureUnit
      );
      const minText = formatTemperature(
        day.tempMinCelsius,
        this.settings.temperatureUnit
      );

      const cell = createEl('div', { className: 'weather-card__day' }, [
        createEl('span', {
          className: 'weather-card__day-name',
          textContent: dayLabel,
        }),
        createWeatherIconSvg(descriptor.icon, 22),
        createEl('div', { className: 'weather-card__day-temps' }, [
          createEl('span', {
            className: 'weather-card__day-max',
            textContent: maxText,
          }),
          createEl('span', {
            className: 'weather-card__day-min',
            textContent: minText,
          }),
        ]),
      ]);

      this.dailyGridEl.appendChild(cell);
    }
  }
}
