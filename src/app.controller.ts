import { Controller, Delete, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('seed')
  async seed() {
    await this.appService.seed();
  }

  @Delete('clear')
  async clear() {
    await this.appService.clear();
  }
}
