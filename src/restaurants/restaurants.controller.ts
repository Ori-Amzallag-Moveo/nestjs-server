import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { RestaurantParams, RestaurantReturnType } from './restaurant.model';
import { RestaurantsService } from './restaurants.service';
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  // @desc     Get all restaurants, with optional 'Params'
  // @route    GET /api/v1/restaurants
  // @access   Public
  @Get()
  async getRestaurants(
    @Query() queryParams: RestaurantParams,
  ): Promise<RestaurantReturnType> {
    try {
      const restaurants =
        await this.restaurantService.getAllRestaurants(queryParams);
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
  async getRestaurant(
    @Param('id') id: string,
    @Query('meal') meal?: string,
  ): Promise<RestaurantReturnType> {
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
  async createRestaurant(
    @Body() createRestaurantDto,
  ): Promise<RestaurantReturnType> {
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
    @Body() updateRestaurantDto,
  ): Promise<RestaurantReturnType> {
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

  @Put(':id/click')
  async increaseRestaurantClicks(@Param('id') id: string) {
    try {
      const updatedRestaurant = await this.restaurantService.increaseClicks(id);
      return { success: true, data: updatedRestaurant };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
