import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GlobalStatsController } from './global.stats.controller';
import { GlobalStatsSchema } from './global.stats.model';
import { GlobalStatsService } from './global.stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GlobalStats', schema: GlobalStatsSchema },
    ]),
  ],
  providers: [GlobalStatsService],
  controllers: [GlobalStatsController],
  exports: [GlobalStatsService],
})
export class GlobalStatsModule {}
