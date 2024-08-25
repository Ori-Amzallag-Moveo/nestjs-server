import { Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { DishesModule } from 'src/dishes/dishes.module';
import { ChefsModule } from 'src/chefs/chefs.module';
import { HomepageService } from './homepage.service';

@Module({
  imports: [RestaurantsModule, DishesModule, ChefsModule],
  providers: [HomepageService],
  controllers: [HomepageController],
})
export class HomepageModule {}
