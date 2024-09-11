import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

import { HomepageReturnType } from './homepage.model';
import { HomepageService } from './homepage.service';
import { Public } from 'src/decorator';

@Controller()
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}
  @Public()
  @Get()
  async getHomepageData(): Promise<HomepageReturnType> {
    try {
      const response = await this.homepageService.getHomepageData();

      if (
        !response.popularRestaurants.length ||
        !response.signatureDishes.length ||
        !response.chefOfTheWeek
      ) {
        throw new HttpException(
          { success: false, msg: 'Some data is missing' },
          HttpStatus.NOT_FOUND,
        );
      }

      return { success: true, data: response };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
