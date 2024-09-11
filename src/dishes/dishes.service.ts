import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

import { Dish } from './dish.model';
import { GlobalStatsService } from 'src/global-stats/global.stats.service';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel('Dish') private readonly dishModel: Model<Dish>,
    private readonly globalStatsService: GlobalStatsService,
  ) {}

  async getDishes(): Promise<Dish[]> {
    return this.dishModel.find().exec();
  }

  async getSignatureDishes(): Promise<Dish[]> {
    const pipeline: PipelineStage[] = [
      { $match: { isSignature: true } },
      {
        $project: {
          name: 1,
          slug: 1,
          imageSrc: 1,
          ingredients: 1,
          icons: 1,
          price: 1,
          isSignature: 1,
        },
      },
    ];
    return this.dishModel.aggregate(pipeline).exec();
  }

  async getDishById(id: string): Promise<Dish | null> {
    return this.dishModel.findById(id).exec();
  }

  async createDish(data: Partial<Dish>): Promise<Dish> {
    await this.globalStatsService.updateStats('totalDishes', 1);
    const dish = new this.dishModel(data);
    return dish.save();
  }

  async updateDish(id: string, data: Partial<Dish>): Promise<Dish | null> {
    return this.dishModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  async deleteDish(id: string): Promise<Dish | null> {
    return this.dishModel.findByIdAndDelete(id).exec();
  }
}
