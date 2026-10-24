import { createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

export class ZenModeController {
  private isZenMode = false;
  private readonly hintPill: HTMLElement;

  constructor(private readonly appRoot: HTMLElement) {
    this.hintPill = createEl(
      'button',
      {
        className: 'zen-exit-pill',
        attrs: {
          type: 'button',
          title: 'Exit Zen mode (or press Z / Esc)',
          'aria-label': 'Exit Zen mode',
        },
      },
      [
        createUiIconSvg('eye', 14),
        createEl('span', { textContent: 'Exit Zen (Press Z)' }),
      ]
    );
    this.hintPill.hidden = true;
    this.hintPill.addEventListener('click', () => this.toggle(false));
    this.bindEvents();
  }

  public getHintPill(): HTMLElement {
    return this.hintPill;
  }

  public toggle(forced?: boolean): void {
    this.isZenMode = typeof forced === 'boolean' ? forced : !this.isZenMode;
    document.body.classList.toggle('zen-mode', this.isZenMode);
    this.hintPill.hidden = !this.isZenMode;
  }

  private bindEvents(): void {
    document.addEventListener('dblclick', (e) => {
      if (
        e.target === document.body ||
        e.target === this.appRoot ||
        (e.target as HTMLElement)?.classList.contains('wallpaper-layer')
      ) {
        this.toggle();
      }
    });

    document.addEventListener('keydown', (e) => {
      const isZKey =
        e.code === 'KeyZ' ||
        e.key === 'z' ||
        e.key === 'Z' ||
        e.key === 'я' ||
        e.key === 'Я';

      if (isZKey) {
        const active = document.activeElement;
        const isInput =
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active instanceof HTMLElement && active.isContentEditable);
        if (!isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this.toggle();
        }
      } else if (this.isZenMode && e.key === 'Escape') {
        this.toggle(false);
      }
    });
  }
}
