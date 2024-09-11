import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';

import { GlobalStatsReturnType } from './global.stats.model';
import { GlobalStatsService } from './global.stats.service';

@Controller('globalStats')
export class GlobalStatsController {
  constructor(private readonly globalStatsService: GlobalStatsService) {}

  // @desc     Get all stats
  // @route    GET /api/v1/globalStats
  // @access   Public
  @Get()
  async getAllStats(): Promise<{
    success: boolean;
    data: GlobalStatsReturnType;
  }> {
    try {
      const stats = await this.globalStatsService.getAllStats();
      return { success: true, data: stats };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Update a specific stat field (e.g., clicks, restaurants)
  // @route    PUT /api/v1/globalStats
  // @access   Private
  @Put()
  async updateStat(
    @Query('statField') statField: keyof GlobalStatsReturnType,
    @Query('incrementValue') incrementValue: number,
  ): Promise<{ success: boolean; data: GlobalStatsReturnType }> {
    try {
      if (!statField || !incrementValue) {
        throw new HttpException(
          { success: false, message: 'Invalid input for updating stats' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedStats = await this.globalStatsService.updateStats(
        statField,
        incrementValue,
      );
      return { success: true, data: updatedStats };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
