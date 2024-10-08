import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(req: User): Promise<User> {
    const user = await this.usersService.findByEmail(req.email);
    if (!(await bcrypt.compare(req.password, user.password))) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }

  async tokenAccess(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
