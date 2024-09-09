import { Injectable } from '@nestjs/common';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { DishesService } from 'src/dishes/dishes.service';
import { ChefsService } from 'src/chefs/chefs.service';
import { homepageData } from './homepage.model';
import { Chef } from 'src/chefs/chefs.model';
import { Restaurant } from 'src/restaurants/restaurant.model';
@Injectable()
export class HomepageService {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly dishesService: DishesService,
    private readonly chefsService: ChefsService,
  ) {}

  async getHomepageData(): Promise<homepageData> {
    const popularRestaurants = await this.restaurantsService.getAllRestaurants({
      page: 1,
      limit: 3,
      isPopular: 'true',
    });
    const signatureDishes = await this.dishesService.getSignatureDishes();
    const limitedSignatureDishes = signatureDishes.slice(0, 3);
    const chefOfTheWeek = await this.chefsService.getChefOfTheWeek();

    const formattedPopularRestaurants = popularRestaurants.map(
      (restaurant) => ({
        restaurantId: restaurant.id,
        restaurantImg: restaurant.imageSrc,
        restaurantName: restaurant.name,
        chefName: (restaurant.chef as unknown as Chef)?.name,
        rating: restaurant.rating || 0,
      }),
    );

    const formattedChefOfTheWeek = chefOfTheWeek
      ? {
          name: chefOfTheWeek.name,
          imageSrc: chefOfTheWeek.imageSrc,
          description: chefOfTheWeek.description,
          restaurants: chefOfTheWeek.restaurants.map((restaurant) => ({
            restaurantId: (restaurant as unknown as Restaurant).id,
            restaurantImg: (restaurant as unknown as Restaurant).imageSrc,
            restaurantName: (restaurant as unknown as Restaurant).name,
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
