import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsService } from './restaurants.service';
import { RestaurantSchema } from './restaurant.model';
import { RestaurantsController } from './restaurants.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
    ]),
  ],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService], // Export the service so it can be used in other modules
})
export class RestaurantsModule {}
