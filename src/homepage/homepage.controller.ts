import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HomepageService } from './homepage.service';

@Controller()
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  async getHomepageData(): Promise<{ success: boolean; data: any }> {
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
