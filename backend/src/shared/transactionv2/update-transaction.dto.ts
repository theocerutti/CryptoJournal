import { OmitType } from '@nestjs/swagger';
import { TransactionV2Dto } from './transaction.dto';
import { IsObject } from 'class-validator';

export class UpdateTransactionV2Dto extends OmitType(TransactionV2Dto, ['to', 'from'] as const) {
  @IsObject()
  from: UpdateTransactionV2Dto;

  @IsObject()
  to: UpdateTransactionV2Dto;
}
