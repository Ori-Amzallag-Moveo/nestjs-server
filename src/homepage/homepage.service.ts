import { Injectable } from '@nestjs/common';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { DishesService } from 'src/dishes/dishes.service';
import { ChefsService } from 'src/chefs/chefs.service';
import { homepageData } from './homepage.model';

@Injectable()
export class HomepageService {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly dishesService: DishesService,
    private readonly chefsService: ChefsService,
  ) {}

  async getHomepageData(): Promise<homepageData> {
    const popularRestaurants = await this.restaurantsService.getAllRestaurants(
      {},
      1,
      3,
      'true',
    );
    const signatureDishes = await this.dishesService.getSignatureDishes();
    const limitedSignatureDishes = signatureDishes.slice(0, 3);

    const chefOfTheWeek = await this.chefsService.getChefOfTheWeek();

    const formattedPopularRestaurants = popularRestaurants.map(
      (restaurant) => ({
        restaurantId: restaurant.id,
        restaurantImg: restaurant.imageSrc,
        restaurantName: restaurant.name,
        chefName: (restaurant.chef as any)?.name || 'Unknown',
        rating: restaurant.rating || 0,
      }),
    );

    const formattedChefOfTheWeek = chefOfTheWeek
      ? {
          name: chefOfTheWeek.name,
          imageSrc: chefOfTheWeek.imageSrc,
          description: chefOfTheWeek.description,
          restaurants: chefOfTheWeek.restaurants.map((restaurant) => ({
            restaurantImg: (restaurant as any).imageSrc,
            restaurantName: (restaurant as any).name,
          })),
        }
      : null;

    return {
      popularRestaurants: formattedPopularRestaurants,
      signatureDishes: limitedSignatureDishes,
      chefOfTheWeek: formattedChefOfTheWeek,
    };
  }
}
