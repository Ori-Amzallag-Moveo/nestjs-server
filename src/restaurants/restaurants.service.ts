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

    const restaurants = await this.restaurantModel
      .find(mongoQuery)
      .populate('chef', 'name')
      .exec();

    if (isOpenNow === 'true') {
      const currentTime = getCurrentTime();

      const openRestaurants = restaurants.filter((restaurant) =>
        isRestaurantOpen(restaurant, currentTime),
      );

      return openRestaurants;
    }

    return restaurants;
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findById(id).exec();
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
