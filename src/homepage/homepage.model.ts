import { Dish } from 'src/dishes/dish.model';

export interface PopularRestaurant {
  restaurantId: string;
  restaurantImg: string;
  restaurantName: string;
  chefName: string;
  rating: number;
}

export interface ChefOfTheWeek {
  name: string;
  imageSrc: string;
  description: string;
  restaurants: { restaurantImg: string; restaurantName: string }[] | null;
}

export interface homepageData {
  popularRestaurants: PopularRestaurant[];
  signatureDishes: Dish[];
  chefOfTheWeek: ChefOfTheWeek;
}

export interface HomepageReturnType {
  success: boolean;
  data: homepageData;
}
