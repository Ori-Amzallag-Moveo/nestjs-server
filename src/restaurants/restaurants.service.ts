import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Restaurant } from './restaurant.model';
import { getCurrentTime, isRestaurantOpen } from './helpers/restaurant.utils';
import { MealTime } from 'src/dishes/dish.model';
import { RestaurantParams } from './restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
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
      range,
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
      .populate('chef', 'name')
      .populate('dishes');

    const allRestaurants = await restaurantsQuery.exec();

    let filteredRestaurants = allRestaurants;
    if (range) {
      const [minPrice, maxPrice] = range.split(',').map(Number);
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

  async deleteRestaurant(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }
}
