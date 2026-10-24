import { getI18n, type AppLanguage, SUPPORTED_LANGUAGES } from '../../core/i18n';
import {
  type LinkTargetMode,
  type TemperatureUnit,
  type TimeFormat,
  type UserSettings,
  type WeatherViewMode,
  type WindSpeedUnit,
} from '../../core/models/Settings';
import { THEME_REGISTRY, type ThemeId } from '../../core/models/Theme';
import {
  type BraveWallpaper,
  type WallpaperSourceMode,
} from '../../core/models/Wallpaper';
import { clearChildren, createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

export interface SettingsDrawerCallbacks {
  onChangeSettings(updated: UserSettings): void;
  onUploadWallpapers(files: FileList): Promise<void>;
  onRemoveCustomWallpaper(id: string): Promise<void>;
}

export class SettingsDrawer {
  private readonly backdropEl: HTMLElement;
  private readonly panelEl: HTMLElement;
  private settings: UserSettings;
  private customWallpapers: readonly BraveWallpaper[] = [];
  private readonly themeButtons = new Map<ThemeId, HTMLButtonElement>();

  constructor(
    initialSettings: UserSettings,
    private readonly callbacks: SettingsDrawerCallbacks
  ) {
    this.settings = initialSettings;

    this.panelEl = createEl('aside', {
      className: 'drawer__panel',
      attrs: { role: 'dialog', 'aria-label': 'Extension Settings' },
    });

    this.backdropEl = createEl(
      'div',
      { className: 'drawer-backdrop', attrs: { hidden: 'true' } },
      [this.panelEl]
    );

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) {
        this.close();
      }
    });

    this.render();
  }

  public getElement(): HTMLElement {
    return this.backdropEl;
  }

  public open(): void {
    this.backdropEl.hidden = false;
  }

  public close(): void {
    this.backdropEl.hidden = true;
  }

  public setCustomWallpapers(wallpapers: readonly BraveWallpaper[]): void {
    this.customWallpapers = wallpapers;
    this.render();
  }

  public updateSettings(settings: UserSettings): void {
    const langChanged = settings.language !== this.settings.language;
    this.settings = settings;
    if (langChanged) {
      this.render();
    } else {
      this.syncThemeActiveState();
    }
  }

  private emitUpdate(partial: Partial<UserSettings>): void {
    const updated = { ...this.settings, ...partial };
    this.updateSettings(updated);
    this.callbacks.onChangeSettings(updated);
  }

  private render(): void {
    const i18n = getI18n(this.settings.language);
    clearChildren(this.panelEl);
    this.themeButtons.clear();

    const title = createEl('h2', {
      className: 'drawer__title',
      textContent: i18n.settingsTitle,
    });

    const closeBtn = createEl(
      'button',
      {
        className: 'icon-btn',
        attrs: { type: 'button', 'aria-label': 'Close settings' },
      },
      [createUiIconSvg('close', 18)]
    );
    closeBtn.addEventListener('click', () => this.close());

    const header = createEl('div', { className: 'drawer__header' }, [
      title,
      closeBtn,
    ]);

    const themeSection = this.buildThemePicker();
    const wallpaperSection = this.buildWallpaperSection();
    const weatherSection = this.buildWeatherSection();
    const clockSection = this.buildClockControls();

    this.panelEl.append(
      header,
      themeSection,
      wallpaperSection,
      weatherSection,
      clockSection
    );
  }

  private buildThemePicker(): HTMLElement {
    const i18n = getI18n(this.settings.language);
    const grid = createEl('div', { className: 'theme-grid' });

    for (const meta of THEME_REGISTRY) {
      const swatch = createEl('span', { className: 'theme-card__swatch' });
      swatch.style.backgroundColor = meta.previewBg;
      swatch.style.borderColor = meta.previewAccent;

      const btn = createEl(
        'button',
        {
          className: 'theme-card',
          attrs: { type: 'button', title: meta.description },
        },
        [
          swatch,
          createEl('span', {
            className: 'theme-card__label',
            textContent: meta.label,
          }),
        ]
      );

      btn.addEventListener('click', () => {
        this.emitUpdate({ theme: meta.id });
      });

      this.themeButtons.set(meta.id, btn);
      grid.appendChild(btn);
    }

    this.syncThemeActiveState();

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', { className: 'drawer__subtitle', textContent: i18n.themeSubtitle }),
      grid,
    ]);
  }

  private syncThemeActiveState(): void {
    for (const [id, btn] of this.themeButtons.entries()) {
      btn.classList.toggle('theme-card--active', id === this.settings.theme);
    }
  }

  private buildWallpaperSection(): HTMLElement {
    const i18n = getI18n(this.settings.language);

    const toggleRow = this.createSegmentedRow<'on' | 'off'>(
      i18n.backgroundMode,
      [
        { value: 'on', label: i18n.bgWallpapers },
        { value: 'off', label: i18n.bgSolidColor },
      ],
      this.settings.showWallpaper ? 'on' : 'off',
      (val) => this.emitUpdate({ showWallpaper: val === 'on' })
    );

    const sourceRow = this.createSegmentedRow<WallpaperSourceMode>(
      i18n.collection,
      [
        { value: 'both', label: i18n.colAll },
        { value: 'custom-only', label: i18n.colMyOnly },
        { value: 'builtin-only', label: i18n.colBrave },
      ],
      this.settings.wallpaperSource,
      (wallpaperSource) => this.emitUpdate({ wallpaperSource })
    );

    const lockRow = this.createSegmentedRow<'locked' | 'rotating'>(
      i18n.lockWallpaper,
      [
        { value: 'rotating', label: i18n.lockRotate },
        { value: 'locked', label: i18n.lockLocked },
      ],
      this.settings.lockWallpaper ? 'locked' : 'rotating',
      (val) => this.emitUpdate({ lockWallpaper: val === 'locked' })
    );

    const dimSlider = createEl('input', {
      className: 'drawer__slider',
      attrs: {
        type: 'range',
        min: '0',
        max: '80',
        step: '5',
        value: `${this.settings.wallpaperDim}`,
      },
    }) as HTMLInputElement;

    const dimValue = createEl('span', {
      className: 'drawer__slider-val',
      textContent: `${this.settings.wallpaperDim}%`,
    });

    dimSlider.addEventListener('input', () => {
      const val = Number(dimSlider.value);
      dimValue.textContent = `${val}%`;
      this.emitUpdate({ wallpaperDim: val });
    });

    const dimRow = createEl('div', { className: 'drawer__slider-row' }, [
      createEl('div', { className: 'drawer__slider-label' }, [
        createEl('span', { textContent: i18n.bgDim }),
        dimValue,
      ]),
      dimSlider,
    ]);

    const blurSlider = createEl('input', {
      className: 'drawer__slider',
      attrs: {
        type: 'range',
        min: '0',
        max: '20',
        step: '1',
        value: `${this.settings.wallpaperBlur}`,
      },
    }) as HTMLInputElement;

    const blurValue = createEl('span', {
      className: 'drawer__slider-val',
      textContent: `${this.settings.wallpaperBlur}px`,
    });

    blurSlider.addEventListener('input', () => {
      const val = Number(blurSlider.value);
      blurValue.textContent = `${val}px`;
      this.emitUpdate({ wallpaperBlur: val });
    });

    const blurRow = createEl('div', { className: 'drawer__slider-row' }, [
      createEl('div', { className: 'drawer__slider-label' }, [
        createEl('span', { textContent: i18n.bgBlur }),
        blurValue,
      ]),
      blurSlider,
    ]);

    const fileInput = createEl('input', {
      attrs: {
        type: 'file',
        accept: 'image/jpeg,image/png,image/webp,image/avif',
        multiple: 'true',
        hidden: 'true',
      },
    });

    const uploadBtn = createEl(
      'button',
      {
        className: 'custom-wp-upload-btn',
        attrs: { type: 'button' },
      },
      [
        createUiIconSvg('plus', 14),
        createEl('span', { textContent: i18n.uploadWallpapersBtn }),
      ]
    );

    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        void this.callbacks.onUploadWallpapers(fileInput.files);
        fileInput.value = '';
      }
    });

    const customHeaderRow = createEl('div', { className: 'drawer__row' }, [
      createEl('span', { textContent: i18n.myUploadedWallpapers }),
      createEl('span', {
        className: 'custom-wp-count',
        textContent: i18n.savedCount(this.customWallpapers.length),
      }),
    ]);

    const galleryEl = createEl('div', { className: 'custom-wp-gallery' });
    if (this.customWallpapers.length === 0) {
      galleryEl.appendChild(
        createEl('p', {
          className: 'custom-wp-empty',
          textContent: i18n.noCustomWallpapers,
        })
      );
    } else {
      for (const wp of this.customWallpapers) {
        const thumb = createEl('div', { className: 'custom-wp-thumb' });
        thumb.style.backgroundImage = `url("${wp.filename}")`;

        const removeBtn = createEl(
          'button',
          {
            className: 'custom-wp-thumb__remove',
            attrs: {
              type: 'button',
              title: `Delete ${wp.author}`,
              'aria-label': `Delete ${wp.author}`,
            },
          },
          [createUiIconSvg('close', 12)]
        );
        removeBtn.addEventListener('click', () => {
          void this.callbacks.onRemoveCustomWallpaper(wp.id);
        });

        const nameTag = createEl('span', {
          className: 'custom-wp-thumb__label',
          textContent: wp.author,
        });

        thumb.append(removeBtn, nameTag);
        galleryEl.appendChild(thumb);
      }
    }

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', {
        className: 'drawer__subtitle',
        textContent: i18n.wallpapersSubtitle,
      }),
      toggleRow,
      sourceRow,
      lockRow,
      dimRow,
      blurRow,
      customHeaderRow,
      uploadBtn,
      fileInput,
      galleryEl,
    ]);
  }

  private buildWeatherSection(): HTMLElement {
    const i18n = getI18n(this.settings.language);

    const langOptions = SUPPORTED_LANGUAGES.map((l) => ({
      value: l.id,
      label: l.label,
    }));

    const langSelect = createEl('select', {
      className: 'drawer__select',
    }) as HTMLSelectElement;

    for (const opt of langOptions) {
      const optionEl = createEl('option', {
        textContent: opt.label,
        attrs: { value: opt.value },
      }) as HTMLOptionElement;
      if (opt.value === this.settings.language) {
        optionEl.selected = true;
      }
      langSelect.appendChild(optionEl);
    }

    langSelect.addEventListener('change', () => {
      this.emitUpdate({ language: langSelect.value as AppLanguage });
    });

    const langRow = createEl('div', { className: 'drawer__row' }, [
      createEl('span', { textContent: i18n.languageLabel }),
      langSelect,
    ]);

    const viewModeRow = this.createSegmentedRow<WeatherViewMode>(
      i18n.layoutStyle,
      [
        { value: 'full', label: i18n.layoutDetailed },
        { value: 'compact', label: i18n.layoutMinimal },
      ],
      this.settings.weatherViewMode,
      (weatherViewMode) => this.emitUpdate({ weatherViewMode })
    );

    const tempRow = this.createSegmentedRow<TemperatureUnit>(
      i18n.temperature,
      [
        { value: 'celsius', label: '°C' },
        { value: 'fahrenheit', label: '°F' },
      ],
      this.settings.temperatureUnit,
      (temperatureUnit) => this.emitUpdate({ temperatureUnit })
    );

    const windRow = this.createSegmentedRow<WindSpeedUnit>(
      i18n.windSpeed,
      [
        { value: 'kmh', label: 'km/h' },
        { value: 'ms', label: 'm/s' },
        { value: 'mph', label: 'mph' },
      ],
      this.settings.windSpeedUnit,
      (windSpeedUnit) => this.emitUpdate({ windSpeedUnit })
    );

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', { className: 'drawer__subtitle', textContent: i18n.weatherSubtitle }),
      langRow,
      viewModeRow,
      tempRow,
      windRow,
    ]);
  }

  private buildClockControls(): HTMLElement {
    const i18n = getI18n(this.settings.language);

    const formatRow = this.createSegmentedRow<TimeFormat>(
      i18n.timeFormat,
      [
        { value: '24h', label: '24h' },
        { value: '12h', label: '12h' },
      ],
      this.settings.timeFormat,
      (timeFormat) => this.emitUpdate({ timeFormat })
    );

    const secondsRow = this.createSegmentedRow<'on' | 'off'>(
      i18n.seconds,
      [
        { value: 'off', label: i18n.secHidden },
        { value: 'on', label: i18n.secVisible },
      ],
      this.settings.showSeconds ? 'on' : 'off',
      (val) => this.emitUpdate({ showSeconds: val === 'on' })
    );

    const tzRow = this.createSegmentedRow<string>(
      i18n.dualClock,
      [
        { value: 'none', label: 'Off' },
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'NY' },
        { value: 'Europe/London', label: 'LON' },
        { value: 'Asia/Tokyo', label: 'TYO' },
      ],
      this.settings.secondaryTimezone,
      (secondaryTimezone) => this.emitUpdate({ secondaryTimezone })
    );

    const quickPinsRow = this.createSegmentedRow<'on' | 'off'>(
      i18n.quickPinsBar,
      [
        { value: 'on', label: i18n.secVisible },
        { value: 'off', label: i18n.secHidden },
      ],
      this.settings.showQuickLinks ? 'on' : 'off',
      (val) => this.emitUpdate({ showQuickLinks: val === 'on' })
    );

    const targetRow = this.createSegmentedRow<LinkTargetMode>(
      i18n.openLinksIn,
      [
        { value: 'current', label: i18n.linksCurrent },
        { value: 'new-tab', label: i18n.linksNewTab },
      ],
      this.settings.linkTarget,
      (linkTarget) => this.emitUpdate({ linkTarget })
    );

    const notesRow = this.createSegmentedRow<'on' | 'off'>(
      i18n.quickNotesToggle,
      [
        { value: 'on', label: i18n.secVisible },
        { value: 'off', label: i18n.secHidden },
      ],
      this.settings.showScratchpad ? 'on' : 'off',
      (val) => this.emitUpdate({ showScratchpad: val === 'on' })
    );

    const nameInput = createEl('input', {
      className: 'drawer__text-input',
      attrs: {
        type: 'text',
        placeholder: i18n.greetingNamePlaceholder,
        maxlength: '28',
        value: this.settings.customName,
      },
    });
    nameInput.addEventListener('input', () => {
      this.emitUpdate({ customName: nameInput.value });
    });

    const greetingRow = createEl('label', { className: 'drawer__field' }, [
      createEl('span', { textContent: i18n.greetingName }),
      nameInput,
    ]);

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', {
        className: 'drawer__subtitle',
        textContent: i18n.clockLayoutSubtitle,
      }),
      formatRow,
      secondsRow,
      tzRow,
      quickPinsRow,
      targetRow,
      notesRow,
      greetingRow,
    ]);
  }

  private createSegmentedRow<T extends string>(
    labelText: string,
    options: readonly { readonly value: T; readonly label: string }[],
    initialValue: T,
    onSelect: (value: T) => void
  ): HTMLElement {
    const buttons: HTMLButtonElement[] = [];
    const group = createEl('div', { className: 'segmented' });

    for (const opt of options) {
      const btn = createEl('button', {
        className:
          opt.value === initialValue
            ? 'segmented__btn segmented__btn--active'
            : 'segmented__btn',
        textContent: opt.label,
        attrs: { type: 'button' },
      });

      btn.addEventListener('click', () => {
        for (const b of buttons) {
          b.classList.remove('segmented__btn--active');
        }
        btn.classList.add('segmented__btn--active');
        onSelect(opt.value);
      });

      buttons.push(btn);
      group.appendChild(btn);
    }

    return createEl('div', { className: 'drawer__row' }, [
      createEl('span', { textContent: labelText }),
      group,
    ]);
  }
}
