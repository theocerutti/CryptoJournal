import { OmitType, PartialType } from '@nestjs/swagger';
import { TransactionV2Dto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { GetTransactionInfoDto, TransactionInfoDto } from '../transaction-info';

export class GetTransactionV2Dto extends OmitType(TransactionV2Dto, ['from', 'to'] as const) {
  @IsObject()
  from: GetTransactionInfoDto;

  @IsObject()
  to: GetTransactionInfoDto;
}
