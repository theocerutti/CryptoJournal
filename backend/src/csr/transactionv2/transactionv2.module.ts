import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TransactionV2 } from '../../model/transactionv2.entity';
import { TransactionV2Controller } from './transactionv2.controller';
import { TransactionV2Service } from './transactionv2.service';
import { TransactionV2Repository } from './transactionv2.repository';
import { TransactionInfo } from '../../model/transaction-info.entity';
import { TransactionInfoRepository } from './transaction-info.repository';
import { PortfolioModule } from '../portfolio/portfolio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionV2, TransactionV2Repository]),
    TypeOrmModule.forFeature([TransactionInfo, TransactionInfoRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => PortfolioModule),
  ],
  controllers: [TransactionV2Controller],
  providers: [TransactionV2Service],
  exports: [TransactionV2Service],
})
export class TransactionV2Module {}
