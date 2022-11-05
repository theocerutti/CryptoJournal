import { OmitType, PartialType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { IsObject } from 'class-validator';
import { GetTransactionInfoDto, TransactionInfoDto } from '../transaction-info';
import { GetAssetDto } from '../asset';

export class GetTransactionDto extends OmitType(TransactionDto, ['from', 'to', 'feeAsset'] as const) {
  @IsObject()
  from: GetTransactionInfoDto;

  @IsObject()
  to: GetTransactionInfoDto;

  @IsObject()
  feeAsset: GetAssetDto;
}
