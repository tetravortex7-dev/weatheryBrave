import { type AppLanguage, getI18n } from '../i18n';

export function getGreetingText(
  date: Date,
  customName: string,
  lang: AppLanguage = 'auto'
): string {
  const i18n = getI18n(lang);
  const hour = date.getHours();
  let salutation: string;

  if (hour >= 5 && hour < 12) {
    salutation = i18n.goodMorning;
  } else if (hour >= 12 && hour < 18) {
    salutation = i18n.goodAfternoon;
  } else if (hour >= 18 && hour < 23) {
    salutation = i18n.goodEvening;
  } else {
    salutation = i18n.goodNight;
  }

  const trimmedName = customName.trim();
  return trimmedName.length > 0 ? `${salutation}, ${trimmedName}` : salutation;
}
