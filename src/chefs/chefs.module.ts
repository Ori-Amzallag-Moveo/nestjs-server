import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChefsService } from './chefs.service';
import { ChefsController } from './chefs.controller';
import { ChefSchema } from './chefs.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chef', schema: ChefSchema }])],
  providers: [ChefsService],
  controllers: [ChefsController],
})
export class ChefsModule {}
