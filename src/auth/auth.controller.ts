import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.model';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @desc     Login exist user
  // @route    POST /auth/login
  @Post('login')
  async login(@Body() req: User, @Response() response: ExpressResponse) {
    try {
      const user = await this.authService.validateUser(req);
      if (!user) {
        throw new BadRequestException('Invalid Credentials');
      }
      const jwtToken = await this.authService.login(user);
      response.cookie('jwt', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });
      return response.send({
        success: true,
        message: 'Login successful',
      });
    } catch (error) {
      throw new HttpException(
        { success: false, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @desc     Logout exist user
  // @route    POST /auth/logout
  @Post('logout')
  async logout(@Response() response: ExpressResponse) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return response.send({ success: true, message: 'Logout successful' });
  }
}
