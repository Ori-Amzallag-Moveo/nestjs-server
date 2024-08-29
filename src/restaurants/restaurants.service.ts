import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    } = queryParams;

    const mongoQuery: any = {};

    if (isPopular === 'true') {
      mongoQuery.rating = { $gte: 4 };
    }

    if (isNewRestaurant === 'true') {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 4);
      mongoQuery.dateOfEstablishment = { $gte: threeYearsAgo };
    }

    const skip = (page - 1) * limit;

    const restaurantsQuery = this.restaurantModel
      .find(mongoQuery)
      .populate('chef', 'name')
      .limit(limit)
      .skip(skip);

    const restaurants = await restaurantsQuery.exec();

    if (isOpenNow === 'true') {
      const currentTime = getCurrentTime();
      const openRestaurants = restaurants.filter((restaurant) =>
        isRestaurantOpen(restaurant, currentTime),
      );
      return openRestaurants;
    }
    return restaurants;
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
