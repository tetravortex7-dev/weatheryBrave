import { type UserSettings } from '../../core/models/Settings';
import {
  type DailyForecastItem,
  type HourlyForecastItem,
  type WeatherData,
} from '../../core/models/Weather';
import { type IClock } from '../../core/ports/IClock';
import {
  formatIsoClockTime,
  formatRelativeAge,
  formatShortWeekday,
} from '../../core/services/TimeFormatter';
import {
  describeUvIndex,
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

const DISPLAY_HOURS = [6, 9, 12, 15, 18, 21] as const;

export class WeatherWidget {
  private readonly root: HTMLElement;
  private readonly locationBtnText: HTMLElement;
  private readonly statusBadge: HTMLElement;
  private readonly currentIconSlot: HTMLElement;
  private readonly currentTempEl: HTMLElement;
  private readonly currentDescEl: HTMLElement;
  private readonly astroBadgeEl: HTMLElement;
  private readonly feelsLikeEl: HTMLElement;
  private readonly humidityEl: HTMLElement;
  private readonly windEl: HTMLElement;
  private readonly dailyGridEl: HTMLElement;
  private readonly hourlyStripEl: HTMLElement;

  private currentData: WeatherData | null = null;
  private settings: UserSettings;
  private selectedDayIso: string | null = null;

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
    this.astroBadgeEl = createEl('div', {
      className: 'weather-card__astro',
      attrs: { hidden: 'true' },
    });

    const primaryLeft = createEl(
      'div',
      { className: 'weather-card__primary' },
      [
        this.currentIconSlot,
        createEl('div', { className: 'weather-card__primary-text' }, [
          this.currentTempEl,
          this.currentDescEl,
          this.astroBadgeEl,
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
    this.hourlyStripEl = createEl('div', {
      className: 'weather-card__hourly',
      attrs: { hidden: 'true' },
    });

    this.root = createEl(
      'section',
      {
        className: 'weather-card',
        attrs: { 'aria-label': 'Weather Forecast' },
      },
      [header, currentRow, this.dailyGridEl, this.hourlyStripEl]
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

    this.renderAstroLine(data.daily[0], data.current.isDay);

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
    this.renderHourlyStrip(data);
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

  private renderAstroLine(
    today: DailyForecastItem | undefined,
    isDay: boolean
  ): void {
    clearChildren(this.astroBadgeEl);
    if (!today) {
      this.astroBadgeEl.hidden = true;
      return;
    }

    const parts: string[] = [];
    if (isDay && today.sunsetIso) {
      parts.push(
        `Sunset ${formatIsoClockTime(today.sunsetIso, this.settings.timeFormat)}`
      );
    } else if (!isDay && today.sunriseIso) {
      parts.push(
        `Sunrise ${formatIsoClockTime(today.sunriseIso, this.settings.timeFormat)}`
      );
    }

    if (typeof today.uvIndexMax === 'number') {
      parts.push(describeUvIndex(today.uvIndexMax));
    }

    if (parts.length === 0) {
      this.astroBadgeEl.hidden = true;
      return;
    }

    this.astroBadgeEl.hidden = false;
    this.astroBadgeEl.append(
      createUiIconSvg(isDay ? 'sunset' : 'sunrise', 13),
      createEl('span', { textContent: parts.join(' · ') })
    );
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

      const isSelected = this.selectedDayIso === day.dateIso;
      const cell = createEl(
        'button',
        {
          className: isSelected
            ? 'weather-card__day weather-card__day--active'
            : 'weather-card__day',
          attrs: {
            type: 'button',
            title: `Toggle hourly forecast for ${dayLabel}`,
          },
        },
        [
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
        ]
      );

      cell.addEventListener('click', () => {
        this.selectedDayIso = isSelected ? null : day.dateIso;
        this.renderDaily(data);
        this.renderHourlyStrip(data);
      });

      this.dailyGridEl.appendChild(cell);
    }
  }

  private renderHourlyStrip(data: WeatherData): void {
    clearChildren(this.hourlyStripEl);
    if (!this.selectedDayIso || !data.hourly || data.hourly.length === 0) {
      this.hourlyStripEl.hidden = true;
      return;
    }

    const daySlots = data.hourly.filter((slot) => {
      if (!slot.timeIso.startsWith(this.selectedDayIso!)) {
        return false;
      }
      const hourPart = Number(slot.timeIso.split('T')[1]?.split(':')[0]);
      return DISPLAY_HOURS.includes(hourPart as (typeof DISPLAY_HOURS)[number]);
    });

    if (daySlots.length === 0) {
      this.hourlyStripEl.hidden = true;
      return;
    }

    this.hourlyStripEl.hidden = false;
    for (const slot of daySlots) {
      this.hourlyStripEl.appendChild(this.createHourlySlotEl(slot));
    }
  }

  private createHourlySlotEl(slot: HourlyForecastItem): HTMLElement {
    const descriptor = describeWmoCode(slot.weatherCode, slot.isDay);
    const timeLabel = formatIsoClockTime(
      slot.timeIso,
      this.settings.timeFormat
    );
    const tempLabel = formatTemperature(
      slot.temperatureCelsius,
      this.settings.temperatureUnit
    );
    const rainProb = Math.round(slot.precipitationProbability);

    return createEl('div', { className: 'weather-card__hour' }, [
      createEl('span', {
        className: 'weather-card__hour-time',
        textContent: timeLabel,
      }),
      createWeatherIconSvg(descriptor.icon, 18),
      createEl('span', {
        className: 'weather-card__hour-temp',
        textContent: tempLabel,
      }),
      createEl('span', {
        className: 'weather-card__hour-pop',
        textContent: rainProb > 0 ? `${rainProb}%` : '—',
      }),
    ]);
  }
}
