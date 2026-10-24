import { type UserSettings } from '../../core/models/Settings';
import {
  buildWallpaperPool,
  pickNextWallpaperFromPool,
  type BraveWallpaper,
} from '../../core/models/Wallpaper';
import { extractDominantColor } from '../../core/services/ColorExtractor';
import { clearChildren, createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

const LAST_WALLPAPER_KEY = 'wb_wallpaper_idx';

export interface WallpaperControllerHandlers {
  onToggleLock(locked: boolean): void;
}

export class WallpaperController {
  private readonly bgLayerEl: HTMLElement;
  private readonly creditBarEl: HTMLElement;
  private readonly creditPrefixEl: HTMLElement;
  private readonly creditLinkEl: HTMLAnchorElement;
  private readonly lockBtn: HTMLButtonElement;
  private readonly nextBtn: HTMLButtonElement;
  private currentIndex: number;
  private settings: UserSettings;
  private customWallpapers: readonly BraveWallpaper[] = [];

  constructor(
    initialSettings: UserSettings,
    private readonly handlers: WallpaperControllerHandlers
  ) {
    this.settings = initialSettings;
    const initialPool = buildWallpaperPool(
      this.settings.wallpaperSource,
      this.customWallpapers
    );
    this.currentIndex = this.loadOrAdvanceIndex(initialPool);

    this.bgLayerEl = createEl('div', {
      className: 'wallpaper-layer',
      attrs: { 'aria-hidden': 'true' },
    });

    this.creditPrefixEl = createEl('span', {
      className: 'wallpaper-credit__prefix',
      textContent: 'Photo by ',
    });

    this.creditLinkEl = createEl('a', {
      className: 'wallpaper-credit__link',
      attrs: {
        href: '#',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }) as HTMLAnchorElement;

    this.lockBtn = createEl(
      'button',
      {
        className: 'wallpaper-credit__btn wallpaper-credit__btn--lock',
        attrs: {
          type: 'button',
          title: this.settings.lockWallpaper
            ? 'Wallpaper locked (Click to unlock)'
            : 'Lock this wallpaper',
          'aria-label': 'Lock wallpaper',
        },
      },
      [createUiIconSvg(this.settings.lockWallpaper ? 'lock' : 'unlock', 13)]
    ) as HTMLButtonElement;
    this.lockBtn.addEventListener('click', () => {
      const nextLocked = !this.settings.lockWallpaper;
      this.handlers.onToggleLock(nextLocked);
    });

    this.nextBtn = createEl(
      'button',
      {
        className: 'wallpaper-credit__btn wallpaper-credit__btn--next',
        attrs: {
          type: 'button',
          title: 'Next wallpaper',
          'aria-label': 'Next wallpaper',
        },
      },
      [createUiIconSvg('refresh', 13)]
    ) as HTMLButtonElement;
    this.nextBtn.addEventListener('click', () => this.cycleNext());

    this.creditBarEl = createEl('footer', { className: 'wallpaper-credit' }, [
      this.creditPrefixEl,
      this.creditLinkEl,
      this.lockBtn,
      this.nextBtn,
    ]);

    this.applyCurrent();
  }

  public getBackgroundElement(): HTMLElement {
    return this.bgLayerEl;
  }

  public getCreditElement(): HTMLElement {
    return this.creditBarEl;
  }

  public updateSettings(settings: UserSettings): void {
    this.settings = settings;
    clearChildren(this.lockBtn);
    this.lockBtn.appendChild(
      createUiIconSvg(this.settings.lockWallpaper ? 'lock' : 'unlock', 13)
    );
    this.lockBtn.classList.toggle(
      'wallpaper-credit__btn--active',
      this.settings.lockWallpaper
    );
    this.lockBtn.setAttribute(
      'title',
      this.settings.lockWallpaper
        ? 'Wallpaper locked (Click to unlock)'
        : 'Lock this wallpaper'
    );
    this.applyCurrent();
  }

  public setCustomWallpapers(
    customWallpapers: readonly BraveWallpaper[],
    selectNewest: boolean = false
  ): void {
    this.customWallpapers = customWallpapers;
    if (selectNewest && customWallpapers.length > 0) {
      this.currentIndex = 0;
      this.saveIndex(this.currentIndex);
    }
    this.applyCurrent();
  }

  public cycleNext(): void {
    const pool = this.getActivePool();
    const next = pickNextWallpaperFromPool(pool, this.currentIndex);
    this.currentIndex = next.index;
    this.saveIndex(this.currentIndex);
    this.applyCurrent();
  }

  private getActivePool(): readonly BraveWallpaper[] {
    return buildWallpaperPool(
      this.settings.wallpaperSource,
      this.customWallpapers
    );
  }

  private loadOrAdvanceIndex(pool: readonly BraveWallpaper[]): number {
    try {
      const raw = window.localStorage.getItem(LAST_WALLPAPER_KEY);
      const prev = raw !== null ? Number(raw) : undefined;
      const validPrev = Number.isFinite(prev) ? (prev as number) : undefined;

      if (this.settings.lockWallpaper && validPrev !== undefined) {
        return validPrev;
      }

      const picked = pickNextWallpaperFromPool(pool, validPrev);
      this.saveIndex(picked.index);
      return picked.index;
    } catch {
      return 0;
    }
  }

  private saveIndex(index: number): void {
    try {
      window.localStorage.setItem(LAST_WALLPAPER_KEY, `${index}`);
    } catch {
    }
  }

  private applyCurrent(): void {
    const pool = this.getActivePool();
    const hasValidWallpaper = this.settings.showWallpaper && pool.length > 0;

    document.body.classList.toggle('has-wallpaper', hasValidWallpaper);
    this.bgLayerEl.hidden = !hasValidWallpaper;
    this.creditBarEl.hidden = !hasValidWallpaper;

    if (!hasValidWallpaper) {
      document.documentElement.style.removeProperty('--accent-primary');
      document.documentElement.style.removeProperty('--accent-glow');
      return;
    }

    const safeIndex = Math.abs(this.currentIndex) % pool.length;
    const wp = pool[safeIndex] ?? pool[0];
    if (!wp) {
      return;
    }

    const dimAlpha = (this.settings.wallpaperDim / 100).toFixed(2);
    const blurPx = `${this.settings.wallpaperBlur}px`;
    this.bgLayerEl.style.setProperty('--wp-dim-alpha', dimAlpha);
    this.bgLayerEl.style.setProperty('--wp-blur', blurPx);

    this.bgLayerEl.style.backgroundImage = `url("${wp.filename}")`;

    const imgFallbackCheck = new Image();
    imgFallbackCheck.src = wp.filename;
    imgFallbackCheck.onerror = () => {
      const fallbackWp = pool[0];
      if (fallbackWp && fallbackWp.filename !== wp.filename) {
        this.bgLayerEl.style.backgroundImage = `url("${fallbackWp.filename}")`;
      }
    };
    if (wp.isCustom) {
      this.creditPrefixEl.textContent = 'Custom · ';
      this.creditLinkEl.textContent = wp.author;
      this.creditLinkEl.removeAttribute('href');
    } else {
      this.creditPrefixEl.textContent = 'Photo by ';
      this.creditLinkEl.textContent = wp.author;
      this.creditLinkEl.href = wp.creditUrl;
    }

    if (this.settings.adaptiveAccent) {
      void extractDominantColor(wp.filename).then((color) => {
        if (color && this.settings.adaptiveAccent) {
          document.documentElement.style.setProperty('--accent-primary', color);
          document.documentElement.style.setProperty(
            '--accent-glow',
            color.replace('rgb(', 'rgba(').replace(')', ', 0.35)')
          );
        } else {
          document.documentElement.style.removeProperty('--accent-primary');
          document.documentElement.style.removeProperty('--accent-glow');
        }
      });
    } else {
      document.documentElement.style.removeProperty('--accent-primary');
      document.documentElement.style.removeProperty('--accent-glow');
    }
  }
}
