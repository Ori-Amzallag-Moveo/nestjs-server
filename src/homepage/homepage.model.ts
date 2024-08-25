import { Dish } from 'src/dishes/dish.model';

export interface homepageData {
  popularRestaurants: Array<{
    restaurantImg: string;
    restaurantName: string;
    chefName: string;
    rating: number;
  }>;
  signatureDishes: Dish[];
  chefOfTheWeek: {
    name: string;
    imageSrc: string;
    description: string;
    restaurants: Array<{ restaurantImg: string; restaurantName: string }>;
  } | null;
}
