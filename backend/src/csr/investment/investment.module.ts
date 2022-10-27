import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Investment } from 'model/investment.entity';
import { InvestmentController } from './investment.controller';
import { InvestmentRepository } from './investment.repository';
import { InvestmentService } from './investment.service';
import { UserModule } from '../user/user.module';
import { TransactionRepository } from '../transaction/transaction.repository';
import { Transaction } from '../../model/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, InvestmentRepository, Transaction, TransactionRepository]),
    forwardRef(() => UserModule),
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports: [InvestmentService],
})
export class InvestmentModule {}
