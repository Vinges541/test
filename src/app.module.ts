import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RentModule } from './rent/rent.module';
import { StatisticsModule } from './statistics/statistics.module';
import { DatabaseModule } from './database/database.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RentModule,
    StatisticsModule,
  ],
})
export class AppModule {}
