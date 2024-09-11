import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChefsController } from './chefs.controller';
import { ChefSchema } from './chefs.model';
import { ChefsService } from './chefs.service';
import { GlobalStatsModule } from '../global-stats/global.stats.module';

@Module({
  imports: [
    GlobalStatsModule,
    MongooseModule.forFeature([{ name: 'Chef', schema: ChefSchema }]),
  ],
  providers: [ChefsService],
  controllers: [ChefsController],
  exports: [ChefsService],
})
export class ChefsModule {}
