import {
  type TemperatureUnit,
  type TimeFormat,
  type UserSettings,
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
  private readonly customGalleryEl: HTMLElement;
  private readonly customCountEl: HTMLElement;
  private settings: UserSettings;
  private customWallpapers: readonly BraveWallpaper[] = [];
  private readonly themeButtons = new Map<ThemeId, HTMLButtonElement>();

  constructor(
    initialSettings: UserSettings,
    private readonly callbacks: SettingsDrawerCallbacks
  ) {
    this.settings = initialSettings;

    const title = createEl('h2', {
      className: 'drawer__title',
      textContent: 'Appearance & Units',
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

    this.customGalleryEl = createEl('div', {
      className: 'custom-wp-gallery',
    });
    this.customCountEl = createEl('span', {
      className: 'custom-wp-count',
      textContent: '0 uploaded',
    });

    const themeSection = this.buildThemePicker();
    const wallpaperSection = this.buildWallpaperSection();
    const unitsSection = this.buildUnitsControls();
    const clockSection = this.buildClockControls();

    const panel = createEl(
      'aside',
      {
        className: 'drawer__panel',
        attrs: { role: 'dialog', 'aria-label': 'Extension Settings' },
      },
      [header, themeSection, wallpaperSection, unitsSection, clockSection]
    );

    this.backdropEl = createEl(
      'div',
      { className: 'drawer-backdrop', attrs: { hidden: 'true' } },
      [panel]
    );

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) {
        this.close();
      }
    });
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
    this.renderCustomGallery();
  }

  private emitUpdate(partial: Partial<UserSettings>): void {
    this.settings = { ...this.settings, ...partial };
    this.syncThemeActiveState();
    this.callbacks.onChangeSettings(this.settings);
  }

  private buildThemePicker(): HTMLElement {
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
      createEl('h3', { className: 'drawer__subtitle', textContent: 'Theme' }),
      grid,
    ]);
  }

  private syncThemeActiveState(): void {
    for (const [id, btn] of this.themeButtons.entries()) {
      btn.classList.toggle('theme-card--active', id === this.settings.theme);
    }
  }

  private buildWallpaperSection(): HTMLElement {
    const toggleRow = this.createSegmentedRow<'on' | 'off'>(
      'Background mode',
      [
        { value: 'on', label: 'Wallpapers' },
        { value: 'off', label: 'Solid color' },
      ],
      this.settings.showWallpaper ? 'on' : 'off',
      (val) => this.emitUpdate({ showWallpaper: val === 'on' })
    );

    const sourceRow = this.createSegmentedRow<WallpaperSourceMode>(
      'Collection',
      [
        { value: 'both', label: 'All' },
        { value: 'custom-only', label: 'My Only' },
        { value: 'builtin-only', label: 'Brave' },
      ],
      this.settings.wallpaperSource,
      (wallpaperSource) => this.emitUpdate({ wallpaperSource })
    );

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
        createEl('span', { textContent: 'Upload Custom Wallpaper(s)' }),
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
      createEl('span', { textContent: 'My uploaded wallpapers' }),
      this.customCountEl,
    ]);

    this.renderCustomGallery();

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', {
        className: 'drawer__subtitle',
        textContent: 'Wallpapers',
      }),
      toggleRow,
      sourceRow,
      customHeaderRow,
      uploadBtn,
      fileInput,
      this.customGalleryEl,
    ]);
  }

  private renderCustomGallery(): void {
    clearChildren(this.customGalleryEl);
    this.customCountEl.textContent = `${this.customWallpapers.length} saved`;

    if (this.customWallpapers.length === 0) {
      this.customGalleryEl.appendChild(
        createEl('p', {
          className: 'custom-wp-empty',
          textContent:
            'No custom wallpapers yet. Upload images to mix with Brave or use "My Only".',
        })
      );
      return;
    }

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
      this.customGalleryEl.appendChild(thumb);
    }
  }

  private buildUnitsControls(): HTMLElement {
    const tempRow = this.createSegmentedRow<TemperatureUnit>(
      'Temperature',
      [
        { value: 'celsius', label: '°C' },
        { value: 'fahrenheit', label: '°F' },
      ],
      this.settings.temperatureUnit,
      (temperatureUnit) => this.emitUpdate({ temperatureUnit })
    );

    const windRow = this.createSegmentedRow<WindSpeedUnit>(
      'Wind speed',
      [
        { value: 'kmh', label: 'km/h' },
        { value: 'ms', label: 'm/s' },
        { value: 'mph', label: 'mph' },
      ],
      this.settings.windSpeedUnit,
      (windSpeedUnit) => this.emitUpdate({ windSpeedUnit })
    );

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', { className: 'drawer__subtitle', textContent: 'Weather' }),
      tempRow,
      windRow,
    ]);
  }

  private buildClockControls(): HTMLElement {
    const formatRow = this.createSegmentedRow<TimeFormat>(
      'Time format',
      [
        { value: '24h', label: '24h' },
        { value: '12h', label: '12h' },
      ],
      this.settings.timeFormat,
      (timeFormat) => this.emitUpdate({ timeFormat })
    );

    const secondsRow = this.createSegmentedRow<'on' | 'off'>(
      'Seconds',
      [
        { value: 'off', label: 'Hidden' },
        { value: 'on', label: 'Visible' },
      ],
      this.settings.showSeconds ? 'on' : 'off',
      (val) => this.emitUpdate({ showSeconds: val === 'on' })
    );

    const quickPinsRow = this.createSegmentedRow<'on' | 'off'>(
      'Quick pins bar',
      [
        { value: 'on', label: 'Visible' },
        { value: 'off', label: 'Hidden' },
      ],
      this.settings.showQuickLinks ? 'on' : 'off',
      (val) => this.emitUpdate({ showQuickLinks: val === 'on' })
    );

    const nameInput = createEl('input', {
      className: 'drawer__text-input',
      attrs: {
        type: 'text',
        placeholder: 'Optional name for greeting',
        maxlength: '28',
        value: this.settings.customName,
      },
    });
    nameInput.addEventListener('input', () => {
      this.emitUpdate({ customName: nameInput.value });
    });

    const greetingRow = createEl('label', { className: 'drawer__field' }, [
      createEl('span', { textContent: 'Greeting name' }),
      nameInput,
    ]);

    return createEl('div', { className: 'drawer__section' }, [
      createEl('h3', {
        className: 'drawer__subtitle',
        textContent: 'Clock & Layout',
      }),
      formatRow,
      secondsRow,
      quickPinsRow,
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
