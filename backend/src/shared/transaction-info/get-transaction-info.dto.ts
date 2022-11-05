import { OmitType, PartialType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';
import { IsObject } from 'class-validator';
import { CreateAssetDto } from '../asset/create-asset.dto';

export class GetTransactionInfoDto extends OmitType(TransactionInfoDto, ['asset'] as const) {
  @IsObject()
  asset: CreateAssetDto;
}
