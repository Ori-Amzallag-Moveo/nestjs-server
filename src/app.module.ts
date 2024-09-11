import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { ChefsModule } from './chefs/chefs.module';
import { DishesModule } from './dishes/dishes.module';
import { GlobalStatsModule } from './global-stats/global.stats.module';
import { HomepageModule } from './homepage/homepage.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    RestaurantsModule,
    DishesModule,
    ChefsModule,
    HomepageModule,
    UsersModule,
    AuthModule,
    GlobalStatsModule,
  ],
})
export class AppModule {}
