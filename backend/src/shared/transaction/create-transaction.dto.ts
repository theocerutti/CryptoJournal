import { OmitType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { CreateTransactionInfoDto } from '../transaction-info';
import { CreateAssetDto } from '../asset';

export class CreateTransactionDto extends OmitType(TransactionDto, ['id', 'from', 'to', 'feesCurrency'] as const) {
  @IsObject()
  from: CreateTransactionInfoDto;

  @IsObject()
  to: CreateTransactionInfoDto;

  @IsObject()
  feesCurrency: CreateAssetDto;
}
