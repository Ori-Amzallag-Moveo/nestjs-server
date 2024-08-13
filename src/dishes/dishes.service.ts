import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Dish } from './dish.model';

@Injectable()
export class DishesService {
  constructor(@InjectModel('Dish') private readonly dishModel: Model<Dish>) {}

  async getAllDishes(): Promise<Dish[]> {
    return this.dishModel.find().populate('restaurants').exec();
  }

  async getSignatureDishes(): Promise<Dish[]> {
    const pipeline: PipelineStage[] = [
      { $match: { isSignature: true } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurants',
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
          ingredients: 1,
          icons: 1,
          price: 1,
          isSignature: 1,
          'restaurant.name': 1,
        },
      },
    ];
    return this.dishModel.aggregate(pipeline).exec();
  }

  async getDishById(id: string): Promise<Dish | null> {
    return this.dishModel.findById(id).populate('restaurants').exec();
  }

  async createDish(data: Partial<Dish>): Promise<Dish> {
    const dish = new this.dishModel(data);
    return dish.save();
  }

  async updateDish(id: string, data: Partial<Dish>): Promise<Dish | null> {
    return this.dishModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('restaurants')
      .exec();
  }

  async deleteDish(id: string): Promise<Dish | null> {
    return this.dishModel.findByIdAndDelete(id).exec();
  }
}
