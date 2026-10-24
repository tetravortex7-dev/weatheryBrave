import {
  type ISearchProvider,
  type SearchDisposition,
} from '../../core/ports/ISearchProvider';
import { createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

export class SearchWidget {
  private readonly formEl: HTMLFormElement;
  private readonly inputEl: HTMLInputElement;
  private readonly shortcutHintEl: HTMLElement;
  private readonly submitBtnEl: HTMLButtonElement;

  constructor(private readonly searchProvider: ISearchProvider) {
    const leadingIcon = createEl('span', { className: 'search-bar__icon' }, [
      createUiIconSvg('search', 18),
    ]);

    this.inputEl = createEl('input', {
      className: 'search-bar__input',
      attrs: {
        type: 'text',
        placeholder: 'Search the web or type URL (!yt, !gh, !r, !d)…',
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: 'false',
        'aria-label': 'Search the web',
      },
    });

    this.shortcutHintEl = createEl('kbd', {
      className: 'search-bar__kbd',
      textContent: '/',
      attrs: { title: 'Press / to focus search' },
    });

    this.submitBtnEl = createEl(
      'button',
      {
        className: 'search-bar__submit',
        attrs: {
          type: 'submit',
          title: 'Search (Enter)',
          'aria-label': 'Submit search',
          hidden: 'true',
        },
      },
      [createUiIconSvg('arrow-right', 16)]
    );

    this.formEl = createEl(
      'form',
      {
        className: 'search-bar',
        attrs: { role: 'search' },
      },
      [leadingIcon, this.inputEl, this.shortcutHintEl, this.submitBtnEl]
    );

    this.bindEvents();
  }

  public getElement(): HTMLElement {
    return this.formEl;
  }

  private bindEvents(): void {
    this.inputEl.addEventListener('input', () => {
      const hasText = this.inputEl.value.trim().length > 0;
      this.submitBtnEl.hidden = !hasText;
      this.shortcutHintEl.hidden = hasText;
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.inputEl.value.length > 0) {
          this.inputEl.value = '';
          this.submitBtnEl.hidden = true;
          this.shortcutHintEl.hidden = false;
        } else {
          this.inputEl.blur();
        }
        return;
      }

      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || e.altKey)) {
        e.preventDefault();
        this.executeSearch('NEW_TAB');
      }
    });

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.executeSearch('CURRENT_TAB');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      const active = document.activeElement;
      const isInputFocused =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLElement && active.isContentEditable);

      if (!isInputFocused) {
        e.preventDefault();
        this.inputEl.focus();
        this.inputEl.select();
      }
    });
  }

  private executeSearch(disposition: SearchDisposition): void {
    const query = this.inputEl.value.trim();
    if (!query) {
      return;
    }
    this.searchProvider.search(query, disposition);
  }
}
