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
  Query,
} from '@nestjs/common';
import { ChefsService } from './chefs.service';
import { ChefParams, ChefReturnType } from './chefs.model';
@Controller('chefs')
export class ChefsController {
  constructor(private readonly chefsService: ChefsService) {}

  // @desc     Get all chefs, with optional 'Params'
  // @route    GET /api/v1/chefs
  // @access   Public
  @Get()
  async getChefs(@Query() queryParams: ChefParams): Promise<ChefReturnType> {
    try {
      const chefs = await this.chefsService.getAllChefs(queryParams);
      return { success: true, data: chefs };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Get chef of the week
  // @route    GET /api/v1/chefs/chef-of-the-week
  // @access   Public
  @Get('chef-of-the-week')
  async getChefOfTheWeek(): Promise<ChefReturnType> {
    try {
      const chef = await this.chefsService.getChefOfTheWeek();
      if (!chef) {
        throw new HttpException(
          { success: false, msg: 'Chef of the week not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: chef };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Get single chef
  // @route    GET /api/v1/chefs/:id
  // @access   Public
  @Get(':id')
  async getChef(@Param('id') id: string): Promise<ChefReturnType> {
    try {
      const chef = await this.chefsService.getChefById(id);
      if (!chef) {
        throw new HttpException(
          { success: false, msg: 'Chef not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: chef };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Create new chef
  // @route    POST /api/v1/chefs
  // @access   Private
  @Post()
  async createChef(@Body() createChefDto): Promise<ChefReturnType> {
    try {
      const chef = await this.chefsService.createChef(createChefDto);
      return { success: true, data: chef };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Update chef
  // @route    PUT /api/v1/chefs/:id
  // @access   Private
  @Put(':id')
  async updateChef(
    @Param('id') id: string,
    @Body() updateChefDto,
  ): Promise<ChefReturnType> {
    try {
      const chef = await this.chefsService.updateChef(id, updateChefDto);
      if (!chef) {
        throw new HttpException(
          { success: false, msg: 'Chef not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, data: chef };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Delete chef
  // @route    DELETE /api/v1/chefs/:id
  // @access   Private
  @Delete(':id')
  async deleteChef(@Param('id') id: string) {
    try {
      const chef = await this.chefsService.deleteChef(id);
      if (!chef) {
        throw new HttpException(
          { success: false, msg: 'Chef not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, msg: 'Chef deleted' };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
