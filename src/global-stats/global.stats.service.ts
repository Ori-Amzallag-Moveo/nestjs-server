import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GlobalStats, GlobalStatsReturnType } from './global.stats.model';

@Injectable()
export class GlobalStatsService {
  constructor(
    @InjectModel('GlobalStats')
    private readonly globalStatsModel: Model<GlobalStats>,
  ) {}

  async getAllStats(): Promise<GlobalStatsReturnType | null> {
    try {
      const stats = await this.globalStatsModel.findOne().exec();
      if (!stats) {
        const defaultStats = new this.globalStatsModel({
          totalClicks: 0,
          totalRestaurants: 0,
          totalChefs: 0,
          totalDishes: 0,
          totalUsers: 0,
        });
        return await defaultStats.save();
      }
      return stats;
    } catch (error) {
      throw new Error('Error fetching global stats');
    }
  }

  async updateStats(
    statField: string,
    incrementValue: number,
  ): Promise<GlobalStatsReturnType> {
    try {
      const updatedStats = await this.globalStatsModel
        .findOneAndUpdate(
          {},
          { $inc: { [statField]: incrementValue } },
          { new: true, upsert: true },
        )
        .exec();

      if (!updatedStats) {
        throw new Error('Global stats not found');
      }

      return updatedStats;
    } catch (error) {
      throw new Error(`Error updating global stats: ${error.message}`);
    }
  }
}
