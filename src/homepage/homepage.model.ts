import { Dish } from 'src/dishes/dish.model';

export interface homepageData {
  popularRestaurants: {
    restaurantId: string;
    restaurantImg: string;
    restaurantName: string;
    chefName: string;
    rating: number;
  }[];
  signatureDishes: Dish[];
  chefOfTheWeek: {
    name: string;
    imageSrc: string;
    description: string;
    restaurants: { restaurantImg: string; restaurantName: string }[];
  } | null;
}
