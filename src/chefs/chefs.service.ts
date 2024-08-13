import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Chef } from './chefs.model';

@Injectable()
export class ChefsService {
  constructor(
    @InjectModel('Chef')
    private readonly chefModel: Model<Chef>,
  ) {}

  async getAllChefs(): Promise<Chef[]> {
    return this.chefModel
      .find()
      .populate('restaurants', 'name imageSrc')
      .exec();
  }

  async getNewChefs(): Promise<Chef[]> {
    const pipeline: PipelineStage[] = [
      { $match: { isNewChef: true } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      { $unwind: { path: '$restaurant', preserveNullAndEmptyArrays: true } },
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
          'restaurant.name': 1,
        },
      },
    ];
    return this.chefModel.aggregate(pipeline).exec();
  }

  async getMostViewedChefs(): Promise<Chef[]> {
    const pipeline: PipelineStage[] = [
      { $match: { isMostViewedChef: true } },
      {
        $lookup: {
          from: 'restaurants', // Assuming the collection name is 'restaurants'
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      { $unwind: { path: '$restaurant', preserveNullAndEmptyArrays: true } },
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
          'restaurant.name': 1,
        },
      },
    ];
    return this.chefModel.aggregate(pipeline).exec();
  }

  async getChefById(id: string): Promise<Chef | null> {
    return this.chefModel.findById(id).populate('restaurants').exec();
  }

  async createChef(data: Partial<Chef>): Promise<Chef> {
    const chef = new this.chefModel(data);
    return chef.save();
  }

  async updateChef(id: string, data: Partial<Chef>): Promise<Chef | null> {
    return this.chefModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('restaurants')
      .exec();
  }

  async deleteChef(id: string): Promise<Chef | null> {
    return this.chefModel.findByIdAndDelete(id).exec();
  }
}
