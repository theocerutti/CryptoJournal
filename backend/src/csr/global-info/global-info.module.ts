import { forwardRef, Module } from '@nestjs/common';
import { GlobalInfoController } from './global-info.controller';
import { GlobalInfoService } from './global-info.service';
import { TransactionModule } from '../transaction/transaction.module';
import { CoinMarketCapModule } from '../coinmarketcap/coinmarketcap.module';

@Module({
  imports: [forwardRef(() => CoinMarketCapModule), forwardRef(() => TransactionModule)],
  controllers: [GlobalInfoController],
  providers: [GlobalInfoService],
  exports: [GlobalInfoService],
})
export class GlobalInfoModule {}
