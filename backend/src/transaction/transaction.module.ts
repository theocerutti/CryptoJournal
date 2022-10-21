import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { UserModule } from '../user/user.module';
import { Transaction } from '../model/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionRepository]), forwardRef(() => UserModule)],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
