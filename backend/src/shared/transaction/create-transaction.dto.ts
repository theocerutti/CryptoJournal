import { OmitType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { CreateTransactionInfoDto } from '../transaction-info';
import { GetAssetDto } from '../asset';

export class CreateTransactionDto extends OmitType(TransactionDto, ['id', 'from', 'to', 'feeAsset'] as const) {
  @IsObject()
  from: CreateTransactionInfoDto;

  @IsObject()
  to: CreateTransactionInfoDto;

  @IsObject()
  feeAsset: GetAssetDto;
}
