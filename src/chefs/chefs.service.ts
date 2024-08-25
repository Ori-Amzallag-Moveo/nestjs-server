import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chef } from './chefs.model';

@Injectable()
export class ChefsService {
  constructor(
    @InjectModel('Chef')
    private readonly chefModel: Model<Chef>,
  ) {}

  async getAllChefs(
    query: any,
    page: number = 1,
    limit: number = 10,
    isNewChef?: string,
    isMostViewedChef?: string,
  ): Promise<Chef[]> {
    const mongoQuery: any = { ...query };

    if (isNewChef === 'true') {
      mongoQuery.isNewChef = true;
    }

    if (isMostViewedChef === 'true') {
      mongoQuery.isMostViewedChef = true;
    }

    const skip = (page - 1) * limit;

    const chefsQuery = this.chefModel
      .find(mongoQuery)
      .populate('restaurants', 'name imageSrc')
      .limit(limit)
      .skip(skip);

    const chefs = await chefsQuery.exec();

    return chefs;
  }

  async getChefById(id: string): Promise<Chef | null> {
    return this.chefModel.findById(id).populate('restaurants').exec();
  }

  async getChefOfTheWeek(): Promise<Chef | null> {
    return this.chefModel
      .findOne({ isChefOfTheWeek: true })
      .populate('restaurants', 'name imageSrc')
      .exec();
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
