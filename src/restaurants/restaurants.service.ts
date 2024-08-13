import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Restaurant } from './restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async getAllRestaurants(query: any): Promise<Restaurant[]> {
    const filter = {};
    if (query.isPopular === 'true') {
      filter['rating'] = { $gte: 4 };
    }
    return this.restaurantModel.find(filter).populate('chef', 'name').exec();
  }

  async getPopularRestaurants(): Promise<Restaurant[]> {
    const pipeline: PipelineStage[] = [
      { $match: { rating: { $gte: 4 } } },
      {
        $lookup: {
          from: 'chefs',
          localField: 'chef',
          foreignField: '_id',
          as: 'chef',
        },
      },
      { $unwind: { path: '$chef', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          slug: 1,
          imageSrc: 1,
          rating: 1,
          isPopular: 1,
          isNewRestaurant: 1,
          isOpenNow: 1,
          location: 1,
          'chef.name': 1,
        },
      },
    ];
    return this.restaurantModel.aggregate(pipeline).exec();
  }

  async getNewRestaurants(): Promise<Restaurant[]> {
    const pipeline: PipelineStage[] = [
      { $match: { isNewRestaurant: true } },
      {
        $lookup: {
          from: 'chefs',
          localField: 'chef',
          foreignField: '_id',
          as: 'chef',
        },
      },
      { $unwind: { path: '$chef', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          slug: 1,
          imageSrc: 1,
          rating: 1,
          isPopular: 1,
          isNewRestaurant: 1,
          isOpenNow: 1,
          location: 1,
          'chef.name': 1,
        },
      },
    ];
    return this.restaurantModel.aggregate(pipeline).exec();
  }

  async getOpenRestaurants(): Promise<Restaurant[]> {
    const pipeline: PipelineStage[] = [
      { $match: { isOpenNow: true } },
      {
        $lookup: {
          from: 'chefs',
          localField: 'chef',
          foreignField: '_id',
          as: 'chef',
        },
      },
      { $unwind: { path: '$chef', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          slug: 1,
          imageSrc: 1,
          rating: 1,
          isPopular: 1,
          isNewRestaurant: 1,
          isOpenNow: 1,
          location: 1,
          'chef.name': 1,
        },
      },
    ];
    return this.restaurantModel.aggregate(pipeline).exec();
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
