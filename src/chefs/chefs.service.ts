import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Chef, ChefParams } from './chefs.model';
import { GlobalStatsService } from 'src/global-stats/global.stats.service';

@Injectable()
export class ChefsService {
  constructor(
    @InjectModel('Chef')
    private readonly chefModel: Model<Chef>,
    private readonly globalStatsService: GlobalStatsService,
  ) {}

  async getAllChefs(queryParams: ChefParams): Promise<Chef[]> {
    const { page = 1, limit = 10, isNewChef, isMostViewedChef } = queryParams;

    const mongoQuery: FilterQuery<Chef> = {};

    if (isNewChef === 'true') {
      mongoQuery.age = { $lte: 35 };
    }

    if (isMostViewedChef === 'true') {
      const chefsWithRestaurants = await this.chefModel
        .find()
        .populate('restaurants', 'clicks')
        .exec();

      // Gather all restaurant clicks for statistical analysis
      const clicksData = chefsWithRestaurants.flatMap((chef) =>
        chef.restaurants.map((restaurant: any) => restaurant.clicks),
      );

      if (clicksData.length === 0) {
        return [];
      }

      // Calculate the mean and standard deviation of restaurant clicks
      const meanClicks =
        clicksData.reduce((a, b) => a + b, 0) / clicksData.length;
      const stdDevClicks = Math.sqrt(
        clicksData.reduce(
          (sum, clicks) => sum + Math.pow(clicks - meanClicks, 2),
          0,
        ) / clicksData.length,
      );

      const mostViewedChefs = chefsWithRestaurants.filter((chef) => {
        const chefTotalClicks = chef.restaurants.reduce(
          (sum: number, restaurant: any) => sum + restaurant.clicks,
          0,
        );

        const zScore = (chefTotalClicks - meanClicks) / stdDevClicks;
        return zScore >= 0;
      });

      const skip = (page - 1) * limit;
      return mostViewedChefs.slice(skip, skip + limit);
    }

    const skip = (page - 1) * limit;
    const chefsQuery = this.chefModel
      .find(mongoQuery)
      .populate('restaurants', 'name imageSrc clicks')
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
      .populate('restaurants', 'id name imageSrc')
      .exec();
  }

  async createChef(data: Partial<Chef>): Promise<Chef> {
    await this.globalStatsService.updateStats('totalChefs', 1);
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
