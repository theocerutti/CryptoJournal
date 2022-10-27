import { forwardRef, Module } from '@nestjs/common';
import { ScrapePriceService } from './ScrapePriceService';
import { InvestmentModule } from '../csr/investment/investment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [forwardRef(() => InvestmentModule), ConfigModule],
  providers: [ScrapePriceService],
  exports: [ScrapePriceService],
})
export class TasksModule {}
