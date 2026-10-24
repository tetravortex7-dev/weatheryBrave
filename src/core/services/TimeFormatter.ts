import { type AppLanguage, getI18n } from '../i18n';
import { type TimeFormat } from '../models/Settings';

export interface FormattedClock {
  readonly timeText: string;
  readonly periodText: string;
  readonly dateText: string;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatClock(
  date: Date,
  format: TimeFormat,
  showSeconds: boolean,
  lang: AppLanguage = 'auto'
): FormattedClock {
  const i18n = getI18n(lang);
  const rawHours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  let hoursText: string;
  let periodText = '';

  if (format === '12h') {
    const hour12 = rawHours % 12 || 12;
    hoursText = `${hour12}`;
    periodText = rawHours >= 12 ? 'PM' : 'AM';
  } else {
    hoursText = pad2(rawHours);
  }

  const timeText = showSeconds
    ? `${hoursText}:${minutes}:${seconds}`
    : `${hoursText}:${minutes}`;

  const weekday = i18n.weekdays[date.getDay()] ?? 'Day';
  const month = i18n.months[date.getMonth()] ?? 'Month';
  const dayOfMonth = date.getDate();

  return {
    timeText,
    periodText,
    dateText: `${weekday}, ${dayOfMonth} ${month}`,
  };
}

export function formatShortWeekday(isoDate: string, lang: AppLanguage = 'auto'): string {
  const i18n = getI18n(lang);
  const parts = isoDate.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return isoDate;
  }

  const localDate = new Date(year, month - 1, day);
  return i18n.shortWeekdays[localDate.getDay()] ?? isoDate;
}

export function formatRelativeAge(
  fetchedAtEpochMs: number,
  nowEpochMs: number,
  lang: AppLanguage = 'auto'
): string {
  const i18n = getI18n(lang);
  const diffMs = Math.max(0, nowEpochMs - fetchedAtEpochMs);
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return i18n.updatedJustNow;
  }
  if (diffMinutes < 60) {
    return i18n.updatedAgoMinutes(diffMinutes);
  }
  const diffHours = Math.floor(diffMinutes / 60);
  return i18n.updatedAgoHours(diffHours);
}

export function formatTimeInTimezone(
  date: Date,
  timeZone: string,
  format: TimeFormat
): string | null {
  if (!timeZone || timeZone === 'none') {
    return null;
  }
  try {
    const is12h = format === '12h';
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: is12h ? 'numeric' : '2-digit',
      minute: '2-digit',
      hour12: is12h,
    });
    return formatter.format(date);
  } catch {
    return null;
  }
}

export function formatIsoClockTime(
  isoDateTime: string,
  format: TimeFormat
): string {
  const timePart = isoDateTime.split('T')[1];
  if (!timePart) {
    return isoDateTime;
  }
  const [rawH, rawM] = timePart.split(':');
  const hours = Number(rawH);
  const minutes = Number(rawM);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return timePart;
  }

  const minStr = pad2(minutes);
  if (format === '12h') {
    const hour12 = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minStr} ${period}`;
  }
  return `${pad2(hours)}:${minStr}`;
}

