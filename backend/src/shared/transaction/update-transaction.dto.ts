import { OmitType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { UpdateTransactionInfoDto } from '../transaction-info';
import { GetTransactionDto } from './get-transaction.dto';

export class UpdateTransactionDto extends OmitType(TransactionDto, ['to', 'from', 'feeAsset'] as const) {
  @IsObject()
  from: UpdateTransactionInfoDto;

  @IsObject()
  to: UpdateTransactionInfoDto;

  @IsObject()
  feeAsset: GetTransactionDto;
}
