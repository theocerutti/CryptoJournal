import { Module } from '@nestjs/common';
import { CoinMarketCapService } from './coinmarketcap.service';
import { CoinMarketCapController } from './coinmarketcap.controller';

@Module({
  imports: [],
  controllers: [CoinMarketCapController],
  providers: [CoinMarketCapService],
  exports: [CoinMarketCapService],
})
export class CoinMarketCapModule {}
