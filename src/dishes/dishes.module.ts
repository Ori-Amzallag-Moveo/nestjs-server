import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DishSchema } from './dish.model';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { GlobalStatsModule } from 'src/global-stats/global.stats.module';

@Module({
  imports: [
    GlobalStatsModule,
    MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }]),
  ],
  providers: [DishesService],
  controllers: [DishesController],
  exports: [DishesService],
})
export class DishesModule {}
