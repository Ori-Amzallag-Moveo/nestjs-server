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

@Controller('chefs')
export class ChefsController {
  constructor(private readonly chefsService: ChefsService) {}

  // @desc     Get all chefs
  // @route    GET /api/v1/chefs
  // @access   Public
  @Get()
  async getChefs(
    @Query('isNewChef') isNewChef?: string,
    @Query('isMostViewedChef') isMostViewedChef?: string,
  ) {
    try {
      const query: any = {};
      const isNewChefBoolean = isNewChef === 'true';
      const isMostViewedChefBoolean = isMostViewedChef === 'true';

      const chefs = await this.chefsService.getAllChefs(
        query,
        isNewChefBoolean,
        isMostViewedChefBoolean,
      );
      return { success: true, data: chefs };
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
  async getChef(@Param('id') id: string) {
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
  async createChef(@Body() createChefDto: any) {
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
  async updateChef(@Param('id') id: string, @Body() updateChefDto: any) {
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
