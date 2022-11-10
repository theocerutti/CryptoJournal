import { Controller, Get, Logger } from '@nestjs/common';
import { CurrentUser } from 'csr/auth/current-user.decorator';
import { User } from 'model/user.entity';
import { GlobalInfoService } from './global-info.service';
import { GlobalInfoDto } from '../../shared/global-info';

@Controller('global-info')
export class GlobalInfoController {
  private readonly logger = new Logger(GlobalInfoController.name);

  constructor(private globalInfoService: GlobalInfoService) {}

  @Get()
  public async get(@CurrentUser() user: User): Promise<GlobalInfoDto> {
    this.logger.log(`Get GlobalInfo=${user.id}`);
    return await this.globalInfoService.buildInfo(user.id);
  }
}
