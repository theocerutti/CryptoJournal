import { OmitType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsNumber, IsObject } from 'class-validator';
import { CreateTransactionInfoDto } from '../transaction-info';

export class CreateTransactionDto extends OmitType(TransactionDto, ['id', 'from', 'to'] as const) {
  @IsObject()
  from: CreateTransactionInfoDto;

  @IsObject()
  to: CreateTransactionInfoDto;
}
