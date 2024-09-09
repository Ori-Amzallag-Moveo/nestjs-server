import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @desc     Register a new user
  // @route    POST /users
  @Post()
  async create(@Body() createUserDto: User) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { success: true, data: user };
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
