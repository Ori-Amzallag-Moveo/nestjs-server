import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { DishSchema } from './dish.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }])],
  providers: [DishesService],
  controllers: [DishesController],
})
export class DishesModule {}
