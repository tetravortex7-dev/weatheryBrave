import { type UserSettings } from '../../core/models/Settings';
import { createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

export interface ScratchpadHandlers {
  onUpdateContent(text: string): void;
  onClose(): void;
}

export class ScratchpadWidget {
  private readonly root: HTMLElement;
  private readonly textareaEl: HTMLTextAreaElement;
  private settings: UserSettings;

  constructor(
    initialSettings: UserSettings,
    private readonly handlers: ScratchpadHandlers
  ) {
    this.settings = initialSettings;

    const titleEl = createEl('span', {
      className: 'scratchpad__title',
      textContent: 'Quick Notes',
    });

    const closeBtn = createEl(
      'button',
      {
        className: 'icon-btn scratchpad__close',
        attrs: {
          type: 'button',
          title: 'Hide notes (can be restored in Settings)',
          'aria-label': 'Hide notes',
        },
      },
      [createUiIconSvg('close', 13)]
    );
    closeBtn.addEventListener('click', () => handlers.onClose());

    const header = createEl('div', { className: 'scratchpad__header' }, [
      titleEl,
      closeBtn,
    ]);

    this.textareaEl = createEl('textarea', {
      className: 'scratchpad__textarea',
      attrs: {
        placeholder: 'Write temporary notes, ideas, or to-do…',
        spellcheck: 'false',
      },
    }) as HTMLTextAreaElement;
    this.textareaEl.value = this.settings.scratchpadContent;

    this.textareaEl.addEventListener('input', () => {
      this.handlers.onUpdateContent(this.textareaEl.value);
    });

    this.root = createEl(
      'aside',
      {
        className: 'scratchpad',
        attrs: { 'aria-label': 'Quick Notes Scratchpad' },
      },
      [header, this.textareaEl]
    );

    this.updateSettings(this.settings);
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public updateSettings(settings: UserSettings): void {
    this.settings = settings;
    this.root.hidden = !this.settings.showScratchpad;
    if (this.textareaEl.value !== this.settings.scratchpadContent) {
      this.textareaEl.value = this.settings.scratchpadContent;
    }
  }
}
