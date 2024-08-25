import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { DishesModule } from './dishes/dishes.module';
import { ChefsModule } from './chefs/chefs.module';
import { HomepageModule } from './homepage/homepage.module';

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
  ],
})
export class AppModule {}
