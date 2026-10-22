import { type UserSettings } from '../../core/models/Settings';
import { type IClock } from '../../core/ports/IClock';
import { getGreetingText } from '../../core/services/GreetingService';
import { formatClock } from '../../core/services/TimeFormatter';
import { createEl } from '../dom/domHelpers';

export class ClockWidget {
  private readonly root: HTMLElement;
  private readonly timeEl: HTMLElement;
  private readonly periodEl: HTMLElement;
  private readonly dateEl: HTMLElement;
  private readonly greetingEl: HTMLElement;
  private timerId: number | null = null;
  private settings: UserSettings;

  constructor(
    private readonly clock: IClock,
    initialSettings: UserSettings
  ) {
    this.settings = initialSettings;

    this.timeEl = createEl('span', { className: 'clock-widget__time' });
    this.periodEl = createEl('span', { className: 'clock-widget__period' });

    const timeRow = createEl('div', { className: 'clock-widget__time-row' }, [
      this.timeEl,
      this.periodEl,
    ]);

    this.dateEl = createEl('p', { className: 'clock-widget__date' });
    this.greetingEl = createEl('p', { className: 'clock-widget__greeting' });

    this.root = createEl(
      'section',
      {
        className: 'clock-widget',
        attrs: { 'aria-label': 'Current Time and Date' },
      },
      [timeRow, this.dateEl, this.greetingEl]
    );

    this.renderNow();
    this.scheduleNextTick();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopTimer();
      } else {
        this.renderNow();
        this.scheduleNextTick();
      }
    });
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public updateSettings(settings: UserSettings): void {
    this.settings = settings;
    this.renderNow();
    this.scheduleNextTick();
  }

  private renderNow(): void {
    const now = this.clock.now();
    const formatted = formatClock(
      now,
      this.settings.timeFormat,
      this.settings.showSeconds
    );

    this.timeEl.textContent = formatted.timeText;
    this.periodEl.textContent = formatted.periodText;
    this.periodEl.hidden = formatted.periodText.length === 0;
    this.dateEl.textContent = formatted.dateText;

    if (this.settings.showGreeting) {
      this.greetingEl.hidden = false;
      this.greetingEl.textContent = getGreetingText(
        now,
        this.settings.customName
      );
    } else {
      this.greetingEl.hidden = true;
    }
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextTick(): void {
    this.stopTimer();
    const now = this.clock.now();
    const msIntoSecond = now.getMilliseconds();
    const delayMs = this.settings.showSeconds
      ? 1000 - msIntoSecond
      : (60 - now.getSeconds()) * 1000 - msIntoSecond;

    this.timerId = window.setTimeout(() => {
      this.renderNow();
      this.scheduleNextTick();
    }, Math.max(50, delayMs));
  }
}
