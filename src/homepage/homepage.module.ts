import { Module } from '@nestjs/common';

import { ChefsModule } from 'src/chefs/chefs.module';
import { DishesModule } from 'src/dishes/dishes.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';

@Module({
  imports: [RestaurantsModule, DishesModule, ChefsModule],
  providers: [HomepageService],
  controllers: [HomepageController],
})
export class HomepageModule {}
