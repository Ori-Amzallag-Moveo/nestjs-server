import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './restaurant.model';
import { getCurrentTime, isRestaurantOpen } from './helpers/restaurant.utils';
@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async getAllRestaurants(
    query: any,
    page: number = 1,
    limit: number = 10,
    isPopular?: string,
    isOpenNow?: string,
    isNewRestaurant?: string,
  ): Promise<Restaurant[]> {
    const mongoQuery: any = { ...query };

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

  async getRestaurantById(
    id: string,
    meal?: string,
  ): Promise<Restaurant | null> {
    let mealFilter: number | null = null;

    if (meal === 'breakfast') mealFilter = 1;
    if (meal === 'lunch') mealFilter = 2;
    if (meal === 'dinner') mealFilter = 3;

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
