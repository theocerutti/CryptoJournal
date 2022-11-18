import { OmitType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { UpdateTransactionInfoDto } from '../transaction-info';

export class UpdateTransactionDto extends OmitType(TransactionDto, ['to', 'from'] as const) {
  @IsObject()
  from: UpdateTransactionInfoDto;

  @IsObject()
  to: UpdateTransactionInfoDto;
}
