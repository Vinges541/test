import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [RentService],
  controllers: [RentController],
  imports: [DatabaseModule],
})
export class RentModule {}
