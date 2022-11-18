import { OmitType, PartialType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { GetTransactionInfoDto } from '../transaction-info';

export class GetTransactionDto extends OmitType(TransactionDto, ['from', 'to'] as const) {
  @IsObject()
  from: GetTransactionInfoDto;

  @IsObject()
  to: GetTransactionInfoDto;
}
