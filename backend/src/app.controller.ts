import { Controller, Get, Logger } from '@nestjs/common';
import { SkipAuth } from './csr/auth/skip-auth.decorators';

@Controller('app')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @SkipAuth()
  @Get('ping')
  async ping(): Promise<string> {
    this.logger.log('Someone has pinged the API!');
    return 'API is up and running!';
  }
}
