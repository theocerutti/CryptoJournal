import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { Transaction } from '../../model/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionInfo } from '../../model/transaction-info.entity';
import { TransactionInfoRepository } from './transaction-info.repository';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionRepository]),
    TypeOrmModule.forFeature([TransactionInfo, TransactionInfoRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => PortfolioModule),
    forwardRef(() => AssetModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
