import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { GlobalStatsService } from 'src/global-stats/global.stats.service';
import { MealTime } from '../dishes/dish.model';
import { getCurrentTime, isRestaurantOpen } from './helpers/restaurant.utils';
import { Restaurant, RestaurantParams } from './restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
    private readonly globalStatsService: GlobalStatsService,
  ) {}

  async getAllRestaurants(
    queryParams: RestaurantParams,
  ): Promise<Restaurant[]> {
    const {
      page = 1,
      limit = 10,
      isPopular,
      isNewRestaurant,
      isOpenNow,
      rating,
      distance,
      priceRange,
    } = queryParams;

    const mongoQuery: FilterQuery<Restaurant> = {};

    if (rating) {
      const ratingsArray = rating.split(',').map(Number);
      mongoQuery.rating = { $in: ratingsArray };
    }

    if (isPopular === 'true') {
      mongoQuery.rating = { $gte: 4 };
    }

    if (isNewRestaurant === 'true') {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 4);
      mongoQuery.dateOfEstablishment = { $gte: threeYearsAgo };
    }

    if (distance) {
      const distanceInMeters = Number(distance) * 1000;
      mongoQuery.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [34.7818, 32.0853],
          },
          $maxDistance: distanceInMeters,
        },
      };
    }

    const restaurantsQuery = this.restaurantModel
      .find(mongoQuery)
      .populate('chef', 'name') // filter all and then paginate and then populate.
      .populate('dishes');

    const allRestaurants = await restaurantsQuery.exec();

    let filteredRestaurants = allRestaurants;
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split(',').map(Number);
      filteredRestaurants = allRestaurants.filter((restaurant) => {
        return restaurant.dishes.every(
          (dish: any) => dish.price >= minPrice && dish.price <= maxPrice,
        );
      });
    }

    const skip = (page - 1) * limit;
    const paginatedRestaurants = filteredRestaurants.slice(skip, skip + limit);

    if (isOpenNow === 'true') {
      const currentTime = getCurrentTime();
      const openRestaurants = paginatedRestaurants.filter((restaurant) =>
        isRestaurantOpen(restaurant, currentTime),
      );
      return openRestaurants;
    }

    return paginatedRestaurants;
  }

  async getRestaurantById(id: string, meal?: string): Promise<Restaurant> {
    let mealFilter: number = null;
    switch (meal) {
      case 'breakfast':
        mealFilter = MealTime.Breakfast;
        break;
      case 'lunch':
        mealFilter = MealTime.Lunch;
        break;
      case 'dinner':
        mealFilter = MealTime.Dinner;
        break;
      default:
        mealFilter = null;
        break;
    }

    const matchCondition = mealFilter !== null ? { meals: mealFilter } : {};

    return this.restaurantModel
      .findById(id)
      .populate({
        path: 'dishes',
        match: matchCondition,
      })
      .populate({
        path: 'chef',
        select: 'name',
      })
      .exec();
  }

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    await this.globalStatsService.updateStats('totalRestaurants', 1);
    const restaurant = new this.restaurantModel(data);
    return restaurant.save();
  }

  async updateRestaurant(
    id: string,
    data: Partial<Restaurant>,
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  async increaseClicks(id: string): Promise<Restaurant> {
    try {
      const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
        id,
        { $inc: { clicks: 1 } },
        { new: true },
      );

      if (!updatedRestaurant) {
        throw new NotFoundException('Restaurant not found');
      }
      await this.globalStatsService.updateStats('totalClicks', 1);
      return updatedRestaurant;
    } catch (error) {
      throw new Error(`Failed to update clicks: ${error.message}`);
    }
  }
}
