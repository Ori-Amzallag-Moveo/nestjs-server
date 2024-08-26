import { Restaurant } from '../restaurant.model';

export function getCurrentTime(): string {
  const now = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Jerusalem',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return now;
}

export function isRestaurantOpen(
  restaurant: Restaurant,
  currentTime: string,
): boolean {
  const [openingTime, closingTime] = restaurant.openingHours;
  const todayDate = new Date().toISOString().split('T')[0];
  const currentDateTime = new Date(`${todayDate}T${currentTime}`);
  const openingDateTime = new Date(`${todayDate}T${openingTime}`);
  const closingDateTime = new Date(`${todayDate}T${closingTime}`);

  if (closingDateTime <= openingDateTime) {
    closingDateTime.setDate(closingDateTime.getDate() + 1);
  }

  return (
    currentDateTime >= openingDateTime && currentDateTime <= closingDateTime
  );
}
