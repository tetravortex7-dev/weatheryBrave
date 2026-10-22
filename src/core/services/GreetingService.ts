export function getGreetingText(date: Date, customName: string): string {
  const hour = date.getHours();
  let salutation: string;

  if (hour >= 5 && hour < 12) {
    salutation = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    salutation = 'Good afternoon';
  } else if (hour >= 18 && hour < 23) {
    salutation = 'Good evening';
  } else {
    salutation = 'Good night';
  }

  const trimmedName = customName.trim();
  return trimmedName.length > 0 ? `${salutation}, ${trimmedName}` : salutation;
}
