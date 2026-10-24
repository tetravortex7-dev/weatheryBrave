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
  private draggedIndex: number | null = null;

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
    }) as HTMLInputElement;

    this.urlInputEl = createEl('input', {
      className: 'quick-links__input quick-links__input--url',
      attrs: {
        type: 'text',
        placeholder: 'URL (e.g. github.com)',
        autocomplete: 'off',
      },
    }) as HTMLInputElement;

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
    ) as HTMLFormElement;

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

  private clearDropIndicators(): void {
    const pills = this.listEl.querySelectorAll('.quick-pin');
    for (const p of Array.from(pills)) {
      p.classList.remove(
        'quick-pin--dragging',
        'quick-pin--drop-before',
        'quick-pin--drop-after'
      );
    }
  }

  private moveLink(fromIdx: number, toIdx: number): void {
    if (fromIdx === toIdx) return;
    const items = [...this.settings.quickLinks];
    const [moved] = items.splice(fromIdx, 1);
    if (!moved) return;
    items.splice(toIdx, 0, moved);
    this.onUpdateLinks(items);
  }

  private render(): void {
    this.root.hidden = !this.settings.showQuickLinks;
    clearChildren(this.listEl);

    const isNewTab = this.settings.linkTarget === 'new-tab';

    for (const [idx, item] of this.settings.quickLinks.entries()) {
      const badge = createEl('span', {
        className: 'quick-pin__monogram',
        textContent: extractMonogram(item.title, item.url),
      });

      const label = createEl('span', {
        className: 'quick-pin__label',
        textContent: item.title,
      });

      const anchorAttrs: Record<string, string> = {
        href: item.url,
        title: `${item.title} (Alt+${idx + 1})`,
      };
      if (isNewTab) {
        anchorAttrs['target'] = '_blank';
        anchorAttrs['rel'] = 'noopener noreferrer';
      }

      const anchor = createEl(
        'a',
        {
          className: 'quick-pin__link',
          attrs: anchorAttrs,
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

      const pill = createEl(
        'div',
        {
          className: 'quick-pin',
          attrs: { draggable: 'true' },
        },
        [anchor, removeBtn]
      );

      pill.addEventListener('dragstart', (e) => {
        this.draggedIndex = idx;
        pill.classList.add('quick-pin--dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', `${idx}`);
        }
      });

      pill.addEventListener('dragend', () => {
        this.draggedIndex = null;
        this.clearDropIndicators();
      });

      pill.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (this.draggedIndex === null || this.draggedIndex === idx) {
          return;
        }
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
        this.clearDropIndicators();
        if (this.draggedIndex < idx) {
          pill.classList.add('quick-pin--drop-after');
        } else {
          pill.classList.add('quick-pin--drop-before');
        }
      });

      pill.addEventListener('dragleave', () => {
        pill.classList.remove('quick-pin--drop-before', 'quick-pin--drop-after');
      });

      pill.addEventListener('drop', (e) => {
        e.preventDefault();
        this.clearDropIndicators();
        if (this.draggedIndex !== null && this.draggedIndex !== idx) {
          this.moveLink(this.draggedIndex, idx);
        }
      });

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
      if (num >= 1 && num <= 9) {
        const target = this.settings.quickLinks[num - 1];
        if (target) {
          e.preventDefault();
          if (this.settings.linkTarget === 'new-tab') {
            window.open(target.url, '_blank', 'noopener,noreferrer');
          } else {
            window.location.assign(target.url);
          }
        }
      }
    });
  }
}
