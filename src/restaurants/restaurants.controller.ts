import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  // @desc     Get all restaurants, with optional 'Params'
  // @route    GET /api/v1/restaurants
  // @access   Public
  @Get()
  async getRestaurants(
    @Query('page') page: number = 1,
    @Query('limit') limit?: number,
    @Query('isPopular') isPopular?: string,
    @Query('isNewRestaurant') isNewRestaurant?: string,
    @Query('isOpenNow') isOpenNow?: string,
  ) {
    try {
      const query: any = {};

      const restaurants = await this.restaurantService.getAllRestaurants(
        query,
        page,
        limit,
        isPopular,
        isOpenNow,
        isNewRestaurant,
      );
      return { success: true, data: restaurants };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Get single restaurant
  // @route    GET /api/v1/restaurants/:id
  // @access   Public
  @Get(':id')
  async getRestaurant(@Param('id') id: string, @Query('meal') meal?: string) {
    try {
      const restaurant = await this.restaurantService.getRestaurantById(
        id,
        meal,
      );
      if (!restaurant) {
        throw new HttpException(
          { success: false, msg: 'Restaurant not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: restaurant };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Create new restaurant
  // @route    POST /api/v1/restaurants
  // @access   Private
  @Post()
  async createRestaurant(@Body() createRestaurantDto: any) {
    try {
      const restaurant =
        await this.restaurantService.createRestaurant(createRestaurantDto);
      return { success: true, data: restaurant };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Update restaurant
  // @route    PUT /api/v1/restaurants/:id
  // @access   Private
  @Put(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: any,
  ) {
    try {
      const restaurant = await this.restaurantService.updateRestaurant(
        id,
        updateRestaurantDto,
      );
      if (!restaurant) {
        throw new HttpException(
          { success: false, msg: 'Restaurant not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: restaurant };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Delete restaurant
  // @route    DELETE /api/v1/restaurants/:id
  // @access   Private
  @Delete(':id')
  async deleteRestaurant(@Param('id') id: string) {
    try {
      const restaurant = await this.restaurantService.deleteRestaurant(id);
      if (!restaurant) {
        throw new HttpException(
          { success: false, msg: 'Restaurant not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, msg: 'Restaurant deleted' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
