import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Response,
} from '@nestjs/common';

import { Response as ExpressResponse } from 'express';
import { User } from 'src/users/users.model';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @desc     Login exist user
  // @route    POST /auth/login
  @Public()
  @Post('login')
  async login(@Body() req: User, @Response() response: ExpressResponse) {
    try {
      const user = await this.authService.validateUser(req);
      if (!user) {
        throw new BadRequestException('Invalid Credentials');
      }
      const jwtToken = await this.authService.tokenAccess(user);
      return response.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful',
        access_token: jwtToken.access_token, // Include the token in the response
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
