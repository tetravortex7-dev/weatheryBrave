import { type TimeFormat } from '../models/Settings';

export interface FormattedClock {
  readonly timeText: string;
  readonly periodText: string;
  readonly dateText: string;
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatClock(
  date: Date,
  format: TimeFormat,
  showSeconds: boolean
): FormattedClock {
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

  const weekday = WEEKDAYS[date.getDay()] ?? 'Day';
  const month = MONTHS[date.getMonth()] ?? 'Month';
  const dayOfMonth = date.getDate();

  return {
    timeText,
    periodText,
    dateText: `${weekday}, ${month} ${dayOfMonth}`,
  };
}

export function formatShortWeekday(isoDate: string): string {
  const parts = isoDate.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return isoDate;
  }

  const localDate = new Date(year, month - 1, day);
  return SHORT_WEEKDAYS[localDate.getDay()] ?? isoDate;
}

export function formatRelativeAge(
  fetchedAtEpochMs: number,
  nowEpochMs: number
): string {
  const diffMs = Math.max(0, nowEpochMs - fetchedAtEpochMs);
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return 'Updated just now';
  }
  if (diffMinutes < 60) {
    return `Updated ${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  return `Updated ${diffHours}h ago`;
}
