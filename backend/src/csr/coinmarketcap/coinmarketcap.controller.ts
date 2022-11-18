import { Controller, Get, Logger } from '@nestjs/common';
import { CurrentUser } from 'csr/auth/current-user.decorator';
import { User } from 'model/user.entity';
import { CoinMarketCapService } from './coinmarketcap.service';
import { CMCCryptoBasicInfos } from '../../shared/coinmarketcap';

@Controller('coinmarketcap')
export class CoinMarketCapController {
  private readonly logger = new Logger(CoinMarketCapController.name);

  constructor(private coinMarketCapService: CoinMarketCapService) {}

  @Get('crypto')
  public async getAll(@CurrentUser() user: User): Promise<CMCCryptoBasicInfos> {
    this.logger.log('Get all cryptos');
    return await this.coinMarketCapService.getCryptosBasicInfos();
  }
}
