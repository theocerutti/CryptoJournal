import { OmitType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';

export class UpdateTransactionDto extends OmitType(TransactionDto, ['to', 'from', 'feesCurrency'] as const) {
  @IsObject()
  from: UpdateTransactionDto;

  @IsObject()
  to: UpdateTransactionDto;

  @IsObject()
  feesCurrency: UpdateTransactionDto;
}
