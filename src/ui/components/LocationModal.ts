import { type LocationConfig } from '../../core/models/Location';
import { type IGeocodingProvider } from '../../core/ports/IGeocodingProvider';
import { clearChildren, createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

export class LocationModal {
  private readonly backdropEl: HTMLElement;
  private readonly inputEl: HTMLInputElement;
  private readonly statusEl: HTMLElement;
  private readonly resultsListEl: HTMLElement;
  private debounceId: number | null = null;

  constructor(
    private readonly geocodingProvider: IGeocodingProvider,
    private readonly onSelectLocation: (location: LocationConfig) => void
  ) {
    const title = createEl('h2', {
      className: 'modal__title',
      textContent: 'Choose Location',
    });

    const closeBtn = createEl(
      'button',
      {
        className: 'icon-btn',
        attrs: { type: 'button', 'aria-label': 'Close location modal' },
      },
      [createUiIconSvg('close', 18)]
    );
    closeBtn.addEventListener('click', () => this.close());

    const header = createEl('div', { className: 'modal__header' }, [
      title,
      closeBtn,
    ]);

    this.inputEl = createEl('input', {
      className: 'modal__input',
      attrs: {
        type: 'search',
        placeholder: 'Search city (e.g. Berlin, Tokyo, Almaty)…',
        autocomplete: 'off',
        spellcheck: 'false',
      },
    });

    this.statusEl = createEl('p', {
      className: 'modal__status',
      textContent: 'Type at least 2 characters to search Open-Meteo.',
    });

    this.resultsListEl = createEl('ul', { className: 'modal__results' });

    const dialog = createEl(
      'div',
      {
        className: 'modal__dialog',
        attrs: { role: 'dialog', 'aria-modal': 'true' },
      },
      [header, this.inputEl, this.statusEl, this.resultsListEl]
    );

    this.backdropEl = createEl(
      'div',
      { className: 'modal-backdrop', attrs: { hidden: 'true' } },
      [dialog]
    );

    this.bindEvents();
  }

  public getElement(): HTMLElement {
    return this.backdropEl;
  }

  public open(): void {
    this.backdropEl.hidden = false;
    this.inputEl.value = '';
    clearChildren(this.resultsListEl);
    this.statusEl.textContent =
      'Type at least 2 characters to search Open-Meteo.';
    window.setTimeout(() => this.inputEl.focus(), 10);
  }

  public close(): void {
    this.backdropEl.hidden = true;
  }

  private bindEvents(): void {
    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.backdropEl.hidden) {
        this.close();
      }
    });

    this.inputEl.addEventListener('input', () => {
      if (this.debounceId !== null) {
        window.clearTimeout(this.debounceId);
      }
      this.debounceId = window.setTimeout(() => {
        void this.performSearch(this.inputEl.value);
      }, 260);
    });
  }

  private async performSearch(query: string): Promise<void> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      clearChildren(this.resultsListEl);
      this.statusEl.textContent =
        'Type at least 2 characters to search Open-Meteo.';
      return;
    }

    this.statusEl.textContent = 'Searching…';
    const result = await this.geocodingProvider.searchCity(trimmed);

    clearChildren(this.resultsListEl);
    if (!result.ok) {
      this.statusEl.textContent = `Search failed: ${result.error}`;
      return;
    }

    if (result.value.length === 0) {
      this.statusEl.textContent = 'No matching cities found.';
      return;
    }

    this.statusEl.textContent = 'Select a location:';
    for (const loc of result.value) {
      const subParts = [loc.admin1, loc.country].filter(Boolean).join(', ');
      const itemBtn = createEl(
        'button',
        {
          className: 'modal__result-btn',
          attrs: { type: 'button' },
        },
        [
          createEl('span', {
            className: 'modal__result-city',
            textContent: loc.name,
          }),
          createEl('span', {
            className: 'modal__result-region',
            textContent: subParts,
          }),
        ]
      );

      itemBtn.addEventListener('click', () => {
        this.onSelectLocation(loc);
        this.close();
      });

      this.resultsListEl.appendChild(createEl('li', {}, [itemBtn]));
    }
  }
}
