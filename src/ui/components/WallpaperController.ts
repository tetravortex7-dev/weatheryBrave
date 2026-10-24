import { type UserSettings } from '../../core/models/Settings';
import {
  buildWallpaperPool,
  pickNextWallpaperFromPool,
  type BraveWallpaper,
} from '../../core/models/Wallpaper';
import { createEl } from '../dom/domHelpers';
import { createUiIconSvg } from '../dom/svgIcons';

const LAST_WALLPAPER_KEY = 'wb_wallpaper_idx';

export class WallpaperController {
  private readonly bgLayerEl: HTMLElement;
  private readonly creditBarEl: HTMLElement;
  private readonly creditPrefixEl: HTMLElement;
  private readonly creditLinkEl: HTMLAnchorElement;
  private currentIndex: number;
  private settings: UserSettings;
  private customWallpapers: readonly BraveWallpaper[] = [];

  constructor(initialSettings: UserSettings) {
    this.settings = initialSettings;
    this.currentIndex = this.loadAndAdvanceIndex(
      buildWallpaperPool(this.settings.wallpaperSource, this.customWallpapers)
    );

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
    });

    const nextBtn = createEl(
      'button',
      {
        className: 'wallpaper-credit__next',
        attrs: {
          type: 'button',
          title: 'Next wallpaper',
          'aria-label': 'Next wallpaper',
        },
      },
      [createUiIconSvg('refresh', 13)]
    );
    nextBtn.addEventListener('click', () => this.cycleNext());

    this.creditBarEl = createEl('footer', { className: 'wallpaper-credit' }, [
      this.creditPrefixEl,
      this.creditLinkEl,
      nextBtn,
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
    this.applyCurrent();
  }

  public setCustomWallpapers(
    customWallpapers: readonly BraveWallpaper[],
    selectNewest: boolean = false
  ): void {
    this.customWallpapers = customWallpapers;
    if (selectNewest && customWallpapers.length > 0) {
      // Newly added custom wallpapers sit at the start of the pool
      this.currentIndex = Math.max(0, customWallpapers.length - 1);
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

  private loadAndAdvanceIndex(pool: readonly BraveWallpaper[]): number {
    try {
      const raw = window.localStorage.getItem(LAST_WALLPAPER_KEY);
      const prev = raw !== null ? Number(raw) : undefined;
      const picked = pickNextWallpaperFromPool(
        pool,
        Number.isFinite(prev) ? prev : undefined
      );
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
      // Ignore storage errors
    }
  }

  private applyCurrent(): void {
    const pool = this.getActivePool();
    const hasValidWallpaper = this.settings.showWallpaper && pool.length > 0;

    document.body.classList.toggle('has-wallpaper', hasValidWallpaper);
    this.bgLayerEl.hidden = !hasValidWallpaper;
    this.creditBarEl.hidden = !hasValidWallpaper;

    if (!hasValidWallpaper) {
      return;
    }

    const safeIndex = this.currentIndex % pool.length;
    const wp = pool[safeIndex] ?? pool[0];
    if (!wp) {
      return;
    }

    this.bgLayerEl.style.backgroundImage = `url("${wp.filename}")`;
    if (wp.isCustom) {
      this.creditPrefixEl.textContent = 'Custom · ';
      this.creditLinkEl.textContent = wp.author;
      this.creditLinkEl.removeAttribute('href');
    } else {
      this.creditPrefixEl.textContent = 'Photo by ';
      this.creditLinkEl.textContent = wp.author;
      this.creditLinkEl.href = wp.creditUrl;
    }
  }
}
