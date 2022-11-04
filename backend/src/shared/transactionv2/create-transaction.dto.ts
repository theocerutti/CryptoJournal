import { OmitType } from '@nestjs/swagger';
import { TransactionV2Dto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { CreateTransactionInfoDto, TransactionInfoDto } from '../transaction-info';

export class CreateTransactionV2Dto extends OmitType(TransactionV2Dto, ['id', 'from', 'to'] as const) {
  @IsObject()
  from: CreateTransactionInfoDto;

  @IsObject()
  to: CreateTransactionInfoDto;
}
