import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { User } from './users.model';
import { UsersService } from './users.service';
import { Public } from 'src/decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @desc     Register a new user
  // @route    POST /users
  @Public()
  @Post()
  async create(@Body() createUserDto: User) {
    try {
      const token = await this.usersService.create(createUserDto);
      return token;
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
