import { Restaurant } from '../restaurant.model';

export function getCurrentTime(): string {
  const now = new Date();
  return now.toTimeString().split(' ')[0].slice(0, 5);
}

export function isRestaurantOpen(
  restaurant: Restaurant,
  currentTime: string,
): boolean {
  const [openingTime, closingTime] = restaurant.openingHours;
  const isOpen: boolean =
    currentTime >= openingTime && currentTime <= closingTime;
  return isOpen;
}
