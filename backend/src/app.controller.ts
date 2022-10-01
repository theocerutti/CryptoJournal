import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './auth/skip-auth.decorators';

@Controller('app')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @SkipAuth()
  @Get('ping')
  async ping(): Promise<string> {
    this.logger.log('Someone has pinged the API!');
    return 'API is up and running!';
  }
}
