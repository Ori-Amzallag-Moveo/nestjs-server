import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishReturnType } from './dish.model';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  // @desc     Get all dishes
  // @route    GET /api/v1/dishes
  // @access   Public
  @Get()
  async getDishes(): Promise<DishReturnType> {
    try {
      const dishes = await this.dishesService.getDishes();
      return { success: true, data: dishes };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Get all signature dishes
  // @route    GET /api/v1/dishes/signature
  // @access   Public
  @Get('signature')
  async getSignatureDishes(): Promise<DishReturnType> {
    try {
      const dishes = await this.dishesService.getSignatureDishes();
      return { success: true, data: dishes };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Get single dish
  // @route    GET /api/v1/dishes/:id
  // @access   Public
  @Get(':id')
  async getDish(@Param('id') id: string): Promise<DishReturnType> {
    try {
      const dish = await this.dishesService.getDishById(id);
      if (!dish) {
        throw new HttpException(
          { success: false, msg: 'Dish not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: dish };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Create new dish
  // @route    POST /api/v1/dishes
  // @access   Private
  @Post()
  async createDish(@Body() createDishDto): Promise<DishReturnType> {
    try {
      const dish = await this.dishesService.createDish(createDishDto);
      return { success: true, data: dish };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Update dish
  // @route    PUT /api/v1/dishes/:id
  // @access   Private
  @Put(':id')
  async updateDish(
    @Param('id') id: string,
    @Body() updateDishDto,
  ): Promise<DishReturnType> {
    try {
      const dish = await this.dishesService.updateDish(id, updateDishDto);
      if (!dish) {
        throw new HttpException(
          { success: false, msg: 'Dish not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: dish };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Delete dish
  // @route    DELETE /api/v1/dishes/:id
  // @access   Private
  @Delete(':id')
  async deleteDish(@Param('id') id: string) {
    try {
      const dish = await this.dishesService.deleteDish(id);
      if (!dish) {
        throw new HttpException(
          { success: false, msg: 'Dish not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, msg: 'Dish deleted' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
