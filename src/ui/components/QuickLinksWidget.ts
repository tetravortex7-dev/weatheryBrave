import {
  extractMonogram,
  MAX_QUICK_LINKS,
  normalizeQuickLinkUrl,
  type QuickLink,
} from '../../core/models/QuickLink';
import { type UserSettings } from '../../core/models/Settings';
import { clearChildren, createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

export class QuickLinksWidget {
  private readonly root: HTMLElement;
  private readonly listEl: HTMLElement;
  private readonly formEl: HTMLFormElement;
  private readonly titleInputEl: HTMLInputElement;
  private readonly urlInputEl: HTMLInputElement;
  private settings: UserSettings;
  private isAdding: boolean = false;

  constructor(
    initialSettings: UserSettings,
    private readonly onUpdateLinks: (links: readonly QuickLink[]) => void
  ) {
    this.settings = initialSettings;

    this.listEl = createEl('div', { className: 'quick-links__list' });

    this.titleInputEl = createEl('input', {
      className: 'quick-links__input quick-links__input--title',
      attrs: {
        type: 'text',
        placeholder: 'Label (e.g. GitHub)',
        maxlength: '20',
        autocomplete: 'off',
      },
    });

    this.urlInputEl = createEl('input', {
      className: 'quick-links__input quick-links__input--url',
      attrs: {
        type: 'text',
        placeholder: 'URL (e.g. github.com)',
        autocomplete: 'off',
      },
    });

    const saveBtn = createEl('button', {
      className: 'quick-links__save-btn',
      textContent: 'Add',
      attrs: { type: 'submit' },
    });

    const cancelBtn = createEl(
      'button',
      {
        className: 'icon-btn quick-links__cancel-btn',
        attrs: { type: 'button', 'aria-label': 'Cancel adding pin' },
      },
      [createUiIconSvg('close', 14)]
    );
    cancelBtn.addEventListener('click', () => this.toggleAddForm(false));

    this.formEl = createEl(
      'form',
      { className: 'quick-links__form', attrs: { hidden: 'true' } },
      [this.titleInputEl, this.urlInputEl, saveBtn, cancelBtn]
    );

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddSubmit();
    });

    this.root = createEl(
      'nav',
      { className: 'quick-links', attrs: { 'aria-label': 'Quick Pins' } },
      [this.listEl, this.formEl]
    );

    this.render();
    this.bindHotkeys();
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public updateSettings(settings: UserSettings): void {
    this.settings = settings;
    this.render();
  }

  private toggleAddForm(open: boolean): void {
    this.isAdding = open;
    this.formEl.hidden = !open;
    if (open) {
      this.titleInputEl.value = '';
      this.urlInputEl.value = '';
      window.setTimeout(() => this.titleInputEl.focus(), 10);
    }
  }

  private handleAddSubmit(): void {
    const normalizedUrl = normalizeQuickLinkUrl(this.urlInputEl.value);
    if (!normalizedUrl) {
      this.urlInputEl.focus();
      return;
    }

    const rawTitle = this.titleInputEl.value.trim();
    const fallbackTitle = new URL(normalizedUrl).hostname.replace(/^www\./i, '');
    const newPin: QuickLink = {
      id: `pin-${Date.now()}`,
      title: rawTitle || fallbackTitle,
      url: normalizedUrl,
    };

    const nextLinks = [...this.settings.quickLinks, newPin].slice(
      0,
      MAX_QUICK_LINKS
    );
    this.toggleAddForm(false);
    this.onUpdateLinks(nextLinks);
  }

  private removeLink(id: string): void {
    const nextLinks = this.settings.quickLinks.filter((item) => item.id !== id);
    this.onUpdateLinks(nextLinks);
  }

  private render(): void {
    this.root.hidden = !this.settings.showQuickLinks;
    clearChildren(this.listEl);

    for (const [idx, item] of this.settings.quickLinks.entries()) {
      const badge = createEl('span', {
        className: 'quick-pin__monogram',
        textContent: extractMonogram(item.title, item.url),
      });

      const label = createEl('span', {
        className: 'quick-pin__label',
        textContent: item.title,
      });

      const anchor = createEl(
        'a',
        {
          className: 'quick-pin__link',
          attrs: {
            href: item.url,
            title: `${item.title} (Alt+${idx + 1})`,
          },
        },
        [badge, label]
      );

      const removeBtn = createEl(
        'button',
        {
          className: 'quick-pin__remove',
          attrs: {
            type: 'button',
            title: `Remove ${item.title}`,
            'aria-label': `Remove ${item.title}`,
          },
        },
        [createUiIconSvg('close', 11)]
      );
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.removeLink(item.id);
      });

      const pill = createEl('div', { className: 'quick-pin' }, [
        anchor,
        removeBtn,
      ]);
      this.listEl.appendChild(pill);
    }

    if (this.settings.quickLinks.length < MAX_QUICK_LINKS) {
      const addBtn = createEl(
        'button',
        {
          className: 'quick-pin quick-pin--add',
          attrs: {
            type: 'button',
            title: 'Add quick link',
            'aria-label': 'Add quick link',
          },
        },
        [createUiIconSvg('plus', 14)]
      );
      addBtn.addEventListener('click', () =>
        this.toggleAddForm(!this.isAdding)
      );
      this.listEl.appendChild(addBtn);
    }
  }

  private bindHotkeys(): void {
    document.addEventListener('keydown', (e) => {
      if (!this.settings.showQuickLinks || !e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      const num = Number(e.key);
      if (num >= 1 && num <= 8) {
        const target = this.settings.quickLinks[num - 1];
        if (target) {
          e.preventDefault();
          window.location.assign(target.url);
        }
      }
    });
  }
}
