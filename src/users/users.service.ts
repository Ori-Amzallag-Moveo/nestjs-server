import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { Model } from 'mongoose';
import { GlobalStatsService } from 'src/global-stats/global.stats.service';
import { User } from './users.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly globalStatsService: GlobalStatsService,
    private readonly jwtService: JwtService,
  ) {}

  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  }

  async create(createUserDto: User): Promise<{ access_token: string }> {
    // Check if email is already taken
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email is already taken');
    }

    // Validate password
    if (!this.validatePassword(createUserDto.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    await this.globalStatsService.updateStats('totalUsers', 1);

    const payload = { email: savedUser.email, sub: savedUser._id };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
